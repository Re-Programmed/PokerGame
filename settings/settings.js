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
                <input id=\"enable_tooltips_input\" type=\"checkbox\" name=\"Enable Tooltips\" oninput="Settings[0].UpdateValue(this.checked);PlaySound(SOUNDS.SwitchButton);">
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
                <input id=\"allow_leaderboard_invites_input\" type=\"checkbox\" name=\"Allow Leaderboard Invites\" oninput="Settings[1].UpdateValue(this.checked);PlaySound(SOUNDS.SwitchButton);">
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
    },

    {
        name: "Enable Audio",
        input: "#enable_audio_input",
        value: true,
        InitGUI: function (savedSettings)
        {
            $("#settings_container").append(`
                <div class="settings_option theme_bg_change">
                <h2>Enable Audio</h2>
                <input id=\"enable_audio_input\" type=\"checkbox\" name=\"Enable Audio\" oninput="Settings[2].UpdateValue(this.checked);PlaySound(SOUNDS.SwitchButton);">
                <button style="float:right;" onclick="Settings[2].UpdateValue(true);">Default</button>
                </div>
                `);

            if(savedSettings.enableaudio == undefined)
            {
                savedSettings.enableaudio = this.value;
            }

            this.UpdateValue(savedSettings.enableaudio, true);
        },

        UpdateValue: function (newValue, forceUpdate = false) {
            if(newValue == this.value && !forceUpdate){return;}
            this.value = newValue;
            $("#enable_audio_input").prop('checked', this.value);
            currentSavedSettings.enableaudio = this.value;

            if(this.value == false)
            {
                if(Settings[3].value == true){Settings[3].UpdateValue(false);}
            }

            if(!forceUpdate)
            {
                changeWasMade = true;
                $(".settings_option").get()[3].style.color = "#55bee0";
            }
        }
    },

    {
        name: "Enable Music In Menus",
        input: "#enable_menu_music",
        value: false,
        InitGUI: function (savedSettings)
        {
            $("#settings_container").append(`
                <div class="settings_option theme_bg_change">
                <h2>Enable Music In Menus</h2>
                <input id=\"enable_menu_music\" type=\"checkbox\" name=\"Enable Music In Menus\" oninput="Settings[3].UpdateValue(this.checked);PlaySound(SOUNDS.SwitchButton);">
                <button style="float:right;" onclick="Settings[3].UpdateValue(false);">Default</button>
                </div>
                `);

            if(savedSettings.enablemenumusic == undefined)
            {
                savedSettings.enablemenumusic = this.value;
            }

            this.UpdateValue(savedSettings.enablemenumusic, true);
        },

        UpdateValue: function (newValue, forceUpdate = false) {
            if(newValue == this.value && !forceUpdate){return;}
            this.value = newValue;
            $("#enable_menu_music").prop('checked', this.value);
            currentSavedSettings.enablemenumusic = this.value;

            if(this.value == true)
            {
                if(Settings[2].value == false){Settings[2].UpdateValue(true);}
            }

            if(!forceUpdate)
            {
                changeWasMade = true;
                $(".settings_option").get()[4].style.color = "#55bee0";
            }
        }
    },

    {
        name: "Mystery Setting",
        input: "#enable_mystery_setting",
        value: false,
        InitGUI: function (savedSettings)
        {
            $("#settings_container").append(`
                <div class="settings_option theme_bg_change">
                <h2>???</h2>
                <input id=\"enable_mystery_setting\" type=\"checkbox\" name=\"Enable Mystery Setting\" oninput="Settings[4].UpdateValue(this.checked);PlaySound(SOUNDS.SwitchButton);">
                <button style="float:right;" onclick="Settings[3].UpdateValue(false);">Default</button>
                </div>
                `);

            if(savedSettings.enablemysterysetting == undefined)
            {
                savedSettings.enablemysterysetting = this.value;
            }

            this.UpdateValue(savedSettings.enablemysterysetting, true);
        },

        UpdateValue: function (newValue, forceUpdate = false) {
            if(newValue == this.value && !forceUpdate){return;}
            this.value = newValue;
            $("#enable_mystery_setting").prop('checked', this.value);
            currentSavedSettings.enablemysterysetting = this.value;

            if(!forceUpdate)
            {
                changeWasMade = true;
                $(".settings_option").get()[5].style.color = "#55bee0";
            }
        }
    }
]

var currentSavedSettings = null

window.addEventListener('load', function () {
    pageMusicModifier = 2; //Drums only on settings page.

    LoadSwipe(1);
    SetBackgroundScroll(0.25);

     //Check what account we are currently logged in on.
     const acc = ls_0x15.ls_0x15_gca();
     if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
     {
        window.open('../signin/index.html?invalid=true', "_self")
     }

     rc_0x01623.rc_0x01623_gu(acc.username).then(user => {
        //Does the user exist?
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }
        
        pthe_0x155_cU = user;

        UpdateThemeOnLoad(pthe_0x155_cU);

        //Make the name at the top say "USERNAME's Settings"
        $(".settings_option>h2").text(user.username + "'s Settings");

        currentSavedSettings = JSON.parse(localStorage.getItem("poker_game_settings_" + pthe_0x155_cU.username));

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
    this.localStorage.setItem("poker_game_settings_" + pthe_0x155_cU.username, JSON.stringify(currentSavedSettings));
})