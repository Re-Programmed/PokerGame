var CurrentTooltip = null

var TOOLTIP_OFFSET = {X: -75, Y: -176}

var LastMousePosition = { X: 0, Y: 0 }

function AddTooltipElement(element, tip)
{
    if(pthe_0x155_cU != undefined)
    {
        if(tooltipIDP_GetSetting(pthe_0x155_cU.username, "tooltips", true) != true)
        {
            return;
        }
    }
    
    element.setAttribute("tooltip", tip);

    element.addEventListener('mouseenter', function (event) { 

        if(CurrentTooltip != null)
        {
            CurrentTooltip.remove();
        }

        CurrentTooltip = document.createElement("div");
        CurrentTooltip.className = "tooltip"

        CurrentTooltip.innerHTML = this.getAttribute("tooltip")

        document.body.appendChild(CurrentTooltip);

    })

    element.addEventListener('mouseleave', function (event) {
        if(CurrentTooltip != null)
        {
            CurrentTooltip.classList += " tooltip_removed";
            const remove = CurrentTooltip;

            CurrentTooltip = null;
            
            setTimeout(() => {
                remove.remove();
            }, 1000 * 0.23);
        }
    })
}

window.addEventListener('mousemove', function (event) {
    if(CurrentTooltip != null)
    {
        $(CurrentTooltip).attr("style", `transform: translate(${event.clientX + TOOLTIP_OFFSET.X}px, ${event.clientY + TOOLTIP_OFFSET.Y}px);`);        
    }

    LastMousePosition = {X: event.clientX, Y: event.clientY};
})

function tooltipIDP_GetSetting(username, setting, defaultVal = false)
{
    var currentSettings = JSON.parse(localStorage.getItem("poker_game_settings_" + pthe_0x155_cU.username));

    if(currentSettings == null)
    {
        currentSettings = {};
    }

    return currentSettings[setting] == undefined ? defaultVal : currentSettings[setting];
}