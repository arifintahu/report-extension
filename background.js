function countSuccessRate(api, extension_id, unresolved) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report/unresolved?extension_id=${extension_id}&status=1`, {
            method: 'GET'
        }).then(async (response) => {
            const resolved  = await response.json();
            const reported  = resolved+unresolved;
            const success   = unresolved ? Math.round(resolved*100*100/reported)/100 : 0;
            resolve({
                unresolved: unresolved,
                resolved: resolved,
                reported: reported,
                success: `${success}%`
            });
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function countUnresolved(api, extension_id) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report/unresolved?extension_id=${extension_id}&status=0`, {
            method: 'GET'
        }).then((response) => {
            resolve(response.json());
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function getData(api) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            resolve(response.json());
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

function postData(api, data) {
    return new Promise((resolve, reject) => {
        fetch(`${api}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status == 200) {
                resolve(true);
            } else {
                reject(response.status);
            }
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    const api = 'http://localhost:8080';

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.function == 'postData') {
            postData(api, {
                ... request.data,
                status: 0,
                extension_id: sender.id
            }).then((result) => {
                console.log('result : ', result);
                sendResponse({
                    message: result
                });
            }).catch((error) => {
                console.log(error);
                sendResponse({
                    error: error
                });
            });
            return true;
        } else if (request.function == 'getData') {
            getData(api).then((result) => {
                console.log('result : ', result);
                sendResponse({
                    message: result
                });
            }).catch((error) => {
                console.log(error);
                sendResponse({
                    error: error
                });
            });
            return true;
        } else if (request.function == 'countUnresolved') {
            countUnresolved(api, sender.id).then((unresolved) => {
                countSuccessRate(api, sender.id, unresolved).then((result) => {
                    console.log('result : ', result);
                    sendResponse(result);
                }).catch((error) => {
                    console.log(error);
                    sendResponse({
                        unresolved: unresolved
                    });
                });
            }).catch((error) => {
                console.log(error);
                sendResponse({
                    unresolved: '-'
                });
            });
            return true;
        }
    });
});