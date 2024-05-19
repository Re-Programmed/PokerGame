
//Opens the home page and logs in with the provided info.
//Sends an alert about invalid username/passcode if no account is found.
function SignIn(username, passcode)
{
    API.GetUser(username).then(user => {
        if(user != null && user.passcode == btoa(btoa(btoa(passcode))))
        {
            LocalStorage.SetCurrentAccount(user);
            window.open('../home/index.html', '_self');
        }else{
            alert('Invalid username or passcode.')
        }
    })
}

window.addEventListener('load', function () {
    LoadSwipe(1);
    SetBackgroundScroll(0.25);

    //If the page loaded with the invalid param, don't attempt to auto log in.
    if(GetURLParam('invalid') == "true"){return;}

    const acc = LocalStorage.GetCurrentAccount();
    
    if(acc != null && acc != undefined && acc != "null")
    {
        window.open('../home/index.html', '_self');
    }
})