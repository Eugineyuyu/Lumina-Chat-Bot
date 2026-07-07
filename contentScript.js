(() => {
  if (window.__ashlyContentScriptLoaded) {
    return;
  }
  window.__ashlyContentScriptLoaded = true;

  const MIN_TYPING_DELAY_MS = 28;
  const MAX_TYPING_DELAY_MS = 85;
  const TIMESTAMP_REGEX = /\b\d{1,2}:\d{2}\b/;
  const TELEMETRY_SEND_MATCH_THRESHOLD = 0.78;
  const TELEMETRY_PENDING_TTL_MS = 180000;
  const TELEMETRY_OBSERVER_DEBOUNCE_MS = 280;
  const TELEMETRY_MAX_PENDING = 24;
  const TELEMETRY_IDLE_CUTOFF_MS = 20000;
  const TELEMETRY_FULL_CONTEXT_MIN_INTERVAL_MS = 3500;
  const TELEMETRY_MAX_OBSERVER_CALLBACKS_FOR_FULL_CONTEXT = 36;
  const CHAT_CONTAINER_CACHE_TTL_MS = 10000;
  const CHAT_CONTAINER_VIEWPORT_DELTA_PX = 140;
  const MAX_CONTAINER_SCAN_NODES = 260;
  const MAX_CONTAINER_TEXT_NODES = 90;
  const MAX_FAST_OPERATOR_CANDIDATES = 4;
  const MAX_SIDE_PANEL_SCAN_NODES = 420;
  const EXTRACTION_MAX_SCAN_MS = 170;
  const PERF_WINDOW_MS = 10000;

  const isElementVisible = (element) => {
    if (!element) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const isTextInput = (element) => {
    if (!element) {
      return false;
    }

    if (element.isContentEditable) {
      return true;
    }

    if (element.tagName === "TEXTAREA") {
      return true;
    }

    if (element.tagName === "INPUT") {
      const type = element.getAttribute("type");
      return !type || ["text", "search", "email", "url"].includes(type);
    }

    return false;
  };

  let lastFocusedInput = null;
  let telemetryPendingCandidates = [];
  let telemetryObserver = null;
  let telemetryObserverRoot = null;
  let telemetryObserverTimer = null;
  let telemetryIdleTimer = null;
  let telemetryLastFullContextMs = 0;
  let telemetryLastMatchMs = 0;
  let telemetryLastCandidateTouchMs = 0;
  let telemetryDetectionInFlight = false;
  const telemetryMatchedSignatures = new Map();
  const perfState = {
    debug: false,
    observerCallbacksTs: [],
    detectionDurationsMs: [],
    contextExtractionsTs: [],
    contextDurationsMs: [],
  };
  let chatContainerCache = {
    element: null,
    expiresAt: 0,
    url: "",
    viewportWidth: 0,
    viewportHeight: 0,
  };

  const cleanText = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  const extractTimestampToken = (value) => {
    const match = String(value || "").match(TIMESTAMP_REGEX);
    return match ? match[0] : "";
  };
  const isLikelyTimestampOnly = (text) => {
    const cleaned = cleanText(text);
    const token = extractTimestampToken(cleaned);
    if (!token) return false;
    const withoutToken = cleaned.replace(token, "").replace(/[^\d]/g, "");
    return cleaned.length <= 10 && withoutToken.length === 0;
  };
  const isLikelyDateSeparator = (text) => {
    const cleaned = cleanText(text).toLowerCase();
    if (!cleaned) return false;
    if (
      /(started at|minutes ago|minute ago|hours ago|hour ago|days ago|day ago)/.test(
        cleaned
      )
    )
      return true;
    if (
      /(mon|tue|wed|thu|fri|sat|sun)[a-z]*,?\s+[a-z]{3,}\s+\d{1,2},?\s+\d{4}/.test(
        cleaned
      )
    )
      return true;
    if (/^\d{1,2}\s+[a-z]{3,}\s+\d{4}$/.test(cleaned)) return true;
    return false;
  };

  const extractNameFromLogText = (text) => {
    const value = cleanText(text);
    if (!value) return "";
    const patterns = [
      /real name\s*[:\-]\s*([A-Z][a-z]{1,20})(?:\s([A-Z][a-z]{1,20}))?/i,
      /name\s*[:\-]\s*([A-Z][a-z]{1,20})(?:\s([A-Z][a-z]{1,20}))?/i,
      /his name is\s+([A-Z][a-z]{1,20})(?:\s([A-Z][a-z]{1,20}))?/i,
      /her name is\s+([A-Z][a-z]{1,20})(?:\s([A-Z][a-z]{1,20}))?/i,
      /customer name is\s+([A-Z][a-z]{1,20})(?:\s([A-Z][a-z]{1,20}))?/i,
      /he is called\s+([A-Z][a-z]{1,20})(?:\s([A-Z][a-z]{1,20}))?/i,
    ];
    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (match) {
        const first = match[1] || "";
        const second = match[2] || "";
        const combined = `${first} ${second}`.trim();
        return combined;
      }
    }
    return "";
  };

  const isBlockLike = (element) => {
    if (!element || !element.tagName) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return ["block", "inline-block", "flex", "grid", "list-item"].includes(
      style.display
    );
  };

  const findBlockAncestor = (node, root) => {
    let current = node?.parentElement || null;
    while (current && current !== root && !isBlockLike(current)) {
      current = current.parentElement;
    }
    return current || root;
  };

  const isTransparentColor = (color) => {
    if (!color) return true;
    const normalized = color.replace(/\s+/g, "").toLowerCase();
    return normalized === "transparent" || normalized === "rgba(0,0,0,0)";
  };

  const parsePixels = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const scoreBubbleElement = (element) => {
    const style = window.getComputedStyle(element);
    let score = 0;
    if (!isTransparentColor(style.backgroundColor)) score += 2;
    if (parsePixels(style.borderRadius) >= 8) score += 1;
    if (parsePixels(style.paddingLeft) + parsePixels(style.paddingRight) >= 10)
      score += 1;
    if (style.boxShadow && style.boxShadow !== "none") score += 1;
    const className = String(element.className || "").toLowerCase();
    if (/(message|bubble|msg|chat|reply|text)/.test(className)) score += 2;
    return score;
  };

  const findRoleFromElement = (element, container) => {
    let current = element;
    let depth = 0;
    while (current && current !== container && depth < 5) {
      const classList = current.classList || [];
      if (classList.contains("flex-row-reverse")) return "operator";
      if (classList.contains("flex-row")) return "customer";
      current = current.parentElement;
      depth += 1;
    }
    return "";
  };

  const findBubbleElement = (node, container, chatRect) => {
    let current = node?.parentElement || null;
    let best = null;
    const minWidth = Math.max(120, chatRect.width * 0.2);
    const maxWidth = chatRect.width * 0.95;
    while (current && current !== container) {
      if (!isElementVisible(current)) {
        current = current.parentElement;
        continue;
      }
      const rect = current.getBoundingClientRect();
      if (
        rect.width >= minWidth &&
        rect.width <= maxWidth &&
        rect.height >= 16 &&
        rect.height <= chatRect.height * 0.45
      ) {
        best = current;
      }
      current = current.parentElement;
    }
    return best;
  };

  const isWithinChatRect = (rect, chatRect) =>
    rect.left >= chatRect.left - 4 &&
    rect.right <= chatRect.right + 4 &&
    rect.top >= chatRect.top - 4 &&
    rect.bottom <= chatRect.bottom + 4;

  const getChatInputTop = (container) => {
    const inputs = container.querySelectorAll(
      'textarea, input[type="text"], input[type="search"], [contenteditable="true"]'
    );
    let top = Number.POSITIVE_INFINITY;
    inputs.forEach((input) => {
      if (!isElementVisible(input)) return;
      const rect = input.getBoundingClientRect();
      if (rect.height > 10 && rect.width > 80) {
        top = Math.min(top, rect.top);
      }
    });
    return Number.isFinite(top) ? top : null;
  };

  const collectTimestampNodes = (container, chatRect) => {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = cleanText(node.textContent);
        const token = extractTimestampToken(text);
        if (!token) return NodeFilter.FILTER_REJECT;
        if (text.length > 24) return NodeFilter.FILTER_REJECT;
        if (/[a-z]/i.test(text.replace(token, "")))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (!parent || !isElementVisible(parent)) continue;
      const rect = parent.getBoundingClientRect();
      if (!isWithinChatRect(rect, chatRect)) continue;
      const token = extractTimestampToken(walker.currentNode.textContent);
      nodes.push({ text: token, rect });
    }
    return nodes;
  };

  const findNearbyTimestamp = (rect, timestampNodes) => {
    if (!timestampNodes || timestampNodes.length === 0) return "";
    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;
    timestampNodes.forEach((node) => {
      const verticalGap = Math.abs(node.rect.top - rect.bottom);
      if (verticalGap > 22) return;
      const horizontalOverlap =
        node.rect.left < rect.right + 12 && node.rect.right > rect.left - 12;
      if (!horizontalOverlap) return;
      const horizontalDistance = Math.abs(
        node.rect.left + node.rect.width / 2 - rect.right
      );
      const score = verticalGap * 2 + horizontalDistance;
      if (score < bestScore) {
        bestScore = score;
        best = node.text;
      }
    });
    return best || "";
  };

  const isScrollable = (element) => {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return ["auto", "scroll"].includes(style.overflowY);
  };

  const perfWindowCount = (timestamps, nowMs = Date.now()) =>
    (Array.isArray(timestamps) ? timestamps : []).filter(
      (value) => nowMs - Number(value) <= PERF_WINDOW_MS
    ).length;

  const trimPerfList = (list, maxSize = 120) => {
    if (!Array.isArray(list)) return [];
    if (list.length <= maxSize) return list;
    return list.slice(-maxSize);
  };

  const recordPerfTimestamp = (list, value = Date.now()) => {
    if (!Array.isArray(list)) return;
    list.push(value);
    const trimmed = trimPerfList(list, 240);
    if (trimmed !== list) {
      list.length = 0;
      trimmed.forEach((item) => list.push(item));
    }
  };

  const recordPerfDuration = (list, valueMs) => {
    if (!Array.isArray(list) || !Number.isFinite(Number(valueMs))) return;
    list.push(Number(valueMs));
    const trimmed = trimPerfList(list, 60);
    if (trimmed !== list) {
      list.length = 0;
      trimmed.forEach((item) => list.push(item));
    }
  };

  const avgPerfDuration = (list) => {
    if (!Array.isArray(list) || list.length === 0) return 0;
    const total = list.reduce((sum, value) => sum + Number(value || 0), 0);
    return Number((total / list.length).toFixed(1));
  };

  const buildPerfSnapshot = () => ({
    observer_active: Boolean(telemetryObserver),
    observer_callbacks_last_10s: perfWindowCount(perfState.observerCallbacksTs),
    full_context_extractions_last_10s: perfWindowCount(
      perfState.contextExtractionsTs
    ),
    avg_detection_ms: avgPerfDuration(perfState.detectionDurationsMs),
    avg_context_ms: avgPerfDuration(perfState.contextDurationsMs),
  });

  const readViewport = () => ({
    width: Number(window.innerWidth || 0),
    height: Number(window.innerHeight || 0),
  });

  const invalidateChatContainerCache = () => {
    chatContainerCache = {
      element: null,
      expiresAt: 0,
      url: "",
      viewportWidth: 0,
      viewportHeight: 0,
    };
  };

  const setCachedChatContainer = (element) => {
    if (!element || !element.isConnected) {
      invalidateChatContainerCache();
      return;
    }
    const viewport = readViewport();
    chatContainerCache = {
      element,
      expiresAt: Date.now() + CHAT_CONTAINER_CACHE_TTL_MS,
      url: String(window.location?.href || ""),
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
    };
  };

  const getCachedChatContainer = () => {
    const now = Date.now();
    const currentUrl = String(window.location?.href || "");
    const viewport = readViewport();
    const cached = chatContainerCache;
    if (!cached?.element || !cached.element.isConnected) {
      invalidateChatContainerCache();
      return null;
    }
    if (cached.expiresAt < now) {
      invalidateChatContainerCache();
      return null;
    }
    if (cached.url && cached.url !== currentUrl) {
      invalidateChatContainerCache();
      return null;
    }
    const widthDelta = Math.abs(
      Number(cached.viewportWidth || 0) - viewport.width
    );
    const heightDelta = Math.abs(
      Number(cached.viewportHeight || 0) - viewport.height
    );
    if (
      widthDelta > CHAT_CONTAINER_VIEWPORT_DELTA_PX ||
      heightDelta > CHAT_CONTAINER_VIEWPORT_DELTA_PX
    ) {
      invalidateChatContainerCache();
      return null;
    }
    return cached.element;
  };

  const findNearestScrollableAncestor = (element) => {
    let current = element?.parentElement || null;
    let depth = 0;
    while (current && depth < 8) {
      if (isScrollable(current) && isElementVisible(current)) {
        return current;
      }
      current = current.parentElement;
      depth += 1;
    }
    return null;
  };

  const getCandidateChatContainers = (scopeRoot = document) => {
    const candidates = [];
    const root =
      scopeRoot && typeof scopeRoot.querySelectorAll === "function"
        ? scopeRoot
        : document;
    const nodeList = root.querySelectorAll(
      "div, section, main, article, ul, ol"
    );
    const scanStartedAt = Date.now();
    let scanned = 0;
    for (
      let index = 0;
      index < nodeList.length && scanned < MAX_CONTAINER_SCAN_NODES;
      index += 1
    ) {
      if (Date.now() - scanStartedAt >= EXTRACTION_MAX_SCAN_MS) {
        break;
      }
      const element = nodeList[index];
      scanned += 1;
      if (!isElementVisible(element)) continue;
      const rect = element.getBoundingClientRect();
      if (
        rect.height < window.innerHeight * 0.35 ||
        rect.width < window.innerWidth * 0.4
      ) {
        continue;
      }
      let textCount = 0;
      let timestampCount = 0;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const text = cleanText(node.textContent);
          if (text.length >= 10 && text.length <= 400) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        },
      });
      while (walker.nextNode()) {
        if (Date.now() - scanStartedAt >= EXTRACTION_MAX_SCAN_MS) {
          break;
        }
        textCount += 1;
        if (TIMESTAMP_REGEX.test(walker.currentNode.textContent || "")) {
          timestampCount += 1;
        }
        if (textCount >= MAX_CONTAINER_TEXT_NODES) break;
      }
      let score = 0;
      if (isScrollable(element)) score += 3;
      score += Math.min(textCount / 20, 3);
      score += Math.min(timestampCount, 3);
      const viewportCenter = window.innerWidth / 2;
      const elementCenter = rect.left + rect.width / 2;
      const centerDistance = Math.abs(viewportCenter - elementCenter);
      score += Math.max(0, 2 - centerDistance / (window.innerWidth * 0.15));
      if (
        rect.width >= window.innerWidth * 0.45 &&
        rect.width <= window.innerWidth * 0.75
      ) {
        score += 2;
      } else if (rect.width > window.innerWidth * 0.9) {
        score -= 1.5;
      }
      candidates.push({ element, score, rect, textCount, timestampCount });
    }
    candidates.sort((a, b) => b.score - a.score);
    return candidates;
  };

  const findMessagesListContainer = () =>
    document.querySelector('[data-testid="messagesList"]') ||
    document.querySelector('[data-test-id="messagesList"]') ||
    document.querySelector('[data-test="messagesList"]');

  const resolvePrimaryChatContainer = () => {
    const explicit = findMessagesListContainer();
    if (explicit && isElementVisible(explicit)) {
      setCachedChatContainer(explicit);
      return explicit;
    }
    const nearInput = findNearestScrollableAncestor(
      lastFocusedInput || document.activeElement
    );
    if (nearInput && isElementVisible(nearInput)) {
      setCachedChatContainer(nearInput);
      return nearInput;
    }
    const cached = getCachedChatContainer();
    if (cached && isElementVisible(cached)) {
      return cached;
    }
    const fallback =
      getCandidateChatContainers(document)?.[0]?.element || document.body;
    if (fallback) {
      setCachedChatContainer(fallback);
    }
    return fallback || document.body;
  };

  const extractMessagesFromContainer = (container, chatRect) => {
    if (!container) return [];
    const elementTextMap = new Map();
    const inputTop = getChatInputTop(container);
    const timestampNodes = collectTimestampNodes(container, chatRect);
    const extractionStartedAt = Date.now();
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = cleanText(node.textContent);
        if (text.length >= 4 && text.length <= 500) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    });
    while (walker.nextNode()) {
      if (Date.now() - extractionStartedAt >= EXTRACTION_MAX_SCAN_MS) {
        break;
      }
      const text = cleanText(walker.currentNode.textContent);
      if (isLikelyDateSeparator(text) || isLikelyTimestampOnly(text)) continue;
      const bubble = findBubbleElement(walker.currentNode, container, chatRect);
      if (!bubble || !isElementVisible(bubble)) continue;
      const rect = bubble.getBoundingClientRect();
      if (!isWithinChatRect(rect, chatRect)) continue;
      if (inputTop && rect.top >= inputTop - 6) continue;
      if (rect.width < 60 || rect.height < 14) continue;
      const explicitRole = findRoleFromElement(bubble, container);
      const entry = elementTextMap.get(bubble) || {
        element: bubble,
        text: "",
        rect,
        score: scoreBubbleElement(bubble),
        explicitRole,
      };
      entry.text = entry.text ? `${entry.text} ${text}` : text;
      entry.rect = rect;
      entry.score = Math.max(entry.score, scoreBubbleElement(bubble));
      if (explicitRole) {
        entry.explicitRole = explicitRole;
      }
      elementTextMap.set(bubble, entry);
    }

    let entries = Array.from(elementTextMap.values())
      .map((entry) => ({
        element: entry.element,
        text: cleanText(entry.text),
        rect: entry.rect,
        score: entry.score,
        explicitRole: entry.explicitRole || "",
      }))
      .filter((entry) => entry.text.length >= 6)
      .filter((entry) => entry.score >= 1 || entry.text.length >= 14);

    const signatureMap = new Map();
    entries.forEach((entry) => {
      const signature = [
        Math.round(entry.rect.left),
        Math.round(entry.rect.top),
        Math.round(entry.rect.width),
        Math.round(entry.rect.height),
        entry.text.slice(0, 180).toLowerCase(),
      ].join("|");
      const existing = signatureMap.get(signature);
      if (
        !existing ||
        entry.score > existing.score ||
        entry.text.length > existing.text.length
      ) {
        signatureMap.set(signature, entry);
      }
    });
    entries = Array.from(signatureMap.values());

    entries.sort((a, b) => a.rect.top - b.rect.top);

    const grouped = [];
    let current = null;
    entries.forEach((entry) => {
      if (!current) {
        current = { ...entry };
        return;
      }
      const verticalGap = Math.abs(entry.rect.top - current.rect.bottom);
      const horizontalGap = Math.abs(entry.rect.left - current.rect.left);
      if (verticalGap < 10 && horizontalGap < 30) {
        current.text = `${current.text} ${entry.text}`.trim();
        const left = Math.min(current.rect.left, entry.rect.left);
        const top = Math.min(current.rect.top, entry.rect.top);
        const right = Math.max(current.rect.right, entry.rect.right);
        const bottom = Math.max(current.rect.bottom, entry.rect.bottom);
        current.rect = {
          left,
          top,
          right,
          bottom,
          width: right - left,
          height: bottom - top,
        };
        current.score = Math.max(current.score, entry.score);
        if (!current.explicitRole && entry.explicitRole) {
          current.explicitRole = entry.explicitRole;
        }
      } else {
        grouped.push(current);
        current = { ...entry };
      }
    });
    if (current) grouped.push(current);

    return grouped.map((entry, index) => ({
      role: entry.explicitRole || "",
      explicitRole: entry.explicitRole || "",
      text: entry.text,
      timestamp:
        extractTimestampToken(entry.text) ||
        findNearbyTimestamp(entry.rect, timestampNodes),
      bounds: {
        x: Math.round(entry.rect.left),
        y: Math.round(entry.rect.top),
        w: Math.round(entry.rect.width),
        h: Math.round(entry.rect.height),
      },
      centerX: entry.rect.left + entry.rect.width / 2,
      score: entry.score,
      scanIndex: index,
    }));
  };

  const extractSidePanel = (side) => {
    const viewportWidth = window.innerWidth || 1;
    const viewportHeight = window.innerHeight || 1;
    const minX = side === "left" ? 0 : viewportWidth * 0.8;
    const maxX = side === "left" ? viewportWidth * 0.2 : viewportWidth;
    const textEntries = [];

    const scanStartedAt = Date.now();
    const rootCandidates =
      side === "left"
        ? [
            "aside",
            '[data-testid*="customer"]',
            '[class*="customer"]',
            '[class*="profile"]',
          ]
        : [
            "aside",
            '[data-testid*="operator"]',
            '[class*="operator"]',
            '[class*="profile"]',
          ];
    const roots = [];
    rootCandidates.forEach((selector) => {
      const match = document.querySelector(selector);
      if (match && !roots.includes(match)) {
        roots.push(match);
      }
    });
    if (roots.length === 0) {
      roots.push(document.body);
    }

    let scannedNodes = 0;
    for (const root of roots) {
      if (Date.now() - scanStartedAt >= EXTRACTION_MAX_SCAN_MS) {
        break;
      }
      const elements = root.querySelectorAll(
        "div, section, aside, li, span, p"
      );
      for (
        let index = 0;
        index < elements.length && scannedNodes < MAX_SIDE_PANEL_SCAN_NODES;
        index += 1
      ) {
        if (Date.now() - scanStartedAt >= EXTRACTION_MAX_SCAN_MS) {
          break;
        }
        const element = elements[index];
        scannedNodes += 1;
        if (!isElementVisible(element)) continue;
        const rect = element.getBoundingClientRect();
        if (rect.left < minX || rect.right > maxX || rect.width < 30) continue;
        if (rect.top < 0 || rect.bottom > viewportHeight) continue;
        const text = cleanText(element.textContent);
        if (!text || text.length > 80) continue;
        textEntries.push({ text, rect });
      }
    }

    textEntries.sort((a, b) => a.rect.top - b.rect.top);
    const deduped = [];
    textEntries.forEach((entry) => {
      const last = deduped[deduped.length - 1];
      if (
        last &&
        last.text === entry.text &&
        Math.abs(last.rect.top - entry.rect.top) < 4
      ) {
        return;
      }
      deduped.push(entry);
    });

    const fields = {};
    let fieldIndex = 1;
    for (let i = 0; i < deduped.length && fieldIndex <= 30; i += 1) {
      const entry = deduped[i];
      if (entry.text.includes(":")) {
        const [rawKey, ...rest] = entry.text.split(":");
        const key = cleanText(rawKey);
        const value = cleanText(rest.join(":"));
        if (key && value) {
          fields[key] = value;
          continue;
        }
      }
      const next = deduped[i + 1];
      if (
        next &&
        Math.abs(next.rect.top - entry.rect.top) < 18 &&
        entry.text.length <= 24
      ) {
        fields[entry.text] = next.text;
        i += 1;
      } else {
        fields[`field_${fieldIndex}`] = entry.text;
      }
      fieldIndex += 1;
    }

    let bounds = null;
    if (deduped.length > 0) {
      const left = Math.min(...deduped.map((e) => e.rect.left));
      const top = Math.min(...deduped.map((e) => e.rect.top));
      const right = Math.max(...deduped.map((e) => e.rect.right));
      const bottom = Math.max(...deduped.map((e) => e.rect.bottom));
      bounds = {
        x: Math.round(left),
        y: Math.round(top),
        w: Math.round(right - left),
        h: Math.round(bottom - top),
      };
    }

    return { fields, bounds };
  };

  const hasHintToken = (value, hint) => {
    const compactValue = String(value || "")
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
    const compactHint = String(hint || "")
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
    if (!compactValue || !compactHint) return false;
    return compactValue.includes(compactHint);
  };

  const findDrawerByHints = (selectors, hints) => {
    for (const selector of selectors) {
      const match = document.querySelector(selector);
      if (match && isElementVisible(match)) {
        return match;
      }
    }

    const candidates = Array.from(
      document.querySelectorAll(
        '[class*="drawer"], aside, [role="dialog"], [data-testid]'
      )
    );
    let best = null;
    let bestScore = 0;
    candidates.forEach((element) => {
      if (!isElementVisible(element)) return;
      const rect = element.getBoundingClientRect();
      if (rect.width < 120 || rect.height < 80) return;
      const testId = String(
        element.getAttribute("data-testid") || ""
      ).toLowerCase();
      const className = String(element.className || "").toLowerCase();
      const text = cleanText(element.textContent || "")
        .toLowerCase()
        .slice(0, 800);
      let score = 0;
      hints.forEach((hint) => {
        if (hasHintToken(testId, hint)) score += 4;
        if (hasHintToken(className, hint)) score += 3;
        if (hasHintToken(text, hint)) score += 2;
      });
      if (score > bestScore) {
        bestScore = score;
        best = element;
      }
    });
    return bestScore >= 3 ? best : null;
  };

  const extractLogbookFromDrawer = (drawer) => {
    const logbookLatest = [];
    const seen = new Set();
    let nameFromLogbook = "";
    const categoryBlocks = Array.from(
      drawer.querySelectorAll(
        '[data-testid^="logbookCategory-"], [data-testid*="logbookCategory"], [class*="logbook-category"]'
      )
    ).filter((element) => isElementVisible(element));

    categoryBlocks.forEach((block) => {
      const title =
        cleanText(
          block.querySelector(
            '[data-testid^="logbookCategoryTitle-"], [data-testid*="logbookCategoryTitle"], [class*="logbook-category-title"], [class*="logbookTitle"]'
          )?.textContent || ""
        ) ||
        cleanText(block.querySelector("h3, h4, strong")?.textContent || "");
      if (!title) return;
      let comments = Array.from(
        block.querySelectorAll(
          '[data-testid^="logbookComment-"], [data-testid*="logbookComment"], [class*="logbook-comment"], li, p'
        )
      )
        .map((node) => cleanText(node.textContent))
        .filter((value) => value && value !== title)
        .slice(0, 10);
      if (comments.length === 0) {
        const blockText = cleanText(block.textContent || "");
        if (blockText && blockText !== title) {
          const fallback = cleanText(blockText.replace(title, ""));
          if (fallback) comments = [fallback];
        }
      }
      if (comments.length === 0) return;
      const latest = comments[0].slice(0, 240);
      const dedupeKey = `${title.toLowerCase()}|${latest.toLowerCase()}`;
      if (!seen.has(dedupeKey)) {
        logbookLatest.push({ category: title.slice(0, 80), text: latest });
        seen.add(dedupeKey);
      }
      if (!nameFromLogbook) {
        for (const comment of comments) {
          const candidate = extractNameFromLogText(comment);
          if (candidate) {
            nameFromLogbook = candidate;
            break;
          }
        }
      }
    });

    return {
      logbookLatest: logbookLatest.slice(0, 20),
      nameFromLogbook,
    };
  };

  const extractCustomerDrawer = () => {
    const drawer = findDrawerByHints(
      [
        ".customer-mobile-drawer",
        '[data-testid="customerMobileDrawer"]',
        '[data-testid="customerProfileDrawer"]',
        '[data-testid="profileNameItem"]',
      ],
      ["customer", "profile", "logbook", "real name"]
    );
    if (!drawer) {
      return { profile: {}, logbookLatest: [], effectiveName: "" };
    }

    const profileName = cleanText(
      drawer.querySelector('[data-testid="profileNameItem"]')?.textContent || ""
    );
    const profileRealName = cleanText(
      drawer.querySelector('[data-testid="profileRealName"]')?.textContent || ""
    );
    const profileLocation = cleanText(
      drawer.querySelector('[data-testid="profileLocation"]')?.textContent || ""
    );
    const civilStatus = cleanText(
      drawer.querySelector('[data-testid="profileCivilStatus"]')?.textContent ||
        ""
    );
    const timezoneLabel = Array.from(drawer.querySelectorAll("span")).find(
      (span) => /timezone:/i.test(span.textContent || "")
    );
    const timezone = timezoneLabel
      ? cleanText(
          timezoneLabel.parentElement?.textContent?.replace(/timezone:/i, "") ||
            ""
        )
      : "";
    const timeText = cleanText(
      drawer.querySelector(".grid-item-time span.blue--text")?.textContent || ""
    );

    let age = "";
    const ageMatch = profileRealName.match(/(\d{2})/);
    if (ageMatch) age = ageMatch[1];

    const logbookData = extractLogbookFromDrawer(drawer);
    const logbookLatest = logbookData.logbookLatest;
    const nameFromLogbook = logbookData.nameFromLogbook;
    const effectiveName = nameFromLogbook || profileName;
    return {
      profile: {
        alias: profileName,
        realNameRaw: profileRealName,
        age,
        location: profileLocation,
        timezone,
        civilStatus,
        timeLocal: timeText,
      },
      logbookLatest,
      effectiveName,
    };
  };

  const extractOperatorDrawer = () => {
    const drawer = findDrawerByHints(
      [
        ".operator-mobile-drawer",
        '[data-testid="operatorMobileDrawer"]',
        '[data-testid="playerMobileDrawer"]',
        '[data-testid="operatorProfileDrawer"]',
        '[data-testid="playerProfileDrawer"]',
        '[data-testid="youAreDrawer"]',
        '[data-testid="youArePanel"]',
        '[data-testid="operatorProfileName"]',
        '[data-testid="playerProfileName"]',
      ],
      ["you are", "operator", "player", "persona", "profile"]
    );
    if (!drawer) {
      return { profile: {}, logbookLatest: [], effectiveName: "" };
    }

    const profileName = cleanText(
      drawer.querySelector(
        '[data-testid="operatorProfileName"], [data-testid="playerProfileName"], [data-testid="youAreName"], [data-testid="profileNameItem-player"]'
      )?.textContent || ""
    );
    const profileRealName = cleanText(
      drawer.querySelector(
        '[data-testid="operatorProfileRealName"], [data-testid="playerProfileRealName"], [data-testid="profileRealName-player"]'
      )?.textContent || ""
    );
    const profileLocation = cleanText(
      drawer.querySelector(
        '[data-testid="operatorProfileLocation"], [data-testid="playerProfileLocation"], [data-testid="profileLocation-player"]'
      )?.textContent || ""
    );
    const civilStatus = cleanText(
      drawer.querySelector(
        '[data-testid="operatorProfileCivilStatus"], [data-testid="playerProfileCivilStatus"], [data-testid="profileCivilStatus-player"]'
      )?.textContent || ""
    );
    const roleLabel = cleanText(
      drawer.querySelector(
        '[data-testid="youAreLabel"], [data-testid="operatorProfileRole"], [data-testid="playerProfileRole"]'
      )?.textContent || ""
    );
    const timezoneLabel = Array.from(drawer.querySelectorAll("span")).find(
      (span) => /timezone:/i.test(span.textContent || "")
    );
    const timezone = timezoneLabel
      ? cleanText(
          timezoneLabel.parentElement?.textContent?.replace(/timezone:/i, "") ||
            ""
        )
      : "";
    const timeText = cleanText(
      drawer.querySelector(".grid-item-time span.blue--text")?.textContent || ""
    );

    let age = "";
    const ageMatch = profileRealName.match(/(\d{2})/);
    if (ageMatch) age = ageMatch[1];
    if (!age) {
      const ageLabel = Array.from(
        drawer.querySelectorAll("div, span, p, li")
      ).find((node) => /(^|\s)age(\s|:|$)/i.test(cleanText(node.textContent)));
      if (ageLabel) {
        const inlineAge = cleanText(ageLabel.textContent || "").match(
          /(\d{2})/
        );
        if (inlineAge) age = inlineAge[1];
      }
    }

    const logbookData = extractLogbookFromDrawer(drawer);
    const logbookLatest = logbookData.logbookLatest;
    const effectiveName = profileName || roleLabel;

    return {
      profile: {
        alias: profileName,
        realNameRaw: profileRealName,
        age,
        location: profileLocation,
        timezone,
        civilStatus,
        roleLabel,
        timeLocal: timeText,
      },
      logbookLatest,
      effectiveName,
    };
  };

  const assignRoles = (messages, chatRect) => {
    if (!messages.length) return { messages, confidence: "low" };
    const widthBase = chatRect.width || window.innerWidth || 1;
    const leftEdge = chatRect.left || 0;
    const rightEdge = leftEdge + widthBase;
    const clearThreshold = Math.max(18, widthBase * 0.04);

    const centers = messages.map(
      (entry) => entry.centerX || entry.bounds.x + entry.bounds.w / 2
    );
    const roles = messages.map((entry) => entry.role || "");
    let clearCount = 0;

    messages.forEach((entry, index) => {
      if (roles[index]) {
        clearCount += 1;
        return;
      }
      const leftGap = Math.abs(entry.bounds.x - leftEdge);
      const rightGap = Math.abs(rightEdge - (entry.bounds.x + entry.bounds.w));
      const gapDiff = Math.abs(leftGap - rightGap);
      if (gapDiff >= clearThreshold) {
        roles[index] = rightGap < leftGap ? "operator" : "customer";
        clearCount += 1;
      }
    });

    const knownCenters = roles
      .map((role, index) => ({ role, center: centers[index] }))
      .filter((entry) => entry.role);
    const fallbackLeft = Math.min(...centers);
    const fallbackRight = Math.max(...centers);
    let leftCenter = knownCenters
      .filter((e) => e.role === "customer")
      .reduce((sum, e) => sum + e.center, 0);
    let rightCenter = knownCenters
      .filter((e) => e.role === "operator")
      .reduce((sum, e) => sum + e.center, 0);
    const leftCount = knownCenters.filter((e) => e.role === "customer").length;
    const rightCount = knownCenters.filter((e) => e.role === "operator").length;
    if (leftCount > 0) leftCenter /= leftCount;
    if (rightCount > 0) rightCenter /= rightCount;
    if (!leftCount) leftCenter = fallbackLeft;
    if (!rightCount) rightCenter = fallbackRight;

    for (let iter = 0; iter < 3; iter += 1) {
      const leftGroup = [];
      const rightGroup = [];
      centers.forEach((center, index) => {
        if (roles[index] === "customer") {
          leftGroup.push(center);
          return;
        }
        if (roles[index] === "operator") {
          rightGroup.push(center);
          return;
        }
        if (Math.abs(center - leftCenter) <= Math.abs(center - rightCenter)) {
          leftGroup.push(center);
        } else {
          rightGroup.push(center);
        }
      });
      if (leftGroup.length > 0) {
        leftCenter =
          leftGroup.reduce((sum, value) => sum + value, 0) / leftGroup.length;
      }
      if (rightGroup.length > 0) {
        rightCenter =
          rightGroup.reduce((sum, value) => sum + value, 0) / rightGroup.length;
      }
    }

    const split = (leftCenter + rightCenter) / 2;
    const updated = messages.map((entry, index) => {
      const role =
        roles[index] || (centers[index] > split ? "operator" : "customer");
      return { ...entry, role };
    });

    const separation = Math.abs(rightCenter - leftCenter);
    const separationRatio = separation / widthBase;
    const clarityRatio = clearCount / messages.length;
    let confidence = "low";
    if (
      separationRatio >= 0.22 &&
      clarityRatio >= 0.6 &&
      messages.length >= 4
    ) {
      confidence = "high";
    } else if (
      separationRatio >= 0.14 &&
      clarityRatio >= 0.35 &&
      messages.length >= 3
    ) {
      confidence = "med";
    }
    return { messages: updated, confidence };
  };

  const sortMessagesForTimeline = (messages) =>
    (Array.isArray(messages) ? messages : [])
      .map((entry, index) => ({ ...entry, timelineIndex: index }))
      .sort((a, b) => {
        const ay = Number(a?.bounds?.y || 0);
        const by = Number(b?.bounds?.y || 0);
        const yDelta = ay - by;
        if (Math.abs(yDelta) > 4) {
          return yDelta;
        }
        const ax = Number(a?.bounds?.x || 0);
        const bx = Number(b?.bounds?.x || 0);
        const xDelta = ax - bx;
        if (Math.abs(xDelta) > 8) {
          return xDelta;
        }
        const aScan = Number.isFinite(Number(a?.scanIndex))
          ? Number(a.scanIndex)
          : Number(a.timelineIndex || 0);
        const bScan = Number.isFinite(Number(b?.scanIndex))
          ? Number(b.scanIndex)
          : Number(b.timelineIndex || 0);
        return aScan - bScan;
      })
      .map(({ timelineIndex, ...entry }) => entry);

  const buildLatestCustomerSnapshot = (messages, roleConfidence) => {
    const source = Array.isArray(messages) ? messages : [];
    const candidateEntries = [];
    const seen = new Set();
    for (let index = source.length - 1; index >= 0; index -= 1) {
      const entry = source[index];
      const text = cleanText(entry?.text || "");
      if (!text) {
        continue;
      }
      const normalized = text.toLowerCase();
      if (seen.has(normalized)) {
        continue;
      }
      const allowUncertainTail =
        source.length - 1 - index <= 2 &&
        !entry?.explicitRole &&
        roleConfidence !== "high";
      if (entry?.role === "customer" || allowUncertainTail) {
        seen.add(normalized);
        candidateEntries.push({
          index,
          text,
          role: entry?.role || "",
          timestamp: entry?.timestamp || "",
        });
      }
      if (candidateEntries.length >= 4) {
        break;
      }
    }

    const primary = candidateEntries[0] || null;
    let turnText = "";
    if (primary && primary.index >= 0) {
      const turnParts = [];
      for (let index = primary.index; index >= 0; index -= 1) {
        const entry = source[index];
        if (entry?.role !== "customer") {
          break;
        }
        const text = cleanText(entry?.text || "");
        if (text) {
          turnParts.unshift(text);
        }
      }
      turnText = cleanText(turnParts.join(" "));
    }

    let confidence = 0;
    if (primary) {
      confidence = 0.55;
      if ((primary.text || "").length >= 12) confidence += 0.15;
      if (turnText && turnText !== primary.text) confidence += 0.15;
      if (candidateEntries.length >= 2) confidence += 0.1;
      if (roleConfidence === "high") confidence += 0.05;
      if (roleConfidence === "low") confidence = Math.min(confidence, 0.7);
      confidence = Math.max(0, Math.min(1, Number(confidence.toFixed(2))));
    }

    return {
      latestCustomerIndex: primary ? primary.index : -1,
      latestCustomerMessage: primary?.text || "",
      latestCustomerTurn: turnText || primary?.text || "",
      latestCustomerCandidates: candidateEntries.map((entry) => entry.text),
      latestCustomerConfidence: confidence,
    };
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getLatestCustomerSignature = (context) => {
    if (!context || typeof context !== "object") return "";
    const turn = cleanText(context.dom_latest_customer_turn || "");
    const latest = cleanText(context.dom_latest_customer_message || "");
    const candidates = Array.isArray(context.dom_latest_customer_candidates)
      ? context.dom_latest_customer_candidates
          .slice(0, 3)
          .map((item) => cleanText(item))
          .filter(Boolean)
      : [];
    return [turn, latest, ...candidates].join("|").toLowerCase();
  };

  const pickBetterContextSnapshot = (first, second) => {
    const firstSig = getLatestCustomerSignature(first);
    const secondSig = getLatestCustomerSignature(second);
    if (!firstSig && secondSig) return second;
    if (firstSig && !secondSig) return first;
    if (firstSig === secondSig) return second;
    const firstConfidence = Number(first?.dom_latest_customer_confidence || 0);
    const secondConfidence = Number(
      second?.dom_latest_customer_confidence || 0
    );
    if (Number.isFinite(firstConfidence) && Number.isFinite(secondConfidence)) {
      return secondConfidence >= firstConfidence ? second : first;
    }
    return second;
  };

  const extractDomContextStable = async () => {
    const first = extractDomContext();
    const hasCustomer = Boolean(
      cleanText(
        first?.dom_latest_customer_turn ||
          first?.dom_latest_customer_message ||
          ""
      )
    );
    if (hasCustomer) {
      return first;
    }
    await wait(170);
    const second = extractDomContext();
    return pickBetterContextSnapshot(first, second);
  };

  const extractDomContext = () => {
    const extractionStartedAt = Date.now();
    recordPerfTimestamp(perfState.contextExtractionsTs, extractionStartedAt);
    const best = resolvePrimaryChatContainer();
    const chatRect = best?.getBoundingClientRect?.() || {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const messages = extractMessagesFromContainer(best, chatRect);
    const sortedMessages = sortMessagesForTimeline(messages);
    const roleAssignment = assignRoles(sortedMessages, chatRect);
    const allMessages = sortMessagesForTimeline(roleAssignment.messages);
    if (allMessages.length > 0) {
      const lastIndex = allMessages.length - 1;
      const lastMessage = allMessages[lastIndex];
      if (
        lastMessage?.role === "operator" &&
        !lastMessage.explicitRole &&
        roleAssignment.confidence !== "high"
      ) {
        lastMessage.role = "customer";
      }
    }
    const recentMessages = allMessages.slice(-12);
    const latestCustomerSnapshot = buildLatestCustomerSnapshot(
      recentMessages,
      roleAssignment.confidence
    );
    const resolvedCustomerIndex = latestCustomerSnapshot.latestCustomerIndex;
    const latestCustomer =
      resolvedCustomerIndex >= 0 ? recentMessages[resolvedCustomerIndex] : null;
    const latestMessage =
      latestCustomer || recentMessages[recentMessages.length - 1];
    const latestOperator =
      [...recentMessages]
        .reverse()
        .find((entry) => entry.role === "operator") || null;
    let operatorBefore = "";
    if (resolvedCustomerIndex > 0) {
      for (let i = resolvedCustomerIndex - 1; i >= 0; i -= 1) {
        if (recentMessages[i]?.role === "operator") {
          operatorBefore = recentMessages[i]?.text || "";
          break;
        }
      }
    }

    const leftPanel = extractSidePanel("left");
    const rightPanel = extractSidePanel("right");
    const shouldScanDrawers =
      Date.now() - extractionStartedAt < EXTRACTION_MAX_SCAN_MS;
    const drawerData = shouldScanDrawers
      ? extractCustomerDrawer()
      : { profile: {}, logbookLatest: [], effectiveName: "" };
    const operatorDrawerData = shouldScanDrawers
      ? extractOperatorDrawer()
      : { profile: {}, logbookLatest: [], effectiveName: "" };

    let confidence = 0.2;
    if (recentMessages.length >= 6) confidence += 0.2;
    const timestampCount = recentMessages.filter((entry) =>
      TIMESTAMP_REGEX.test(entry.text)
    ).length;
    if (timestampCount >= 3) confidence += 0.2;
    if (
      Object.keys(leftPanel.fields).length > 0 &&
      Object.keys(rightPanel.fields).length > 0
    )
      confidence += 0.2;
    if (latestCustomer && latestCustomer.text.length >= 12) confidence += 0.2;
    if (roleAssignment.confidence === "low") {
      confidence = Math.min(confidence, 0.45);
    } else if (roleAssignment.confidence === "med") {
      confidence = Math.min(confidence, 0.7);
    }
    confidence = Math.max(0, Math.min(1, Number(confidence.toFixed(2))));
    setCachedChatContainer(best);
    const extractionDuration = Date.now() - extractionStartedAt;
    recordPerfDuration(perfState.contextDurationsMs, extractionDuration);

    return {
      context_version: "1.1",
      dom_messages: recentMessages.map((entry) => ({
        role: entry.role,
        text: entry.text,
        timestamp: entry.timestamp,
      })),
      dom_message_bounds: recentMessages.map((entry) => ({
        role: entry.role,
        bounds: entry.bounds,
        score: entry.score || 0,
        timestamp: entry.timestamp || "",
      })),
      dom_message_bounds_all: allMessages.map((entry) => ({
        role: entry.role,
        bounds: entry.bounds,
        score: entry.score || 0,
        timestamp: entry.timestamp || "",
      })),
      dom_latest_customer_message:
        latestCustomerSnapshot.latestCustomerMessage ||
        latestCustomer?.text ||
        "",
      dom_latest_customer_turn:
        latestCustomerSnapshot.latestCustomerTurn || latestCustomer?.text || "",
      dom_latest_customer_candidates:
        latestCustomerSnapshot.latestCustomerCandidates || [],
      dom_latest_customer_confidence:
        latestCustomerSnapshot.latestCustomerConfidence || 0,
      dom_latest_operator_message: latestOperator?.text || "",
      dom_latest_operator_before_customer_message: operatorBefore,
      dom_profiles: {
        left: leftPanel.fields,
        right: rightPanel.fields,
      },
      dom_profile_summary: drawerData.profile,
      dom_logbook_latest: drawerData.logbookLatest,
      dom_effective_name: drawerData.effectiveName,
      dom_operator_profile_summary: operatorDrawerData.profile,
      dom_operator_logbook_latest: operatorDrawerData.logbookLatest,
      dom_operator_effective_name: operatorDrawerData.effectiveName,
      dom_bounds: {
        chat: {
          x: Math.round(chatRect.left),
          y: Math.round(chatRect.top),
          w: Math.round(chatRect.width),
          h: Math.round(chatRect.height),
        },
        last_message: latestMessage?.bounds || null,
        left_panel: leftPanel.bounds,
        right_panel: rightPanel.bounds,
      },
      dom_confidence: confidence,
      dom_role_confidence: roleAssignment.confidence,
      capture_meta: {
        url: window.location?.href || "",
        viewportWidth: window.innerWidth || 0,
        viewportHeight: window.innerHeight || 0,
        devicePixelRatio: window.devicePixelRatio || 1,
        capturedAt: new Date().toISOString(),
        perf: buildPerfSnapshot(),
      },
    };
  };

  const normalizeTelemetryText = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[`"'.,!?;:()[\]{}<>@#$%^&*_+=\\/|-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 800);

  const tokenizeTelemetryText = (value) => {
    const normalized = normalizeTelemetryText(value);
    if (!normalized) return [];
    return normalized
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token.length >= 2);
  };

  const computeTelemetrySimilarity = (candidateText, outboundText) => {
    const candidateNorm = normalizeTelemetryText(candidateText);
    const outboundNorm = normalizeTelemetryText(outboundText);
    if (!candidateNorm || !outboundNorm) return 0;
    if (candidateNorm === outboundNorm) return 1;

    const candidateTokens = new Set(tokenizeTelemetryText(candidateNorm));
    const outboundTokens = new Set(tokenizeTelemetryText(outboundNorm));
    let overlap = 0;
    candidateTokens.forEach((token) => {
      if (outboundTokens.has(token)) overlap += 1;
    });
    const union = candidateTokens.size + outboundTokens.size - overlap;
    const jaccard = union > 0 ? overlap / union : 0;
    const candidateCoverage =
      candidateTokens.size > 0 ? overlap / candidateTokens.size : 0;
    const outboundCoverage =
      outboundTokens.size > 0 ? overlap / outboundTokens.size : 0;

    let containment = 0;
    if (outboundNorm.includes(candidateNorm) && candidateNorm.length >= 8) {
      containment = 0.98;
    } else if (
      candidateNorm.includes(outboundNorm) &&
      outboundNorm.length >= 8
    ) {
      containment = 0.9;
    }
    return Math.max(
      jaccard,
      candidateCoverage,
      outboundCoverage * 0.92,
      containment
    );
  };

  const pruneTelemetryMatchedSignatures = () => {
    const cutoff = Date.now() - 5 * 60 * 1000;
    telemetryMatchedSignatures.forEach((timestamp, signature) => {
      if (Number(timestamp) < cutoff) {
        telemetryMatchedSignatures.delete(signature);
      }
    });
  };

  const stopTelemetryTracking = ({ clearPending = false } = {}) => {
    if (telemetryObserver) {
      telemetryObserver.disconnect();
    }
    telemetryObserver = null;
    telemetryObserverRoot = null;
    telemetryDetectionInFlight = false;
    if (telemetryObserverTimer) {
      clearTimeout(telemetryObserverTimer);
      telemetryObserverTimer = null;
    }
    if (telemetryIdleTimer) {
      clearTimeout(telemetryIdleTimer);
      telemetryIdleTimer = null;
    }
    if (clearPending) {
      telemetryPendingCandidates = [];
    }
  };

  const refreshTelemetryIdleWindow = () => {
    if (telemetryIdleTimer) {
      clearTimeout(telemetryIdleTimer);
      telemetryIdleTimer = null;
    }
    if (telemetryPendingCandidates.length === 0) {
      stopTelemetryTracking();
      return;
    }
    telemetryIdleTimer = setTimeout(() => {
      const nowMs = Date.now();
      pruneTelemetryPendingCandidates();
      if (telemetryPendingCandidates.length === 0) {
        stopTelemetryTracking();
        return;
      }
      const sinceLastMatch = nowMs - Number(telemetryLastMatchMs || 0);
      const sinceCandidate = nowMs - Number(telemetryLastCandidateTouchMs || 0);
      if (
        sinceLastMatch >= TELEMETRY_IDLE_CUTOFF_MS &&
        sinceCandidate >= TELEMETRY_IDLE_CUTOFF_MS
      ) {
        stopTelemetryTracking({ clearPending: true });
      } else {
        refreshTelemetryIdleWindow();
      }
    }, TELEMETRY_IDLE_CUTOFF_MS);
  };

  const pruneTelemetryPendingCandidates = () => {
    const now = Date.now();
    telemetryPendingCandidates = telemetryPendingCandidates
      .filter((candidate) => candidate && Number(candidate.expires_at_ms) > now)
      .slice(-TELEMETRY_MAX_PENDING);
    if (telemetryPendingCandidates.length === 0) {
      stopTelemetryTracking();
    }
  };

  const registerTelemetryPendingCandidate = (candidate) => {
    if (!candidate || typeof candidate !== "object") return;
    const requestId = cleanText(
      candidate.request_id || candidate.requestId || ""
    );
    const replyId = cleanText(candidate.reply_id || candidate.replyId || "");
    const replyTextRaw = cleanText(
      candidate.reply_text_raw || candidate.replyTextRaw || ""
    );
    if (!requestId || !replyId || !replyTextRaw) {
      return;
    }
    pruneTelemetryPendingCandidates();
    const selectedTsMs = Number(candidate.selected_ts_ms || Date.now());
    const expiresAtMs = Number(
      candidate.expires_at_ms || selectedTsMs + TELEMETRY_PENDING_TTL_MS
    );
    const normalized = {
      request_id: requestId,
      reply_id: replyId,
      reply_text_raw: replyTextRaw,
      reply_text_norm: normalizeTelemetryText(
        candidate.reply_text_norm || replyTextRaw
      ),
      source_message_raw: cleanText(candidate.source_message_raw || ""),
      source_message_norm: normalizeTelemetryText(
        candidate.source_message_norm || candidate.source_message_raw || ""
      ),
      prompt_version: cleanText(candidate.prompt_version || ""),
      model: cleanText(candidate.model || ""),
      score_percent: Number.isFinite(Number(candidate.score_percent))
        ? Number(candidate.score_percent)
        : null,
      rank_position: Number.isFinite(Number(candidate.rank_position))
        ? Number(candidate.rank_position)
        : null,
      selected_ts_ms: selectedTsMs,
      expires_at_ms: expiresAtMs,
    };
    const dedupeKey = `${normalized.request_id}:${normalized.reply_id}`;
    telemetryPendingCandidates = telemetryPendingCandidates.filter(
      (item) => `${item.request_id}:${item.reply_id}` !== dedupeKey
    );
    telemetryPendingCandidates.push(normalized);
    telemetryPendingCandidates = telemetryPendingCandidates.slice(
      -TELEMETRY_MAX_PENDING
    );
    telemetryLastCandidateTouchMs = Date.now();
  };

  const collectOutboundMessagesForTelemetry = (context) => {
    const candidates = [];
    const pushCandidate = (text) => {
      const raw = cleanText(text || "");
      if (!raw || raw.length < 2) return;
      const norm = normalizeTelemetryText(raw);
      if (!norm) return;
      if (candidates.some((entry) => entry.norm === norm)) return;
      candidates.push({ raw, norm });
    };
    const messages = Array.isArray(context?.dom_messages)
      ? context.dom_messages
      : [];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const entry = messages[index];
      if (entry?.role !== "operator") continue;
      pushCandidate(entry?.text || "");
      if (candidates.length >= 4) break;
    }
    pushCandidate(context?.dom_latest_operator_message || "");
    return candidates;
  };

  const collectFastOutboundMessagesForTelemetry = () => {
    const root = resolvePrimaryChatContainer();
    if (!root || !isElementVisible(root)) {
      return [];
    }
    const candidates = [];
    const seen = new Set();
    const pushCandidate = (rawText) => {
      const raw = cleanText(rawText || "");
      if (
        !raw ||
        raw.length < 2 ||
        isLikelyDateSeparator(raw) ||
        isLikelyTimestampOnly(raw)
      ) {
        return;
      }
      const norm = normalizeTelemetryText(raw);
      if (!norm || seen.has(norm)) {
        return;
      }
      seen.add(norm);
      candidates.push({ raw, norm });
    };
    const selectors = [
      '[data-testid*="message"]',
      '[data-test-id*="message"]',
      '[class*="message"]',
      '[class*="bubble"]',
      '[role="listitem"]',
      "div",
    ];
    let scannedNodes = 0;
    for (const selector of selectors) {
      if (candidates.length >= MAX_FAST_OPERATOR_CANDIDATES) {
        break;
      }
      const nodes = root.querySelectorAll(selector);
      for (let index = nodes.length - 1; index >= 0; index -= 1) {
        if (
          candidates.length >= MAX_FAST_OPERATOR_CANDIDATES ||
          scannedNodes >= 120
        ) {
          break;
        }
        const node = nodes[index];
        scannedNodes += 1;
        if (!node || !isElementVisible(node)) continue;
        const explicitRole = findRoleFromElement(node, root);
        const classHint = String(node.className || "").toLowerCase();
        const roleHint = /(outgoing|sent|operator|mine|self|me|right)/.test(
          classHint
        )
          ? "operator"
          : "";
        if (explicitRole && explicitRole !== "operator" && !roleHint) {
          continue;
        }
        const text = cleanText(node.innerText || node.textContent || "");
        if (!text || text.length > 520) continue;
        pushCandidate(text);
      }
    }
    return candidates;
  };

  const pickTelemetryMatch = (outbound, nowMs) => {
    if (!outbound?.norm) return null;
    let best = null;
    telemetryPendingCandidates.forEach((candidate) => {
      const similarity = computeTelemetrySimilarity(
        candidate.reply_text_norm || candidate.reply_text_raw,
        outbound.norm
      );
      if (similarity < TELEMETRY_SEND_MATCH_THRESHOLD) return;
      const ageDelta = Math.abs(
        nowMs - Number(candidate.selected_ts_ms || nowMs)
      );
      if (!best) {
        best = { candidate, similarity, ageDelta };
        return;
      }
      if (similarity > best.similarity) {
        best = { candidate, similarity, ageDelta };
        return;
      }
      if (
        Math.abs(similarity - best.similarity) < 0.0001 &&
        ageDelta < best.ageDelta
      ) {
        best = { candidate, similarity, ageDelta };
      }
    });
    return best;
  };

  const emitTelemetrySentConfirmed = (
    candidate,
    outbound,
    similarity,
    nowMs
  ) => {
    if (!candidate || !outbound) return;
    pruneTelemetryMatchedSignatures();
    const signature = `${candidate.request_id}:${candidate.reply_id}:${outbound.norm}`;
    if (telemetryMatchedSignatures.has(signature)) {
      return;
    }
    telemetryMatchedSignatures.set(signature, nowMs);
    chrome.runtime.sendMessage(
      {
        type: "TELEMETRY_REPLY_SENT_CONFIRMED",
        payload: {
          request_id: candidate.request_id,
          reply_id: candidate.reply_id,
          reply_text_raw: outbound.raw,
          reply_text_norm: outbound.norm,
          source_message_raw: candidate.source_message_raw || "",
          source_message_norm: candidate.source_message_norm || "",
          prompt_version: candidate.prompt_version || "",
          model: candidate.model || "",
          score_percent: candidate.score_percent,
          rank_position: candidate.rank_position,
          selected_ts_ms: candidate.selected_ts_ms,
          sent_ts_ms: nowMs,
          similarity: Number(similarity.toFixed(3)),
        },
      },
      () => void chrome.runtime.lastError
    );
  };

  const processTelemetryOutboundDetection = () => {
    if (telemetryDetectionInFlight) {
      return;
    }
    telemetryDetectionInFlight = true;
    const startedAt = Date.now();
    try {
      pruneTelemetryPendingCandidates();
      if (telemetryPendingCandidates.length === 0) {
        return;
      }
      let outboundCandidates = collectFastOutboundMessagesForTelemetry();
      const nowMs = Date.now();
      const observerLoad = perfWindowCount(
        perfState.observerCallbacksTs,
        nowMs
      );
      const allowFullContext =
        observerLoad <= TELEMETRY_MAX_OBSERVER_CALLBACKS_FOR_FULL_CONTEXT;
      if (
        outboundCandidates.length === 0 &&
        allowFullContext &&
        nowMs - telemetryLastFullContextMs >=
          TELEMETRY_FULL_CONTEXT_MIN_INTERVAL_MS
      ) {
        telemetryLastFullContextMs = nowMs;
        const context = extractDomContext();
        outboundCandidates = collectOutboundMessagesForTelemetry(context);
      }
      if (outboundCandidates.length === 0) {
        refreshTelemetryIdleWindow();
        return;
      }
      for (const outbound of outboundCandidates) {
        const match = pickTelemetryMatch(outbound, nowMs);
        if (!match) {
          continue;
        }
        const matchKey = `${match.candidate.request_id}:${match.candidate.reply_id}`;
        telemetryPendingCandidates = telemetryPendingCandidates.filter(
          (candidate) =>
            `${candidate.request_id}:${candidate.reply_id}` !== matchKey
        );
        emitTelemetrySentConfirmed(
          match.candidate,
          outbound,
          match.similarity,
          nowMs
        );
        telemetryLastMatchMs = nowMs;
        break;
      }
      pruneTelemetryPendingCandidates();
      refreshTelemetryIdleWindow();
    } finally {
      recordPerfDuration(
        perfState.detectionDurationsMs,
        Date.now() - startedAt
      );
      telemetryDetectionInFlight = false;
    }
  };

  const scheduleTelemetryDetection = () => {
    if (telemetryPendingCandidates.length === 0) {
      stopTelemetryTracking();
      return;
    }
    if (telemetryObserverTimer) {
      clearTimeout(telemetryObserverTimer);
    }
    telemetryObserverTimer = setTimeout(() => {
      telemetryObserverTimer = null;
      processTelemetryOutboundDetection();
    }, TELEMETRY_OBSERVER_DEBOUNCE_MS);
  };

  const ensureTelemetryObserver = () => {
    pruneTelemetryPendingCandidates();
    if (telemetryPendingCandidates.length === 0) {
      stopTelemetryTracking();
      return;
    }
    const root = resolvePrimaryChatContainer() || document.body;
    if (!root) return;
    if (telemetryObserver && telemetryObserverRoot === root) {
      refreshTelemetryIdleWindow();
      return;
    }
    if (telemetryObserver) {
      telemetryObserver.disconnect();
    }
    telemetryObserverRoot = root;
    telemetryObserver = new MutationObserver((mutationList) => {
      if (!Array.isArray(mutationList) || mutationList.length === 0) {
        return;
      }
      recordPerfTimestamp(perfState.observerCallbacksTs, Date.now());
      const relevant = mutationList.some(
        (mutation) =>
          mutation?.target &&
          mutation.target.nodeType === 1 &&
          telemetryObserverRoot?.contains(mutation.target)
      );
      if (!relevant) {
        return;
      }
      scheduleTelemetryDetection();
    });
    telemetryObserver.observe(root, {
      childList: true,
      subtree: true,
    });
    refreshTelemetryIdleWindow();
    scheduleTelemetryDetection();
  };

  const buildSelector = (element) => {
    if (!element) return "";
    if (element.id) return `#${CSS.escape(element.id)}`;
    const parts = [];
    let current = element;
    let depth = 0;
    while (current && current.nodeType === 1 && depth < 4) {
      const tag = current.tagName.toLowerCase();
      const classList = Array.from(current.classList || [])
        .filter((cls) => !cls.startsWith("__"))
        .slice(0, 3)
        .map((cls) => `.${CSS.escape(cls)}`)
        .join("");
      const parent = current.parentElement;
      if (!parent) {
        parts.unshift(`${tag}${classList}`);
        break;
      }
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current.tagName
      );
      const index = siblings.indexOf(current) + 1;
      const nth = siblings.length > 1 ? `:nth-of-type(${index})` : "";
      parts.unshift(`${tag}${classList}${nth}`);
      current = parent;
      depth += 1;
    }
    return parts.join(" > ");
  };

  const summarizeElement = (element, score, category) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const dataset = {};
    Object.keys(element.dataset || {})
      .slice(0, 6)
      .forEach((key) => {
        dataset[key] = String(element.dataset[key] || "").slice(0, 80);
      });
    const snippet = cleanText(element.textContent || "").slice(0, 160);
    return {
      category,
      score: Number(score.toFixed(2)),
      selector: buildSelector(element),
      tag: element.tagName.toLowerCase(),
      id: element.id || "",
      classes: Array.from(element.classList || []).slice(0, 8),
      testId: element.getAttribute("data-testid") || "",
      dataset,
      role: element.getAttribute("role") || "",
      ariaLabel: element.getAttribute("aria-label") || "",
      text: snippet,
      bounds: {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
      },
      styles: {
        display: style.display,
        overflowY: style.overflowY,
        background: style.backgroundColor,
        borderRadius: style.borderRadius,
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
      },
    };
  };

  const scanDomCandidates = () => {
    const dump = {
      capturedAt: new Date().toISOString(),
      url: window.location?.href || "",
      viewport: {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0,
        dpr: window.devicePixelRatio || 1,
      },
      containers: [],
      bubbles: [],
    };

    const containers = getCandidateChatContainers();
    dump.containers = containers
      .slice(0, 15)
      .map((entry) =>
        summarizeElement(entry.element, entry.score, "container")
      );

    const container = containers[0]?.element || document.body;
    const chatRect = container?.getBoundingClientRect?.() || {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const bubbleMap = new Map();
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = cleanText(node.textContent);
        if (text.length >= 4 && text.length <= 500) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    });
    while (walker.nextNode()) {
      const text = cleanText(walker.currentNode.textContent);
      if (!text || isLikelyDateSeparator(text) || isLikelyTimestampOnly(text))
        continue;
      const bubble = findBubbleElement(walker.currentNode, container, chatRect);
      if (!bubble || !isElementVisible(bubble)) continue;
      if (bubble.closest("#__ashly_dom_overlay")) continue;
      const rect = bubble.getBoundingClientRect();
      if (!isWithinChatRect(rect, chatRect)) continue;
      const score = scoreBubbleElement(bubble) + Math.min(text.length / 80, 2);
      const current = bubbleMap.get(bubble);
      if (!current || current.score < score) {
        bubbleMap.set(bubble, { element: bubble, score });
      }
    }
    dump.bubbles = Array.from(bubbleMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((entry) => summarizeElement(entry.element, entry.score, "bubble"));
    return dump;
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const findLogbookButton = () =>
    document.querySelector('[data-testid="addNewLogbookButton-customer"]') ||
    Array.from(document.querySelectorAll("button")).find((btn) =>
      /add new log/i.test(cleanText(btn.textContent))
    );

  const findActiveModal = () => {
    const logbookForm = document.querySelector(
      '[data-testid="newLogbookForm"]'
    );
    if (logbookForm) {
      return logbookForm.closest('[role="dialog"]') || logbookForm;
    }
    const selectors = [
      ".v-dialog--active",
      ".v-overlay__content",
      ".v-menu__content.menuable__content__active",
      '[role="dialog"]',
    ];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && isElementVisible(element)) {
        return element;
      }
    }
    return null;
  };

  const extractLogbookModal = (modal) => {
    if (!modal)
      return { categories: [], textareaSelector: "", selectSelector: "" };
    const form =
      modal.querySelector('[data-testid="newLogbookForm"]') ||
      modal.querySelector("form") ||
      modal;
    const customerNameEl = modal.querySelector(
      '[data-testid="logbookCustomerName"]'
    );
    const profileNameEl = modal.querySelector(
      '[data-testid="logbookProfileName"]'
    );
    const titleEl = modal.querySelector('[data-testid="logbookDialogTitle"]');

    const textarea =
      modal.querySelector('[data-testid="logbookComment"]') ||
      modal.querySelector("textarea");
    const textareaSelector = textarea ? buildSelector(textarea) : "";

    const selectInput = modal.querySelector(
      '[data-testid="logbookCategorySelect"]'
    );
    const selectButton =
      selectInput?.closest('[role="button"]') ||
      selectInput?.closest(".v-input__slot");
    const selectSelector = selectInput
      ? buildSelector(selectInput)
      : selectButton
      ? buildSelector(selectButton)
      : "";

    const saveButton = modal.querySelector('[data-testid="logbookSaveButton"]');
    const cancelButton = modal.querySelector(
      '[data-testid="logbookCancelButton"]'
    );

    const categories = [];
    const listbox =
      document.querySelector('[role="listbox"]') ||
      document.querySelector(".v-menu__content.menuable__content__active");
    if (listbox) {
      const options = listbox.querySelectorAll('[role="option"], .v-list-item');
      options.forEach((option) => {
        const text = cleanText(option.textContent);
        if (text && !categories.includes(text)) {
          categories.push(text);
        }
      });
    }

    return {
      customerName: cleanText(customerNameEl?.textContent || ""),
      profileName: cleanText(profileNameEl?.textContent || ""),
      dialogTitle: cleanText(titleEl?.textContent || ""),
      formSelector: form ? buildSelector(form) : "",
      categories,
      textareaSelector,
      selectSelector,
      saveButtonSelector: saveButton ? buildSelector(saveButton) : "",
      cancelButtonSelector: cancelButton ? buildSelector(cancelButton) : "",
    };
  };

  const scanLogbookModal = async () => {
    const button = findLogbookButton();
    if (!button) {
      throw new Error("Logbook button not found");
    }
    button.click();
    let modal = null;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      await sleep(150);
      modal = findActiveModal();
      if (modal) break;
    }
    if (!modal) {
      throw new Error("Logbook modal did not appear");
    }

    // Try to open select list if present to read categories.
    const selectInput = modal.querySelector(
      '[data-testid="logbookCategorySelect"]'
    );
    const selectTrigger =
      selectInput?.closest('[role="button"]') ||
      selectInput?.closest(".v-input__slot");
    if (selectTrigger) {
      selectTrigger.click();
      await sleep(150);
    }

    const modalData = extractLogbookModal(modal);

    // Close modal for safety.
    const closeBtn =
      modal.querySelector('[data-testid="logbookCancelButton"]') ||
      modal.querySelector('button[aria-label="Close"], .v-btn--icon') ||
      modal.querySelector('button[type="button"]');
    if (closeBtn) {
      closeBtn.click();
    } else {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    }

    return modalData;
  };

  const normalizeMatch = (value) => cleanText(value || "").toLowerCase();

  const selectLogbookCategory = async (modal, category) => {
    const target = normalizeMatch(category);
    if (!target) {
      throw new Error("Category is required");
    }
    const selectInput = modal.querySelector(
      '[data-testid="logbookCategorySelect"]'
    );
    const selectTrigger =
      selectInput?.closest('[role="button"]') ||
      selectInput?.closest(".v-input__slot");
    if (!selectTrigger) {
      throw new Error("Category select not found");
    }
    selectTrigger.click();
    await sleep(150);

    const listbox =
      document.querySelector('[role="listbox"]') ||
      document.querySelector(".v-menu__content.menuable__content__active");
    if (!listbox) {
      throw new Error("Category list not visible");
    }
    const options = Array.from(
      listbox.querySelectorAll('[role="option"], .v-list-item')
    );
    let selected = null;
    options.forEach((option) => {
      const text = cleanText(option.textContent);
      if (!text) return;
      if (normalizeMatch(text) === target) {
        selected = option;
      }
    });
    if (!selected) {
      selected =
        options.find((option) =>
          normalizeMatch(option.textContent).includes(target)
        ) ||
        options.find((option) =>
          target.includes(normalizeMatch(option.textContent))
        );
    }
    if (!selected) {
      throw new Error(`Category not found: ${category}`);
    }
    selected.click();
    await sleep(120);
    return cleanText(selected.textContent);
  };

  const fillLogbookComment = (modal, comment) => {
    const textarea =
      modal.querySelector('[data-testid="logbookComment"]') ||
      modal.querySelector("textarea");
    if (!textarea) {
      throw new Error("Comment textarea not found");
    }
    textarea.focus();
    textarea.value = comment;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const submitLogbook = (modal) => {
    const saveButton = modal.querySelector('[data-testid="logbookSaveButton"]');
    if (!saveButton) {
      throw new Error("Save button not found");
    }
    if (saveButton.disabled) {
      throw new Error("Save button is disabled");
    }
    saveButton.click();
  };

  const applyLogbookEntry = async ({ category, comment }) => {
    const button = findLogbookButton();
    if (!button) {
      throw new Error("Logbook button not found");
    }
    button.click();
    let modal = null;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      await sleep(150);
      modal = findActiveModal();
      if (modal) break;
    }
    if (!modal) {
      throw new Error("Logbook modal did not appear");
    }

    const chosenCategory = await selectLogbookCategory(modal, category);
    fillLogbookComment(modal, comment);
    await sleep(80);
    submitLogbook(modal);
    return chosenCategory;
  };

  const trackFocus = (event) => {
    const target = event.target;
    if (isTextInput(target) && isElementVisible(target)) {
      lastFocusedInput = target;
    }
  };

  document.addEventListener("focusin", trackFocus, true);

  const isStillConnected = (element) =>
    element && typeof element.isConnected === "boolean" && element.isConnected;

  const findReplyInput = () => {
    if (
      isTextInput(lastFocusedInput) &&
      isElementVisible(lastFocusedInput) &&
      isStillConnected(lastFocusedInput)
    ) {
      return lastFocusedInput;
    }

    const activeElement = document.activeElement;
    if (isTextInput(activeElement)) {
      return activeElement;
    }

    const candidates = [
      ...document.querySelectorAll(
        'textarea, input[type="text"], input[type="search"], input[type="email"], input[type="url"], input:not([type]), [contenteditable="true"]'
      ),
    ];

    return (
      candidates.find(
        (candidate) => isTextInput(candidate) && isElementVisible(candidate)
      ) || null
    );
  };

  const updateEditableSelection = (element) => {
    if (!element.isContentEditable) {
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const dispatchInputEvents = (element, text) => {
    const beforeInput = new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      data: text,
      inputType: "insertText",
    });
    element.dispatchEvent(beforeInput);

    const inputEvent = new InputEvent("input", {
      bubbles: true,
      data: text,
      inputType: "insertText",
    });
    element.dispatchEvent(inputEvent);
  };

  const insertText = (element, text) => {
    if (element.isContentEditable) {
      updateEditableSelection(element);
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return;
      }
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      dispatchInputEvents(element, text);
      return;
    }

    const start = Number.isInteger(element.selectionStart)
      ? element.selectionStart
      : element.value.length;
    const end = Number.isInteger(element.selectionEnd)
      ? element.selectionEnd
      : element.value.length;
    element.setRangeText(text, start, end, "end");
    element.setSelectionRange(start + text.length, start + text.length);
    dispatchInputEvents(element, text);
  };

  const getTypingDelay = () => {
    // Slightly slower base speed than the original 28-85ms
    const min = 45;
    const max = 110;
    const jitter = Math.random() * (max - min);
    return Math.round(min + jitter);
  };

  const typeText = async (element, text) => {
    element.focus();
    element.scrollIntoView({ block: "center", inline: "nearest" });
    updateEditableSelection(element);

    for (const char of text) {
      insertText(element, char);

      let delay = getTypingDelay();

      // --- HUMAN HESITATION ENGINE ---
      if (char === "." || char === "?" || char === "!") {
        // Deep breath/thought pause at the end of a sentence (400ms - 800ms)
        delay += Math.random() * 400 + 400;
      } else if (char === "," || char === ";") {
        // Shorter pause at a comma (150ms - 350ms)
        delay += Math.random() * 200 + 150;
      } else if (char === " ") {
        // 10% chance to hesitate slightly between words while "thinking"
        if (Math.random() < 0.1) {
          delay += Math.random() * 150 + 50;
        }
      } else {
        // 1% chance of a random micro-pause mid-word (simulates a finger fumble)
        if (Math.random() < 0.01) {
          delay += Math.random() * 150 + 50;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  let overlayRoot = null;

  const clearOverlay = () => {
    if (overlayRoot && overlayRoot.parentNode) {
      overlayRoot.parentNode.removeChild(overlayRoot);
    }
    overlayRoot = null;
  };

  const ensureOverlay = () => {
    if (overlayRoot) return overlayRoot;
    const root = document.createElement("div");
    root.id = "__ashly_dom_overlay";
    root.style.position = "fixed";
    root.style.left = "0";
    root.style.top = "0";
    root.style.width = "100vw";
    root.style.height = "100vh";
    root.style.pointerEvents = "none";
    root.style.zIndex = "2147483647";
    document.documentElement.appendChild(root);
    overlayRoot = root;
    return overlayRoot;
  };

  const drawOverlay = (boxes) => {
    if (!Array.isArray(boxes) || boxes.length === 0) {
      clearOverlay();
      return;
    }
    const root = ensureOverlay();
    root.innerHTML = "";
    boxes.forEach((entry) => {
      const bounds = entry?.bounds;
      if (!bounds) return;
      const role = entry?.role || "unknown";
      const color =
        role === "operator"
          ? "#f97316"
          : role === "customer"
          ? "#34d399"
          : "#facc15";
      const box = document.createElement("div");
      box.style.position = "absolute";
      box.style.left = `${bounds.x}px`;
      box.style.top = `${bounds.y}px`;
      box.style.width = `${bounds.w}px`;
      box.style.height = `${bounds.h}px`;
      box.style.border = `2px solid ${color}`;
      box.style.borderRadius = "6px";
      box.style.boxSizing = "border-box";
      box.style.background = "rgba(0,0,0,0.02)";

      const label = document.createElement("div");
      label.textContent = `${role}`;
      label.style.position = "absolute";
      label.style.left = "0";
      label.style.top = "-16px";
      label.style.padding = "2px 6px";
      label.style.fontSize = "10px";
      label.style.fontFamily = "sans-serif";
      label.style.background = color;
      label.style.color = "#fff";
      label.style.borderRadius = "4px";
      label.style.whiteSpace = "nowrap";
      box.appendChild(label);
      if (entry?.timestamp) {
        const timeLabel = document.createElement("div");
        timeLabel.textContent = entry.timestamp;
        timeLabel.style.position = "absolute";
        timeLabel.style.right = "0";
        timeLabel.style.bottom = "-16px";
        timeLabel.style.padding = "2px 6px";
        timeLabel.style.fontSize = "10px";
        timeLabel.style.fontFamily = "sans-serif";
        timeLabel.style.background = "#111827";
        timeLabel.style.color = "#fff";
        timeLabel.style.borderRadius = "4px";
        timeLabel.style.whiteSpace = "nowrap";
        box.appendChild(timeLabel);
      }
      root.appendChild(box);
    });
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message) {
      return;
    }

    if (message.type === "PING_CONTENT_SCRIPT") {
      sendResponse?.({ ok: true });
      return;
    }

    if (message.type === "TELEMETRY_STOP_TRACKING") {
      stopTelemetryTracking({ clearPending: true });
      sendResponse?.({ ok: true, pending: 0 });
      return;
    }

    if (message.type === "TELEMETRY_REGISTER_PENDING_REPLY") {
      registerTelemetryPendingCandidate(message.candidate);
      ensureTelemetryObserver();
      sendResponse?.({ ok: true, pending: telemetryPendingCandidates.length });
      return;
    }

    if (message.type === "TYPE_REPLY") {
      const target = findReplyInput();
      if (!target) {
        sendResponse({ ok: false, error: "No reply input found." });
        return;
      }

      typeText(target, message.text)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({ ok: false, error: error?.message || String(error) })
        );

      return true;
    }

    if (message.type === "EXTRACT_CONTEXT") {
      extractDomContextStable()
        .then((context) => sendResponse({ ok: true, context }))
        .catch((error) =>
          sendResponse({ ok: false, error: error?.message || String(error) })
        );
      return true;
    }

    if (message.type === "SHOW_DEBUG_OVERLAY") {
      if (!message.enabled) {
        clearOverlay();
        sendResponse?.({ ok: true });
        return;
      }
      drawOverlay(message.boxes);
      sendResponse?.({ ok: true });
    }

    if (message.type === "SCAN_DOM") {
      try {
        const dump = scanDomCandidates();
        sendResponse?.({ ok: true, dump });
      } catch (error) {
        sendResponse?.({ ok: false, error: error?.message || String(error) });
      }
    }

    if (message.type === "SCAN_LOGBOOK_MODAL") {
      scanLogbookModal()
        .then((modal) => sendResponse?.({ ok: true, modal }))
        .catch((error) =>
          sendResponse?.({ ok: false, error: error?.message || String(error) })
        );
      return true;
    }

    if (message.type === "APPLY_LOGBOOK_ENTRY") {
      applyLogbookEntry({
        category: message.category,
        comment: message.comment,
      })
        .then((chosen) => sendResponse?.({ ok: true, category: chosen }))
        .catch((error) =>
          sendResponse?.({ ok: false, error: error?.message || String(error) })
        );
      return true;
    }
  });
  // --- FLOATING UI TRIGGER (Right-Side, Minimalist Logo) ---
  const injectLuminaTrigger = () => {
    if (document.getElementById("lumina-trigger-btn")) return;

    const btn = document.createElement("div");
    btn.id = "lumina-trigger-btn";
    btn.style.cssText = `
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 48px;
      background-color: #1c1c1f;
      border: 1px solid rgba(229, 124, 101, 0.4);
      border-right: none;
      border-radius: 12px 0 0 12px;
      cursor: pointer;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -4px 0 16px rgba(0, 0, 0, 0.5);
      transition: width 0.2s ease, background-color 0.2s ease;
    `;

    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="22" height="22">
          <path d="M64 24 L72 56 L104 64 L72 72 L64 104 L56 72 L24 64 L56 56 Z" fill="#e57c65" />
          <circle cx="64" cy="64" r="8" fill="#ffffff" />
      </svg>
    `;

    btn.addEventListener("mouseenter", () => {
      btn.style.width = "52px";
      btn.style.backgroundColor = "#2d2d33";
      // Removed the WAKE_UP ping that was stealing the security token!
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.width = "44px";
      btn.style.backgroundColor = "#1c1c1f";
    });

    btn.addEventListener("click", () => {
      // Sends the pure click event with the user gesture token fully intact
      chrome.runtime.sendMessage({ type: "OPEN_LUMINA_PANEL" });
    });

    document.body.appendChild(btn);

    // Listen for Panel Open/Close to hide/show button
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "LUMINA_PANEL_OPENED") btn.style.display = "none";
      if (message.action === "LUMINA_PANEL_CLOSED") btn.style.display = "flex";
    });

    // Check initial state on page load
    chrome.runtime.sendMessage({ type: "CHECK_PANEL_STATE" }, (response) => {
      if (response && response.isOpen) btn.style.display = "none";
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectLuminaTrigger);
  } else {
    injectLuminaTrigger();
  }
})();
