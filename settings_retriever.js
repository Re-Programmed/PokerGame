function GetSetting(setting, defaultVal = false)
{
    var currentSettings = JSON.parse(localStorage.getItem("poker_game_settings_" + pthe_0x155_cU.username));

    if(currentSettings == null)
    {
        currentSettings = {};
    }

    return currentSettings[setting] == undefined ? defaultVal : currentSettings[setting];
}