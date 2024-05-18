function SignIn(username, passcode)
{
    API.GetUser(username).then(user => {
        if(user != null && user.passcode == passcode)
        {
            LocalStorage.SetCurrentAccount(user);
            window.open('../home/index.html', '_self');
        }else{
            alert('Invalid username or passcode.')
        }
    })
}

window.addEventListener('load', function () {
    if(GetURLParam('invalid') == "true"){return;}

    const acc = LocalStorage.GetCurrentAccount();
    
    if(acc != null && acc != undefined && acc != "null")
    {
        window.open('../home/index.html', '_self');
    }
})