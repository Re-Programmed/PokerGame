window.addEventListener('load', function () {
    LoadSwipe(-1);
    SetBackgroundScroll(0.25)

    //Check what account we are currently logged in on.
    const acc = LocalStorage.GetCurrentAccount();
    if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
    {
        window.open('../signin/index.html?invalid=true', "_self")
    }

    API.GetUser(acc.username).then(user => {
        //Does the user exist?
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }

        //Update icon.
        if(user.icon != null && user.icon != undefined && user.icon != "null")
        {
            $("#user_icon").attr("src", atob(user.icon));
        }

        //Update name.
        $("#user_username").text(user.username);
    })
    
    
})