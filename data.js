const LocalStorage = {
    GetCurrentAccount: function () {
        return JSON.parse(localStorage.getItem('pokerapp_081924801948_current_account'));
    },

    SetCurrentAccount: function (current_account) {
        return localStorage.setItem('pokerapp_081924801948_current_account', JSON.stringify(current_account));
    }
}

const API = {
    GetItem: async function (id) {
        const a = await fetch('https://3c60tmkszb.execute-api.us-west-2.amazonaws.com/default/getchat?table=PokerGame&id=' + id);
        const data = await a.json();
        return data;
    },

    SendItem: async function(id, data) {
        fetch('https://3c60tmkszb.execute-api.us-west-2.amazonaws.com/default/updatechat?table=PokerGame&id=' + id + "&data=" + data);
    },

    GetUser: async function (encodedUsername)
    {
        var data = await this.GetItem("user_" + encodedUsername);
        const u = JSON.parse(atob(data.data));
        u.username = encodedUsername;
        return u;
    },

    UpdateUser: async function (newUser)
    {
        var user = JSON.parse(JSON.stringify(newUser));
        delete user.username;

        this.SendItem("user_" + newUser.username, btoa(JSON.stringify(user)));
    }
}

function GetURLParam(param)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    if(!urlParams.has(param))
    {
        return null;
    }

    return urlParams.get(param);
}