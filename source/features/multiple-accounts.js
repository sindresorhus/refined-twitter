import { getUsername, getUserImage } from '../libs/utils';

function accountAlreadyExist() {
    
}

function setLocalStorage(newAccount) {
    const { localStorage } = window;
    const existingAccounts = JSON.parse(localStorage.getItem("activeAccounts"));
    const updatedAccounts = Object.assign(existingAccounts, newAccount);

    localStorage.setItem("activeAccounts", JSON.stringify(updatedAccounts));
}

function getAccessTokens() {
    return new Promise((res,rej) => {
        chrome.runtime.sendMessage({message: "reqAccessToken"}, function(response) {
            const { key, token } = response;
            res({key, token})
            return true;
        });
    }).catch(e => e);
}

function createUserData() {
    const userImage = getUserImage();

    return getAccessTokens().then(data => ({
        [userName]: {
            key: data.key,
            token: data.token,
            userImage
        }
    }))
}

const multipleAccounts = function(){
    const userName = getUsername();

    const currentAccount = createUserData().then(data => data);


}

export default multipleAccounts;

// https://pbs.twimg.com/profile_images/881262893836242946/r4czN0MR_normal.jpg
// https://pbs.twimg.com/profile_images/881262893836242946/r4czN0MR_400x400.jpg