chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request);
            sendResponse({
            	message: 'sent'
        	});
        }
    );
});