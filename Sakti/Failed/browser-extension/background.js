console.log("🟢 Paste Bridge service worker aktif");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PASTE_REQUEST") {
    chrome.runtime.sendNativeMessage("com.paste.bridge", {
      command: "paste",
      value: message.value || ""
    }, (response) => {
      console.log("📤 Native response:", response);
      sendResponse(response);
    });

    return true; // for async response
  }
});
