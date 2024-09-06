

window.addEventListener('load', function () {
    SetXPBarDisplay(50);
})

function SetXPBarDisplay(value)
{
    $("#xp_level_value").attrib('style', `width: ${value}%;`);
}