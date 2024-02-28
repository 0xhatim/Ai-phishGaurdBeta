console.log("AI-PhishGuard Background Script loaded.");
function getDomainFromUrl(url) {
    return url;

}

console.log("AI-PhishGuard Background Script loaded.");

chrome.tabs.onActivated.addListener(function (activeInfo) {
    // Get information about the newly activated tab
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        // Send the updated information to the popup
        chrome.runtime.sendMessage({
            message: "updateInfo",
            tabUrl: tab.url,
        });
    });
});

// Rest of your background.js logic...

// Rest of your background.js logic...
