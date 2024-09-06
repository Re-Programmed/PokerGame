const ls_0x15 = {
    ls_0x15_gca: function () {
        return JSON.parse(localStorage.getItem('pokerapp_081924801948_current_account'));
    },

    ls_0x15_sca: function (ls_0x15_sca_ca) {
        return localStorage.setItem('pokerapp_081924801948_current_account', JSON.stringify(ls_0x15_sca_ca));
    },

    ls_0x15_urld: function (rd)
    {
        localStorage.setItem("pokerapp_081924801948_current_room_" + pthe_0x155_U.username, JSON.stringify(rd));
    },

    ls_0x15_rrld: function ()
    {
        return JSON.parse(localStorage.getItem("pokerapp_081924801948_current_room_" + pthe_0x155_U.username));
    }
}
const _bbb = atob('aHR0cHM6Ly8zYzYwdG1rc3piLmV4ZWN1dGUtYXBpLnVzLXdlc3QtMi5hbWF6b25hd3MuY29t');
const rc_0x01623 = {
    rc_0x01623_gi: async function (id) {
        const a = await fetch(_bbb + '/default/getchat?table=PokerGame&id=' + id);
        const data = await a.json();
        return data;
    },

    rc_0x01623_si: async function(id, data) {
        const a = await fetch(_bbb + '/default/updatechat?table=PokerGame&id=' + id + "&data=" + data);
        return a;
    },

    rc_0x01623_gu: async function (rc_0x01623_gu_eu)
    {
        var data = await this.rc_0x01623_gi("user_" + rc_0x01623_gu_eu);
        if(data == null){return null;}
        const u = JSON.parse(atob(data.data));
        u.username = rc_0x01623_gu_eu;
        u.passcode = btoa(btoa(btoa(u.passcode)));
        return u;
    },

    rc_0x01623_uu: async function (rc_0x01623_nu)
    {
        var user = JSON.parse(JSON.stringify(rc_0x01623_nu));
        delete user.username;
//QmFzZSA2NCBpcyBub3QgZW5jcnlwdGlvbiE=
        user.passcode = atob(atob(atob(user.passcode)));

        const a = await this.rc_0x01623_si("user_" + rc_0x01623_nu.username, btoa(JSON.stringify(user)));
        return a;
    },

    rc_0x01623_scan: 0,
    rc_0x01623_gau: async function ()
    {
        ScanAttempts = 0;

        const data = await fetch('https://tjdzerjw9f.execute-api.us-west-2.amazonaws.com/default?table=PokerGame');

        const u = await data.json();

        if(u == null || u == "null" || u == undefined)
        {
            if(this.rc_0x01623_scan > 10){ return null; }
            this.rc_0x01623_scan++;
            return await this.rc_0x01623_gau();
        }

        var rc_0x01623_ua_check = []
        for(var i = 0; i < u.Count; i++)
        {
            var item = u.Items[i];
            if(item.id.startsWith("user_"))
            {
                const u = JSON.parse(atob(item.data));
                u.username = item.id.replace("user_", "");
                delete u.passcode;
                rc_0x01623_ua_check.push(u);
            }
        }

        return rc_0x01623_ua_check;
    },

    rc_0x01623_gar: async function () {
        this.ScanAttempts = 0;

        const data = await fetch('https://tjdzerjw9f.execute-api.us-west-2.amazonaws.com/default?table=PokerGame');

        const u = await data.json();

        if(u == null || u == "null" || u == undefined)
        {
            if(this.rc_0x01623_scan > 10){ return null; }
            this.rc_0x01623_scan++;
            return await this.rc_0x01623_gar();
        }

        var rc_0x01623_ra_check = []
        for(var i = 0; i < u.Count; i++)
        {
            var item = u.Items[i];
            if(item.id.startsWith("room_"))
            {
                const u = JSON.parse(atob(item.data));
                u.room_name = item.id.replace("room_", "");
                delete u.code;
                rc_0x01623_ra_check.push(u);
            }
        }

        return rc_0x01623_ra_check;
    },

    rc_0x01623_ur: async function (d) {
        var o_d = JSON.parse(JSON.stringify(d));
        delete o_d.room_name;

        const a = await this.rc_0x01623_si("room_" + d.room_name, btoa(JSON.stringify(o_d)));
        return a;
    },

    rc_0x01623_gr: async function(d)
    {
        var data = await this.rc_0x01623_gi("room_" + d);
        if(data == null){return null;}

        const u = JSON.parse(atob(data.data));
        u.room_name = d;
        
        return u;
    },

    rc_0x01623_gl: async function () {
        const data = await this.rc_0x01623_gi("leaderboard");
        if(data == null){return null;}
        const u = JSON.parse(atob(data.data));
        return u;
    },

    rc_0x01623_sl: async function (d) {
        const data = await this.rc_0x01623_si("leaderboard", btoa(JSON.stringify(d)));
        return data;
    },

    test_12: async function ()
    {
        return await FAKE_SERVER;
    },
    test_34: async function (d)
    {
        FAKE_SERVER = d;
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
    room_name: "Cool Room",
    CurrentTurn: 1,
    CurrentBlind: 1,
    CurrentBet: 5,
    CurrentStage: 0,
    RoundsPlayed: 0,
    QueuedBets: [

    ],
    AllIn: [

    ],
    Creator: "Will",
    MinimumBet: 5,
    PlayerCards: [
        {c1: null, c2: null},
        {c1: null, c2: null},
        {c1: null, c2: null},
        {c1: null, c2: null}
    ],
    Folded: []
}
