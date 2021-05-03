function sendMessage(data) {
    chrome.runtime.sendMessage({ payload: data }, function(response) {
        console.log(response);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var sendButton      = document.getElementById('sendReport');
    var inputIssue      = document.getElementById('aligned-issue');
    var inputSummary    = document.getElementById('aligned-summary');

    sendButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({
                function: 'postData',
                data: {
                    url: tabs[0].url ?  tabs[0].url : '',
                    issue: inputIssue.value,
                    summary: inputSummary.value
                }
            }, function(response) {
                console.log(response);
            });
        });
    }, false);
}, false);