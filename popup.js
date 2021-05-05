document.addEventListener('DOMContentLoaded', function() {
    var sendButton      = document.getElementById('sendReport');
    var inputIssue      = document.getElementById('aligned-issue');
    var inputSummary    = document.getElementById('aligned-summary');
    var numUnresolved   = document.getElementById('num-unresolved');
    var numResolved     = document.getElementById('num-resolved');
    var numReported     = document.getElementById('num-reported');
    var numSuccess      = document.getElementById('num-success');

    chrome.runtime.sendMessage({
        function: 'countUnresolved',
        data: {}
    }, function(response) {
        if (response) {
            numUnresolved.innerHTML = response.unresolved ? response.unresolved : '0';
            numResolved.innerHTML   = response.resolved ? response.resolved : '0';
            numReported.innerHTML   = response.reported ? response.reported : '0';
            numSuccess.innerHTML    = response.success ? response.success : '0';
        }
    });

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
                chrome.runtime.sendMessage({
                    function: 'countUnresolved',
                    data: {}
                }, function(response) {
                    if (response.count) {
                        numUnreolved.innerHTML = response.count;
                    }
                });
            });
        });
    }, false);
}, false);