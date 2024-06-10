//True if the user has modified any setting.
var changeWasMade = false;

const Settings = [
    {
        name: "Tooltips",
        input: "#enable_tooltips_input",
        value: true,
        InitGUI: function (savedSettings) {
            //Create graphics.
            $("#settings_container").append(`
                <div class="settings_option theme_bg_change">
                <h2>Tooltips</h2>
                <input id=\"enable_tooltips_input\" type=\"checkbox\" name=\"Enable Tooltips\" oninput="Settings[0].UpdateValue(this.checked);">
                <button style="float:right;" onclick="Settings[0].UpdateValue(true);">Default</button>
                </div>
                `);

            if(savedSettings.tooltips == undefined)
            {
                savedSettings.tooltips = this.value;
            }

            this.UpdateValue(savedSettings.tooltips, true);
        },

        UpdateValue: function (newValue, forceUpdate = false) {
            if(newValue == this.value && !forceUpdate){return;}
            this.value = newValue;
            $("#enable_tooltips_input").prop('checked', this.value);
            currentSavedSettings.tooltips = this.value;
            if(!forceUpdate)
            {
                changeWasMade = true;
                $(".settings_option").get()[1].style.color = "#55bee0";
            } 
        }
    },

    {
        name: "Allow Leaderboard Invites",
        input: "#allow_leaderboard_invites_input",
        value: true,
        InitGUI: function (savedSettings) {
            //Create graphics.
            $("#settings_container").append(`
                <div class="settings_option theme_bg_change">
                <h2>Allow Local Leaderboard Invites</h2>
                <input id=\"allow_leaderboard_invites_input\" type=\"checkbox\" name=\"Allow Leaderboard Invites\" oninput="Settings[1].UpdateValue(this.checked);">
                <button style="float:right;" onclick="Settings[1].UpdateValue(true);">Default</button>
                </div>
                `);

            if(savedSettings.allowleaderboardinvites == undefined)
            {
                savedSettings.allowleaderboardinvites = this.value;
            }

            this.UpdateValue(savedSettings.allowleaderboardinvites, true);
        },

        UpdateValue: function (newValue, forceUpdate = false) {
            if(newValue == this.value && !forceUpdate){return;}
            this.value = newValue;
            $("#allow_leaderboard_invites_input").prop('checked', this.value);
            currentSavedSettings.allowleaderboardinvites = this.value;
            if(!forceUpdate)
            {
                changeWasMade = true;
                $(".settings_option").get()[2].style.color = "#55bee0";
            }
        }
    }
]

var currentSavedSettings = null

window.addEventListener('load', function () {
    LoadSwipe(1);
    SetBackgroundScroll(0.25);

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
        
        currentUser = user;

        UpdateThemeOnLoad(currentUser);

        //Make the name at the top say "USERNAME's Settings"
        $(".settings_option>h2").text(user.username + "'s Settings");

        currentSavedSettings = JSON.parse(localStorage.getItem("poker_game_settings_" + currentUser.username));

        if(currentSavedSettings == null)
        {
            //Default setting.
            currentSavedSettings = {};
        }

        //Load all switches.
        for(var i = 0; i < Settings.length; i++)
        {
            Settings[i].InitGUI(currentSavedSettings);
        }

     });
})

//Save all settings before leaving.
window.addEventListener('beforeunload', function () {
    this.localStorage.setItem("poker_game_settings_" + currentUser.username, JSON.stringify(currentSavedSettings));
})