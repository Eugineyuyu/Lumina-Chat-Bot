document.addEventListener('DOMContentLoaded', () => {
  const authGate = document.getElementById('authGate');
  const appContent = document.getElementById('appContent');
  const authKeyInput = document.getElementById('authKey');
  const unlockBtn = document.getElementById('unlockBtn');
  const authError = document.getElementById('authError');
  const resetDeviceBtn = document.getElementById('resetDeviceBtn');
  const settingsToggle = document.getElementById('settingsToggle');
  const planBadge = document.getElementById('planBadge');
  const successCounter = document.getElementById('successCounter');
  const costCounter = document.getElementById('costCounter');
  const proFlashRemaining = document.getElementById('proFlashRemaining');
  const proProRemaining = document.getElementById('proProRemaining');
  const proResetAt = document.getElementById('proResetAt');
  const settingsPanel = document.getElementById('settingsPanel');
  const replyCountSelect = document.getElementById('replyCountSelect');
  const modelSelect = document.getElementById('modelSelect');
  const promptVariantSelect = document.getElementById('promptVariantSelect');
  const themeToggle = document.getElementById('themeToggle');
  const showLogsToggle = document.getElementById('showLogsToggle');
  const showContextToggle = document.getElementById('showContextToggle');
  const showOverlayToggle = document.getElementById('showOverlayToggle');
  const refreshOverlayBtn = document.getElementById('refreshOverlayBtn');
  const scanDomBtn = document.getElementById('scanDomBtn');
  const scanLogbookBtn = document.getElementById('scanLogbookBtn');
  const testLogbookBtn = document.getElementById('testLogbookBtn');

  const captureBtn = document.getElementById('captureBtn');
  const retryBtn = document.getElementById('retryBtn');
  const retryBestBtn = document.getElementById('retryBestBtn');
  const retryBestCounter = document.getElementById('retryBestCounter');
  const clearBtn = document.getElementById('clearBtn');
  const replyContainer = document.getElementById('replyContainer');
  const logSection = document.getElementById('logSection');
  const clientLogList = document.getElementById('clientLogList');
  const operatorLogList = document.getElementById('operatorLogList');
  const logGroupsContainer = document.getElementById('logGroupsContainer');
  const statusSection = document.getElementById('statusSection');
  const statusLabel = document.getElementById('statusLabel');
  const analysisTimer = document.getElementById('analysisTimer');
  const toast = document.getElementById('toast');
  const errorBanner = document.getElementById('errorBanner');
  const latencySummary = document.getElementById('latencySummary');
  const feedbackStrip = document.getElementById('feedbackStrip');
  const feedbackHint = document.getElementById('feedbackHint');
  const feedbackGoodBtn = document.getElementById('feedbackGoodBtn');
  const feedbackBadBtn = document.getElementById('feedbackBadBtn');
  const contextDebug = document.getElementById('contextDebug');
  const contextSource = document.getElementById('contextSource');
  const contextConfidence = document.getElementById('contextConfidence');
  const contextCustomer = document.getElementById('contextCustomer');
  const contextOperator = document.getElementById('contextOperator');
  const contextOperatorBefore = document.getElementById('contextOperatorBefore');
  const profileExtract = document.getElementById('profileExtract');
  const contextEffectiveName = document.getElementById('contextEffectiveName');
  const contextAlias = document.getElementById('contextAlias');
  const contextAge = document.getElementById('contextAge');
  const contextLocation = document.getElementById('contextLocation');
  const contextTimezone = document.getElementById('contextTimezone');
  const contextStatus = document.getElementById('contextStatus');
  const contextLogbookList = document.getElementById('contextLogbookList');
  const contextOperatorEffectiveName = document.getElementById('contextOperatorEffectiveName');
  const contextOperatorAlias = document.getElementById('contextOperatorAlias');
  const contextOperatorAge = document.getElementById('contextOperatorAge');
  const contextOperatorLocation = document.getElementById('contextOperatorLocation');
  const contextOperatorTimezone = document.getElementById('contextOperatorTimezone');
  const contextOperatorStatus = document.getElementById('contextOperatorStatus');
  const contextOperatorRoleLabel = document.getElementById('contextOperatorRoleLabel');
  const contextOperatorLogbookList = document.getElementById('contextOperatorLogbookList');
  const ocrExtract = document.getElementById('ocrExtract');
  const ocrChat = document.getElementById('ocrChat');
  const ocrCustomerProfile = document.getElementById('ocrCustomerProfile');
  const ocrOperatorProfile = document.getElementById('ocrOperatorProfile');
  const ocrLogbook = document.getElementById('ocrLogbook');
  const qualityExtract = document.getElementById('qualityExtract');
  const qualityReply1 = document.getElementById('qualityReply1');
  const qualityReply2 = document.getElementById('qualityReply2');
  const qualityReply3 = document.getElementById('qualityReply3');
  const qualityReply4 = document.getElementById('qualityReply4');
  const qualityReply5 = document.getElementById('qualityReply5');
  const analysisSection = document.getElementById('analysisSection');
  const historySection = document.getElementById('historySection');
  const historyList = document.getElementById('historyList');
  const historyClearBtn = document.getElementById('historyClearBtn');

  const reply1Btn = document.getElementById('reply1');
  const reply2Btn = document.getElementById('reply2');
  const reply3Btn = document.getElementById('reply3');
  const reply4Btn = document.getElementById('reply4');
  const reply5Btn = document.getElementById('reply5');
  const replyScore1 = document.getElementById('replyScore1');
  const replyScore2 = document.getElementById('replyScore2');
  const replyScore3 = document.getElementById('replyScore3');
  const replyScore4 = document.getElementById('replyScore4');
  const replyScore5 = document.getElementById('replyScore5');
  const replyCue1 = document.getElementById('replyCue1');
  const replyCue2 = document.getElementById('replyCue2');
  const replyCue3 = document.getElementById('replyCue3');
  const replyCue4 = document.getElementById('replyCue4');
  const replyCue5 = document.getElementById('replyCue5');

  const CLIENT_KEY_STORAGE_KEY = 'ashlyClientKey';
  const DEVICE_ID_STORAGE_KEY = 'ashlyDeviceId';
  const SETTINGS_STORAGE_KEY = 'ashlySettings';
  const HISTORY_STORAGE_KEY = 'ashlyHistory';
  const LOGBOOK_CATEGORIES_KEY = 'ashlyLogbookCategories';
  const LOGBOOK_SCAN_SESSION_KEY = 'ashlyLogbookScanSession';
  const DOM_DIAGNOSTICS_STORAGE_KEY = 'ashlyDomDiagnostics';
  const DOM_DIAGNOSTICS_UPLOAD_LEDGER_KEY = 'ashlyDomDiagnosticsUploadLedger';
  const LEGACY_CLIENT_KEY_STORAGE_KEYS = ['astrvibeClientKey'];
  const LEGACY_DEVICE_ID_STORAGE_KEYS = ['astrvibeDeviceId'];
  const LEGACY_SETTINGS_STORAGE_KEYS = ['astrvibeSettings'];
  const LEGACY_HISTORY_STORAGE_KEYS = ['astrvibeHistory'];
  const LEGACY_LOGBOOK_CATEGORIES_STORAGE_KEYS = ['astrvibeLogbookCategories'];
  const LEGACY_LOGBOOK_SCAN_SESSION_KEYS = ['astrvibeLogbookScanSession'];
  const devConfig = (globalThis.ASHLY_DEV_CONFIG && typeof globalThis.ASHLY_DEV_CONFIG === 'object')
    ? globalThis.ASHLY_DEV_CONFIG
    : {};
  const DEFAULT_BACKEND_URL =
    "https://dom-metrics-analyzer-v2.onrender.com";
  const backendUrl = String(
    devConfig.enabled ? (devConfig.backendUrl || DEFAULT_BACKEND_URL) : DEFAULT_BACKEND_URL
  ).trim() || DEFAULT_BACKEND_URL;
  const defaultClientKey = String(
    devConfig.enabled ? (devConfig.defaultClientKey || '') : ''
  ).trim();
  const REQUEST_TIMEOUT_MS = 60000;
  const HISTORY_LIMIT = 8;
  const TELEMETRY_FLUSH_INTERVAL_MS = 1200;
  const TELEMETRY_RETRY_INTERVAL_MS = 4000;
  const TELEMETRY_BATCH_MAX = 20;
  const TELEMETRY_PENDING_TTL_MS = 180000;
  const CONTENT_SCRIPT_CACHE_TTL_MS = 60000;
  const CONTENT_SCRIPT_PING_TIMEOUT_MS = 1200;
  const DOM_DIAGNOSTICS_LIMIT = 24;
  const DOM_DIAGNOSTICS_UPLOAD_WINDOW_MS = 60 * 60 * 1000;
  const DOM_DIAGNOSTICS_UPLOAD_MAX_PER_HOST = 3;
  const CAPTURE_FORMAT = 'jpeg';
  const CAPTURE_QUALITY = 80;
  const IMAGE_QUALITY = 0.75;
  const IMAGE_MAX_WIDTH = {
    full: 1280,
    chat: 1000,
    last_message: 600,
    left_profile: 500,
    right_profile: 500
  };

  let timerInterval = null;
  let timerStart = 0;
  let lastPromptVersion = 'v1';
  let lastModelName = 'gemini-2.5-flash';
  let lastScreenshotUrl = '';
  let lastContext = null;
  let lastImageVariants = null;
  let lastOverlayBoxes = [];
  let lastCaptureStartedAt = 0;
  let lastCompressEndedAt = 0;
  let lastAnalyzeEndedAt = 0;
  let settings = {
    replyCount: 3,
    showLogs: false,
    model: 'gemini-2.5-flash',
    promptVariant: 'v1',
      theme: 'dark',
    showContext: false,
    showOverlay: false
  };
  let historyEntries = [];
  let clientKey = '';
  let deviceId = '';
  let logbookCategories = [];
  let logbookScanInFlight = false;
  let currentPlan = '';
  let successCount = 0;
  let spendKesTotal = 0;
  let proRetryRemaining = null;
  let currentQuota = null;
  let currentPricing = null;
  let analysisInFlightCount = 0;
  let analysisThumbnailEl = null;
  let analysisThumbnailImgEl = null;
  let telemetryQueue = [];
  let telemetryFlushTimer = null;
  let telemetryFlushInFlight = false;
  let pendingSendCandidates = new Map();
  let latestAnalysisTelemetry = null;
  let latestFeedbackPayload = null;
  let feedbackSubmitInFlight = false;
  let authRequestSequence = 0;
  let analysisRequestSequence = 0;
  const uiErrorState = {
    auth: { message: '', code: '' },
    app: { message: '', code: '' }
  };
  const contentScriptReadyByTab = new Map();

  const setUnlockedState = (isUnlocked) => {
    if (authGate) authGate.style.display = isUnlocked ? 'none' : 'flex';
    if (appContent) appContent.style.display = isUnlocked ? 'flex' : 'none';
  };

  const renderUiErrors = () => {
    if (authError) {
      authError.textContent = uiErrorState.auth.message || '';
      if (uiErrorState.auth.code) {
        authError.dataset.code = uiErrorState.auth.code;
      } else {
        delete authError.dataset.code;
      }
    }
    if (errorBanner) {
      errorBanner.textContent = uiErrorState.app.message || '';
      errorBanner.style.display = uiErrorState.app.message ? 'block' : 'none';
      if (uiErrorState.app.code) {
        errorBanner.dataset.code = uiErrorState.app.code;
      } else {
        delete errorBanner.dataset.code;
      }
    }
    if (resetDeviceBtn) {
      const showReset = uiErrorState.auth.code === 'key_device_bound';
      resetDeviceBtn.style.display = showReset ? 'inline-flex' : 'none';
      resetDeviceBtn.disabled = !showReset;
    }
  };

  const setAuthErrorState = (message, { code = '' } = {}) => {
    uiErrorState.auth = {
      message: String(message || '').trim(),
      code: String(code || '').trim(),
    };
    renderUiErrors();
  };

  const clearAuthError = () => {
    uiErrorState.auth = { message: '', code: '' };
    renderUiErrors();
  };

  const setAppErrorState = (message, { code = '' } = {}) => {
    uiErrorState.app = {
      message: String(message || '').trim(),
      code: String(code || '').trim(),
    };
    renderUiErrors();
  };

  const clearAppError = () => {
    uiErrorState.app = { message: '', code: '' };
    renderUiErrors();
  };

  const clearAllErrors = () => {
    uiErrorState.auth = { message: '', code: '' };
    uiErrorState.app = { message: '', code: '' };
    renderUiErrors();
  };

  const beginAuthRequest = () => {
    authRequestSequence += 1;
    return authRequestSequence;
  };

  const isCurrentAuthRequest = (requestToken) => requestToken === authRequestSequence;

  const beginAnalysisRequest = () => {
    analysisRequestSequence += 1;
    return analysisRequestSequence;
  };

  const isCurrentAnalysisRequest = (requestToken) => requestToken === analysisRequestSequence;

  const normalizeKeyErrorCode = (value) => String(value || '').trim().toLowerCase();

  const formatKeyAccessMessage = ({ code = '', error = '', status = '', key_status = '' } = {}, fallbackStatus = 0) => {
    const normalizedCode = normalizeKeyErrorCode(code);
    const normalizedStatus = String(key_status || status || '').trim().toLowerCase();
    if (normalizedCode === 'key_device_bound' || normalizedStatus === 'device_bound') {
      return 'Key already used on another device. Use "Reset device binding" to move it here.';
    }
    if (normalizedCode === 'key_paused' || normalizedStatus === 'paused') {
      return error || 'Key paused pending review.';
    }
    if (normalizedCode === 'key_revoked' || normalizedStatus === 'revoked') {
      return error || 'Key revoked.';
    }
    if (normalizedCode === 'key_deleted' || normalizedStatus === 'deleted') {
      return error || 'Key deleted.';
    }
    if (normalizedCode === 'invalid_key' || normalizedStatus === 'invalid' || fallbackStatus === 401) {
      return error || 'Invalid key.';
    }
    return String(error || '').trim();
  };

  const shouldClearStoredKeyForCode = (code) => {
    const normalizedCode = normalizeKeyErrorCode(code);
    return normalizedCode === 'invalid_key'
      || normalizedCode === 'key_deleted'
      || normalizedCode === 'key_revoked';
  };

  const resetAccountMetrics = () => {
    currentPlan = '';
    successCount = 0;
    spendKesTotal = 0;
    proRetryRemaining = null;
    currentQuota = null;
    currentPricing = null;
    setPlanBadge('');
    setSuccessCounter(0);
    setCostCounter(0);
    setRetryBestCounter(null);
    renderProPanel();
  };

  const lockSidepanelForKeyFailure = async ({ message, code = '', clearStoredKey = false } = {}) => {
    clearAppError();
    setAuthErrorState(message || 'Invalid key.', { code });
    clientKey = '';
    if (clearStoredKey) {
      persistClientKey('');
    }
    resetAccountMetrics();
    resetResults();
    resetPreview();
    setLatencySummary('');
    if (statusSection) statusSection.style.display = 'none';
    stopTimer();
    setUnlockedState(false);
    telemetryQueue = [];
    pendingSendCandidates.clear();
    latestAnalysisTelemetry = null;
    await stopTelemetryTrackingInActiveTab();
  };

  const handleKeyVerificationFailure = async (verification, { clearStoredKey = false } = {}) => {
    const code = normalizeKeyErrorCode(verification?.code);
    const message = formatKeyAccessMessage(verification, verification?.status)
      || String(verification?.error || '').trim()
      || 'Unable to verify key right now.';
    await lockSidepanelForKeyFailure({
      message,
      code,
      clearStoredKey,
    });
  };

  const setPlanBadge = (plan) => {
    if (!planBadge) return;
    const normalized = plan === 'pro' ? 'Pro' : (plan === 'basic' ? 'Basic' : 'Plan');
    planBadge.textContent = normalized;
    planBadge.dataset.plan = plan || '';
    if (document?.documentElement) {
      document.documentElement.setAttribute('data-plan', plan || '');
    }
  };

  const setSuccessCounter = (count) => {
    if (!successCounter) return;
    const value = Number.isFinite(Number(count)) ? Number(count) : 0;
    successCounter.textContent = `Requests: ${value}`;
  };

  const setCostCounter = (amountKes) => {
    if (!costCounter) return;
    const value = Number.isFinite(Number(amountKes)) ? Number(amountKes) : 0;
    costCounter.textContent = `Sent: ${value.toFixed(2)}`;
  };

  const promptVariantNameByValue = {
    v1: 'Candy Classic',
    v2: 'Roxie Heat',
    v3: 'Velvet Siren'
  };

  const normalizePromptVariant = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    return ['v1', 'v2', 'v3'].includes(normalized) ? normalized : 'v1';
  };

  const formatPromptVariantLabel = (value) => {
    const normalized = normalizePromptVariant(value);
    return promptVariantNameByValue[normalized] || promptVariantNameByValue.v1;
  };

  const resolveRemainingQuota = (quota, key) => {
    if (!quota || typeof quota !== 'object') return null;
    const direct = Number(quota?.[key]);
    if (Number.isFinite(direct)) return Math.max(0, Math.round(direct));
    const quotaKey = key === 'remaining_pro' ? 'quota_pro_weekly' : 'quota_flash_weekly';
    const usedKey = key === 'remaining_pro' ? 'used_pro_weekly' : 'used_flash_weekly';
    const limit = Number(quota?.[quotaKey]);
    const used = Number(quota?.[usedKey]);
    if (Number.isFinite(limit) && Number.isFinite(used)) {
      return Math.max(0, Math.round(limit - used));
    }
    return null;
  };

  const formatQuotaReset = (value) => {
    const date = value ? new Date(value) : null;
    if (!date || !Number.isFinite(date.getTime())) return '-';
    return date.toLocaleString();
  };

  const renderProPanel = () => {
    if (document?.documentElement) {
      document.documentElement.setAttribute('data-plan', currentPlan || '');
    }
    const isPro = currentPlan === 'pro';
    const remainingFlash = resolveRemainingQuota(currentQuota, 'remaining_flash');
    const remainingPro = resolveRemainingQuota(currentQuota, 'remaining_pro');
    if (proFlashRemaining) {
      proFlashRemaining.style.display = isPro ? 'inline-flex' : 'none';
      proFlashRemaining.textContent = `Std left: ${remainingFlash === null ? '-' : String(remainingFlash)}`;
    }
    if (proProRemaining) {
      proProRemaining.style.display = isPro ? 'inline-flex' : 'none';
      proProRemaining.textContent = `Prem left: ${remainingPro === null ? '-' : String(remainingPro)}`;
    }
    if (proResetAt) {
      proResetAt.style.display = isPro ? 'inline-flex' : 'none';
      proResetAt.textContent = `Reset: ${formatQuotaReset(currentQuota?.reset_at)}`;
    }
  };

  const setRetryBestCounter = (remaining) => {
    if (!retryBestCounter) return;
    if (currentPlan !== 'basic') {
      retryBestCounter.textContent = '';
      retryBestCounter.style.display = 'none';
      return;
    }
    const value = Number(remaining);
    if (!Number.isFinite(value)) {
      retryBestCounter.textContent = '';
      retryBestCounter.style.display = 'none';
      return;
    }
    retryBestCounter.textContent = String(Math.max(0, value));
    retryBestCounter.style.display = 'inline-flex';
  };

  const applyPlanCapabilities = () => {
    const isPro = currentPlan === 'pro';
    const proOption = modelSelect?.querySelector('option[value="gemini-2.5-pro"]');
    if (proOption) {
      proOption.disabled = !isPro;
    }
    if (!isPro && settings.model === 'gemini-2.5-pro') {
      settings.model = 'gemini-2.5-flash';
    }

    if (replyCountSelect) {
      Array.from(replyCountSelect.options).forEach((option) => {
        const value = Number(option.value);
        if (!Number.isNaN(value)) {
          option.disabled = !isPro && value > 3;
        }
      });
    }
    if (!isPro && settings.replyCount > 3) {
      settings.replyCount = 3;
    }

    setRetryBestCounter(proRetryRemaining);
    renderProPanel();
    applySettings();
    persistSettings();
  };

  const generateDeviceId = () => {
    if (crypto?.randomUUID) return crypto.randomUUID();
    const randomPart = () => Math.random().toString(16).slice(2);
    return `${Date.now()}-${randomPart()}-${randomPart()}`;
  };

  const getStorageCandidates = (primaryKey, legacyKeys = []) => [primaryKey, ...legacyKeys];

  const findStoredValue = (source, keys) => {
    for (const key of keys) {
      if (source && Object.prototype.hasOwnProperty.call(source, key)) {
        return { key, value: source[key] };
      }
    }
    return { key: '', value: undefined };
  };

  const persistChromeStorageValue = (primaryKey, legacyKeys, value) => {
    chrome.storage.local.set({ [primaryKey]: value }, () => {
      if (Array.isArray(legacyKeys) && legacyKeys.length > 0) {
        chrome.storage.local.remove(legacyKeys);
      }
    });
  };

  const readChromeStorageValue = (primaryKey, legacyKeys, callback) => {
    const keys = getStorageCandidates(primaryKey, legacyKeys);
    chrome.storage.local.get(keys, (result) => {
      const match = findStoredValue(result, keys);
      if (match.key && match.key !== primaryKey && match.value !== undefined) {
        persistChromeStorageValue(primaryKey, legacyKeys, match.value);
      }
      callback(match.value);
    });
  };

  const persistLocalStorageValue = (primaryKey, legacyKeys, value) => {
    localStorage.setItem(primaryKey, value);
    legacyKeys.forEach((key) => localStorage.removeItem(key));
  };

  const readLocalStorageValue = (primaryKey, legacyKeys) => {
    const keys = getStorageCandidates(primaryKey, legacyKeys);
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        if (key !== primaryKey) {
          persistLocalStorageValue(primaryKey, legacyKeys, value);
        }
        return value;
      }
    }
    return null;
  };

  const readSessionStorageValue = (primaryKey, legacyKeys) => {
    const keys = getStorageCandidates(primaryKey, legacyKeys);
    for (const key of keys) {
      const value = sessionStorage.getItem(key);
      if (value !== null) {
        if (key !== primaryKey) {
          sessionStorage.setItem(primaryKey, value);
          legacyKeys.forEach((legacyKey) => sessionStorage.removeItem(legacyKey));
        }
        return value;
      }
    }
    return null;
  };

  const persistDeviceId = (value) => {
    if (chrome?.storage?.local) {
      persistChromeStorageValue(DEVICE_ID_STORAGE_KEY, LEGACY_DEVICE_ID_STORAGE_KEYS, value);
      return;
    }
    persistLocalStorageValue(DEVICE_ID_STORAGE_KEY, LEGACY_DEVICE_ID_STORAGE_KEYS, value || '');
  };

  const readDeviceId = (callback) => {
    const finalize = (stored) => {
      let resolved = (stored || '').trim();
      if (!resolved) {
        resolved = generateDeviceId();
        persistDeviceId(resolved);
      }
      deviceId = resolved;
      callback(resolved);
      };

      if (chrome?.storage?.local) {
        readChromeStorageValue(DEVICE_ID_STORAGE_KEY, LEGACY_DEVICE_ID_STORAGE_KEYS, finalize);
        return;
      }
      finalize(readLocalStorageValue(DEVICE_ID_STORAGE_KEY, LEGACY_DEVICE_ID_STORAGE_KEYS));
  };

  const ensureDeviceId = () => new Promise((resolve) => {
    if (deviceId) {
      resolve(deviceId);
      return;
    }
    readDeviceId(resolve);
  });

  const persistClientKey = (value) => {
    if (chrome?.storage?.local) {
      persistChromeStorageValue(CLIENT_KEY_STORAGE_KEY, LEGACY_CLIENT_KEY_STORAGE_KEYS, value);
      return;
    }
    persistLocalStorageValue(CLIENT_KEY_STORAGE_KEY, LEGACY_CLIENT_KEY_STORAGE_KEYS, value || '');
  };

  const readClientKey = (callback) => {
    const finalize = (storedValue) => {
      const storedKey = String(storedValue || '').trim();
      if (storedKey) {
        callback(storedKey);
        return;
      }
      if (defaultClientKey) {
        persistClientKey(defaultClientKey);
        callback(defaultClientKey);
        return;
      }
      callback('');
      };

      if (chrome?.storage?.local) {
        readChromeStorageValue(CLIENT_KEY_STORAGE_KEY, LEGACY_CLIENT_KEY_STORAGE_KEYS, finalize);
        return;
      }
      finalize(readLocalStorageValue(CLIENT_KEY_STORAGE_KEY, LEGACY_CLIENT_KEY_STORAGE_KEYS));
  };

  const resolveVerifyUrl = () => {
    if (backendUrl.includes('/api/analyze')) {
      return backendUrl.replace('/api/analyze', '/api/auth/verify');
    }
    if (backendUrl.includes('/analyze')) {
      return backendUrl.replace('/analyze', '/auth/verify');
    }
    return `${backendUrl.replace(/\/$/, '')}/api/auth/verify`;
  };

  const resolveResetDeviceUrl = () => {
    if (backendUrl.includes('/api/analyze')) {
      return backendUrl.replace('/api/analyze', '/api/auth/reset-device');
    }
    if (backendUrl.includes('/analyze')) {
      return backendUrl.replace('/analyze', '/auth/reset-device');
    }
    return `${backendUrl.replace(/\/$/, '')}/api/auth/reset-device`;
  };

  const resetDeviceBinding = async (key) => {
    try {
      await ensureDeviceId();
      const response = await fetch(resolveResetDeviceUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Key': key,
          ...(deviceId ? { 'X-Device-Id': deviceId } : {})
        },
        body: JSON.stringify({}),
      });
      let payload = null;
      try {
        payload = await response.json();
      } catch (_error) {
        payload = null;
      }
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: payload?.error || payload?.message || `Reset failed (${response.status})`,
          code: payload?.code || '',
          key_status: payload?.key_status || payload?.status || '',
        };
      }
      return {
        ok: Boolean(payload?.ok),
        status: response.status,
        error: payload?.error || '',
        code: payload?.code || '',
        key_status: payload?.key_status || payload?.status || '',
        payload,
      };
    } catch (error) {
      console.warn('Device reset failed', error);
      return {
        ok: false,
        status: 0,
        error: 'Unable to reset device binding right now. Check connection and try again.',
        code: error?.name === 'AbortError' ? 'request_timeout' : 'network_error',
      };
    }
  };

  const verifyClientKey = async (key) => {
    try {
      await ensureDeviceId();
      const response = await fetch(resolveVerifyUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Key': key,
          ...(deviceId ? { 'X-Device-Id': deviceId } : {})
        }
      });
      if (!response.ok) {
        let detail = '';
        let payload = null;
        try {
          const data = await response.json();
          payload = data;
          detail = data?.error || data?.message || '';
        } catch (err) {
          try {
            detail = await response.text();
          } catch (textErr) {
            detail = '';
          }
        }
        return {
          ok: false,
          status: response.status,
          error: detail,
          code: payload?.code || '',
          key_status: payload?.key_status || payload?.status || '',
        };
      }
      const data = await response.json().catch(() => null);
      if (!data?.ok) {
        return {
          ok: false,
          status: response.status,
          error: data?.error || data?.message || '',
          code: data?.code || '',
          key_status: data?.key_status || data?.status || '',
        };
      }
      const spendKesTotal = Number(data?.quota?.spent_kes_weekly ?? data?.charged_kes_total) || 0;
      return {
        ok: true,
        plan: data.plan || '',
        success_count: data.success_count ?? 0,
        charged_kes_total: spendKesTotal,
        pro_retry_remaining: data.pro_retry_remaining,
        quota: data.quota || null,
        pricing: data.pricing || null
      };
    } catch (error) {
      console.warn('Client key verification failed', error);
      return {
        ok: false,
        status: 0,
        error: 'Unable to reach server. Check connection and try again.',
        code: error?.name === 'AbortError' ? 'request_timeout' : 'network_error',
      };
    }
  };

  const attemptUnlock = async () => {
    const authRequestToken = beginAuthRequest();
    const providedKey = authKeyInput?.value?.trim() || '';
    if (!providedKey) {
      setAuthErrorState('Enter a key', { code: 'missing_key' });
      return;
    }
    if (unlockBtn) unlockBtn.disabled = true;
    clearAppError();
    setAuthErrorState('Verifying...', { code: 'verifying' });
    try {
      const verification = await verifyClientKey(providedKey);
      if (!isCurrentAuthRequest(authRequestToken)) {
        return;
      }
      if (!verification.ok) {
        const code = normalizeKeyErrorCode(verification.code);
        if (code === 'network_error' || code === 'request_timeout') {
          setAuthErrorState(verification.error || 'Unable to verify key right now.', { code });
          return;
        }
        await handleKeyVerificationFailure(verification, {
          clearStoredKey: shouldClearStoredKeyForCode(code),
        });
        return;
      }
      clientKey = providedKey;
      persistClientKey(providedKey);
      currentPlan = verification.plan || '';
      successCount = Number(verification.success_count) || 0;
      spendKesTotal = Number(verification.quota?.spent_kes_weekly ?? verification.charged_kes_total) || 0;
      proRetryRemaining = verification.pro_retry_remaining ?? null;
      currentQuota = verification.quota || null;
      currentPricing = verification.pricing || null;
      setPlanBadge(currentPlan);
      setSuccessCounter(successCount);
      setCostCounter(spendKesTotal);
      setRetryBestCounter(proRetryRemaining);
      applyPlanCapabilities();
      clearAllErrors();
      setUnlockedState(true);
      autoScanLogbookOnce();
    } finally {
      if (isCurrentAuthRequest(authRequestToken) && unlockBtn) {
        unlockBtn.disabled = false;
      }
    }
  };

  unlockBtn?.addEventListener('click', () => {
    attemptUnlock();
  });
  authKeyInput?.addEventListener('keydown', (e) => e.key === 'Enter' && attemptUnlock());
  resetDeviceBtn?.addEventListener('click', async () => {
    const providedKey = authKeyInput?.value?.trim() || '';
    if (!providedKey) {
      setAuthErrorState('Enter a key', { code: 'missing_key' });
      return;
    }
    if (resetDeviceBtn) resetDeviceBtn.disabled = true;
    if (unlockBtn) unlockBtn.disabled = true;
    setAuthErrorState('Resetting device binding...', { code: 'resetting_device' });
    const result = await resetDeviceBinding(providedKey);
    if (!result.ok) {
      const code = normalizeKeyErrorCode(result.code);
      const message = formatKeyAccessMessage(result, result.status)
        || result.error
        || 'Unable to reset device binding right now.';
      setAuthErrorState(message, { code: code || 'reset_failed' });
      if (unlockBtn) unlockBtn.disabled = false;
      renderUiErrors();
      return;
    }
    if (unlockBtn) unlockBtn.disabled = false;
    clearAllErrors();
    setAuthErrorState('Device binding reset. Verifying...', { code: 'verifying' });
    await attemptUnlock();
  });
  ensureDeviceId().then(() => {
    readClientKey(async (storedKey) => {
      const authRequestToken = beginAuthRequest();
      clientKey = storedKey;
      if (authKeyInput) {
        authKeyInput.value = storedKey || '';
      }
      if (!storedKey) {
        resetAccountMetrics();
        clearAllErrors();
        setUnlockedState(false);
        return;
      }
      const verification = await verifyClientKey(storedKey);
      if (!isCurrentAuthRequest(authRequestToken)) {
        return;
      }
      if (verification.ok) {
        currentPlan = verification.plan || '';
        successCount = Number(verification.success_count) || 0;
        spendKesTotal = Number(verification.quota?.spent_kes_weekly ?? verification.charged_kes_total) || 0;
        proRetryRemaining = verification.pro_retry_remaining ?? null;
        currentQuota = verification.quota || null;
        currentPricing = verification.pricing || null;
        setPlanBadge(currentPlan);
        setSuccessCounter(successCount);
        setCostCounter(spendKesTotal);
        setRetryBestCounter(proRetryRemaining);
        applyPlanCapabilities();
        clearAllErrors();
        setUnlockedState(true);
        autoScanLogbookOnce();
        return;
      }
      const code = normalizeKeyErrorCode(verification.code);
      if (code === 'network_error' || code === 'request_timeout') {
        clearAppError();
        resetAccountMetrics();
        setUnlockedState(false);
        setAuthErrorState(verification.error || 'Unable to verify key right now.', { code });
        return;
      }
      await handleKeyVerificationFailure(verification, {
        clearStoredKey: shouldClearStoredKeyForCode(code),
      });
    });
  });

  const applySettings = () => {
    if (replyCountSelect) replyCountSelect.value = String(settings.replyCount);
    if (modelSelect) modelSelect.value = settings.model;
    if (promptVariantSelect) promptVariantSelect.value = normalizePromptVariant(settings.promptVariant);
    if (themeToggle) themeToggle.checked = settings.theme === 'dark';
    if (showLogsToggle) showLogsToggle.checked = Boolean(settings.showLogs);
    if (showContextToggle) showContextToggle.checked = Boolean(settings.showContext);
    if (showOverlayToggle) showOverlayToggle.checked = Boolean(settings.showOverlay);
      if (document?.documentElement) {
        document.documentElement.setAttribute('data-theme', settings.theme === 'light' ? 'light' : 'dark');
        document.documentElement.style.colorScheme = settings.theme === 'light' ? 'light' : 'dark';
      }
    for (let i = 1; i <= 5; i += 1) {
      const card = document.getElementById(`card${i}`);
      if (card) {
        card.style.display = i <= settings.replyCount ? 'flex' : 'none';
      }
    }
    if (logSection) {
      logSection.style.display = settings.showLogs ? 'flex' : 'none';
    }
    if (contextDebug) {
      contextDebug.style.display = settings.showContext ? 'flex' : 'none';
    }
    if (profileExtract) {
      profileExtract.style.display = settings.showContext ? 'flex' : 'none';
    }
    if (ocrExtract) {
      ocrExtract.style.display = settings.showContext ? 'flex' : 'none';
    }
    if (qualityExtract) {
      qualityExtract.style.display = settings.showContext ? 'flex' : 'none';
    }
    renderProPanel();
  };

  const persistSettings = () => {
    if (chrome?.storage?.local) {
      persistChromeStorageValue(SETTINGS_STORAGE_KEY, LEGACY_SETTINGS_STORAGE_KEYS, settings);
      return;
    }
    persistLocalStorageValue(SETTINGS_STORAGE_KEY, LEGACY_SETTINGS_STORAGE_KEYS, JSON.stringify(settings));
  };

  const persistLogbookCategories = (categories) => {
    logbookCategories = Array.isArray(categories) ? categories : [];
    if (chrome?.storage?.local) {
      persistChromeStorageValue(LOGBOOK_CATEGORIES_KEY, LEGACY_LOGBOOK_CATEGORIES_STORAGE_KEYS, logbookCategories);
      return;
    }
    persistLocalStorageValue(LOGBOOK_CATEGORIES_KEY, LEGACY_LOGBOOK_CATEGORIES_STORAGE_KEYS, JSON.stringify(logbookCategories));
  };

  const readLogbookCategories = () => {
    if (chrome?.storage?.local) {
      readChromeStorageValue(LOGBOOK_CATEGORIES_KEY, LEGACY_LOGBOOK_CATEGORIES_STORAGE_KEYS, (stored) => {
        logbookCategories = Array.isArray(stored) ? stored : [];
      });
      return;
    }
    try {
      const parsed = JSON.parse(readLocalStorageValue(LOGBOOK_CATEGORIES_KEY, LEGACY_LOGBOOK_CATEGORIES_STORAGE_KEYS) || '[]');
      logbookCategories = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      logbookCategories = [];
    }
  };

  const hasLogbookScanAttempted = () => {
    try {
      return readSessionStorageValue(LOGBOOK_SCAN_SESSION_KEY, LEGACY_LOGBOOK_SCAN_SESSION_KEYS) === '1';
    } catch (err) {
      return false;
    }
  };

  const markLogbookScanAttempted = () => {
    try {
      sessionStorage.setItem(LOGBOOK_SCAN_SESSION_KEY, '1');
      LEGACY_LOGBOOK_SCAN_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
    } catch (err) {
      // ignore
    }
  };

  const readSettings = () => {
      const sanitizeSettings = (value) => ({
        replyCount: Number(value?.replyCount) || 3,
        showLogs: Boolean(value?.showLogs),
        model: value?.model || 'gemini-2.5-flash',
        promptVariant: normalizePromptVariant(value?.promptVariant || 'v1'),
        theme: value?.theme === 'light' ? 'light' : 'dark',
        showContext: Boolean(value?.showContext),
        showOverlay: Boolean(value?.showOverlay)
      });

      if (chrome?.storage?.local) {
        readChromeStorageValue(SETTINGS_STORAGE_KEY, LEGACY_SETTINGS_STORAGE_KEYS, (storedValue) => {
        settings = sanitizeSettings({ ...settings, ...(storedValue || {}) });
        applySettings();
      });
        return;
      }
      try {
      const parsed = JSON.parse(readLocalStorageValue(SETTINGS_STORAGE_KEY, LEGACY_SETTINGS_STORAGE_KEYS) || '{}');
        settings = sanitizeSettings({ ...settings, ...parsed });
      } catch (err) {
        console.warn('Settings read failed', err);
    }
    applySettings();
  };

  readSettings();
  readLogbookCategories();

  settingsToggle?.addEventListener('click', () => {
    if (!settingsPanel || !settingsToggle) return;
    const isOpen = settingsPanel.style.display === 'flex';
    settingsPanel.style.display = isOpen ? 'none' : 'flex';
    settingsToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  replyCountSelect?.addEventListener('change', (event) => {
    const selected = Number(event.target.value) || 1;
    if (currentPlan === 'basic' && selected > 3) {
      settings.replyCount = 3;
      if (replyCountSelect) replyCountSelect.value = '3';
    } else {
      settings.replyCount = selected;
    }
    applySettings();
    persistSettings();
  });

  modelSelect?.addEventListener('change', (event) => {
    const selected = event.target.value || 'gemini-2.5-flash';
    if (currentPlan === 'basic' && selected === 'gemini-2.5-pro') {
      settings.model = 'gemini-2.5-flash';
      if (modelSelect) modelSelect.value = 'gemini-2.5-flash';
    } else {
      settings.model = selected;
    }
    persistSettings();
  });

  promptVariantSelect?.addEventListener('change', (event) => {
    settings.promptVariant = normalizePromptVariant(event.target.value || 'v1');
    persistSettings();
  });

  feedbackGoodBtn?.addEventListener('click', () => {
    submitFeedback('positive');
  });

  feedbackBadBtn?.addEventListener('click', () => {
    submitFeedback('negative');
  });

  themeToggle?.addEventListener('change', (event) => {
    settings.theme = event.target.checked ? 'dark' : 'light';
    applySettings();
    persistSettings();
  });

  showLogsToggle?.addEventListener('change', (event) => {
    settings.showLogs = Boolean(event.target.checked);
    applySettings();
    persistSettings();
  });

  showContextToggle?.addEventListener('change', (event) => {
    settings.showContext = Boolean(event.target.checked);
    applySettings();
    persistSettings();
  });

  showOverlayToggle?.addEventListener('change', (event) => {
    settings.showOverlay = Boolean(event.target.checked);
    applySettings();
    persistSettings();
    if (!settings.showOverlay) {
      sendDebugOverlay([], false);
    } else if (lastOverlayBoxes.length > 0) {
      sendDebugOverlay(lastOverlayBoxes, true);
    }
  });

  const refreshOverlayOnly = async () => {
    try {
      setStatus('Scanning DOM...');
      if (statusSection) statusSection.style.display = 'flex';
      const context = await extractDomContext();
      updateContextDebug(context);
      lastOverlayBoxes = Array.isArray(context?.dom_message_bounds_all)
        ? context.dom_message_bounds_all
        : (Array.isArray(context?.dom_message_bounds) ? context.dom_message_bounds : []);
      if (settings.showOverlay) {
        sendDebugOverlay(lastOverlayBoxes, true);
      } else {
        sendDebugOverlay(lastOverlayBoxes, true);
        settings.showOverlay = true;
        if (showOverlayToggle) showOverlayToggle.checked = true;
        persistSettings();
        applySettings();
      }
    } catch (err) {
      setError(`Overlay scan failed: ${err.message}`);
    } finally {
      if (statusSection) statusSection.style.display = 'none';
    }
  };

  refreshOverlayBtn?.addEventListener('click', () => {
    setError('');
    refreshOverlayOnly();
  });

  const downloadDomScan = async () => {
    try {
      setStatus('Scanning DOM...');
      if (statusSection) statusSection.style.display = 'flex';
      const context = lastContext || await extractDomContext();
      const artifact = await captureDomDiagnosticArtifact({
        requestId: `manual-${Date.now()}`,
        context,
        responseMeta: {
          context_source: '',
          generation_path: '',
          model: lastModelName,
          prompt_variant: lastPromptVersion,
        },
        manualExport: true,
        triggerReason: 'manual_scan',
        fallbackReason: '',
        error: null,
      });
      downloadDomDiagnosticArtifact(artifact);
    } catch (err) {
      setError(`DOM scan error: ${err.message}`);
    } finally {
      if (statusSection) statusSection.style.display = 'none';
    }
  };

  scanDomBtn?.addEventListener('click', () => {
    setError('');
    downloadDomScan();
  });

  const scanLogbookModal = async () => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) {
        setError('No active tab found.');
        return;
      }
      const ready = await ensureContentScript(tab.id);
      if (!ready) {
        setError('Unable to initialize content script.');
        return;
      }
      setStatus('Scanning logbook modal...');
      if (statusSection) statusSection.style.display = 'flex';
      const payloadResult = await sendTabMessage(tab.id, { type: 'SCAN_LOGBOOK_MODAL' });
      const payload = payloadResult.ok ? (payloadResult.response || { ok: false, error: 'No response' }) : { ok: false, error: payloadResult.error };
      if (!payload.ok) {
        setError(payload.error || 'Logbook scan failed.');
        return;
      }
      const modal = payload.modal || {};
      const categories = Array.isArray(modal.categories) ? modal.categories : [];
      const textareaFound = Boolean(modal.textareaSelector);
      const selectFound = Boolean(modal.selectSelector);
      if (categories.length > 0) {
        persistLogbookCategories(categories);
      }
      setLatencySummary(`Logbook scan: ${categories.length} categories | Select: ${selectFound ? 'yes' : 'no'} | Comment: ${textareaFound ? 'yes' : 'no'}`);
    } catch (err) {
      setError(`Logbook scan error: ${err.message}`);
    } finally {
      if (statusSection) statusSection.style.display = 'none';
    }
  };

  const autoScanLogbookOnce = async () => {
    if (logbookScanInFlight || hasLogbookScanAttempted()) {
      return;
    }
    const tab = await getActiveTab();
    if (!tab?.url || !tab.url.includes('chathomebase.com/chat')) {
      return;
    }
    logbookScanInFlight = true;
    try {
      await scanLogbookModal();
    } finally {
      markLogbookScanAttempted();
      logbookScanInFlight = false;
    }
  };

  scanLogbookBtn?.addEventListener('click', () => {
    setError('');
    scanLogbookModal();
  });

  const addTestLogbookEntry = async () => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) {
        setError('No active tab found.');
        return;
      }
      const ready = await ensureContentScript(tab.id);
      if (!ready) {
        setError('Unable to initialize content script.');
        return;
      }
      setStatus('Fetching logbook categories...');
      if (statusSection) statusSection.style.display = 'flex';
      const scanResult = await sendTabMessage(tab.id, { type: 'SCAN_LOGBOOK_MODAL' });
      const scan = scanResult.ok ? (scanResult.response || { ok: false, error: 'No response' }) : { ok: false, error: scanResult.error };
      if (!scan.ok) {
        setError(scan.error || 'Logbook scan failed.');
        return;
      }
      const categories = Array.isArray(scan.modal?.categories) ? scan.modal.categories : [];
      if (categories.length === 0) {
        setError('No categories found in logbook modal.');
        return;
      }
      const chosenCategory = categories[0];
      const timestamp = new Date().toLocaleString();
      const comment = `Test log entry from extension (${timestamp}).`;
      setStatus('Adding test log...');
      await applyLogbookEntry(chosenCategory, comment);
    } catch (err) {
      setError(`Test log failed: ${err.message}`);
    } finally {
      if (statusSection) statusSection.style.display = 'none';
    }
  };

  testLogbookBtn?.addEventListener('click', () => {
    setError('');
    addTestLogbookEntry();
  });

  const startTimer = () => {
    timerStart = Date.now();
    if (analysisTimer) analysisTimer.textContent = '0.0s';
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = (Date.now() - timerStart) / 1000;
      if (analysisTimer) analysisTimer.textContent = `${elapsed.toFixed(1)}s`;
    }, 100);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
  };

  const setStatus = (message) => {
    if (statusLabel) statusLabel.textContent = message;
  };

  const setError = (message) => {
    setAppErrorState(message);
  };

  const setLatencySummary = (message) => {
    if (!latencySummary) return;
    latencySummary.textContent = message || '';
  };

  const renderFeedbackStrip = ({
    visible = false,
    hint = '',
    goodDisabled = false,
    badDisabled = false,
  } = {}) => {
    if (!feedbackStrip) return;
    feedbackStrip.style.display = visible ? 'flex' : 'none';
    if (feedbackHint) {
      feedbackHint.textContent = hint || '+1 standard reward. Quick tap only.';
    }
    if (feedbackGoodBtn) feedbackGoodBtn.disabled = !visible || goodDisabled;
    if (feedbackBadBtn) feedbackBadBtn.disabled = !visible || badDisabled;
  };

  const resetFeedbackStrip = () => {
    latestFeedbackPayload = null;
    feedbackSubmitInFlight = false;
    renderFeedbackStrip({ visible: false });
  };

  const ensureAnalysisThumbnail = () => {
    if (analysisThumbnailEl && analysisThumbnailImgEl) {
      return;
    }
    const container = document.createElement('div');
    container.id = 'analysisThumbnail';
    container.className = 'analysis-thumbnail';

    const img = document.createElement('img');
    img.alt = 'Analyzing capture';
    img.className = 'analysis-thumbnail-image';

    container.appendChild(img);
    document.body.appendChild(container);
    analysisThumbnailEl = container;
    analysisThumbnailImgEl = img;
  };

  const showAnalysisThumbnail = (imageUrl) => {
    if (!imageUrl) return;
    ensureAnalysisThumbnail();
    if (!analysisThumbnailEl || !analysisThumbnailImgEl) return;
    analysisThumbnailImgEl.src = imageUrl;
    analysisThumbnailEl.classList.add('visible');
  };

  const hideAnalysisThumbnail = () => {
    if (!analysisThumbnailEl) return;
    analysisThumbnailEl.classList.remove('visible');
  };

  const formatModelLabel = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return '';
    if (normalized.includes('flash')) return 'standard';
    if (normalized.includes('pro')) return 'premium';
    return normalized;
  };

  const resetPreview = () => {
      lastScreenshotUrl = '';
      lastContext = null;
      lastImageVariants = null;
      lastOverlayBoxes = [];
      latestAnalysisTelemetry = null;
      resetFeedbackStrip();
      if (contextCustomer) contextCustomer.textContent = 'Not detected';
    if (contextOperator) contextOperator.textContent = 'Not detected';
    if (contextOperatorBefore) contextOperatorBefore.textContent = 'Not detected';
    if (contextSource) contextSource.textContent = 'Source: -';
    if (contextConfidence) contextConfidence.textContent = 'Role confidence: -';
    if (contextEffectiveName) contextEffectiveName.textContent = 'Not detected';
    if (contextAlias) contextAlias.textContent = 'Not detected';
    if (contextAge) contextAge.textContent = 'Not detected';
    if (contextLocation) contextLocation.textContent = 'Not detected';
    if (contextTimezone) contextTimezone.textContent = 'Not detected';
    if (contextStatus) contextStatus.textContent = 'Not detected';
    if (contextLogbookList) contextLogbookList.textContent = '';
    if (contextOperatorEffectiveName) contextOperatorEffectiveName.textContent = 'Not detected';
    if (contextOperatorAlias) contextOperatorAlias.textContent = 'Not detected';
    if (contextOperatorAge) contextOperatorAge.textContent = 'Not detected';
    if (contextOperatorLocation) contextOperatorLocation.textContent = 'Not detected';
    if (contextOperatorTimezone) contextOperatorTimezone.textContent = 'Not detected';
    if (contextOperatorStatus) contextOperatorStatus.textContent = 'Not detected';
    if (contextOperatorRoleLabel) contextOperatorRoleLabel.textContent = 'Not detected';
    if (contextOperatorLogbookList) contextOperatorLogbookList.textContent = '';
    if (ocrChat) ocrChat.textContent = 'Not detected';
    if (ocrCustomerProfile) ocrCustomerProfile.textContent = 'Not detected';
    if (ocrOperatorProfile) ocrOperatorProfile.textContent = 'Not detected';
    if (ocrLogbook) ocrLogbook.textContent = 'Not detected';
    if (qualityReply1) qualityReply1.textContent = 'Not scored';
    if (qualityReply2) qualityReply2.textContent = 'Not scored';
    if (qualityReply3) qualityReply3.textContent = 'Not scored';
    if (qualityReply4) qualityReply4.textContent = 'Not scored';
    if (qualityReply5) qualityReply5.textContent = 'Not scored';
    setReplyScoreBadge(replyScore1, null);
    setReplyScoreBadge(replyScore2, null);
    setReplyScoreBadge(replyScore3, null);
    setReplyScoreBadge(replyScore4, null);
    setReplyScoreBadge(replyScore5, null);
    [replyCue1, replyCue2, replyCue3, replyCue4, replyCue5].forEach((badge) => {
      if (!badge) return;
      badge.hidden = true;
      badge.textContent = 'Attach image';
    });
    hideAnalysisThumbnail();
    if (retryBtn) retryBtn.disabled = true;
    if (retryBestBtn) retryBestBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;
    if (analysisSection) analysisSection.style.display = 'none';
  };

  function showToast(message = 'Sent!') {
    if (toast) {
      toast.textContent = message;
    }
    toast.className = 'toast show';
    setTimeout(() => toast.className = 'toast', 2000);
  }

  const getLatestMessageByRole = (messages, role) => {
    if (!Array.isArray(messages)) return '';
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const entry = messages[i];
      if (entry?.role === role && entry?.text) {
        return entry.text;
      }
    }
    return '';
  };

  const truncateContextText = (value) => {
    const text = String(value || '').trim();
    if (!text) return 'Not detected';
    return text.length > 220 ? `${text.slice(0, 220)}...` : text;
  };

  const updateContextDebug = (context, responseData) => {
    if (!contextCustomer || !contextOperator || !contextOperatorBefore) return;
    let sourceLabel = 'Source: -';
    let confidenceLabel = 'Role confidence: -';
    let latestCustomer = '';
    let latestOperator = '';
    let operatorBefore = '';
    if (context) {
      const messages = Array.isArray(context.dom_messages) ? context.dom_messages : [];
      latestCustomer = context.dom_latest_customer_turn
        || context.dom_latest_customer_message
        || getLatestMessageByRole(messages, 'customer');
      latestOperator = context.dom_latest_operator_message || getLatestMessageByRole(messages, 'operator');
      operatorBefore = context.dom_latest_operator_before_customer_message || '';
      if (latestCustomer || latestOperator || operatorBefore || messages.length > 0) {
        sourceLabel = 'Source: DOM';
      }
      if (context.dom_role_confidence) {
        const roleConfidence = String(context.dom_role_confidence || '').toUpperCase();
        const customerConfidence = Number.isFinite(Number(context.dom_latest_customer_confidence))
          ? ` | Last msg conf: ${Math.round(Number(context.dom_latest_customer_confidence) * 100)}%`
          : '';
        confidenceLabel = `Role confidence: ${roleConfidence}${customerConfidence}`;
      }
      const perf = context?.capture_meta?.perf || null;
      if (perf && settings.showContext) {
        const observerActive = perf.observer_active ? 'on' : 'off';
        const cb10s = Number(perf.observer_callbacks_last_10s || 0);
        const full10s = Number(perf.full_context_extractions_last_10s || 0);
        const detectMs = Number(perf.avg_detection_ms || 0).toFixed(1);
        confidenceLabel += ` | Perf obs:${observerActive} cb10s:${cb10s} full10s:${full10s} detect:${detectMs}ms`;
      }
    }
    if (!latestCustomer && responseData?.latest_customer_message) {
      latestCustomer = responseData.latest_customer_message;
      sourceLabel = 'Source: OCR/Model';
    }
    if (!latestOperator && responseData?.latest_operator_message) {
      latestOperator = responseData.latest_operator_message;
      if (sourceLabel === 'Source: -') {
        sourceLabel = 'Source: OCR/Model';
      }
    }
    if (!operatorBefore && responseData?.latest_operator_message) {
      operatorBefore = responseData.latest_operator_message;
      if (sourceLabel === 'Source: -') {
        sourceLabel = 'Source: OCR/Model';
      }
    }
    contextCustomer.textContent = truncateContextText(latestCustomer);
    contextOperator.textContent = truncateContextText(latestOperator);
    contextOperatorBefore.textContent = truncateContextText(operatorBefore);
    if (contextSource) contextSource.textContent = sourceLabel;
    if (contextConfidence) contextConfidence.textContent = confidenceLabel;

    const profile = context?.dom_profile_summary || {};
    if (contextEffectiveName) contextEffectiveName.textContent = truncateContextText(context?.dom_effective_name || profile.alias || '');
    if (contextAlias) contextAlias.textContent = truncateContextText(profile.alias || '');
    if (contextAge) contextAge.textContent = truncateContextText(profile.age || '');
    if (contextLocation) contextLocation.textContent = truncateContextText(profile.location || '');
    if (contextTimezone) contextTimezone.textContent = truncateContextText(profile.timezone || '');
    if (contextStatus) contextStatus.textContent = truncateContextText(profile.civilStatus || '');

    const operatorProfile = context?.dom_operator_profile_summary || context?.dom_profiles?.right || {};
    if (contextOperatorEffectiveName) {
      contextOperatorEffectiveName.textContent = truncateContextText(
        context?.dom_operator_effective_name || operatorProfile.alias || ''
      );
    }
    if (contextOperatorAlias) contextOperatorAlias.textContent = truncateContextText(operatorProfile.alias || '');
    if (contextOperatorAge) contextOperatorAge.textContent = truncateContextText(operatorProfile.age || '');
    if (contextOperatorLocation) contextOperatorLocation.textContent = truncateContextText(operatorProfile.location || '');
    if (contextOperatorTimezone) contextOperatorTimezone.textContent = truncateContextText(operatorProfile.timezone || '');
    if (contextOperatorStatus) contextOperatorStatus.textContent = truncateContextText(operatorProfile.civilStatus || '');
    if (contextOperatorRoleLabel) contextOperatorRoleLabel.textContent = truncateContextText(operatorProfile.roleLabel || '');

    const renderLogbookList = (container, entries, emptyLabel) => {
      if (!container) return;
      container.innerHTML = '';
      if (!Array.isArray(entries) || entries.length === 0) {
        container.textContent = emptyLabel;
        return;
      }
      entries.forEach((entry) => {
        const line = document.createElement('div');
        line.textContent = `${entry.category}: ${entry.text}`;
        container.appendChild(line);
      });
    };

    const latestCustomerLogbook = Array.isArray(context?.dom_logbook_latest) ? context.dom_logbook_latest : [];
    renderLogbookList(contextLogbookList, latestCustomerLogbook, 'No logbook entries detected');

    const latestOperatorLogbook = Array.isArray(context?.dom_operator_logbook_latest)
      ? context.dom_operator_logbook_latest
      : [];
    renderLogbookList(contextOperatorLogbookList, latestOperatorLogbook, 'No operator logbook updates detected');

    const ocr = responseData?.ocr_extraction || responseData?.ocr || null;
    if (ocrChat) ocrChat.textContent = truncateContextText(ocr?.chat || '');
    if (ocrCustomerProfile) ocrCustomerProfile.textContent = truncateContextText(ocr?.customer_profile || '');
    if (ocrOperatorProfile) ocrOperatorProfile.textContent = truncateContextText(ocr?.operator_profile || '');
    if (ocrLogbook) ocrLogbook.textContent = truncateContextText(ocr?.logbook || '');

    const replyQuality = responseData?.meta?.reply_quality || responseData?.reply_quality || null;
    const formatScore = (scoreObj) => {
      if (!scoreObj || typeof scoreObj !== 'object') return 'Not scored';
      const percent = Number.isFinite(Number(scoreObj.percent)) ? `${scoreObj.percent}%` : '';
      const score = Number.isFinite(Number(scoreObj.score)) ? String(scoreObj.score) : '';
      const max = Number.isFinite(Number(scoreObj.max)) ? String(scoreObj.max) : '';
      if (percent && score && max) return `${percent} (${score}/${max})`;
      if (percent) return percent;
      return 'Not scored';
    };
    if (qualityReply1) qualityReply1.textContent = formatScore(replyQuality?.reply_1);
    if (qualityReply2) qualityReply2.textContent = formatScore(replyQuality?.reply_2);
    if (qualityReply3) qualityReply3.textContent = formatScore(replyQuality?.reply_3);
    if (qualityReply4) qualityReply4.textContent = formatScore(replyQuality?.reply_4);
    if (qualityReply5) qualityReply5.textContent = formatScore(replyQuality?.reply_5);
  };

  const sendDebugOverlay = async (boxes, enabled) => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) return;
      const ready = await ensureContentScript(tab.id);
      if (!ready) return;
      await sendTabMessage(tab.id, {
        type: 'SHOW_DEBUG_OVERLAY',
        enabled: Boolean(enabled),
        boxes: Array.isArray(boxes) ? boxes : []
      });
    } catch (err) {
      console.warn('Overlay update failed', err);
    }
  };

  async function typeReplyInActiveTab(text) {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) return;
      const ready = await ensureContentScript(tab.id);
      if (!ready) return;
      const sent = await sendTabMessage(tab.id, { type: 'TYPE_REPLY', text });
      if (sent.ok && sent.response?.ok) {
        showToast();
      }
    } catch (err) {
      console.error('Typing failed', err);
    }
  }

  async function handleReplySelection(replyId) {
    const replyBtn = document.getElementById(`reply${replyId}`);
    const card = document.getElementById(`card${replyId}`);
    const replyText = clipTelemetryText(replyBtn?.innerText || '', 800);
    if (!replyText || replyBtn?.disabled) return;

    document.querySelectorAll('.reply-card').forEach(c => c.classList.remove('selected'));
    card?.classList.add('selected');

    const telemetrySource = latestAnalysisTelemetry?.repliesByCard?.[String(replyId)] || null;
    const requestId = telemetrySource?.request_id || latestAnalysisTelemetry?.request_id || '';
    const replyIdentifier = telemetrySource?.reply_id || `reply_${replyId}`;
    const selectedTsMs = Date.now();
    const sourceMessageRaw = telemetrySource?.source_message_raw || latestAnalysisTelemetry?.source_message_raw || '';
    const sourceMessageNorm = telemetrySource?.source_message_norm || normalizeTelemetryText(sourceMessageRaw);
    const selectedEvent = buildTelemetryEvent('reply_selected', {
      request_id: requestId,
      reply_id: replyIdentifier,
      reply_text_raw: replyText,
      reply_text_norm: normalizeTelemetryText(replyText),
      source_message_raw: sourceMessageRaw,
      source_message_norm: sourceMessageNorm,
      prompt_version: telemetrySource?.prompt_version || lastPromptVersion,
      model: telemetrySource?.model || lastModelName,
      score_percent: telemetrySource?.score_percent,
      rank_position: telemetrySource?.rank_position,
      meta: {
        selected_ts_ms: selectedTsMs
      }
    });
    enqueueTelemetryEvent(selectedEvent);
    await registerPendingSendCandidate({
      request_id: requestId,
      reply_id: replyIdentifier,
      reply_text_raw: replyText,
      reply_text_norm: normalizeTelemetryText(replyText),
      source_message_raw: sourceMessageRaw,
      source_message_norm: sourceMessageNorm,
      prompt_version: telemetrySource?.prompt_version || lastPromptVersion,
      model: telemetrySource?.model || lastModelName,
      score_percent: telemetrySource?.score_percent,
      rank_position: telemetrySource?.rank_position,
      selected_ts_ms: selectedTsMs
    });

    await typeReplyInActiveTab(replyText);
    scheduleTelemetryFlush(120);
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || message.type !== 'TELEMETRY_REPLY_SENT_CONFIRMED') {
      return;
    }
    prunePendingSendCandidates();
    const payload = message.payload || {};
    const requestId = clipTelemetryText(payload.request_id || payload.requestId || '', 120);
    const replyId = clipTelemetryText(payload.reply_id || payload.replyId || '', 80);
    const pending = consumePendingCandidate(requestId, replyId);
    const replyTextRaw = clipTelemetryText(payload.reply_text_raw || payload.sent_text_raw || pending?.reply_text_raw || '', 800);
    const sourceRaw = clipTelemetryText(payload.source_message_raw || pending?.source_message_raw || '', 1200);
    const event = buildTelemetryEvent('reply_sent_confirmed', {
      request_id: requestId || pending?.request_id || '',
      reply_id: replyId || pending?.reply_id || '',
      reply_text_raw: replyTextRaw,
      reply_text_norm: clipTelemetryText(payload.reply_text_norm || payload.sent_text_norm || normalizeTelemetryText(replyTextRaw), 800),
      source_message_raw: sourceRaw,
      source_message_norm: clipTelemetryText(payload.source_message_norm || pending?.source_message_norm || normalizeTelemetryText(sourceRaw), 800),
      prompt_version: payload.prompt_version || pending?.prompt_version || lastPromptVersion,
      model: payload.model || pending?.model || lastModelName,
      score_percent: payload.score_percent ?? pending?.score_percent ?? null,
      rank_position: payload.rank_position ?? pending?.rank_position ?? null,
      meta: {
        similarity: Number.isFinite(Number(payload.similarity)) ? Number(payload.similarity) : null,
        selected_ts_ms: Number(payload.selected_ts_ms || pending?.selected_ts_ms || 0) || null,
        sent_ts_ms: Number(payload.sent_ts_ms || Date.now())
      }
    });
    enqueueTelemetryEvent(event);
    scheduleTelemetryFlush(80);
    sendResponse?.({ ok: true });
    return true;
  });

  reply1Btn.addEventListener('click', () => handleReplySelection('1'));
  reply2Btn.addEventListener('click', () => handleReplySelection('2'));
  reply3Btn.addEventListener('click', () => handleReplySelection('3'));
  reply4Btn?.addEventListener('click', () => handleReplySelection('4'));
  reply5Btn?.addEventListener('click', () => handleReplySelection('5'));

  const scoreReply = (reply) => {
    if (!reply) return -Infinity;
    const idealLength = 160;
    return -Math.abs(reply.length - idealLength);
  };

  const hasServerReplyQuality = (replyQuality) => {
    if (!replyQuality || typeof replyQuality !== 'object') return false;
    const fields = ['reply_1', 'reply_2', 'reply_3', 'reply_4', 'reply_5'];
    return fields.some((field) => Number.isFinite(Number(replyQuality?.[field]?.percent)));
  };

  const buildLocalReplyQuality = (replies) => {
    const fields = ['reply_1', 'reply_2', 'reply_3', 'reply_4', 'reply_5'];
    const quality = {};
    fields.forEach((field, index) => {
      const text = String(replies?.[index] || '').trim();
      if (!text) return;
      const diff = Math.abs(text.length - 160);
      const percent = Math.max(35, Math.min(98, Math.round(100 - (Math.min(diff, 220) / 220) * 65)));
      quality[field] = {
        score: percent,
        max: 100,
        percent
      };
    });
    return quality;
  };

  const rankReplies = (replies, replyQuality = null, replyMediaCues = null) => {
    const qualityScores = [
      replyQuality?.reply_1?.percent,
      replyQuality?.reply_2?.percent,
      replyQuality?.reply_3?.percent,
      replyQuality?.reply_4?.percent,
      replyQuality?.reply_5?.percent
    ];
    return replies
      .map((reply, index) => {
        const qualityScore = Number.isFinite(qualityScores[index]) ? qualityScores[index] : null;
        const score = qualityScore ?? scoreReply(reply);
        return {
          reply,
          index,
          score,
          mediaCue: replyMediaCues?.[`reply_${index + 1}`] || null,
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  function setReplyScoreBadge(badge, scoreObj) {
    if (!badge) return;
    badge.classList.remove('score-high', 'score-med', 'score-low', 'score-unknown');
    if (!scoreObj || typeof scoreObj !== 'object') {
      badge.textContent = '--';
      badge.classList.add('score-unknown');
      return;
    }
    const percent = Number(scoreObj.percent);
    if (!Number.isFinite(percent)) {
      badge.textContent = '--';
      badge.classList.add('score-unknown');
      return;
    }
    badge.textContent = `${Math.round(percent)}%`;
    if (percent >= 80) {
      badge.classList.add('score-high');
    } else if (percent >= 65) {
      badge.classList.add('score-med');
    } else {
      badge.classList.add('score-low');
    }
  }

  function setReplyCueBadge(badge, cue) {
    if (!badge) return;
    const shouldShow = Boolean(cue?.attach_image);
    badge.hidden = !shouldShow;
    badge.textContent = 'Attach image';
    if (shouldShow && cue?.strength) {
      badge.dataset.strength = String(cue.strength);
    } else {
      delete badge.dataset.strength;
    }
  }

  const renderHistory = () => {
    if (!historySection || !historyList) return;
    historyList.innerHTML = '';
    if (historyEntries.length === 0) {
      historySection.style.display = 'none';
      return;
    }
    historySection.style.display = 'flex';
    historyEntries.forEach((entry, index) => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const meta = document.createElement('div');
      meta.className = 'history-meta';
      meta.textContent = new Date(entry.timestamp).toLocaleString();

      const actions = document.createElement('div');
      actions.className = 'history-actions';

      const loadBtn = document.createElement('button');
      loadBtn.type = 'button';
      loadBtn.className = 'history-btn';
      loadBtn.textContent = 'Load replies';
      loadBtn.addEventListener('click', () => {
        applyReplies(entry.replies, entry.replyQuality);
        if (analysisSection) analysisSection.style.display = 'flex';
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'history-btn';
      deleteBtn.textContent = 'Remove';
      deleteBtn.addEventListener('click', () => {
        historyEntries.splice(index, 1);
        persistHistory();
        renderHistory();
      });

      actions.appendChild(loadBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(meta);
      item.appendChild(actions);
      historyList.appendChild(item);
    });
  };

  const persistHistory = () => {
    if (chrome?.storage?.local) {
      persistChromeStorageValue(HISTORY_STORAGE_KEY, LEGACY_HISTORY_STORAGE_KEYS, historyEntries);
      return;
    }
    persistLocalStorageValue(HISTORY_STORAGE_KEY, LEGACY_HISTORY_STORAGE_KEYS, JSON.stringify(historyEntries));
  };

  const readHistory = () => {
    if (chrome?.storage?.local) {
      readChromeStorageValue(HISTORY_STORAGE_KEY, LEGACY_HISTORY_STORAGE_KEYS, (storedValue) => {
        historyEntries = Array.isArray(storedValue) ? storedValue : [];
        renderHistory();
      });
      return;
    }
    try {
      const parsed = JSON.parse(readLocalStorageValue(HISTORY_STORAGE_KEY, LEGACY_HISTORY_STORAGE_KEYS) || '[]');
      historyEntries = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('History read failed', err);
      historyEntries = [];
    }
    renderHistory();
  };

  const pushHistory = (replies, replyQuality) => {
    historyEntries.unshift({
      timestamp: Date.now(),
      replies,
      replyQuality: replyQuality || null
    });
    historyEntries = historyEntries.slice(0, HISTORY_LIMIT);
    persistHistory();
    renderHistory();
  };

  const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab || null;
  };

  const isNoReceiverError = (message) => {
    const text = String(message || '').toLowerCase();
    return text.includes('receiving end does not exist') || text.includes('could not establish connection');
  };

  const markContentScriptReady = (tabId) => {
    if (!tabId) return;
    contentScriptReadyByTab.set(Number(tabId), Date.now() + CONTENT_SCRIPT_CACHE_TTL_MS);
  };

  const markContentScriptStale = (tabId, reason = '') => {
    if (!tabId) return;
    contentScriptReadyByTab.delete(Number(tabId));
    if (reason && !isNoReceiverError(reason)) {
      console.warn('Content script marked stale:', reason);
    }
  };

  const isContentScriptFresh = (tabId) => {
    const expiry = Number(contentScriptReadyByTab.get(Number(tabId)) || 0);
    return expiry > Date.now();
  };

  const sendTabMessage = (tabId, message, { timeoutMs = 0 } = {}) => new Promise((resolve) => {
    if (!tabId) {
      resolve({ ok: false, error: 'missing_tab_id' });
      return;
    }
    let settled = false;
    let timer = null;
    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        resolve({ ok: false, error: 'message_timeout' });
      }, timeoutMs);
    }
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (chrome.runtime.lastError) {
        const err = chrome.runtime.lastError.message || 'send_message_failed';
        if (isNoReceiverError(err)) {
          markContentScriptStale(tabId, err);
        }
        resolve({ ok: false, error: err });
        return;
      }
      resolve({ ok: true, response });
    });
  });

  const pingContentScript = async (tabId) => {
    const result = await sendTabMessage(tabId, { type: 'PING_CONTENT_SCRIPT' }, { timeoutMs: CONTENT_SCRIPT_PING_TIMEOUT_MS });
    if (result.ok && result.response?.ok) {
      markContentScriptReady(tabId);
      return true;
    }
    return false;
  };

  const ensureContentScript = async (tabId) => {
    if (!tabId) return false;
    if (isContentScriptFresh(tabId)) {
      return true;
    }
    if (await pingContentScript(tabId)) {
      return true;
    }
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['contentScript.js'] });
      const pinged = await pingContentScript(tabId);
      if (pinged) {
        return true;
      }
    } catch (err) {
      console.warn('Content script injection failed', err);
      markContentScriptStale(tabId, err?.message || String(err));
    }
    return false;
  };

  if (chrome?.tabs?.onUpdated) {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo?.status === 'loading' || changeInfo?.url) {
        markContentScriptStale(tabId, 'tab_navigated');
      }
    });
  }
  if (chrome?.tabs?.onRemoved) {
    chrome.tabs.onRemoved.addListener((tabId) => {
      markContentScriptStale(tabId, 'tab_removed');
    });
  }

  const resolveTelemetryUrl = () => {
    if (backendUrl.includes('/api/analyze')) {
      return backendUrl.replace('/api/analyze', '/api/telemetry/events');
    }
    if (backendUrl.includes('/analyze')) {
      return backendUrl.replace('/analyze', '/telemetry/events');
    }
    return `${backendUrl.replace(/\/$/, '')}/api/telemetry/events`;
  };

  const resolveFeedbackUrl = () => {
    if (backendUrl.includes('/api/analyze')) {
      return backendUrl.replace('/api/analyze', '/api/feedback');
    }
    if (backendUrl.includes('/analyze')) {
      return backendUrl.replace('/analyze', '/feedback');
    }
    return `${backendUrl.replace(/\/$/, '')}/api/feedback`;
  };

  const resolveDomDiagnosticsUrl = () => {
    if (backendUrl.includes('/api/analyze')) {
      return backendUrl.replace('/api/analyze', '/api/dom-diagnostics');
    }
    if (backendUrl.includes('/analyze')) {
      return backendUrl.replace('/analyze', '/dom-diagnostics');
    }
    return `${backendUrl.replace(/\/$/, '')}/api/dom-diagnostics`;
  };

  const clipDiagnosticText = (value, max = 240) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

  const readJsonStorageValue = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch (_error) {
      return fallback;
    }
  };

  const writeJsonStorageValue = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Storage write failed', key, error);
    }
  };

  const normalizePathShape = (value) => {
    try {
      const url = new URL(String(value || ''), 'https://ashly.local');
      const segments = url.pathname
        .split('/')
        .filter(Boolean)
        .slice(0, 8)
        .map((segment) => {
          const clean = segment.toLowerCase();
          if (/^\d+$/.test(clean)) return ':n';
          if (/^[0-9a-f]{8,}$/i.test(clean)) return ':id';
          if (/^[0-9a-f-]{16,}$/i.test(clean)) return ':id';
          if (clean.length > 36) return ':slug';
          return clean;
        });
      return `/${segments.join('/') || ''}` || '/';
    } catch (_error) {
      return '/';
    }
  };

  const hashTextSha256 = async (value) => {
    const text = String(value || '').trim();
    if (!text) return '';
    if (crypto?.subtle?.digest && globalThis.TextEncoder) {
      const bytes = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    return normalizeTelemetryText(text);
  };

  const trimDiagnosticObject = (value, maxEntries = 16, valueMax = 180) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const out = {};
    Object.entries(value).slice(0, maxEntries).forEach(([key, itemValue]) => {
      const safeKey = clipDiagnosticText(key, 64);
      const safeValue = clipDiagnosticText(itemValue, valueMax);
      if (!safeKey || !safeValue) return;
      out[safeKey] = safeValue;
    });
    return out;
  };

  const summarizeDiagnosticElements = (items, maxItems, includeRichFields = false) => (
    Array.isArray(items)
      ? items.slice(0, maxItems).map((item) => {
          if (!item || typeof item !== 'object') return null;
          const summary = {
            selector: clipDiagnosticText(item.selector || '', 180),
            tag: clipDiagnosticText(item.tag || '', 24),
            score: Number.isFinite(Number(item.score)) ? Number(Number(item.score).toFixed(2)) : null,
            text: clipDiagnosticText(item.text || '', 160),
            bounds: {
              x: Number.isFinite(Number(item?.bounds?.x)) ? Math.round(Number(item.bounds.x)) : null,
              y: Number.isFinite(Number(item?.bounds?.y)) ? Math.round(Number(item.bounds.y)) : null,
              w: Number.isFinite(Number(item?.bounds?.w)) ? Math.round(Number(item.bounds.w)) : null,
              h: Number.isFinite(Number(item?.bounds?.h)) ? Math.round(Number(item.bounds.h)) : null,
            }
          };
          if (!includeRichFields) {
            return summary;
          }
          return {
            ...summary,
            id: clipDiagnosticText(item.id || '', 64),
            classes: Array.isArray(item.classes) ? item.classes.map((entry) => clipDiagnosticText(entry, 48)).filter(Boolean).slice(0, 6) : [],
            role: clipDiagnosticText(item.role || '', 32),
            ariaLabel: clipDiagnosticText(item.ariaLabel || '', 80),
            dataset: trimDiagnosticObject(item.dataset, 8, 80),
            styles: trimDiagnosticObject(item.styles, 8, 40),
          };
        }).filter(Boolean)
      : []
  );

  const readDomDiagnosticsArtifacts = () => {
    const stored = readJsonStorageValue(DOM_DIAGNOSTICS_STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  };

  const persistDomDiagnosticsArtifact = (artifact) => {
    const current = readDomDiagnosticsArtifacts();
    const next = [artifact, ...current]
      .filter((entry, index, array) => entry?.diagnostic_id && array.findIndex((candidate) => candidate?.diagnostic_id === entry.diagnostic_id) === index)
      .slice(0, DOM_DIAGNOSTICS_LIMIT);
    writeJsonStorageValue(DOM_DIAGNOSTICS_STORAGE_KEY, next);
  };

  const readDomDiagnosticsUploadLedger = () => {
    const stored = readJsonStorageValue(DOM_DIAGNOSTICS_UPLOAD_LEDGER_KEY, {});
    return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  };

  const shouldUploadDomDiagnosticArtifact = (artifact) => {
    const hostHash = String(artifact?.site?.host_hash || '').trim() || 'unknown';
    const nowMs = Date.now();
    const ledger = readDomDiagnosticsUploadLedger();
    const nextLedger = {};
    Object.entries(ledger).forEach(([key, values]) => {
      const activeValues = Array.isArray(values)
        ? values.filter((value) => Number(value) > (nowMs - DOM_DIAGNOSTICS_UPLOAD_WINDOW_MS))
        : [];
      if (activeValues.length > 0) {
        nextLedger[key] = activeValues;
      }
    });
    const current = Array.isArray(nextLedger[hostHash]) ? nextLedger[hostHash] : [];
    const activeWindow = current.slice();
    if (activeWindow.length >= DOM_DIAGNOSTICS_UPLOAD_MAX_PER_HOST) {
      nextLedger[hostHash] = activeWindow;
      writeJsonStorageValue(DOM_DIAGNOSTICS_UPLOAD_LEDGER_KEY, nextLedger);
      return false;
    }
    activeWindow.push(nowMs);
    nextLedger[hostHash] = activeWindow;
    writeJsonStorageValue(DOM_DIAGNOSTICS_UPLOAD_LEDGER_KEY, nextLedger);
    return true;
  };

  const buildDomDiagnosticsDecision = ({ context, responseMeta = {}, error = null }) => {
    const domConfidence = Number(context?.dom_confidence);
    const roleConfidence = String(context?.dom_role_confidence || '').trim().toLowerCase();
    const hasLatestCustomer = Boolean(
      clipContextText(context?.dom_latest_customer_turn || context?.dom_latest_customer_message || '', 900)
    );
    if (error) {
      return { capture: true, triggerReason: 'request_error', fallbackReason: clipDiagnosticText(error.message || 'request_error', 120) };
    }
    if (!context || typeof context !== 'object') {
      return { capture: true, triggerReason: 'missing_dom_context', fallbackReason: 'no_dom_context' };
    }
    if (!hasLatestCustomer) {
      return { capture: true, triggerReason: 'missing_latest_customer', fallbackReason: 'latest_customer_missing' };
    }
    if (roleConfidence === 'low') {
      return { capture: true, triggerReason: 'low_role_confidence', fallbackReason: 'role_confidence_low' };
    }
    if (!Number.isFinite(domConfidence) || domConfidence < 0.55) {
      return { capture: true, triggerReason: 'low_dom_confidence', fallbackReason: 'dom_confidence_low' };
    }
    if (String(responseMeta?.context_source || '').trim().toLowerCase() === 'ocr') {
      return { capture: true, triggerReason: 'ocr_fallback', fallbackReason: 'context_source_ocr' };
    }
    if (String(responseMeta?.generation_path || '').trim().toLowerCase() === 'image_only') {
      return { capture: true, triggerReason: 'image_only_fallback', fallbackReason: 'generation_path_image_only' };
    }
    return { capture: false, triggerReason: '', fallbackReason: '' };
  };

  const buildDomDiagnosticArtifact = async ({
    requestId,
    context,
    scanDump,
    responseMeta = {},
    manualExport = false,
    triggerReason = 'manual_scan',
    fallbackReason = '',
    error = null
  }) => {
    const sourceUrl = String(scanDump?.url || context?.capture_meta?.url || '').trim();
    let host = '';
    try {
      host = sourceUrl ? new URL(sourceUrl).hostname : '';
    } catch (_error) {
      host = '';
    }
    const hostHash = await hashTextSha256(host);
    const containers = Array.isArray(scanDump?.containers) ? scanDump.containers : [];
    const bubbles = Array.isArray(scanDump?.bubbles) ? scanDump.bubbles : [];
    const artifact = {
      schema_version: 'dom_diagnostic_summary_v1',
      diagnostic_id: createTelemetryEventId('domdiag'),
      captured_at: new Date().toISOString(),
      request_id: clipDiagnosticText(requestId || '', 120),
      manual_export: Boolean(manualExport),
      site: {
        host: clipDiagnosticText(host, 120),
        host_hash: hostHash,
        path_shape: normalizePathShape(sourceUrl),
        url: clipDiagnosticText(sourceUrl, 400),
      },
      extraction_version: clipDiagnosticText(context?.context_version || '1.1', 24),
      trigger_reason: clipDiagnosticText(triggerReason, 80),
      fallback_reason: clipDiagnosticText(fallbackReason || error?.message || '', 120),
      context_source: clipDiagnosticText(responseMeta?.context_source || '', 64),
      generation_path: clipDiagnosticText(responseMeta?.generation_path || '', 80),
      dom_confidence: Number.isFinite(Number(context?.dom_confidence)) ? Number(Number(context.dom_confidence).toFixed(3)) : null,
      role_confidence: clipDiagnosticText(context?.dom_role_confidence || '', 24),
      latest_customer_present: Boolean(clipContextText(context?.dom_latest_customer_turn || context?.dom_latest_customer_message || '', 900)),
      latest_customer_confidence: Number.isFinite(Number(context?.dom_latest_customer_confidence))
        ? Number(Number(context.dom_latest_customer_confidence).toFixed(3))
        : null,
      candidate_counts: {
        containers: containers.length,
        bubbles: bubbles.length,
      },
      geometry: {
        chat: context?.dom_bounds?.chat || null,
        left_panel: context?.dom_bounds?.left_panel || null,
        right_panel: context?.dom_bounds?.right_panel || null,
        last_message: context?.dom_bounds?.last_message || null,
      },
      extracted: {
        latest_customer_message: clipDiagnosticText(context?.dom_latest_customer_message || '', 320),
        latest_customer_turn: clipDiagnosticText(context?.dom_latest_customer_turn || '', 520),
        latest_operator_message: clipDiagnosticText(context?.dom_latest_operator_message || '', 320),
        profile_summary: trimDiagnosticObject(context?.dom_profile_summary, 16, 160),
        operator_profile_summary: trimDiagnosticObject(context?.dom_operator_profile_summary, 16, 160),
      },
      samples: {
        latest_customer_candidates: Array.isArray(context?.dom_latest_customer_candidates)
          ? context.dom_latest_customer_candidates.map((value) => clipDiagnosticText(value, 220)).filter(Boolean).slice(0, 4)
          : [],
        top_container_texts: containers.map((item) => clipDiagnosticText(item?.text || '', 160)).filter(Boolean).slice(0, 5),
        top_bubble_texts: bubbles.map((item) => clipDiagnosticText(item?.text || '', 160)).filter(Boolean).slice(0, 8),
      },
      selectors: {
        containers: summarizeDiagnosticElements(containers, 6, false),
        bubbles: summarizeDiagnosticElements(bubbles, 8, false),
      },
      local_scan_snapshot: {
        containers: summarizeDiagnosticElements(containers, 12, true),
        bubbles: summarizeDiagnosticElements(bubbles, 18, true),
      },
      meta: {
        prompt_variant: clipDiagnosticText(responseMeta?.prompt_variant || responseMeta?.promptVersion || lastPromptVersion || '', 32),
        model: clipDiagnosticText(responseMeta?.model || lastModelName || '', 80),
        error: clipDiagnosticText(error?.message || '', 180),
      }
    };
    return artifact;
  };

  const buildDomDiagnosticUploadPayload = (artifact) => ({
    schema_version: 'dom_diagnostic_upload_v1',
    diagnostic_id: artifact?.diagnostic_id || '',
    captured_at: artifact?.captured_at || new Date().toISOString(),
    request_id: artifact?.request_id || '',
    manual_export: Boolean(artifact?.manual_export),
    site: {
      host_hash: artifact?.site?.host_hash || '',
      path_shape: artifact?.site?.path_shape || '',
    },
    extraction_version: artifact?.extraction_version || '',
    trigger_reason: artifact?.trigger_reason || '',
    fallback_reason: artifact?.fallback_reason || '',
    context_source: artifact?.context_source || '',
    generation_path: artifact?.generation_path || '',
    dom_confidence: artifact?.dom_confidence ?? null,
    role_confidence: artifact?.role_confidence || '',
    latest_customer_present: Boolean(artifact?.latest_customer_present),
    latest_customer_confidence: artifact?.latest_customer_confidence ?? null,
    candidate_counts: artifact?.candidate_counts || {},
    geometry: artifact?.geometry || {},
    extracted: artifact?.extracted || {},
    samples: artifact?.samples || {},
    selectors: artifact?.selectors || {},
    meta: artifact?.meta || {},
  });

  const uploadDomDiagnosticArtifact = async (artifact) => {
    if (!artifact || !clientKey) return;
    try {
      await ensureDeviceId();
      const headers = { 'Content-Type': 'application/json' };
      if (clientKey) headers['X-Client-Key'] = clientKey;
      if (deviceId) headers['X-Device-Id'] = deviceId;
      await fetch(resolveDomDiagnosticsUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify(buildDomDiagnosticUploadPayload(artifact)),
      });
    } catch (error) {
      console.warn('DOM diagnostics upload failed', error);
    }
  };

  const captureDomDiagnosticArtifact = async ({
    requestId,
    context,
    responseMeta = {},
    manualExport = false,
    triggerReason = 'manual_scan',
    fallbackReason = '',
    error = null,
  }) => {
    const tab = await getActiveTab();
    if (!tab?.id) {
      throw new Error('No active tab found.');
    }
    const ready = await ensureContentScript(tab.id);
    if (!ready) {
      throw new Error('Unable to initialize content script.');
    }
    const payloadResult = await sendTabMessage(tab.id, { type: 'SCAN_DOM' });
    const payload = payloadResult.ok ? (payloadResult.response || { ok: false, error: 'No response' }) : { ok: false, error: payloadResult.error };
    if (!payload.ok) {
      throw new Error(payload.error || 'DOM scan failed.');
    }
    const artifact = await buildDomDiagnosticArtifact({
      requestId,
      context,
      scanDump: payload.dump || {},
      responseMeta,
      manualExport,
      triggerReason,
      fallbackReason,
      error,
    });
    persistDomDiagnosticsArtifact(artifact);
    if (!manualExport && shouldUploadDomDiagnosticArtifact(artifact)) {
      void uploadDomDiagnosticArtifact(artifact);
    }
    return artifact;
  };

  const downloadDomDiagnosticArtifact = (artifact) => {
    const json = JSON.stringify(artifact || {}, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ashly-dom-diagnostic-${timestamp}.json`;
    chrome.downloads.download({ url, filename, saveAs: true }, () => {
      URL.revokeObjectURL(url);
    });
  };

  const scheduleDomDiagnosticsCapture = (options = {}) => {
    setTimeout(() => {
      captureDomDiagnosticArtifact(options).catch((error) => {
        console.warn('DOM diagnostic capture failed', error);
      });
    }, 0);
  };

  const normalizeTelemetryText = (value) => String(value || '')
    .toLowerCase()
    .replace(/[`"'.,!?;:()[\]{}<>@#$%^&*_+=\\/|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 800);

  const clipTelemetryText = (value, max = 800) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

  const createTelemetryEventId = (prefix = 'evt') => {
    const randomPart = Math.random().toString(16).slice(2, 12);
    const timePart = Date.now().toString(36);
    return `${prefix}_${timePart}_${randomPart}`;
  };

  const enqueueTelemetryEvent = (event) => {
    if (!event || typeof event !== 'object') return;
    telemetryQueue.push(event);
    if (telemetryQueue.length > 500) {
      telemetryQueue = telemetryQueue.slice(-500);
    }
    scheduleTelemetryFlush(120);
  };

  const scheduleTelemetryFlush = (delayMs = TELEMETRY_FLUSH_INTERVAL_MS) => {
    if (telemetryFlushTimer) {
      return;
    }
    telemetryFlushTimer = setTimeout(() => {
      telemetryFlushTimer = null;
      flushTelemetryQueue();
    }, delayMs);
  };

  const flushTelemetryQueue = async () => {
    if (telemetryFlushInFlight || telemetryQueue.length === 0) {
      return;
    }
    telemetryFlushInFlight = true;
    const batch = telemetryQueue.slice(0, TELEMETRY_BATCH_MAX);
    try {
      await ensureDeviceId();
      const headers = { 'Content-Type': 'application/json' };
      if (clientKey) headers['X-Client-Key'] = clientKey;
      if (deviceId) headers['X-Device-Id'] = deviceId;
      const response = await fetch(resolveTelemetryUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({ events: batch })
      });
      if (!response.ok) {
        throw new Error(`telemetry_http_${response.status}`);
      }
      telemetryQueue.splice(0, batch.length);
      if (telemetryQueue.length > 0) {
        scheduleTelemetryFlush(80);
      }
    } catch (error) {
      console.warn('Telemetry flush failed', error);
      scheduleTelemetryFlush(TELEMETRY_RETRY_INTERVAL_MS);
    } finally {
      telemetryFlushInFlight = false;
    }
  };

  const buildTelemetryEvent = (eventType, payload = {}) => ({
    event_id: createTelemetryEventId(eventType.replace(/[^a-z]/g, '').slice(0, 8) || 'evt'),
    event_type: eventType,
    ts: new Date().toISOString(),
    request_id: clipTelemetryText(payload.request_id || payload.requestId || '', 120),
    reply_id: clipTelemetryText(payload.reply_id || payload.replyId || '', 80),
    reply_text_raw: clipTelemetryText(payload.reply_text_raw || payload.replyTextRaw || payload.reply_text || '', 800),
    reply_text_norm: clipTelemetryText(payload.reply_text_norm || payload.replyTextNorm || normalizeTelemetryText(payload.reply_text_raw || payload.reply_text || ''), 800),
    source_message_raw: clipTelemetryText(payload.source_message_raw || payload.sourceMessageRaw || '', 1200),
    source_message_norm: clipTelemetryText(payload.source_message_norm || payload.sourceMessageNorm || normalizeTelemetryText(payload.source_message_raw || ''), 800),
    prompt_version: clipTelemetryText(payload.prompt_version || payload.promptVersion || lastPromptVersion || '', 64),
    model: clipTelemetryText(payload.model || lastModelName || settings.model || '', 80),
    score_percent: Number.isFinite(Number(payload.score_percent)) ? Number(payload.score_percent) : null,
    rank_position: Number.isFinite(Number(payload.rank_position)) ? Number(payload.rank_position) : null,
    meta: payload.meta && typeof payload.meta === 'object' ? payload.meta : {}
  });

  const buildFeedbackPayload = ({ requestId, orderedReplies, replyQuality, meta = {}, sourceMessageRaw = '' }) => {
    const feedbackReplies = Array.isArray(orderedReplies)
      ? orderedReplies
        .filter((entry) => String(entry?.reply || '').trim())
        .map((entry, index) => {
          const sourceIndex = Number.isFinite(Number(entry?.index)) ? Number(entry.index) : index;
          const qualityForReply = replyQuality?.[`reply_${sourceIndex + 1}`] || null;
          return {
            reply_id: `reply_${sourceIndex + 1}`,
            rank_position: index + 1,
            score_percent: Number.isFinite(Number(qualityForReply?.percent)) ? Number(qualityForReply.percent) : null,
            text: clipTelemetryText(entry?.reply || '', 800),
          };
        })
      : [];
    if (!requestId || feedbackReplies.length === 0) {
      return null;
    }
    return {
      request_id: requestId,
      prompt_version: lastPromptVersion || settings.promptVariant || '',
      model: meta.model || lastModelName || settings.model || '',
      source_message_raw: clipTelemetryText(sourceMessageRaw || '', 1200),
      replies: feedbackReplies,
      reply_quality: replyQuality || null,
      context_source: meta.context_source || '',
      dom_confidence: meta.dom_confidence ?? null,
      generation_path: meta.generation_path || '',
    };
  };

  const submitFeedback = async (feedbackType) => {
    if (!latestFeedbackPayload || feedbackSubmitInFlight) return;
    feedbackSubmitInFlight = true;
    renderFeedbackStrip({
      visible: true,
      hint: 'Saving feedback...',
      goodDisabled: true,
      badDisabled: true,
    });
    try {
      await ensureDeviceId();
      const headers = { 'Content-Type': 'application/json' };
      if (clientKey) headers['X-Client-Key'] = clientKey;
      if (deviceId) headers['X-Device-Id'] = deviceId;
      const response = await fetch(resolveFeedbackUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...latestFeedbackPayload,
          feedback_type: feedbackType,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || `feedback_http_${response.status}`);
      }
      if (data?.quota && typeof data.quota === 'object') {
        currentQuota = data.quota;
        renderProPanel();
      }
      const flashBonus = Number(data?.bonus_awarded?.flash || 0);
      const rewardStatus = String(data?.reward_status || '').trim().toLowerCase();
      let hint = 'Feedback saved. Thanks for tuning the set.';
      if (flashBonus > 0) {
        hint = `Feedback saved. +${flashBonus} standard request added.`;
      } else if (rewardStatus === 'duplicate') {
        hint = 'Already rated for this set. Feedback still saved.';
      } else if (rewardStatus === 'daily_cap') {
        hint = 'Feedback saved. Daily bonus cap reached.';
      }
      renderFeedbackStrip({
        visible: true,
        hint,
        goodDisabled: true,
        badDisabled: true,
      });
      showToast(flashBonus > 0 ? `Saved. +${flashBonus} standard` : 'Feedback saved');
    } catch (error) {
      console.warn('Feedback submit failed', error);
      renderFeedbackStrip({
        visible: true,
        hint: 'Could not save feedback right now. Try again in a second.',
        goodDisabled: false,
        badDisabled: false,
      });
    } finally {
      feedbackSubmitInFlight = false;
    }
  };

  const prunePendingSendCandidates = () => {
    const now = Date.now();
    for (const [candidateKey, candidate] of pendingSendCandidates.entries()) {
      if (!candidate || Number(candidate.expires_at_ms) <= now) {
        pendingSendCandidates.delete(candidateKey);
      }
    }
  };

  const registerPendingSendCandidate = async (candidate) => {
    if (!candidate?.request_id || !candidate?.reply_id || !candidate?.reply_text_raw) {
      return;
    }
    prunePendingSendCandidates();
    const candidateKey = `${candidate.request_id}:${candidate.reply_id}`;
    const selectedTsMs = Number(candidate.selected_ts_ms) || Date.now();
    const normalizedCandidate = {
      ...candidate,
      selected_ts_ms: selectedTsMs,
      expires_at_ms: selectedTsMs + TELEMETRY_PENDING_TTL_MS
    };
    pendingSendCandidates.set(candidateKey, normalizedCandidate);
    try {
      const tab = await getActiveTab();
      if (!tab?.id) return;
      const ready = await ensureContentScript(tab.id);
      if (!ready) return;
      await sendTabMessage(tab.id, {
        type: 'TELEMETRY_REGISTER_PENDING_REPLY',
        candidate: normalizedCandidate
      });
    } catch (error) {
      console.warn('Pending send registration failed', error);
    }
  };

  const consumePendingCandidate = (requestId, replyId) => {
    const key = `${String(requestId || '').trim()}:${String(replyId || '').trim()}`;
    const candidate = pendingSendCandidates.get(key) || null;
    if (candidate) {
      pendingSendCandidates.delete(key);
    }
    return candidate;
  };

  const stopTelemetryTrackingInActiveTab = async () => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) return;
      const ready = await ensureContentScript(tab.id);
      if (!ready) return;
      await sendTabMessage(tab.id, { type: 'TELEMETRY_STOP_TRACKING' });
    } catch (error) {
      console.warn('Failed to stop telemetry tracking in tab', error);
    }
  };

  const extractDomContext = async () => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) return null;
      const ready = await ensureContentScript(tab.id);
      if (!ready) return null;
      const response = await sendTabMessage(tab.id, { type: 'EXTRACT_CONTEXT' });
      if (!response.ok || !response.response?.ok) {
        return null;
      }
      return response.response.context || null;
    } catch (err) {
      console.warn('DOM extraction failed', err);
      return null;
    }
  };

  const loadImage = (dataUrl) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });

  const dataUrlToBlob = (dataUrl) => {
    const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.*)$/);
    if (!match) return null;
    const mime = match[1] || 'image/jpeg';
    const base64 = match[2] || '';
    if (!base64) return null;
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let index = 0; index < len; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: mime });
  };

  const loadImageBitmap = async (dataUrl) => {
    if (typeof createImageBitmap === 'function') {
      const blob = dataUrlToBlob(dataUrl);
      if (blob) {
        return createImageBitmap(blob);
      }
    }
    return loadImage(dataUrl);
  };

  const createCanvas = (width, height) => {
    if (typeof OffscreenCanvas !== 'undefined') {
      return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const canvasToDataUrl = async (canvas, quality) => {
    if (typeof canvas.convertToBlob === 'function') {
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
      return blobToDataUrl(blob);
    }
    return canvas.toDataURL('image/jpeg', quality);
  };

  const clampRect = (rect, maxWidth, maxHeight) => {
    const x = Math.max(0, Math.min(rect.x, maxWidth - 1));
    const y = Math.max(0, Math.min(rect.y, maxHeight - 1));
    const width = Math.max(1, Math.min(rect.w, maxWidth - x));
    const height = Math.max(1, Math.min(rect.h, maxHeight - y));
    return { x, y, w: width, h: height };
  };

  const cropAndResize = async (image, rect, maxWidth) => {
    if (!rect || rect.w < 10 || rect.h < 10) return null;
    const width = image.width || image.naturalWidth || 0;
    const height = image.height || image.naturalHeight || 0;
    if (!width || !height) return null;
    const safeRect = clampRect(rect, width, height);
    const scale = safeRect.w > maxWidth ? maxWidth / safeRect.w : 1;
    const targetWidth = Math.max(1, Math.round(safeRect.w * scale));
    const targetHeight = Math.max(1, Math.round(safeRect.h * scale));
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    ctx.drawImage(
      image,
      safeRect.x,
      safeRect.y,
      safeRect.w,
      safeRect.h,
      0,
      0,
      targetWidth,
      targetHeight
    );
    return canvasToDataUrl(canvas, IMAGE_QUALITY);
  };

  const prepareImageVariants = async (dataUrl, context, options = {}) => {
    const includeProfileVariants = Boolean(options.includeProfileVariants);
    const includeAuxVariants = Boolean(options.includeAuxVariants);
    const image = await loadImageBitmap(dataUrl);
    const viewportWidth = context?.capture_meta?.viewportWidth || image.width || image.naturalWidth || 1;
    const viewportHeight = context?.capture_meta?.viewportHeight || image.height || image.naturalHeight || 1;
    const scaleX = (image.width || image.naturalWidth || 1) / viewportWidth;
    const scaleY = (image.height || image.naturalHeight || 1) / viewportHeight;

    const toImageRect = (bounds) => {
      if (!bounds) return null;
      const rect = {
        x: Math.round(bounds.x * scaleX),
        y: Math.round(bounds.y * scaleY),
        w: Math.round(bounds.w * scaleX),
        h: Math.round(bounds.h * scaleY)
      };
      return rect.w > 10 && rect.h > 10 ? rect : null;
    };

    const fullRect = {
      x: 0,
      y: 0,
      w: image.width || image.naturalWidth || 1,
      h: image.height || image.naturalHeight || 1
    };

    const variants = {};
    const fullVariant = await cropAndResize(image, fullRect, IMAGE_MAX_WIDTH.full);
    variants.full = fullVariant || '';

    if (includeAuxVariants) {
      const chatRect = toImageRect(context?.dom_bounds?.chat);
      const lastMessageRect = toImageRect(context?.dom_bounds?.last_message);
      const leftRect = includeProfileVariants ? toImageRect(context?.dom_bounds?.left_panel) : null;
      const rightRect = includeProfileVariants ? toImageRect(context?.dom_bounds?.right_panel) : null;
      const [chatVariant, lastMessageVariant, leftVariant, rightVariant] = await Promise.all([
        cropAndResize(image, chatRect, IMAGE_MAX_WIDTH.chat),
        cropAndResize(image, lastMessageRect, IMAGE_MAX_WIDTH.last_message),
        includeProfileVariants ? cropAndResize(image, leftRect, IMAGE_MAX_WIDTH.left_profile) : Promise.resolve(null),
        includeProfileVariants ? cropAndResize(image, rightRect, IMAGE_MAX_WIDTH.right_profile) : Promise.resolve(null),
      ]);
      if (chatVariant) variants.chat = chatVariant;
      if (lastMessageVariant) variants.last_message = lastMessageVariant;
      if (leftVariant) variants.left_profile = leftVariant;
      if (rightVariant) variants.right_profile = rightVariant;
    }

    return {
      variants,
      previewUrl: variants.full || dataUrl
    };
  };

  const clipContextText = (value, max = 320) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

  const trimContextMessages = (messages, maxMessages = 8) => {
    if (!Array.isArray(messages)) return [];
    return messages
      .map((entry) => ({
        role: clipContextText(entry?.role || '', 24),
        text: clipContextText(entry?.text || entry?.message || '', 260),
        timestamp: clipContextText(entry?.timestamp || '', 24)
      }))
      .filter((entry) => entry.text)
      .slice(-maxMessages);
  };

  const trimContextLogbook = (entries, maxEntries = 8) => {
    if (!Array.isArray(entries)) return [];
    return entries
      .map((entry) => ({
        category: clipContextText(entry?.category || entry?.label || entry?.title || '', 64),
        text: clipContextText(entry?.text || entry?.message || entry?.value || '', 220),
      }))
      .filter((entry) => entry.text)
      .slice(0, maxEntries);
  };

  const trimContextObject = (value, maxPairs = 16) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const entries = Object.entries(value).slice(0, maxPairs);
    const out = {};
    entries.forEach(([key, itemValue]) => {
      const cleanKey = clipContextText(key, 64);
      const cleanValue = clipContextText(itemValue, 220);
      if (!cleanKey || !cleanValue) return;
      out[cleanKey] = cleanValue;
    });
    return out;
  };

  const buildAnalyzeContextPayload = (context) => {
    if (!context || typeof context !== 'object') return null;
    const trimmedMessages = trimContextMessages(context.dom_messages || context.domMessages || []);
    const payload = {
      context_version: clipContextText(context.context_version || '1.1', 16),
      dom_messages: trimmedMessages,
      dom_latest_customer_turn: clipContextText(context.dom_latest_customer_turn, 900),
      dom_latest_customer_message: clipContextText(context.dom_latest_customer_message, 500),
      dom_latest_customer_candidates: Array.isArray(context.dom_latest_customer_candidates)
        ? context.dom_latest_customer_candidates.map((value) => clipContextText(value, 280)).filter(Boolean).slice(0, 4)
        : [],
      dom_latest_customer_confidence: Number.isFinite(Number(context.dom_latest_customer_confidence))
        ? Number(context.dom_latest_customer_confidence)
        : 0,
      dom_latest_operator_message: clipContextText(context.dom_latest_operator_message, 500),
      dom_latest_operator_before_customer_message: clipContextText(context.dom_latest_operator_before_customer_message, 500),
      dom_profile_summary: trimContextObject(context.dom_profile_summary, 16),
      dom_operator_profile_summary: trimContextObject(context.dom_operator_profile_summary, 16),
      dom_logbook_latest: trimContextLogbook(context.dom_logbook_latest, 8),
      dom_operator_logbook_latest: trimContextLogbook(context.dom_operator_logbook_latest, 8),
      dom_effective_name: clipContextText(context.dom_effective_name, 80),
      dom_operator_effective_name: clipContextText(context.dom_operator_effective_name, 80),
      dom_confidence: Number.isFinite(Number(context.dom_confidence)) ? Number(context.dom_confidence) : 0,
      dom_role_confidence: clipContextText(context.dom_role_confidence, 24),
    };
    return payload;
  };

  const buildClientTimingPayload = () => {
    const nowMs = Date.now();
    const captureMs = lastCaptureStartedAt > 0
      ? Math.max(0, (lastCompressEndedAt || nowMs) - lastCaptureStartedAt)
      : null;
    const prepareMs = (lastCompressEndedAt > 0 && lastCaptureStartedAt > 0)
      ? Math.max(0, lastCompressEndedAt - lastCaptureStartedAt)
      : null;
    return {
      capture: Number.isFinite(Number(captureMs)) ? Number(captureMs) : null,
      image_prepare: Number.isFinite(Number(prepareMs)) ? Number(prepareMs) : null,
    };
  };

  const clearLogSection = () => {
    if (clientLogList) clientLogList.innerHTML = '';
    if (operatorLogList) operatorLogList.innerHTML = '';
    if (logGroupsContainer) logGroupsContainer.innerHTML = '';
  };

  const resetResults = () => {
    if (replyContainer) replyContainer.style.display = 'none';
    if (logSection) logSection.style.display = 'none';
    resetFeedbackStrip();
    clearLogSection();
  };

  const normalizeLogEntries = (entries, fallbackLabel) => {
    if (!entries) return [];
    if (Array.isArray(entries)) {
      return entries.map((entry) => {
        if (typeof entry === 'string') {
          return { category: fallbackLabel, text: entry };
        }
        return {
          category: entry.category || entry.title || fallbackLabel,
          text: entry.text || entry.detail || entry.notes || ''
        };
      });
    }
    if (typeof entries === 'string') {
      return [{ category: fallbackLabel, text: entries }];
    }
    return [];
  };

  const renderLogList = (entries, container, sideLabel) => {
    if (!container) return;
    container.innerHTML = '';
    entries.forEach((entry) => {
      const item = document.createElement('div');
      item.className = 'log-item';

      const title = document.createElement('div');
      title.className = 'log-item-title';
      title.textContent = entry.category || sideLabel;

      const text = document.createElement('div');
      text.className = 'log-item-text';
      text.textContent = entry.text || '';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'log-item-action';
      button.textContent = 'Type to comment';
      const marker = `[${sideLabel}]`;
      button.addEventListener('click', () => {
        const composed = entry.text ? `${marker} ${entry.text}` : marker;
        typeReplyInActiveTab(composed);
      });

      const autoLogBtn = document.createElement('button');
      autoLogBtn.type = 'button';
      autoLogBtn.className = 'log-item-action';
      autoLogBtn.textContent = 'Add to logbook';
      autoLogBtn.addEventListener('click', () => {
        const category = entry.category || sideLabel || '';
        const comment = entry.text || '';
        if (!comment) {
          setError('Logbook comment is empty.');
          return;
        }
        applyLogbookEntry(category, comment);
      });

      item.appendChild(title);
      item.appendChild(text);
      item.appendChild(button);
      item.appendChild(autoLogBtn);
      container.appendChild(item);
    });
  };

  const applyLogbookEntry = async (category, comment) => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) {
        setError('No active tab found.');
        return;
      }
      const ready = await ensureContentScript(tab.id);
      if (!ready) {
        setError('Unable to initialize content script.');
        return;
      }
      setStatus('Adding logbook entry...');
      if (statusSection) statusSection.style.display = 'flex';
      const payloadResult = await sendTabMessage(tab.id, {
        type: 'APPLY_LOGBOOK_ENTRY',
        category,
        comment
      });
      const payload = payloadResult.ok ? (payloadResult.response || { ok: false, error: 'No response' }) : { ok: false, error: payloadResult.error };
      if (!payload.ok) {
        setError(payload.error || 'Failed to add logbook entry.');
        return;
      }
      setLatencySummary(`Logbook entry added: ${payload.category || category}`);
      showToast();
    } catch (err) {
      setError(`Logbook entry error: ${err.message}`);
    } finally {
      if (statusSection) statusSection.style.display = 'none';
    }
  };

  const renderLogGroups = (groups) => {
    if (!logGroupsContainer) return;
    logGroupsContainer.innerHTML = '';
    if (!Array.isArray(groups)) return;
    groups.forEach((group) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'log-group';

      const title = document.createElement('div');
      title.className = 'log-group-title';
      title.textContent = group.title || group.name || 'Log Group';

      const options = document.createElement('div');
      options.className = 'log-group-options';

      const items = Array.isArray(group.items) ? group.items : [];
      items.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'log-option-btn';
        const label = item.label || item.category || item.title || 'Option';
        const text = item.text || item.detail || item.notes || '';
        button.textContent = label;
        button.addEventListener('click', () => {
          const composed = text ? `[${label}] ${text}` : `[${label}]`;
          typeReplyInActiveTab(composed);
        });
        options.appendChild(button);
      });

      wrapper.appendChild(title);
      wrapper.appendChild(options);
      logGroupsContainer.appendChild(wrapper);
    });
  };

  const applyReplies = (replies, replyQuality, orderedRepliesOverride = null, replyMediaCues = null) => {
    const orderedReplies = Array.isArray(orderedRepliesOverride)
      ? orderedRepliesOverride
      : rankReplies(replies, replyQuality, replyMediaCues);
    const replyButtons = [reply1Btn, reply2Btn, reply3Btn, reply4Btn, reply5Btn];
    const replyBadges = [replyScore1, replyScore2, replyScore3, replyScore4, replyScore5];
    const replyCueBadges = [replyCue1, replyCue2, replyCue3, replyCue4, replyCue5];
    const qualityArray = [
      replyQuality?.reply_1,
      replyQuality?.reply_2,
      replyQuality?.reply_3,
      replyQuality?.reply_4,
      replyQuality?.reply_5
    ];
    let hasReplies = false;
    orderedReplies.forEach((entry, index) => {
      const reply = entry?.reply || '';
      if (replyButtons[index]) {
        if (reply) {
          replyButtons[index].innerText = reply;
          replyButtons[index].disabled = false;
          replyButtons[index].setAttribute('aria-disabled', 'false');
          hasReplies = true;
        } else {
          replyButtons[index].innerText = 'No suggestion generated';
          replyButtons[index].disabled = true;
          replyButtons[index].setAttribute('aria-disabled', 'true');
        }
      }
      if (replyBadges[index]) {
        const quality = typeof entry?.index === 'number' ? qualityArray[entry.index] : null;
        setReplyScoreBadge(replyBadges[index], quality);
      }
      if (replyCueBadges[index]) {
        const cue = entry?.mediaCue || (typeof entry?.index === 'number' ? replyMediaCues?.[`reply_${entry.index + 1}`] : null);
        setReplyCueBadge(replyCueBadges[index], cue);
      }
    });
    for (let i = orderedReplies.length; i < replyButtons.length; i += 1) {
      if (replyButtons[i]) {
        replyButtons[i].innerText = 'No suggestion generated';
        replyButtons[i].disabled = true;
        replyButtons[i].setAttribute('aria-disabled', 'true');
      }
      if (replyBadges[i]) setReplyScoreBadge(replyBadges[i], null);
      if (replyCueBadges[i]) setReplyCueBadge(replyCueBadges[i], null);
    }
    if (hasReplies) {
      replyContainer.style.display = 'flex';
      document.querySelectorAll('.reply-card').forEach(c => c.classList.remove('selected'));
      hideAnalysisThumbnail();
    }
    return orderedReplies;
  };


  const sendForAnalysis = async (imageUrl, options = {}) => {
    if (!imageUrl) return;
    const analysisRequestToken = beginAnalysisRequest();
    analysisInFlightCount += 1;
    showAnalysisThumbnail(imageUrl);
    clearAppError();
    resetResults();
    if (statusSection) statusSection.style.display = 'flex';
    const forcedModel = options.forcedModel || '';
    const retryReason = options.retryReason || '';
    const context = options.context || null;
    const trimmedContext = buildAnalyzeContextPayload(context);
    const requestModel = forcedModel || settings.model;
    let summaryMessage = '';
    if (forcedModel) {
      setStatus('Retrying with Premium request...');
    } else if (retryReason) {
      setStatus('Retrying analysis...');
    } else {
      setStatus('Sending screenshot...');
    }
    startTimer();

    const requestId = crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let metaModel = '';
    let metaTone = '';
    let metaPath = '';

    try {
      await ensureDeviceId();
      const headers = { 'Content-Type': 'application/json' };
      if (clientKey) {
        headers['X-Client-Key'] = clientKey;
      }
      if (deviceId) {
        headers['X-Device-Id'] = deviceId;
      }
      const requestPayload = {
        image: imageUrl,
        context: trimmedContext || undefined,
        context_version: trimmedContext?.context_version || undefined,
        customer_name: trimmedContext?.dom_effective_name || undefined,
        reply_count: settings.replyCount,
        include_logs: settings.showLogs,
        include_ocr: settings.showContext,
        logbook_categories: settings.showLogs && logbookCategories.length > 0 ? logbookCategories : undefined,
        model: requestModel,
        prompt_variant: normalizePromptVariant(settings.promptVariant),
        request_id: requestId,
        request_reason: retryReason,
        client_timings_ms: buildClientTimingPayload(),
      };
      const requestBody = JSON.stringify(requestPayload);
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers,
        body: requestBody,
        signal: controller.signal
      });
      if (!isCurrentAnalysisRequest(analysisRequestToken)) {
        return;
      }

      if (!response.ok) {
        let detail = '';
        let errorPayload = null;
        try {
          const data = await response.json();
          errorPayload = data;
          const primary = data?.error || data?.message || '';
          const details = data?.details || '';
          const reason = data?.block_reason ? `Block reason: ${data.block_reason}` : '';
          detail = [primary, details, reason].filter(Boolean).join(' ');
        } catch (err) {
          try {
            const text = await response.text();
            detail = text || '';
          } catch (textErr) {
            detail = '';
          }
        }
        if (response.status === 401 || response.status === 403) {
          const code = normalizeKeyErrorCode(errorPayload?.code);
          if (code || response.status === 401) {
            await handleKeyVerificationFailure({
              status: response.status,
              error: detail,
              code,
              key_status: errorPayload?.key_status || errorPayload?.status || '',
            }, {
              clearStoredKey: shouldClearStoredKeyForCode(code || 'invalid_key'),
            });
            return;
          }
        }
        if (response.status === 402 && (errorPayload?.quota_exhausted || errorPayload?.code === 'quota_exhausted' || errorPayload?.code === 'billing_cap_reached')) {
          const remainingFlash = Number(errorPayload?.remaining?.flash);
          const remainingPro = Number(errorPayload?.remaining?.pro);
          const resetAt = errorPayload?.reset_at ? new Date(errorPayload.reset_at) : null;
          let message = detail || 'Weekly quota exhausted';
          if (Number.isFinite(remainingFlash) || Number.isFinite(remainingPro)) {
            const flashText = Number.isFinite(remainingFlash) ? String(Math.max(0, remainingFlash)) : '-';
            const proText = Number.isFinite(remainingPro) ? String(Math.max(0, remainingPro)) : '-';
            message += ` (Standard ${flashText}, Premium ${proText})`;
          }
          if (resetAt && Number.isFinite(resetAt.getTime())) {
            message += `. Resets ${resetAt.toLocaleString()}`;
          }
          if (errorPayload?.upgrade_url) {
            message += '. Upgrade for additional quota.';
          }
          currentQuota = errorPayload?.quota || {
            remaining_flash: Number.isFinite(remainingFlash) ? Math.max(0, remainingFlash) : null,
            remaining_pro: Number.isFinite(remainingPro) ? Math.max(0, remainingPro) : null,
            reset_at: errorPayload?.reset_at || ''
          };
          renderProPanel();
          setError(message);
          return;
        }
        throw new Error(`Server Error (${response.status})${detail ? ` ${detail}` : ''}`);
      }

      const data = await response.json();
      if (!isCurrentAnalysisRequest(analysisRequestToken)) {
        return;
      }
      clearAppError();
      lastPromptVersion = normalizePromptVariant(
        data.prompt_version
        || data.promptVariant
        || data.meta?.prompt_variant_used
        || settings.promptVariant
        || lastPromptVersion
      );
      lastModelName = data.model || lastModelName;
      metaModel = data.model || requestModel || '';
      metaTone = data.detected_tone || '';
      metaPath = data.generation_path || '';
      const responsePlan = data.meta?.plan || '';
      if (responsePlan) {
        currentPlan = responsePlan;
        setPlanBadge(currentPlan);
        applyPlanCapabilities();
      }
      if (data.meta?.success_count !== undefined) {
        successCount = Number(data.meta.success_count) || 0;
        setSuccessCounter(successCount);
      }
      if (data.meta?.charged_kes_total !== undefined || data.meta?.quota?.spent_kes_weekly !== undefined) {
        spendKesTotal = Number(data.meta?.quota?.spent_kes_weekly ?? data.meta?.charged_kes_total) || 0;
        setCostCounter(spendKesTotal);
      }
      if (data.meta?.pro_retry_remaining !== undefined) {
        proRetryRemaining = Number(data.meta.pro_retry_remaining);
        setRetryBestCounter(proRetryRemaining);
      }
      if (data.meta?.quota && typeof data.meta.quota === 'object') {
        currentQuota = data.meta.quota;
      }
      if (data.meta?.plan_pricing && typeof data.meta.plan_pricing === 'object') {
        currentPricing = data.meta.plan_pricing;
      }
      renderProPanel();
      const responseRequestId = clipTelemetryText(data?.request_id || requestId || '', 120);
      const diagnosticsResponseMeta = {
        context_source: data.meta?.context_source || '',
        generation_path: data.generation_path || '',
        model: metaModel || requestModel || '',
        prompt_variant: lastPromptVersion || settings.promptVariant || '',
      };
      const contextSource = data.meta?.context_source || '';
      const domConfidence = Number.isFinite(Number(data.meta?.dom_confidence))
        ? Number(data.meta?.dom_confidence).toFixed(2)
        : '';
      const imagesSent = Number.isFinite(Number(data.meta?.images_sent))
        ? String(data.meta?.images_sent)
        : '';
      const modeLabel = contextSource ? contextSource.toUpperCase() : 'UNKNOWN';
      summaryMessage = `Mode: ${modeLabel}`;
      if (domConfidence) summaryMessage += ` | Dom conf: ${domConfidence}`;
      if (imagesSent) summaryMessage += ` | Images: ${imagesSent}`;
      if (metaModel) summaryMessage += ` | Model: ${formatModelLabel(metaModel)}`;
      if (lastPromptVersion) summaryMessage += ` | Version: ${formatPromptVariantLabel(lastPromptVersion)}`;
      if (Array.isArray(data.meta?.feature_downgrades) && data.meta.feature_downgrades.length > 0) {
        summaryMessage += ` | Downgraded: ${data.meta.feature_downgrades.join(', ')}`;
      }
      if (metaPath) summaryMessage += ` | Path: ${metaPath}`;
      setLatencySummary(summaryMessage);
      updateContextDebug(context, data);
      const replies = [data.reply_1, data.reply_2, data.reply_3, data.reply_4, data.reply_5];
      const serverReplyQuality = data?.meta?.reply_quality || data?.reply_quality || null;
      const replyMediaCues = data?.meta?.reply_media_cues || null;
      const replyQuality = hasServerReplyQuality(serverReplyQuality)
        ? serverReplyQuality
        : buildLocalReplyQuality(replies);
      const hasAnyReply = replies.some((reply) => Boolean(reply));
      const trackingSourceRaw = clipTelemetryText(
        data?.source_message_for_tracking
        || context?.dom_latest_customer_turn
        || context?.dom_latest_customer_message
        || data?.latest_customer_message
        || '',
        1200
      );
      const qualityArray = [
        replyQuality?.reply_1,
        replyQuality?.reply_2,
        replyQuality?.reply_3,
        replyQuality?.reply_4,
        replyQuality?.reply_5
      ];
      const orderedReplies = rankReplies(replies, replyQuality, replyMediaCues);
        if (hasAnyReply) {
          applyReplies(replies, replyQuality, orderedReplies, replyMediaCues);
          pushHistory(replies, replyQuality);
          const feedbackMeta = {
            model: metaModel || lastModelName,
            context_source: contextSource || data.meta?.context_source || '',
            dom_confidence: data.meta?.dom_confidence ?? null,
            generation_path: metaPath || data.generation_path || '',
          };
          const telemetryByCard = {};
        orderedReplies.forEach((entry, rankIndex) => {
          const sourceIndex = Number.isFinite(Number(entry?.index)) ? Number(entry.index) : rankIndex;
          const rawReplyText = clipTelemetryText(entry?.reply || '', 800);
          if (!rawReplyText) return;
          const qualityForReply = qualityArray[sourceIndex];
          const scorePercent = Number(qualityForReply?.percent);
          const rankPosition = rankIndex + 1;
          const cardSlot = String(rankPosition);
          const replyId = `reply_${sourceIndex + 1}`;
          telemetryByCard[cardSlot] = {
            request_id: responseRequestId,
            reply_id: replyId,
            reply_text_raw: rawReplyText,
            reply_text_norm: normalizeTelemetryText(rawReplyText),
            source_message_raw: trackingSourceRaw,
            source_message_norm: normalizeTelemetryText(trackingSourceRaw),
            prompt_version: lastPromptVersion,
            model: metaModel || lastModelName,
            score_percent: Number.isFinite(scorePercent) ? scorePercent : null,
            rank_position: rankPosition
          };
          enqueueTelemetryEvent(buildTelemetryEvent('reply_generated', telemetryByCard[cardSlot]));
        });
          latestAnalysisTelemetry = {
            request_id: responseRequestId,
            source_message_raw: trackingSourceRaw,
            source_message_norm: normalizeTelemetryText(trackingSourceRaw),
            prompt_version: lastPromptVersion,
            model: metaModel || lastModelName,
            repliesByCard: telemetryByCard
          };
          latestFeedbackPayload = buildFeedbackPayload({
            requestId: responseRequestId,
            orderedReplies,
            replyQuality,
            meta: feedbackMeta,
            sourceMessageRaw: trackingSourceRaw,
          });
          renderFeedbackStrip({
            visible: Boolean(latestFeedbackPayload),
            hint: '+1 standard reward. Quick tap only.',
            goodDisabled: false,
            badDisabled: false,
          });
          scheduleTelemetryFlush(200);
        } else {
          latestAnalysisTelemetry = null;
          resetFeedbackStrip();
          setError('No replies returned. Please try again.');
        }

      const domDiagnosticsDecision = buildDomDiagnosticsDecision({
        context,
        responseMeta: diagnosticsResponseMeta,
        error: null,
      });
      if (domDiagnosticsDecision.capture) {
        scheduleDomDiagnosticsCapture({
          requestId: responseRequestId,
          context,
          responseMeta: diagnosticsResponseMeta,
          triggerReason: domDiagnosticsDecision.triggerReason,
          fallbackReason: domDiagnosticsDecision.fallbackReason,
          error: null,
        });
      }

      clearLogSection();
      if (settings.showLogs && logSection) {
        const clientEntries = normalizeLogEntries(data.client_logbook || data.client_logs, 'Client Log');
        const operatorEntries = normalizeLogEntries(data.operator_logbook || data.operator_logs, 'Operator Log');
        renderLogList(clientEntries, clientLogList, 'Client');
        renderLogList(operatorEntries, operatorLogList, 'Operator');
        renderLogGroups(data.log_groups || data.logGroups);
        logSection.style.display = 'flex';
      }
    } catch (error) {
      if (!isCurrentAnalysisRequest(analysisRequestToken)) {
        return;
      }
      const message = error?.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : `Error: ${error.message}`;
      setError(message);
      summaryMessage = '';
      const domDiagnosticsDecision = buildDomDiagnosticsDecision({
        context,
        responseMeta: {},
        error,
      });
      if (domDiagnosticsDecision.capture) {
        scheduleDomDiagnosticsCapture({
          requestId,
          context,
          responseMeta: {
            model: requestModel,
            prompt_variant: normalizePromptVariant(settings.promptVariant),
          },
          triggerReason: domDiagnosticsDecision.triggerReason,
          fallbackReason: domDiagnosticsDecision.fallbackReason,
          error,
        });
      }
    } finally {
      clearTimeout(timeoutId);
      lastAnalyzeEndedAt = Date.now();
      analysisInFlightCount = Math.max(analysisInFlightCount - 1, 0);
      if (isCurrentAnalysisRequest(analysisRequestToken)) {
        setLatencySummary(summaryMessage);
        if (statusSection) statusSection.style.display = 'none';
        stopTimer();
      }
      if (analysisInFlightCount === 0) {
        hideAnalysisThumbnail();
      }
    }
  };

  const handleCapture = async () => {
    if (!captureBtn) return;
    captureBtn.disabled = true;
    setError('');
    setLatencySummary('');
    lastScreenshotUrl = '';
    lastContext = null;
    lastImageVariants = null;
    setStatus('Capturing tab...');
    if (statusSection) statusSection.style.display = 'flex';
    startTimer();
    lastCaptureStartedAt = Date.now();

    const activeTab = await getActiveTab();
    const captureWindowId = activeTab?.windowId;
    if (captureWindowId == null) {
      setError('Capture failed: no active browser window found.');
      captureBtn.disabled = false;
      if (statusSection) statusSection.style.display = 'none';
      stopTimer();
      return;
    }

    chrome.tabs.captureVisibleTab(captureWindowId, { format: CAPTURE_FORMAT, quality: CAPTURE_QUALITY }, async (dataUrl) => {
      if (chrome.runtime.lastError) {
        setError(`Capture failed: ${chrome.runtime.lastError.message}`);
        captureBtn.disabled = false;
        if (statusSection) statusSection.style.display = 'none';
        stopTimer();
        return;
      }

      setStatus('Extracting context...');
      const context = await extractDomContext();
      updateContextDebug(context);
      lastOverlayBoxes = Array.isArray(context?.dom_message_bounds_all)
        ? context.dom_message_bounds_all
        : (Array.isArray(context?.dom_message_bounds) ? context.dom_message_bounds : []);
      if (settings.showOverlay) {
        sendDebugOverlay(lastOverlayBoxes, true);
      }

      setStatus('Preparing screenshot...');
      let variants = {};
      let previewUrl = dataUrl;
      try {
        const prepared = await prepareImageVariants(dataUrl, context, {
          includeProfileVariants: Boolean(settings.showContext),
        });
        variants = prepared.variants || {};
        previewUrl = prepared.previewUrl || dataUrl;
      } catch (err) {
        console.warn('Image preprocessing failed', err);
      }

      lastCompressEndedAt = Date.now();
      lastScreenshotUrl = previewUrl;
      lastContext = context;
      lastImageVariants = variants;
      showAnalysisThumbnail(previewUrl);
      if (analysisSection) analysisSection.style.display = 'flex';
      if (retryBtn) retryBtn.disabled = false;
      if (retryBestBtn) retryBestBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
      setStatus('Analyzing...');
      sendForAnalysis(previewUrl, { context, imageVariants: variants }).finally(() => {
        captureBtn.disabled = false;
      });
    });
  };

  const handleRetry = () => {
    if (!lastScreenshotUrl) return;
    setStatus('Retrying analysis...');
    sendForAnalysis(lastScreenshotUrl, {
      retryReason: 'user_retry',
      context: lastContext,
      imageVariants: lastImageVariants
    });
  };

  const handleRetryBest = () => {
    if (!lastScreenshotUrl) return;
    setStatus('Retrying with Premium request...');
    sendForAnalysis(lastScreenshotUrl, {
      forcedModel: 'gemini-2.5-pro',
      retryReason: 'user_retry_best',
      context: lastContext,
      imageVariants: lastImageVariants
    });
  };

  const handleClear = () => {
    setError('');
    setLatencySummary('');
    resetResults();
    resetPreview();
    pendingSendCandidates.clear();
    void stopTelemetryTrackingInActiveTab();
    if (settings.showOverlay) {
      sendDebugOverlay([], false);
    }
  };

  captureBtn?.addEventListener('click', handleCapture);
  retryBtn?.addEventListener('click', handleRetry);
  retryBestBtn?.addEventListener('click', handleRetryBest);
  clearBtn?.addEventListener('click', handleClear);

  historyClearBtn?.addEventListener('click', () => {
    historyEntries = [];
    persistHistory();
    renderHistory();
  });

  document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    const tagName = target?.tagName?.toLowerCase?.();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target?.isContentEditable) {
      return;
    }
    if (appContent?.style.display === 'none') return;

    if (event.key >= '1' && event.key <= '5') {
      handleReplySelection(event.key);
      return;
    }

    const key = event.key.toLowerCase();
    if (key === 'enter') {
      if (!captureBtn?.disabled) handleCapture();
      return;
    }
    if (key === 'r') {
      if (!retryBtn?.disabled) handleRetry();
      return;
    }
    if (key === 'b') {
      if (!retryBestBtn?.disabled) handleRetryBest();
      return;
    }
    if (key === 'c') {
      if (!clearBtn?.disabled) handleClear();
      return;
    }
  });

  readHistory();
  resetPreview();

});
