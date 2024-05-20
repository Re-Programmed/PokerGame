const LocalStorage = {
    GetCurrentAccount: function () {
        return JSON.parse(localStorage.getItem('pokerapp_081924801948_current_account'));
    },

    SetCurrentAccount: function (current_account) {
        return localStorage.setItem('pokerapp_081924801948_current_account', JSON.stringify(current_account));
    },

    UpdateRoomLocalData: function (rd)
    {
        localStorage.setItem("pokerapp_081924801948_current_room", JSON.stringify(rd));
    },

    RetrieveRoomLocalData: function ()
    {
        return JSON.parse(localStorage.getItem("pokerapp_081924801948_current_room"));
    }
}

const API = {
    GetItem: async function (id) {
        const a = await fetch('https://3c60tmkszb.execute-api.us-west-2.amazonaws.com/default/getchat?table=PokerGame&id=' + id);
        const data = await a.json();
        return data;
    },

    SendItem: async function(id, data) {
        const a = await fetch('https://3c60tmkszb.execute-api.us-west-2.amazonaws.com/default/updatechat?table=PokerGame&id=' + id + "&data=" + data);
        return a;
    },

    GetUser: async function (encodedUsername)
    {
        var data = await this.GetItem("user_" + encodedUsername);
        if(data == null){return null;}
        const u = JSON.parse(atob(data.data));
        u.username = encodedUsername;
        u.passcode = btoa(btoa(btoa(u.passcode)));
        return u;
    },

    UpdateUser: async function (newUser)
    {
        var user = JSON.parse(JSON.stringify(newUser));
        delete user.username;

        user.passcode = atob(atob(atob(user.passcode)));

        const a = await this.SendItem("user_" + newUser.username, btoa(JSON.stringify(user)));
        return a;
    },

    ScanAttempts: 0,
    GetAllUsers: async function ()
    {
        ScanAttempts = 0;

        const data = await fetch('https://tjdzerjw9f.execute-api.us-west-2.amazonaws.com/default?table=PokerGame');

        const u = await data.json();

        if(u == null || u == "null" || u == undefined)
        {
            if(this.ScanAttempts > 10){ return null; }
            this.ScanAttempts++;
            return await this.GetAllUsers();
        }

        var userArray = []
        for(var i = 0; i < u.Count; i++)
        {
            var item = u.Items[i];
            if(item.id.startsWith("user_"))
            {
                const u = JSON.parse(atob(item.data));
                u.username = item.id.replace("user_", "");
                delete u.passcode;
                userArray.push(u);
            }
        }

        return userArray;
    },

    GetAllRooms: async function () {
        this.ScanAttempts = 0;

        const data = await fetch('https://tjdzerjw9f.execute-api.us-west-2.amazonaws.com/default?table=PokerGame');

        const u = await data.json();

        if(u == null || u == "null" || u == undefined)
        {
            if(this.ScanAttempts > 10){ return null; }
            this.ScanAttempts++;
            return await this.GetAllRooms();
        }

        var roomArray = []
        for(var i = 0; i < u.Count; i++)
        {
            var item = u.Items[i];
            if(item.id.startsWith("room_"))
            {
                const u = JSON.parse(atob(item.data));
                u.room_name = item.id.replace("room_", "");
                delete u.code;
                roomArray.push(u);
            }
        }

        return roomArray;
    },

    UpdateRoom: async function (newRoom) {
        var room = JSON.parse(JSON.stringify(newRoom));
        delete room.room_name;

        const a = await this.SendItem("room_" + newRoom.room_name, btoa(JSON.stringify(room)));
        return a;
    },

    GetLeaderboard: async function () {
        const data = await this.GetItem("leaderboard");
        if(data == null){return null;}
        const u = JSON.parse(atob(data.data));
        return u;
    },

    GetRoom_TEST: async function ()
    {
        return await FAKE_SERVER;
    },
    SetRoom_TEST: async function (room)
    {
        FAKE_SERVER = room;
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

var FAKE_SERVER = {players:["Will", "Joe"],code:"",game:"poker",theme:"ptg",
    CurrentTurn: 1,
    CurrentBlind: 1,
    CurrentBet: 5,
    CurrentStage: 0,
    QueuedBets: [

    ],
    Creator: "Will",
    MinimumBet: 5
}
