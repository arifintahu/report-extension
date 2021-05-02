function sendMessage(data) {
    chrome.runtime.sendMessage({ payload: data }, function(response) {
        console.log(response);
    });
}

async function postData(targetUrl, data = {}) {
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    return new Promise((resolve, reject) => {
        fetch(proxyUrl + targetUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            sendMessage({ok:true});
            resolve(response.json());
        }).catch((error) => {
            sendMessage(error);
            reject(error);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var sendButton      = document.getElementById('sendReport');
    var inputIssue      = document.getElementById('aligned-issue');
    var inputSummary    = document.getElementById('aligned-summary');

    sendButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            var api = 'https://webhook.site/aa54cf0f-fe4d-41a6-9016-b63e28d79189';
            postData(api, { 
                url: tabs[0].url ?  tabs[0].url : '',
                issue: inputIssue.value,
                summary: inputSummary.value
            }).then(data => {
                sendMessage({
                    status: 'done',
                    message: data
                });
            }).catch(error => {
                sendMessage({
                    status: 'error',
                    message: error
                });
            });
        });
    }, false);
}, false);