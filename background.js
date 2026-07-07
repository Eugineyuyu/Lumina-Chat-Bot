// --- 1. Open Side Panel via Chrome Toolbar Icon Click ---
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) return;
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (error) {
    console.error(error);
  }
});

// --- 2. Track Side Panel State (Is it open or closed?) ---
let isPanelOpen = false;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "lumina-sidepanel") {
    isPanelOpen = true;

    // Broadcast to all tabs: HIDE THE BUTTON
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs
          .sendMessage(tab.id, { action: "LUMINA_PANEL_OPENED" })
          .catch(() => {});
      });
    });

    port.onDisconnect.addListener(() => {
      isPanelOpen = false;

      // Broadcast to all tabs: SHOW THE BUTTON
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs
            .sendMessage(tab.id, { action: "LUMINA_PANEL_CLOSED" })
            .catch(() => {});
        });
      });
    });
  }
});

// --- 3. Message Listeners ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_LUMINA_PANEL') {
    if (chrome.sidePanel && sender.tab) {
      // Open specifically for the Tab that generated the click
      chrome.sidePanel.open({ tabId: sender.tab.id }).catch((err) => {
        console.error("Failed to open side panel:", err);
      });
    }
  }
  
  if (message.type === 'CHECK_PANEL_STATE') {
    sendResponse({ isOpen: isPanelOpen });
  }
});
