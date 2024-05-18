window.addEventListener('load', function () {
    const acc = LocalStorage.GetCurrentAccount();
    if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
    {
        window.open('../signin/index.html?invalid=true', "_self")
    }

    API.GetUser(acc.username).then(user => {
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }
    })
    
    
})