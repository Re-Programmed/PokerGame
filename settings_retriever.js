function GetSetting(username, setting, defaultVal = false)
{
    var currentSettings = JSON.parse(localStorage.getItem("poker_game_settings_" + currentUser.username));

    if(currentSettings == null)
    {
        currentSettings = {};
    }

    return currentSettings[setting] == undefined ? defaultVal : currentSettings[setting];
}