function postData(api, data) {
    return new Promise((resolve, reject) => {
        fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            resolve(response.json());
        }).catch((error) => {
            reject('Error : ', error);
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    const api = 'https://api-mirror.herokuapp.com';

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.function == 'postData') {
            postData(api, {
                ... request.data,
                extension_id: sender.id
            }).then((result) => {
                console.log('result : ', result);
            }).catch((error) => {
                console.log(error);
            });
        }
        sendResponse({
            message: 'sent'
        });
    });
});