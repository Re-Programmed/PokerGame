var pu_0x023_CC = [0, 0, 0, 0, 0]

var pu_0x023_CPC = []

var pu_0x023_CV = [
    1,
    10,
    25,
    50,
    100
]

var pu_0x023_MC = [
    1,
    10,
    25,
    50,
    100
]

const CHIP_SETS = {
    DefaultSet: {
        folder: "default_set",
        chipNames: [
            "White Chip",
            "Red Chip",
            "Green Chip",
            "Blue Chip",
            "Black Chip"
        ]
    }
}

var CurrentChipSet = CHIP_SETS.DefaultSet;const PLAYER_HTML_ATTRIBS = `<div id="%p%_attribs" style="width: 100%; height: 16px;"></div>`
const PLAYER_HTML = `

    <h3 id="player_%p%_name_display">%username%</h3>
    <div id="player_%p%_cards" class="player_cards_display"><img src=\"%c1dest%\" width=\"35\" height=\"50\" class=\"no_interpolation\"><img src=\"%c2dest%\" width=\"35\" height=\"50\" class=\"no_interpolation\"></div>
    <p style="display:inline;font-size: 0.5em;" id="player_%p%_hand"></p>
    <div style="border: 3px solid #222222; background-color: #182920; height: 17px;"><p id="player_%p%_chipcount" style="transform: translateY(-17px); text-align: center;">%chips%</p></div>
`

var CurrentChipMenu = null;function pu_0x023_func_cpd(pu_0x023_func_cpd_1, pu_0x023_func_cpd_2)
{    
    var st_im = $("#player_" + pu_0x023_func_cpd_1 + "_cards>img:first-child").attr("src");    var st_im2 = $("#player_" + pu_0x023_func_cpd_1 + "_cards>img:last-child").attr("src");    var st_uc = (st_im != undefined && st_im != '../assets/cards/back.png');    var ht = PLAYER_HTML;    if(pu_0x023_func_cpd_2.icon != null && pu_0x023_func_cpd_2.icon != undefined && pu_0x023_func_cpd_2.icon != "" && pu_0x023_func_cpd_2.icon != "null")
    {
        ht = PLAYER_HTML_ATTRIBS + `<img src="%icon%">` + ht;    }else{
        ht = PLAYER_HTML_ATTRIBS + ht;    }

    var st_uHTML = pu_0x023_func_cpd_2.username;    if(pu_0x023_func_cpd_2.customize.NameColor != 'default')
    {
        st_uHTML = `<span style="color: ${pu_0x023_func_cpd_2.customize.NameColor.startsWith("#") ? pu_0x023_func_cpd_2.customize.NameColor : "#" + pu_0x023_func_cpd_2.customize.NameColor};">` + st_uHTML + "</span>";    }

    if(pu_0x023_func_cpd_2.customize.Font != 'default')
    {
        st_uHTML = `<span style="font-family: ${pu_0x023_func_cpd_2.customize.Font};">` + st_uHTML + "</span>";    }

    ht = ht.replace("%icon%", atob(pu_0x023_func_cpd_2.icon)).replace(/%username%/g, censorText(st_uHTML)).replace(/%chips%/g, pu_0x023_func_cpd_2.chips).replace(/%p%/g, pu_0x023_func_cpd_1);    if(!st_uc)
    {
        st_im = '../assets/cards/back.png';        st_im2 = '../assets/cards/back.png';    }

    ht = ht.replace("%c1dest%", st_im).replace("%c2dest%", st_im2);    

    $(`#player_${pu_0x023_func_cpd_1}_display`).html(ht).attr("class", "player_display");    if(pu_0x023_func_cpd_2.customize.BGColor != 'default')
    {
        document.getElementById(`player_${pu_0x023_func_cpd_1}_display`).setAttribute("style", "background-color: " + (pu_0x023_func_cpd_2.customize.BGColor.startsWith("#") ? pu_0x023_func_cpd_2.customize.BGColor : "#" + pu_0x023_func_cpd_2.customize.BGColor) + ";");    }
}


function pu_0x023_func_acts(pu_0x023_func_acts_1, pu_0x023_func_acts_2 = false, pu_0x023_func_acts_3 = false)
{
    const st_f = Math.random() < 0.5;    const st_cd = $(`#chip_${pu_0x023_func_acts_1}_display`);    const st_nc = document.createElement("img");    st_nc.classList = "no_interpolation " + (st_f ? "chip_f" : "chip")
    st_nc.style = `top: ${40 - pu_0x023_CC[pu_0x023_func_acts_1 - 1] * 4}px;`;    pu_0x023_CC[pu_0x023_func_acts_1 - 1]++;    var st_cff = CurrentChipSet.folder;        

    for(var i = 0; i < pthe_0x155_cU.customize.Set.length; i++)
    {
        const st_st = pthe_0x155_cU.customize.Set[i];        if(st_st >= 0)
        {
            const st_cat = MAIN_CATALOG[st_st];            if(st_cat.Data.replaces.includes(pu_0x023_func_acts_1))
            {
                st_cff = st_cat.Data.value;                break;            }
        }
    }

    st_nc.src = "../assets/chips/" + st_cff + "/" + pu_0x023_func_acts_1 + ".png";    AddTooltipElement(st_nc, `<h3>${CurrentChipSet.chipNames[pu_0x023_func_acts_1 - 1]}</h3><p style="transform: translateY(-7px);">${pu_0x023_CV[pu_0x023_func_acts_1 - 1]} = $${pu_0x023_MC[pu_0x023_func_acts_1 - 1]}</p>`)

    st_nc.setAttribute("val", pu_0x023_func_acts_1);    st_nc.addEventListener('click', pu_0x023_func_hand_ch);    st_cd.append(st_nc);}


function pu_0x023_func_rcfs(pu_0x023_func_rcfs_1)
{
    if(pu_0x023_CC[pu_0x023_func_rcfs_1 - 1] <= 0){ return false; }
    pu_0x023_CC[pu_0x023_func_rcfs_1 - 1]--;    const st_cd = $(`#chip_${pu_0x023_func_rcfs_1}_display`);    st_cd.find(":last-child").remove();    return true;}

function pu_0x023_func_acvts(pu_0x023_func_acvts_1)
{
    var st_c = []
    
    for(var i = pu_0x023_CV.length - 1; i >= 0; i--)
    {
        st_c.push(Math.floor(pu_0x023_func_acvts_1 / pu_0x023_CV[i]));        pu_0x023_func_acvts_1 = pu_0x023_func_acvts_1 % pu_0x023_CV[i];    }

    for(var c = 0; c < st_c.length; c++)
    {
        for(var st_a = 0; st_a < st_c[c]; st_a++)
        {
            pu_0x023_func_acts(st_c.length - c, false, true);        }
    }

    PlaySound(SOUNDS.Chip);}

function pu_0x023_func_rcvfs(pu_0x023_func_rcvfs_1, pu_0x023_func_rcvfs_2 = [0, 0, 0, 0, 0])
{
    const st_ov = pu_0x023_func_rcvfs_1;    var st_c = []

    for(var i = pu_0x023_CV.length - 1; i >= 0; i--)
    {
        var st_a = Math.floor(pu_0x023_func_rcvfs_1/pu_0x023_CV[i]);        st_c[i] = st_a > pu_0x023_CC[i] ? pu_0x023_CC[i] : st_a;        pu_0x023_func_rcvfs_2[i] += st_c[i];        pu_0x023_func_rcvfs_1 -= st_c[i] * pu_0x023_CV[i];    }

    if(pu_0x023_func_rcvfs_1 > 0)
    {
        for(var i = pu_0x023_CC.length - 1; i >= 1; i--)
        {
            if(pu_0x023_CC[i] > 0)
            {
                pu_0x023_func_rcfs(i + 1);                var st_v = pu_0x023_CV[i];                for(var c = i - 1; c >= 0; c--)
                {
                    if(st_v == 0){break;}
                    const add = Math.floor(st_v / pu_0x023_CV[c]);                    st_v = st_v % pu_0x023_CV[c];                    for(var v = 0; v < add; v++)
                    {
                        pu_0x023_func_acts(c + 1);                    }
                }

                for(var i = 0; i < st_c.length; i++)
                {
                    for(var st_a0x15 = 0; st_a0x15 < st_c[i]; st_a0x15++)
                    {
                        pu_0x023_func_rcfs(i + 1);                    }
                }

                return pu_0x023_func_rcvfs(pu_0x023_func_rcvfs_1, pu_0x023_func_rcvfs_2);            }
        }
    }


    for(var i = 0; i < st_c.length; i++)
    {
        for(var st_a0x15 = 0; st_a0x15 < st_c[i]; st_a0x15++)
        {
            pu_0x023_func_rcfs(i + 1);        }
    }

    pu_0x023_cc_chip();    return pu_0x023_func_rcvfs_2;}

function pu_0x023_func_ctcv()
{
    var st_t = 0;    for(var st_c = 0; st_c < pu_0x023_CC.length; st_c++)
    {
        st_t += pu_0x023_CC[st_c] * pu_0x023_CV[st_c];    }

    return st_t;}

function pu_0x023_cc_chip()
{
    const st_tv = pu_0x023_func_ctcv();    for(var st_c = 0; st_c < pu_0x023_CC.length; st_c++)
    {
        var st_nz = true;        while(st_nz)
        {
            st_nz = pu_0x023_func_rcfs(st_c + 1);        }
        
    }

    pu_0x023_func_acvts(st_tv);}

function pu_0x023_func_hand_ch()
{
    PlaySound(SOUNDS.SingleChip);    if(CurrentChipMenu != null){CurrentChipMenu.remove();}

    const st_HTML_0x15 = document.createElement('div');    st_HTML_0x15.id = "chip_menu";    st_HTML_0x15.innerHTML = `
        <button val="${this.getAttribute("val")}" onclick="pu_0x023_func_bc(this.getAttribute('val'));PlaySound(SOUNDS.Chip);">Break</button>
        <button onclick="pu_0x023_func_actp(this.getAttribute('val'))" val="${this.getAttribute("val")}">Add</button>
    `

    st_HTML_0x15.style = "position: fixed; top: " + LastMousePosition.Y + "px; left: " + LastMousePosition.X + "px;";    document.body.appendChild(st_HTML_0x15);    CurrentChipMenu = st_HTML_0x15;}

function pu_0x023_func_bc(pu_0x023_func_bc_1)
{
    if(pu_0x023_func_bc_1 <= 1){return;}

    if(pu_0x023_CC[pu_0x023_func_bc_1 - 1] > 0)
    {
        pu_0x023_func_rcfs(pu_0x023_func_bc_1);        var val = pu_0x023_CV[pu_0x023_func_bc_1 - 1];        for(var c = pu_0x023_func_bc_1 - 2; c >= 0; c--)
        {
            if(val == 0){break;}
            const add = Math.floor(val / pu_0x023_CV[c]);            val = val % pu_0x023_CV[c];            for(var v = 0; v < add; v++)
            {
                pu_0x023_func_acts(c + 1);            }
        }
    }
}

window.addEventListener('click', function (event) {
    if(CurrentChipMenu != null && event.target != CurrentChipMenu && !(event.target.attributes.length > 0 && (event.target.attributes[0].nodeValue.includes("chip") || event.target.attributes[0].nodeValue.includes("chip_f"))))
    {
        CurrentChipMenu.remove();    }
})

const PLAYER_ATTRIBUTES = {
    BigBlind: { icon: "big_blind_chip.png", ToolTip: "<h4>Big Blind</h4><p style=\"transform: translateY(-7px);\">Must Bet</p>" },
    House: { icon: "house_chip.png", ToolTip: "<h4>House</h4><p style=\"transform: translateY(-7px);\">Created The Room</p>"}
}

function pu_0x023_func_attr_apa(pu_0x023_func_attr_apa_1, pu_0x023_func_attr_apa_2)
{
    const st_at = document.createElement('img')
    st_at.classList = "no_interpolation attrib_display";    st_at.src = `../assets/chips/${CurrentChipSet.folder}/${pu_0x023_func_attr_apa_2.icon}`;    AddTooltipElement(st_at, pu_0x023_func_attr_apa_2.ToolTip);    $(`#${pu_0x023_func_attr_apa_1}_attribs`).append(st_at);}

function pu_0x023_func_attr_capa()
{
    for(var v = 1; v <= 4; v++)
    {
        if(document.getElementById(`${v}_attribs`) == null){continue;}
        document.getElementById(`${v}_attribs`).innerHTML = "";    }
}

var pu_0x023_PV = 0;var pu_0x023_CB = 0;function pu_0x023_func_actpd(pu_0x023_func_actpd_1, pu_0x023_func_actpd_2 = false, pu_0x023_func_actpd_3 = -1)
{
    if(pu_0x023_func_actpd_3 > 0 && pu_0x023_PV + pu_0x023_CV[pu_0x023_func_actpd_1 - 1] > pu_0x023_func_actpd_3){return;}

    if(!pu_0x023_func_actpd_2)
    {
        pu_0x023_CPC.push(pu_0x023_func_actpd_1);    }

    pu_0x023_PV += pu_0x023_CV[pu_0x023_func_actpd_1 - 1];    var x = (Math.random() * 180);    var y = (Math.random() * 180);    const flip = Math.random() < 0.5;    const st_nc = document.createElement("img");    st_nc.classList = "no_interpolation pot_chip";    st_nc.setAttribute("p", Math.floor(x + y));    st_nc.addEventListener("click", pu_0x023_func_pupc);    st_nc.style = `position: fixed; top: ${y}px; left: ${x}px;`
    
    var st_cs = false;    if(pthe_0x155_func_imt())
    {
        if(pthe_0x155_cU != undefined)
        {
            if(pthe_0x155_cU.customize != undefined)
            {
                if(pthe_0x155_cU.customize.Set.length > 1)
                {
                    for(var i = 0; i < pthe_0x155_cU.customize.Set.length; i++)
                    {
                    }
                }
            }
        }
    }

    if(!st_cs)
    {
        st_nc.src = "../assets/chips/" + CurrentChipSet.folder + "/" + pu_0x023_func_actpd_1 + ".png";    }

    AddTooltipElement(st_nc, `<h3>${CurrentChipSet.chipNames[pu_0x023_func_actpd_1 - 1]}</h3><p style="transform: translateY(-7px);">${pu_0x023_CV[pu_0x023_func_actpd_1 - 1]} = $${pu_0x023_MC[pu_0x023_func_actpd_1 - 1]}</p>`)

    st_nc.setAttribute("val", pu_0x023_func_actpd_1);    $("#pot").append(st_nc);}

var pu_0x023_QB = []
var pu_0x023_UOC = 0

function pu_0x023_func_actp(pu_0x023_func_actp_1, pu_0x023_func_actp_2 = false)
{
    if(!pthe_0x155_func_imt()){return;}
    if(pthe_0x155_cB && pthe_0x155_GD.CurrentBet < pu_0x023_CB + pu_0x023_CV[pu_0x023_func_actp_1 - 1]){ return; }

    PlaySound(SOUNDS.Chip);    pu_0x023_UOC += pu_0x023_CV[pu_0x023_func_actp_1 - 1];    if(pu_0x023_UOC > 0)
    {
        $("#turn_details_info").css("color", "lightgreen");    }else if(pu_0x023_UOC == 0)
    {
        $("#turn_details_info").css("color", "lightblue");    }else{
        $("#turn_details_info").css("color", "red");    }

    $("#turn_details_info").text(pu_0x023_UOC > 0 ? (`+${pu_0x023_UOC}`) : (pu_0x023_UOC == 0 ? "0" : `${pu_0x023_UOC}`))

    pu_0x023_CB += pu_0x023_CV[pu_0x023_func_actp_1 - 1];    pu_0x023_func_actpd(pu_0x023_func_actp_1);    if(!pu_0x023_func_actp_2)
    {
        pu_0x023_func_rcfs(pu_0x023_func_actp_1);    }

    pu_0x023_QB.push(pu_0x023_func_actp_1);}

function pu_0x023_func_slgs()
{
    const pu_0x023_func_slgs_1 = {
        QueuedBets: pu_0x023_QB,
        WasMyTurn: pthe_0x155_WMT,
        UpsetOfCurrent: pu_0x023_UOC,
        RoomName: pthe_0x155_GD.room_name,
        LastRoomRound: pthe_0x155_GD.RoundsPlayed,
        LastRoomEvent: pthe_0x155_GD.CurrentStage,
        MyCards: pthe_0x155_u_MC,
        ChipCount: pu_0x023_CC,
        CurrentBet: pu_0x023_CB,
        CurrentPotChips: pu_0x023_CPC,
        checkingBets: pthe_0x155_cB,
        Folded: pthe_0x155_p_F,
        showingCards: pthe_0x155_p_sC,
        IHaveShownCards: pthe_0x155_p_IHSC,
        ICanRecieveWinnings: pthe_0x155_p_ICRW,
        WaitingScreenDisplayed: pthe_0x155_WSD,
        wasWaiting: pthe_0x155_wW
    }

    ls_0x15.ls_0x15_urld(pu_0x023_func_slgs_1);}

function CheckIsValidRoomLocalData()
{
    const pu_0x023_var = ls_0x15.ls_0x15_rrld();    if(pu_0x023_var.RoomName != current_room || pu_0x023_var.LastRoomRound != pthe_0x155_GD.RoundsPlayed || pu_0x023_var.LastRoomEvent != pthe_0x155_GD.CurrentStage)
    {
        return false;    }

    return true;}

function pu_0x023_func_llgs(pu_0x023_func_llgs_1)
{
    const pu_0x023_func_llgs_st_1 = ls_0x15.ls_0x15_rrld();    if(pu_0x023_func_llgs_st_1 == null || pu_0x023_func_llgs_st_1 == undefined){return false;}

    if(pu_0x023_func_llgs_st_1.RoomName != pu_0x023_func_llgs_1)
    {
        return false;    }

    if(pu_0x023_func_llgs_st_1.LastRoomRound != pthe_0x155_GD.RoundsPlayed)
    {
        return false;    }
    
    for(var v = 0; v < pu_0x023_func_llgs_st_1.ChipCount.length; v++)
    {
        for(var amnt = 0; amnt < pu_0x023_func_llgs_st_1.ChipCount[v]; amnt++)
        {
            pu_0x023_func_acts(v + 1);        }
    }

    DrawCardsToHand(pu_0x023_func_llgs_st_1.MyCards);    pthe_0x155_WSD = pu_0x023_func_llgs_st_1.WaitingScreenDisplayed;    pthe_0x155_WMT = pu_0x023_func_llgs_st_1.WasMyTurn;    pu_0x023_UOC = pu_0x023_func_llgs_st_1.UpsetOfCurrent;    pthe_0x155_p_F = pu_0x023_func_llgs_st_1.Folded;    pthe_0x155_wW = pu_0x023_func_llgs_st_1.wasWaiting;    pthe_0x155_p_sC = pu_0x023_func_llgs_st_1.showingCards;    pthe_0x155_p_IHSC = pu_0x023_func_llgs_st_1.IHaveShownCards;    pthe_0x155_p_ICRW = pu_0x023_func_llgs_st_1.ICanRecieveWinnings;    pthe_0x155_cB = pu_0x023_func_llgs_st_1.checkingBets;    
     if(pu_0x023_UOC > 0)
    {
        $("#turn_details_info").css("color", "lightgreen");    }else if(pu_0x023_UOC == 0)
    {
        $("#turn_details_info").css("color", "lightblue");    }else{
        $("#turn_details_info").css("color", "red");    }

    $("#turn_details_info").text(pu_0x023_UOC > 0 ? (`+${pu_0x023_UOC}`) : (pu_0x023_UOC == 0 ? "0" : `${pu_0x023_UOC}`))

    pu_0x023_QB = pu_0x023_func_llgs_st_1.QueuedBets;    pu_0x023_CPC = pu_0x023_func_llgs_st_1.CurrentPotChips;    for(var b = 0; b < pu_0x023_CPC.length; b++)
    {
        pu_0x023_func_actpd(pu_0x023_CPC[b], true);    }

    pu_0x023_CB = pu_0x023_func_llgs_st_1.CurrentBet;    return true;}

function pu_0x023_func_gsclgs()
{
    const pu_0x023_func_gsclgs_st_1 = {
        QueuedBets: [],
        WasMyTurn: false,
        UpsetOfCurrent: 0,
        RoomName: "New Room",
        MyCards: [],
        ChipCount: [0, 0, 0, 0, 0],
        CurrentBet: 5,
        CurrentPotChips: [],
        Folded: false,
        showingCards: false,
        IHaveShownCards: false,
        ICanRecieveWinnings: false,
        WaitingScreenDisplayed: false,
        wasWaiting: false
    }

    ls_0x15.ls_0x15_urld(pu_0x023_func_gsclgs_st_1);}



function CreateScrollText(value, color = "#DDDDDD")
{
    const scrollText = document.createElement("div");    scrollText.style = `
        position: fixed;        top: 100%;        left: 50%;        transform: translate(-50%, 0);        padding: 7px;        text-align: center;    `

    scrollText.innerHTML = `<h1 style="color: ${color};">${value}</h1>`
    
    document.body.appendChild(scrollText);    const fadeInt = setInterval(function () {
        scrollText.style.top = (scrollText.style.top.replace("%", "") - 0.1) + "%"; 

        if(parseFloat(scrollText.style.top.replace("%", "")) > 50)
        {
            scrollText.style.color = "#DDDDDDFF";        }else{
            const value = parseInt((100 * ((scrollText.style.top.replace("%", "") + 50)/50)));            scrollText.style.color = "#DDDDDD" + value;            if(parseFloat(scrollText.style.top.replace("%", "")) < -50)
            {
                scrollText.remove();                clearInterval(fadeInt);            }
        }
    }, 1)
}

var pu_0x023_hPC = null
function pu_0x023_func_pupc(pu_0x023_func_pupc_1)
{
    if(!pthe_0x155_func_imt()){return;}

    PlaySound(SOUNDS.SingleChip);    if(pu_0x023_hPC != null)
    {
        pu_0x023_hPC = null;    }else{
        pu_0x023_hPC = this;    }

    pu_0x023_MUT = 0;    pthe_0x155_GD.G_Fun.x = pu_0x023_func_pupc_1.clientX;    pthe_0x155_GD.G_Fun.y = pu_0x023_func_pupc_1.clientY;    pthe_0x155_GD.G_Fun.p = pu_0x023_hPC == null ? pthe_0x155_GD.G_Fun.p : pu_0x023_hPC.getAttribute("p");    rc_0x01623.rc_0x01623_ur(pthe_0x155_GD);}

var pu_0x023_MUT = 0;window.addEventListener('mousemove', function (event) {
    if(pu_0x023_hPC != null)
    {
        pu_0x023_hPC.setAttribute("style", `position: fixed; top: ${event.clientY - window.innerHeight/2.3}px; left: ${event.clientX - window.innerWidth/2.18}px; transition-duration: 0s;z-index: 5;`);        pu_0x023_MUT++;        if(pu_0x023_MUT > 50)
        {
            pu_0x023_MUT = 0;            pthe_0x155_GD.G_Fun.x = event.clientX;            pthe_0x155_GD.G_Fun.y = event.clientY;            pthe_0x155_GD.G_Fun.p = pu_0x023_hPC.getAttribute("p");            rc_0x01623.rc_0x01623_ur(pthe_0x155_GD);        }
    }
})

function pu_0x023_func_game_vs()
{
    pu_0x023_func_game_vs_rc();    for(var x = 0; x < 3; x++)
    {
        setTimeout(() => {
            const st_wt = document.createElement("h1");            st_wt.textContent = "You Win!";        
            st_wt.setAttribute("class", "win_text");        
            setTimeout(() => {
                st_wt.remove();            }, 5000)
        
            document.body.appendChild(st_wt);        }, x * 100)
    }
}

function pu_0x023_func_game_vs_rc()
{
    const a = new Audio("../assets/sounds/victory_screen/chip_rain.mp3");    a.play();    setTimeout(() => {
        a.currentTime = 0;        a.play();    }, 2205)

    for(var y = 0; y < 200; y++)
    {
        setTimeout(() => {
            const st_c = document.createElement("img");            st_c.src = "../assets/chips/default_set/" + (Math.floor(Math.random() * 5) + 1) + ".png";            st_c.className = "no_interpolation";            st_c.width = "64";            st_c.height = "64";            const yPos = Math.random() * 100;            var xPos = -20;            const st_cfi = setInterval(() => {
                st_c.setAttribute("style", `position: fixed; top: ${xPos}%; left: ${yPos}%;`);                xPos++;                if(xPos > 100)
                {
                    st_c.remove();                    clearInterval(st_cfi);                }

                if(xPos == -18)
                {
                    document.body.appendChild(st_c);                }
            }, 5)

        }, Math.random() * y * 20);    }
}

var pu_0x023_CTT = 100;function pu_0x023_CTT_func_rm()
{
    pu_0x023_CTT--;    $("#timer_countdown").css('width', `${pu_0x023_CTT}%`)
}

var pu_0x023_tC = null;function pu_0x023_tC_func_btc(pu_0x023_tC_func_btc_1 = 0)
{
    pu_0x023_tC_func_ctt();    pu_0x023_CTT = 100;    pu_0x023_tC = setInterval(function () {
        if(pu_0x023_CTT < 1)
        {
            clearInterval(pu_0x023_tC);            pu_0x023_tC = null;            return;        }

        pu_0x023_CTT_func_rm();    },  (pu_0x023_tC_func_btc_1 + TURN_LENGTH_LIMIT) * 10);}

function pu_0x023_tC_func_ctt()
{
    if(pu_0x023_tC != null)
    {
        clearInterval(pu_0x023_tC);        pu_0x023_CTT = 100;        pu_0x023_tC = null;    }
}

window.addEventListener('load', function () {
  this.setTimeout(function () {
    this.setInterval(function () {
        UpdateMusicState();       }, 200)
  }, 3000)
})

var currentAudioStateValue = 0;var currentMusic = undefined;//Updates what the music is doing based on the current game.
function UpdateMusicState()
{
    if(pthe_0x155_GD.ShowingCards >= 0 || pthe_0x155_GD.CurrentStage > 4)
    {
        if(currentAudioStateValue == 6){return;}
        currentAudioStateValue = 6;        CurrentLoopingSound?.pause();        currentMusic = PlaySound(SOUNDS.Music_FinalBeat, true);    }else if(pthe_0x155_GD.Waiting)
    {
        if(currentAudioStateValue == 6){return;}
        if(currentAudioStateValue == 1){return;}
        currentAudioStateValue = 1;        CurrentLoopingSound?.pause();        currentMusic = PlaySound(SOUNDS.Music_Chill_Drums, true);    }else{
        if(pthe_0x155_GD.CurrentStage == 1)
        {
            if(currentAudioStateValue == 3){return;}
            currentAudioStateValue = 3;            CurrentLoopingSound?.pause();            switch(Math.floor(Math.random() * 3))
            {
                case 0:
                    currentMusic = PlaySound(SOUNDS.Music_Chill_AllPiano, true);                    break;                case 1:
                    currentMusic = PlaySound(SOUNDS.Music_Chill_MoreDrums, true);                    break;                case 2:
                    currentMusic = PlaySound(SOUNDS.Music_Chill_NoDrums, true);                    break;            }
        }else if(pthe_0x155_GD.CurrentStage == 2)
        {
            if(currentAudioStateValue == 4){return;}
            currentAudioStateValue = 4;            CurrentLoopingSound?.pause();            switch(Math.floor(Math.random() * 4))
            {
                case 0:
                    currentMusic = PlaySound(SOUNDS.Music_Chill_All, true);                    break;                case 1:
                    currentMusic = PlaySound(SOUNDS.Music_Chill_Melody, true);                    break;                case 2:
                    currentMusic = PlaySound(SOUNDS.Music_Chill_Chords, true);                    break;                case 3:
                    //Better odds.
                    currentMusic = PlaySound(SOUNDS.Music_Chill_All, true);                    break;            }
        }else if(pthe_0x155_GD.CurrentStage == 3)
            {
                if(currentAudioStateValue == 5){return;}
                currentAudioStateValue = 5;                CurrentLoopingSound?.pause();                switch(Math.floor(Math.random() * 6))
                {
                    case 0:
                        currentMusic = PlaySound(SOUNDS.Music_Contemplation, true);                        break;                    case 1:
                        currentMusic = PlaySound(SOUNDS.Music_Contemplation, true);                        break;                    case 2:
                        currentMusic = PlaySound(SOUNDS.Music_Chill_NoDrums, true);                        break;                    case 3:
                        currentMusic = PlaySound(SOUNDS.Music_Chill_Chords, true);                        break;                    case 4:
                        currentMusic = PlaySound(SOUNDS.Music_Contemplation, true);                        break;                    case 5:
                        currentMusic = PlaySound(SOUNDS.Music_Chill_AllPiano, true);                        break;                }
            } else{
            if(currentAudioStateValue == 2){return;}
            currentAudioStateValue = 2;            CurrentLoopingSound?.pause();            currentMusic = PlaySound(SOUNDS.Music_Chill_Chords, true);        }
    }

   
    return true;}