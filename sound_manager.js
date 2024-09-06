const SOUNDS = {
    SwitchButton: "switch_button.mp3",
    PressButton: "button_press.mp3",
    Swipe: "swipe.mp3",
    Crumple: "crumple.mp3",
    SquareUp: "sq_up.wav",
    SineUp: "sine_up.mp3",
    PackJingle: "pack_jingle.mp3",
    Chip: "chip_effect.mp3",
    SingleChip: "single_chip.mp3",
    Music_Chill_All: "music_tracks/BrassMain.mp3",
    Music_Chill_AllPiano: "music_tracks/ChillDrums_ChordPiano_MelodyPiano.mp3",
    Music_Chill_Chords: "music_tracks/ChillDrums_ChordPiano.mp3",
    Music_Chill_Melody: "music_tracks/ChillDrums_MelodyPiano.mp3",
    Music_Chill_Drums: "music_tracks/ChillDrums.mp3",
    Music_Chill_NoDrums: "music_tracks/ChordPiano_MelodyPiano.mp3",
    Music_Chill_MoreDrums: "music_tracks/IncreasedDrums_ChordPiano_MelodyPiano.mp3",
    Music_FinalBeat: "music_tracks/FinalBeat.mp3",
    Music_MainTheme: "music_tracks/fruit_in_flight_main_theme.mp3",
    Music_Contemplation: "music_tracks/thinking.mp3"
}

var CurrentLoopingSound = null;

//if onEnd is true, will update AudioEndChecker
function PlaySound(sound, loop = false)
{
    if(!CanPlaySound()){return;}

    console.warn("PLAYING: " + sound);
    var a = new Audio("../assets/sounds/" + sound);
    soundManager_handleAudio(a, loop);
}

function soundManager_handleAudio(a, loop = false)
{
    //In case of error.
    a.play().catch(e => {
        setTimeout(function () {
            soundManager_handleAudio(a, loop);
        }, 1000)
    })

   a.loop = loop;
   if(a.loop){CurrentLoopingSound = a; console.warn("CHANGED LOOPER;");console.warn(CurrentLoopingSound)}
}

//Give all buttons a sound.
window.addEventListener('load', function () {
    this.setTimeout(function () {
        Array.from(document.getElementsByTagName("button")).forEach(button => {
            button.addEventListener('click', function () {
                PlaySound(SOUNDS.PressButton);
            })
        });
    }, 500)
})

//Checks settings to ensure sound is enabled.
function CanPlaySound()
{
    if (typeof pthe_0x155_cU == 'undefined') {
        return true;
    }

    var currentSettings = JSON.parse(localStorage.getItem("poker_game_settings_" + pthe_0x155_cU.username));

    if(currentSettings == null)
    {
        currentSettings = {};
    }

    return currentSettings.enableaudio == undefined ? true : currentSettings.enableaudio;
}