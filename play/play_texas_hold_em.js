//EMPTY ROOM
//eyJwbGF5ZXJzIjpbIldpbGwiLCJKb2UiXSwiY29kZSI6IiIsImdhbWUiOiJwb2tlciIsInRoZW1lIjoicHRnIiwiQ3VycmVudFR1cm4iOjEsIkN1cnJlbnRCbGluZCI6MSwiQ3VycmVudEJldCI6NSwiQ3VycmVudFN0YWdlIjowLCJSb3VuZHNQbGF5ZWQiOjAsIlF1ZXVlZEJldHMiOltdLCJBbGxJbiI6W10sIkNyZWF0b3IiOiJXaWxsIiwiTWluaW11bUJldCI6NSwiUGxheWVyQ2FyZHMiOlt7ImMxIjpudWxsLCJjMiI6bnVsbH0seyJjMSI6bnVsbCwiYzIiOm51bGx9LHsiYzEiOm51bGwsImMyIjpudWxsfSx7ImMxIjpudWxsLCJjMiI6bnVsbH1dLCJGb2xkZWQiOltdLCJQb3QiOiAwLCAiUGxheWVyQmV0cyI6IFswLCAwLCAwLCAwXSwiQ2hlY2tpbmdCZXRzIjogW10sICJQdWJsaWNDYXJkcyI6WyIiLCIiLCIiLCIiLCIiXSwiU2hvd2luZ0NhcmRzIjotMSwiV2lubmVycyI6W10sIldhaXRpbmciOnRydWUsIlZvdGVzIjpbXSwiR19GdW4iOnt4OjAseTowfX0===

//TODO:
    //Somehow the current turn is becoming off sync and two players will be playing at the same time.
    //SOMETIMES ON ENDING YOUR TURN, THE POT WILL RANDOMLY GET CHIPS ADDED TO IT.
    //Show player cards not working for some reason.
    //Add final hand check and winner gets the pot.

var pthe_0x155_GD = {
    CurrentTurn: 0
}

var pthe_0x155_CD = {
    PlayerNum: 1,
    Players: []
}

var pthe_0x155_U = {
    
}

var pthe_0x155_Sp = false;var pthe_0x155_cU; //READONLY

var pthe_0x155_CR = "";const pthe_0x155_utils_ERROR_is = {
    Message: `
        <h1 style="text-align: center; animation-name: fade_in_text; animation-duration: 0.8s;">Invalid Session</h1>
        <h4 style="text-align: center; animation-name: fade_in_text; animation-duration: 0.8s;">An instance of PokerGame is already ruinning on this device. %s</h4>
        <button style="position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%) scale(1.45);" onclick="MakeDominantSession()">Make Dominant Session</button>
    `,
    ErrorLog: 'Invalid Session: An instance of PokerGame is already ruinning on this device.',
    AlternateSession: 'Joining a alternate session with account: %s.',

    Unauth: (value) => {
        pthe_0x155_utils_iS = true;        document.body.innerHTML = pthe_0x155_utils_ERROR_is.Message.replace(/%s/g, pthe_0x155_a_a_t == null ? `(${value})` : `(${value}, Alt Account: ${pthe_0x155_a_a_t})`);        clearInterval(pthe_0x155_uID);    }
}

const pthe_0x155_utils_SID = Math.floor(Math.random() * 1_000_000_000);var pthe_0x155_utils_iS = false;setInterval(function () {
    if(pthe_0x155_utils_iS){return;}
    const utils_sc = JSON.parse(localStorage.getItem("PokerWebsite_ActiveSession" + (pthe_0x155_a_a_t == null ? "" : pthe_0x155_a_a_t)));    if(utils_sc && utils_sc.SessionID != null && utils_sc.SessionID != pthe_0x155_utils_SID)
    {
        pthe_0x155_utils_ERROR_is.Unauth("Session Overridden");        return;    }
},100)

function MakeDominantSession()
{
    if(window.location.search.includes("&forceValid="))
    {
        window.location.reload();        return;    }

    window.open('./index.html' + window.location.search + "&forceValid=true", "_self");}

const unload = function () {
    localStorage.removeItem("PokerWebsite_ActiveSession" + (pthe_0x155_a_a_t == null ? "" : pthe_0x155_a_a_t));}

var pthe_0x155_a_a_t = null;window.addEventListener('load', function () {

    pthe_0x155_a_a_t = GetURLParam("alt");    if(localStorage.getItem("PokerWebsite_ActiveSession" + (pthe_0x155_a_a_t == null ? "" : pthe_0x155_a_a_t)) && !GetURLParam("forceValid"))
    {
        pthe_0x155_utils_ERROR_is.Unauth("401 Unauthorized");        return;    }

    if(pthe_0x155_a_a_t != null)
    {
        alert(pthe_0x155_utils_ERROR_is.AlternateSession.replace(/%s/g, pthe_0x155_a_a_t));       
    }  

    localStorage.setItem("PokerWebsite_ActiveSession" + (pthe_0x155_a_a_t == null ? "" : pthe_0x155_a_a_t), JSON.stringify({active: true, SessionID: pthe_0x155_utils_SID}));    window.addEventListener('unload', unload);    LoadSwipe(1);    
    const st_a = ls_0x15.ls_0x15_gca();    if(st_a == undefined || st_a == null || st_a == "null" || st_a.username == undefined)
    {
        window.open('../signin/index.html?invalid=true', "_self")
    }

    if(pthe_0x155_a_a_t != null)
    {
        st_a.username = pthe_0x155_a_a_t;    }

    rc_0x01623.rc_0x01623_gu(st_a.username).then(pthe_0x155_serv_u => {
        if(pthe_0x155_serv_u == undefined || pthe_0x155_serv_u == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(pthe_0x155_serv_u.passcode != st_a.passcode) { window.open('../signin/index.html?invalid=true', "_self") }

        pthe_0x155_U = pthe_0x155_serv_u;        UpdateThemeOnLoad(pthe_0x155_serv_u);        pu_0x023_func_cpd(4, pthe_0x155_serv_u);        this.setTimeout(function () {
            if(pu_0x023_func_ctcv() < 1)
            {
                var st_mval = pthe_0x155_serv_u.money;        
    
                this.setTimeout(function () {
                     pu_0x023_func_acvts(pthe_0x155_serv_u.money);                }, 2200)
    
                pthe_0x155_U.chips = pu_0x023_func_ctcv();                rc_0x01623.rc_0x01623_uu(pthe_0x155_U);            }
        }, 1250);        if(pthe_0x155_p_IHSC)
        {
            ShowCards(true);        }
    })

    const st_tab = GetURLParam("table");    if(st_tab == null)
    {
        this.window.open('../rooms_and_leaderboard/index.html', '_self');    }

    pthe_0x155_CR = st_tab;    pthe_0x155_func_bg();    AddTooltipElement(this.document.getElementById("fold_button"), "<h3>Fold</h3><p style=\"transform: translateY(-7px);\">Stop playing.</p>");    AddTooltipElement(this.document.getElementById("check_button"), "<h3>Match</h3><p style=\"transform: translateY(-7px);\">Stay in the game.</p>");    AddTooltipElement(this.document.getElementById("raise_button"), "<h4>Next Turn / Check</h4><p style=\"transform: translateY(-7px);\">Move on.</p>");    pthe_0x155_func_U();    this.setInterval(function () {
        UpdateButtons();    }, 500)

    document.getElementById("pot").addEventListener('mouseleave', function (event) {
        document.getElementById("bet_display").style = "background-color: #00000000; border: 3px solid #00000000;";        document.getElementById('bet_display_info').style = "color: #DDDDDD00;";    })

    document.getElementById("pot").addEventListener('mouseenter', function (event) {
        document.getElementById("bet_display").style = "";        document.getElementById('bet_display_info').style = "";        document.getElementById('bet_display_info').innerHTML = `Current Bet: ${pthe_0x155_GD.CurrentBet > pu_0x023_CB ? pthe_0x155_GD.CurrentBet : pu_0x023_CB}<br><br>Pot: ${pthe_0x155_GD.Pot}`
    })

    $("#deck").on('click', DeckClick);})


function pthe_0x155_func_bg()
{
    PopulateDeck();    RenderDeck("#deck");}

var pthe_0x155_u_MC = {c1: null, c2: null}

function DrawCardsToHand(dcth_0x15_1 = null)
{
    if(dcth_0x15_1 != null && dcth_0x15_1.c1 != null && dcth_0x15_1.c2 != null)
    {
        const card1 = new Card(dcth_0x15_1.c1.split("_")[0], dcth_0x15_1.c1.split("_")[1]);        const card2 = new Card(dcth_0x15_1.c2.split("_")[0], dcth_0x15_1.c2.split("_")[1]);        RenderCard("#hand", card1);        RenderCard("#hand", card2);        pthe_0x155_u_MC.c1 = card1.Suit + "_" + card1.Value;        pthe_0x155_u_MC.c2 = card2.Suit + "_" + card2.Value;        
        return;    }

    if(pthe_0x155_u_MC.c1 != null && pthe_0x155_u_MC.c2 != null || dcth_0x15_1 != null){ return; }

    PlaySound(SOUNDS.SquareUp);    const dcth_0x15_c1 = DrawCard();    const dcth_0x15_c2 = DrawCard();    pthe_0x155_u_MC.c1 = dcth_0x15_c1.Suit + "_" + dcth_0x15_c1.Value;    pthe_0x155_u_MC.c2 = dcth_0x15_c2.Suit + "_" + dcth_0x15_c2.Value;    RenderCard("#hand", dcth_0x15_c1);    RenderCard("#hand", dcth_0x15_c2);    pu_0x023_func_slgs();}

function pthe_0x155_func_scp(pthe_0x155_func_scp_1)
{
    if(pthe_0x155_func_imt())
    {
        if(!pthe_0x155_p_sC)
        {
            document.getElementById("fold_button").removeAttribute("disabled");            document.getElementById("check_button").removeAttribute("disabled");            document.getElementById("raise_button").removeAttribute("disabled");        }

       $("#player_4_display").attr("style", "border: 3px solid #796600; transform: scale(1.05);")

       for(var v = 1; v < 4; v++)
       {
            $("#player_" + v + "_display").attr("style", "")
       }
    }else{
        $("#player_4_display").attr("style", "")
        if(!pthe_0x155_p_sC)
        {
            document.getElementById("fold_button").setAttribute("disabled", "true");            document.getElementById("check_button").setAttribute("disabled", "true");            document.getElementById("raise_button").setAttribute("disabled", "true");        }

        var i = 1;        for(var v = 1; v <= pthe_0x155_GD.players.length; v++)
        {
            if(v == pthe_0x155_GD.CurrentTurn)
            {
                $("#player_" + i + "_display").attr("style", "border: 3px solid #796600; transform: scale(1.05);")
            } else if(pthe_0x155_GD.Folded.includes(v))
            {
                $("#player_" + i + "_display").attr("style", "transform: scale(0.95); background-color: #00312a;");            } else{
                $("#player_" + i + "_display").attr("style", "")
            }
    
            if(v != pthe_0x155_CD.PlayerNum){i++;}
        }
    }

    
}

const pthe_0x155_uID = setInterval(function () {
    pthe_0x155_func_U();    if(pthe_0x155_func_U_aU)
    {
        setTimeout(() => {
            pthe_0x155_func_U();        }, 500);        setTimeout(() => {
            pthe_0x155_func_U();        }, 1000);        setTimeout(() => {
            pthe_0x155_func_U();        }, 1500);    }
}, 2000)

function Waiting_JoinTable()
{
    if($("#wait_join_button").text().startsWith("Loading")){return;}
    $("#wait_join_button").text("Loading...");    if(!pthe_0x155_GD.players.includes(pthe_0x155_U.username))
    {
        pthe_0x155_GD.players.push(pthe_0x155_U.username);        if(pthe_0x155_GD.watching.includes(pthe_0x155_U.username))
        {
            pthe_0x155_GD.watching.splice(pthe_0x155_GD.watching.indexOf(pthe_0x155_U.username), 1);        }

        rc_0x01623.rc_0x01623_ur(pthe_0x155_GD);    }else{
        pthe_0x155_GD.players.splice(pthe_0x155_GD.players.indexOf(pthe_0x155_U.username), 1);        
        if(!pthe_0x155_GD.watching.includes(pthe_0x155_U.username))
        {
            pthe_0x155_GD.watching.push(pthe_0x155_U.username);        }

        if(pthe_0x155_GD.Votes.includes(pthe_0x155_U.username))
        {
            pthe_0x155_GD.Votes.splice(pthe_0x155_GD.Votes.indexOf(pthe_0x155_U.username), 1);        }

        rc_0x01623.rc_0x01623_ur(pthe_0x155_GD);    }
}

function Waiting_VoteStart()
{
    if($("#wait_vote_button").text().startsWith("Loading")){return;}
    $("#wait_vote_button").text("Loading...");    if(!pthe_0x155_GD.Votes.includes(pthe_0x155_U.username))
    {
        pthe_0x155_GD.Votes.push(pthe_0x155_U.username);        rc_0x01623.rc_0x01623_ur(pthe_0x155_GD);    }else{
        pthe_0x155_GD.Votes.splice(pthe_0x155_GD.Votes.indexOf(pthe_0x155_U.username), 1);        rc_0x01623.rc_0x01623_ur(pthe_0x155_GD);    }
}

var pthe_0x155_WMT = false;var pthe_0x155_UN = 0;var pthe_0x155_GR = false;var pthe_0x155_PR_UP = false

function pthe_0x155_func_U(pthe_0x155_func_U_1 = false, pthe_0x155_func_U_2 = false)
{
    if(pthe_0x155_PR_UP){return;}
    if(!pthe_0x155_func_imt())
    {
        pthe_0x155_GR = false;    }

    const st_iS = pthe_0x155_func_U_1;    
    if(!pthe_0x155_GR || pthe_0x155_func_U_2 || pthe_0x155_GD.Waiting)
    {
        rc_0x01623.rc_0x01623_gr(pthe_0x155_CR).then(st_fd => {
            pthe_0x155_GR = true;            pthe_0x155_func_pU(st_fd, st_iS);        })

    }else{
        pthe_0x155_func_pU(pthe_0x155_GD, st_iS);    }
}

var pthe_0x155_lS = 0, pthe_0x155_lSC = -1;var pthe_0x155_WSD = false;const playerWaitingChip = `
    <div class="player_waiting_chip dark_bottom_theme" id="player_%playerName%_waiting">%img%<h3>%playerName%</h3></div>
`

var pthe_0x155_wP = []
var pthe_0x155_sT = -500;var pthe_0x155_lGFun = {x:0,y:0,p:0}
var pthe_0x155_lMFun = null

var pthe_0x155_func_U_aU = false;function pthe_0x155_func_csg()
{
    setInterval(() => {
        pthe_0x155_sT = 0;    }, 1);    if(pthe_0x155_GD.Waiting && pthe_0x155_GD.Votes.length > 0)
    {
        pthe_0x155_GD.Waiting = false;        pthe_0x155_GD.Votes = [];        var st_pA = JSON.parse(JSON.stringify(pthe_0x155_GD.players));        const st_oL = st_pA.length;        for(var st_i = 0; st_i < st_oL; st_i++)
        {
            var id = Math.floor(Math.random() * st_pA.length);            pthe_0x155_GD.players[st_i] = st_pA[id];            st_pA.splice(id, 1);        }
        
        rc_0x01623.rc_0x01623_ur(pthe_0x155_GD).then(d => {
            pu_0x023_func_gsclgs();            window.location.reload();        })
    }
}

var pthe_0x155_wW = false;var pthe_0x155_dWMFun = 0, pthe_0x155_lFunT = null;var pthe_0x155_rL = false;var pthe_0x155_spec_lST = -1, pthe_0x155_spec_lSB = [];var pthe_0x155_l3PCP = 0;function pthe_0x155_func_pU(pthe_0x155_func_pU_1, pthe_0x155_func_pU_2)
{
    pthe_0x155_cU = pthe_0x155_U;    pthe_0x155_UN++;    pthe_0x155_GD = pthe_0x155_func_pU_1;    pthe_0x155_Sp = false;    if(!pthe_0x155_GD.players.includes(pthe_0x155_U.username)){pthe_0x155_Sp = true;}

    if(pthe_0x155_Sp)
    {
        if(pthe_0x155_spec_lST != pthe_0x155_GD.CurrentTurn || pthe_0x155_GD.CheckingBets.length != pthe_0x155_spec_lSB.length)
        {
            for(var st_i = 0; st_i < pthe_0x155_GD.QueuedBets.length; st_i++) 
            {
                pu_0x023_func_actpd(pthe_0x155_GD.QueuedBets[st_i]);            }

            pthe_0x155_spec_lST = pthe_0x155_GD.CurrentTurn;            pthe_0x155_spec_lSB = pthe_0x155_GD.CheckingBets;        }
        $("#spectator_text").css("visibility", "");        if(pthe_0x155_GD.Waiting)
        {
            if(!pthe_0x155_GD.watching.includes(pthe_0x155_U.username))
            {
                pthe_0x155_GD.watching.push(pthe_0x155_U.username);                rc_0x01623.rc_0x01623_ur(pthe_0x155_GD);            }
        }
    }else{
        $("#spectator_text").css("visibility", "hidden");        if(pthe_0x155_l3PCP != pthe_0x155_GD.CurrentTurn && !pthe_0x155_func_imt() && !(pthe_0x155_GD.CurrentTurn - 1 == pthe_0x155_CD.PlayerNum) && !pthe_0x155_GD.Waiting)
        {
            pthe_0x155_l3PCP = pthe_0x155_GD.CurrentTurn;            if(pthe_0x155_GD.QueuedBets.length > 0)
            {
                pthe_0x155_GD.QueuedBets.forEach(bet => pu_0x023_func_actpd(bet));            }
        }

        if(pthe_0x155_l3PCP != pthe_0x155_GD.CurrentTurn && !pthe_0x155_func_imt() && !pthe_0x155_GD.Waiting)
        {
            pu_0x023_tC_func_btc(10);        }
    }

    if(pthe_0x155_GD.Waiting)
    {
        pu_0x023_tC_func_ctt();        pthe_0x155_l3PCP = -5;    }

    if(pu_0x023_CTT < 2 && pthe_0x155_func_imt() && !pthe_0x155_p_F)
    {
        pthe_0x155_func_button_f(true);    }

    if(pu_0x023_CTT < 2 && !pthe_0x155_func_imt())
    {
         pthe_0x155_GD.Folded.push(pthe_0x155_GD.players[pthe_0x155_GD.CurrentTurn - 1]);        const prevTurn = pthe_0x155_GD.CurrentTurn;        pthe_0x155_GD.CurrentTurn++;        var finishStage = false;        if(pthe_0x155_GD.players.length < pthe_0x155_GD.CurrentTurn)
        {
            finishStage = true;            pthe_0x155_GD.CurrentTurn = 1;        }

        pthe_0x155_GD.QueuedBets = [];        pu_0x023_UOC = -pu_0x023_CB;        pu_0x023_CB = 0;        pu_0x023_QB = [];        if(finishStage)
        {
            pthe_0x155_func_fs();        }

        if(pthe_0x155_GD.CheckingBets.length > 0)
        {
            if(pthe_0x155_GD.CheckingBets.includes(prevTurn))
            {
                pthe_0x155_GD.CheckingBets.splice(pthe_0x155_GD.CheckingBets.indexOf(prevTurn), 1);            }

            pthe_0x155_cB = false;        }

        pu_0x023_func_slgs();        rc_0x01623.rc_0x01623_ur(pthe_0x155_GD).then(d => {
            pthe_0x155_PR_UP = false;        })

        pthe_0x155_GR = false;    }

    if(!pthe_0x155_rL)
    {
        pu_0x023_func_llgs(GetURLParam("table"));        pthe_0x155_rL = true;    }

    if(pthe_0x155_GD.Waiting)
    {
        $("#waiting_screen").attr("style", "");        $("#waiting_cover").attr("style", "");        pthe_0x155_wW = true;        pu_0x023_func_gsclgs();        var st_tT = "Table: <br>";        $("#waiting_spectator_display").html(`<p>Spectating: </p>`);        for(var st_i = 0; st_i < pthe_0x155_GD.watching.length; st_i++)
        {
            if(pthe_0x155_GD.watching[st_i] != null)
            {
                $("#waiting_spectator_display").append(`<p>${censorText(pthe_0x155_GD.watching[st_i])}</p>`);            }
        }

        if(pthe_0x155_GD.players.length < pthe_0x155_wP.length)
        {
            pthe_0x155_wP = []
            $("#waiting_screen_players").html("Table: <br><p>Loading...</p>");        }

        for(var st_i = 0; st_i < pthe_0x155_GD.players.length; st_i++)
        {
            if(pthe_0x155_wP.length <= st_i){pthe_0x155_wP.push({player: "", data: ""});}

            if(pthe_0x155_wP[st_i].player != pthe_0x155_GD.players[st_i])
            {
                pthe_0x155_wP[st_i].player = pthe_0x155_GD.players[st_i];                const i2 = st_i;                rc_0x01623.rc_0x01623_gu(pthe_0x155_wP[i2].player).then(user => {
                    var chip = playerWaitingChip.replace(/%playerName%/g, censorText(user.username));                    if(user.icon != null && user.icon != undefined && user.icon != "null" && user.icon != "")
                    {
                        chip = chip.replace(/%img%/g, `<img src="%playerIcon%" width="32" height="32">`).replace(/%playerIcon%/g, atob(user.icon));                    }
                    chip = chip.replace(/%img%/g, "") + "<br>";                    pthe_0x155_wP[i2].data = chip;                })
            }

            st_tT += pthe_0x155_wP[st_i].data;        }

        if(pthe_0x155_GD.players.includes(pthe_0x155_U.username))
        {
            $("#wait_join_button").text("Leave Table");            $("#wait_vote_button").attr("style", "visibility: default;");        }else{

            $("#wait_join_button").text("Join Table");            $("#wait_vote_button").attr("style", "visibility: hidden;");        }

        if(pthe_0x155_GD.Votes.includes(pthe_0x155_U.username))
        {
            $("#wait_vote_button").text("Remove Vote");        }else{
            $("#wait_vote_button").text("Vote");        }

        var st_n = pthe_0x155_GD.room_name; 
        if(pthe_0x155_GD.players.length < 2){pthe_0x155_sT = -500;} 
        else if(pthe_0x155_GD.Votes.length == pthe_0x155_GD.players.length - 1)
        {
            if(pthe_0x155_sT < -400)
            {
                pthe_0x155_sT = 20;                const id = setInterval(() => {
                    if((pthe_0x155_sT < 0 && pthe_0x155_sT > -400) || pthe_0x155_GD.Waiting != true)
                    {
                        pthe_0x155_func_csg();                        clearInterval(id);                    }

                    pthe_0x155_sT--;                }, 1300)
            }else if(pthe_0x155_sT > 40)
            {
                pthe_0x155_sT = 40;            }
        }else if(pthe_0x155_GD.Votes.length == pthe_0x155_GD.players.length)
        {
            if(pthe_0x155_sT < -400)
            {
                pthe_0x155_sT = 5;                const id = setInterval(() => {
                    if((pthe_0x155_sT < 0 && pthe_0x155_sT > -400) || pthe_0x155_GD.Waiting != true)
                    {
                        pthe_0x155_func_csg();                        clearInterval(id);                    }

                    pthe_0x155_sT--;                }, 1300)
            }else if(pthe_0x155_sT > 5)
            {
                pthe_0x155_sT = 5;            }
        }else if(pthe_0x155_GD.Votes.length > 0)
        {
            if(pthe_0x155_sT < -400)
            {
                pthe_0x155_sT = 80;                const id = setInterval(() => {
                    if((pthe_0x155_sT < 0 && pthe_0x155_sT > -400) || pthe_0x155_GD.Waiting != true)
                    {
                        pthe_0x155_func_csg();                        clearInterval(id);                    }

                    pthe_0x155_sT--;                }, 1300)
            }
        }else{
            pthe_0x155_sT = -500;        }

        if(pthe_0x155_sT > 0)
        {
            st_n += " - " + pthe_0x155_sT + "s";        }else if(pthe_0x155_sT == 0)
        {
            st_n += " - Loading...";        }

        $("#waiting_room_name").text(st_n);        $("#waiting_screen_players").html(st_tT);        for(var st_i = 0; st_i < pthe_0x155_GD.Votes.length; st_i++)
        {
            $(`#player_${pthe_0x155_GD.Votes[st_i]}_waiting`).attr("style", "background-color: #846e3055;")
        }

        return;    }

    if(pthe_0x155_wW)
    {
        pu_0x023_func_gsclgs();        window.location.reload();        pthe_0x155_wW = false;    }

    $("#waiting_screen").attr("style", "width: 0; height: 0; position: relative; visibility: none; transform: translate(-5000%, -5000%);")
    $("#waiting_cover").attr("style", "width: 0; height: 0; position: relative; visibility: none; transform: translate(-5000%, -5000%);")
    
    pthe_0x155_func_U_aU = false;    pthe_0x155_dWMFun++;    if(pthe_0x155_u_MC.c1 != null && pthe_0x155_u_MC.c2 != null && pthe_0x155_GD.PublicCards[4] != '')
    {
        const st_pC = [
            new Card(pthe_0x155_GD.PublicCards[0].split("_")[0], pthe_0x155_GD.PublicCards[0].split("_")[1]),
            new Card(pthe_0x155_GD.PublicCards[1].split("_")[0], pthe_0x155_GD.PublicCards[1].split("_")[1]),
            new Card(pthe_0x155_GD.PublicCards[2].split("_")[0], pthe_0x155_GD.PublicCards[2].split("_")[1]),
            new Card(pthe_0x155_GD.PublicCards[3].split("_")[0], pthe_0x155_GD.PublicCards[3].split("_")[1]),
            new Card(pthe_0x155_GD.PublicCards[4].split("_")[0], pthe_0x155_GD.PublicCards[4].split("_")[1])
        ]
    
        const st_h = [ new Card(pthe_0x155_u_MC.c1.split("_")[0], pthe_0x155_u_MC.c1.split("_")[1]),
        new Card(pthe_0x155_u_MC.c2.split("_")[0], pthe_0x155_u_MC.c2.split("_")[1])]

        const st_BH = GetBestPlayerHand(st_pC, st_h);        const st_disp = POKER_HANDS[st_BH.hand].name;        $("#player_4_hand").text(st_disp);        $("#player_4_hand").attr("style", "font-size: 24px;")
    }

    if(!pthe_0x155_func_imt())
    {
        if(pthe_0x155_GD.G_Fun.x != pthe_0x155_lGFun.x || pthe_0x155_GD.G_Fun.y != pthe_0x155_lGFun.y)
        {
            pthe_0x155_func_U_aU = true;            pthe_0x155_dWMFun = 0;            if(pthe_0x155_GD.G_Fun.p != pthe_0x155_lGFun.p && $("#pot").children().length > 0)
            {
                pthe_0x155_lMFun = document.getElementById("pot").children[Math.floor(Math.random() * $("#pot").children().length)];            }
    
            if(pthe_0x155_lMFun != null)
            {
                if(pthe_0x155_lFunT != null){
                    const rm = pthe_0x155_lFunT;                    pthe_0x155_lFunT = null;                    rm.setAttribute("class", "remove_lft");                    setTimeout(() => {
                        rm.remove();                    }, 300);                }
                pthe_0x155_lFunT = document.createElement("p");                pthe_0x155_lFunT.textContent = pthe_0x155_GD.players[pthe_0x155_GD.CurrentTurn - 1];                pthe_0x155_lFunT.setAttribute("style", `position: fixed; top: ${pthe_0x155_GD.G_Fun.y - 60}px; left: ${pthe_0x155_GD.G_Fun.x - window.innerWidth/20}px; transition-duration: 0.5s;z-index: 5;`);                pthe_0x155_lFunT.setAttribute("class", "move_fun_text");                pthe_0x155_lMFun.setAttribute("style", `position: fixed; top: ${pthe_0x155_GD.G_Fun.y - window.innerHeight/2.3}px; left: ${pthe_0x155_GD.G_Fun.x - window.innerWidth/2.18}px; transition-duration: 0.5s;z-index: 5;`)
           
                document.body.appendChild(pthe_0x155_lFunT);            }
    
            pthe_0x155_lGFun = pthe_0x155_GD.G_Fun;        }
        
    }

    if(pthe_0x155_dWMFun < 10)
    {
        pthe_0x155_func_U_aU = true;    }else if(pthe_0x155_lFunT != null){
        const rm = pthe_0x155_lFunT;        pthe_0x155_lFunT = null;        rm.setAttribute("class", "remove_lft");        setTimeout(() => {
            rm.remove();        }, 300);    }

    if(!pthe_0x155_util_r)
    {
        for(var st_i = 0; st_i < pthe_0x155_func_pU_1.players.length; st_i++)
        {
            if(pthe_0x155_func_pU_1.players[st_i] == pthe_0x155_U.username)
            {
                pthe_0x155_CD.PlayerNum = st_i + 1;            }
        }
    }

    while(pthe_0x155_GD.players.length > pthe_0x155_CD.Players.length)
    {
        pthe_0x155_CD.Players.push({ username: "" });    }

    for(var v = 1; v < 4; v++)
    {
        if($(`#player_${v}_display`).html() != " ")
        {
            if(v >= pthe_0x155_CD.Players.length)
            {
                $(`#player_${v}_display`).html(" ")
            }
            
        }
    }

    var st_i = 4;    while(pthe_0x155_GD.players.length < pthe_0x155_CD.Players.length && st_i > 0)
    {
        if(pthe_0x155_CD.Players.length > st_i)
        {
            document.getElementById(`player_${st_i}_display`).setAttribute("class", "player_display_hidden");            document.getElementById(`player_${st_i}_display`).setAttribute("style", "");            document.getElementById(`player_${st_i}_display`).innerHTML = "";            pthe_0x155_CD.Players.splice(st_i, 1);        }

        st_i--;    }
    
    while(pthe_0x155_lS < pthe_0x155_GD.CurrentStage)
    {
        pthe_0x155_lS++;        switch(pthe_0x155_lS)
        {
            case 1:
                for(var st_i = 0; st_i < 3; st_i++)
                {
                    const c = new Card(pthe_0x155_GD.PublicCards[st_i].split("_")[0], pthe_0x155_GD.PublicCards[st_i].split("_")[1])
                    setTimeout(function () {
                        RenderCard("#public_cards_display", c, 0.65);                    }, v * 500)
                }
                break;            case 2:
            case 3:
                const c = new Card(pthe_0x155_GD.PublicCards[pthe_0x155_lS + 1].split("_")[0], pthe_0x155_GD.PublicCards[pthe_0x155_lS + 1].split("_")[1])
                RenderCard("#public_cards_display", c, 0.65);                break;        }
    }
    
    pthe_0x155_func_uap();    if(!pthe_0x155_util_r)
    {
        setTimeout(function () {
            pthe_0x155_func_upa();        }, 1500)
    }

    pthe_0x155_func_scp();    $("#player_4_chipcount").text(pu_0x023_func_ctcv());    if(!pthe_0x155_WMT && pthe_0x155_func_imt())
    {
        pthe_0x155_func_bt();        pthe_0x155_WMT = true;    }

    if(!pthe_0x155_func_imt())
    {
        pthe_0x155_WMT = false;    }

    if(pthe_0x155_GD.ShowingCards != -1)
    {  
        if(pthe_0x155_lSC != pthe_0x155_GD.ShowingCards)
        {
            pthe_0x155_func_spc(pthe_0x155_GD.ShowingCards);            pthe_0x155_lSC = pthe_0x155_GD.ShowingCards;        }
    }else{
        pthe_0x155_lSC = -1;    }

    var st_i = 1;    for(var v = 0; v < pthe_0x155_CD.Players.length; v++)
    {
        $(`#player_${st_i}_chipcount`).text(pthe_0x155_CD.Players[v].chips);        if(v + 1 != pthe_0x155_CD.PlayerNum){st_i++;}
    }

    if(pu_0x023_PV != pthe_0x155_GD.Pot)
    {
        //Sync Issue.
    }

    if(pthe_0x155_p_F)
    {
        $("#player_4_display").attr("style", "transform: scale(0.85); background-color: #00312a;");    }

    for(var st_i = 0; st_i < pthe_0x155_GD.Folded; st_i++)
    {
        const st_pID = pthe_0x155_GD.players.indexOf(pthe_0x155_GD.Folded[st_i]) + 1;        if(st_pID == pthe_0x155_CD.PlayerNum){continue;}

        if(st_pID < pthe_0x155_CD.PlayerNum)
        {
            $(`#player_${st_pID}_display`).attr("style", "transform: scale(0.85);background-color: #00312a;");        }else{
            $(`#player_${st_pID - 1}_display`).attr("style", "transform: scale(0.85);background-color: #00312a;");        }
        
    }

    while(pthe_0x155_fQ.length > 0)
    {
        pthe_0x155_fQ[0]();        pthe_0x155_fQ.splice(0, 1);    }

    if(!pthe_0x155_util_r)
    {
        pthe_0x155_func_upa();        pthe_0x155_util_r = true;    }

    if(pthe_0x155_func_pU_2){return;}

    pu_0x023_func_slgs();}

function pthe_0x155_func_uap(pthe_0x155_func_uap_1 = false)
{
    var i = 1;    for(var p = 0; p < pthe_0x155_GD.players.length; p++)
    {
        if(pthe_0x155_GD.players[p] == pthe_0x155_U.username)
        {
            pthe_0x155_CD.PlayerNum = p + 1;            pthe_0x155_CD.Players[p] = pthe_0x155_U;            continue;        }

        if(pthe_0x155_GD.players[p] != pthe_0x155_CD.Players[p].username || pthe_0x155_func_uap_1 || $(`#player_${i}_name_display`).text() != pthe_0x155_GD.players[p])
        {
            const st_p2 = p;            const st_i2 = i;            rc_0x01623.rc_0x01623_gu(pthe_0x155_GD.players[st_p2]).then(st_ret_u => {
                pthe_0x155_CD.Players[st_p2] = st_ret_u;                pu_0x023_func_cpd(st_i2, st_ret_u);                pthe_0x155_func_upa();            })
        }
        
        i++;    }
}

var pthe_0x155_fQ = []
function queue(v){pthe_0x155_fQ.push(v);}

function pthe_0x155_func_imt()
{
    if(pthe_0x155_Sp){pthe_0x155_CD.PlayerNum = 9999;return false;}
    return pthe_0x155_GD.CurrentTurn == pthe_0x155_CD.PlayerNum;}

var pthe_0x155_aSA = false;function pthe_0x155_func_spc(pthe_0x155_func_spc_1)
{
    if(pthe_0x155_aSA){return;}
    if(pthe_0x155_func_spc_1 == pthe_0x155_CD.PlayerNum){return;}

    pthe_0x155_aSA = true;    pthe_0x155_func_spc_1--;    var st_pD = 0;    var i = 0;    for(var v = 0; v < pthe_0x155_CD.Players.length; v++)
    {
        if(pthe_0x155_CD.PlayerNum != v){i++;}

        if(v == pthe_0x155_func_spc_1)
        {
            st_pD = i;        }
    }
    
    $(`#player_${st_pD}_cards`).attr("style", "transition-duration: 0.3s; opacity: 0;");    setTimeout(() => {
        $(`#player_${st_pD}_cards`).attr("style", "transition-duration: 0.3s; opacity: 1; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(4);");        $(`#player_${st_pD}_cards>img`).attr("style", "margin: 6.5px;");        setTimeout(() => {
            $(`#player_${st_pD}_cards>img`).attr("style", "transition-duration: 0.3s; transform: scaleX(0);");            setTimeout(() => {
                const st_pcval = pthe_0x155_GD.PlayerCards[pthe_0x155_func_spc_1];                var st_cval = new Card(st_pcval.c1.split("_")[0], st_pcval.c1.split("_")[1]);   
                $(`#player_${st_pD}_cards>img:first-child`).attr("src", "../assets/cards/" + st_cval.GetImage());                st_cval = new Card(st_pcval.c2.split("_")[0], st_pcval.c2.split("_")[1]);                $(`#player_${st_pD}_cards>img:last-child`).attr("src", "../assets/cards/" + st_cval.GetImage());                $(`#player_${st_pD}_cards>img`).attr("style", "transition-duration: 0.3s; transform: scaleX(1); margin: 6.5px;");                setTimeout(() => {
                    $(`#player_${st_pD}_cards`).attr("style", "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(4); transition-duration: 0.3s; opacity: 0;");               
                    setTimeout(() => {
                        $(`#player_${st_pD}_cards`).attr("style", "transition-duration: 0.3s; opacity: 1;");              
                        $(`#player_${st_pD}_cards>img`).attr("style", "");     
                        pthe_0x155_aSA = false;                    }, 0.3 * 1000);                }, 2000);            }, 0.3 * 1000);        }, 0.6 * 1000);    }, 0.3 * 1000);}

//QUEUE ONLY.
function pthe_0x155_func_ft()
{
    if(pthe_0x155_func_imt())
    {
        pthe_0x155_PR_UP = true;        var st_fS = false;        CreateScrollText("Bet: " + pu_0x023_CB, "lightblue");        pthe_0x155_GD.CurrentTurn++;        if(pthe_0x155_GD.players.length < pthe_0x155_GD.CurrentTurn)
        {
            st_fS = true;            pthe_0x155_GD.CurrentTurn = 1;        }

        pthe_0x155_GD.QueuedBets = pu_0x023_QB;        pthe_0x155_GD.CurrentBet = pu_0x023_CB;        pthe_0x155_U.chips = pu_0x023_func_ctcv();        pthe_0x155_U.money -= pu_0x023_CB;        rc_0x01623.rc_0x01623_uu(pthe_0x155_U);        pthe_0x155_GD.PlayerBets[pthe_0x155_CD.PlayerNum - 1] = pu_0x023_CB;        
        const st_LU = pu_0x023_UOC;        if(st_LU > 0)
        {
            setTimeout(function () {
                CreateScrollText("Raised: " + st_LU, "blue");            }, 1000)
        }else
        {
            if(pthe_0x155_GD.CurrentBet == 0)
            {
                if(!pthe_0x155_p_F)
                {
                    setTimeout(function () {
                        CreateScrollText("Checked", "lightgreen");                    }, 1000)
                }
            }else if(!pthe_0x155_p_F)
            {
                setTimeout(function () {
                    CreateScrollText("Matched: " + pu_0x023_CB, "lightgreen");                }, 1000)
            }
        }

        pthe_0x155_GD.PlayerCards[pthe_0x155_CD.PlayerNum - 1] = pthe_0x155_u_MC;        pu_0x023_UOC = -pu_0x023_CB;        pu_0x023_CB = 0;        pu_0x023_QB = [];        pthe_0x155_GD.Pot = pu_0x023_PV;        if(pu_0x023_UOC > 0)
        {
            $("#turn_details_info").css("color", "lightgreen");        }else if(pu_0x023_UOC == 0)
        {
            $("#turn_details_info").css("color", "lightblue");        }else{
            $("#turn_details_info").css("color", "red");        }
    
        $("#turn_details_info").text(pu_0x023_UOC > 0 ? (`+${pu_0x023_UOC}`) : (pu_0x023_UOC == 0 ? "0" : `${pu_0x023_UOC}`))

        if(pthe_0x155_p_F)
        {
            pthe_0x155_GD.Folded.push(pthe_0x155_CD.PlayerNum);            setTimeout(function () {
                CreateScrollText("Folded", "red");            }, 2000)
        }else if(pu_0x023_func_ctcv() < 1)
        {
            setTimeout(function () {
                CreateScrollText("All In!", "gold");            }, 2000)
        }

        
        if(st_fS)
        {
            pthe_0x155_func_fs();        }

        if(pthe_0x155_cB)
        {
            if(pthe_0x155_GD.CheckingBets.includes(pthe_0x155_CD.PlayerNum))
            {
                pthe_0x155_GD.CheckingBets.splice(pthe_0x155_GD.CheckingBets.indexOf(pthe_0x155_CD.PlayerNum), 1);            }

            pthe_0x155_cB = false;        }

        pu_0x023_func_slgs();        pthe_0x155_WMT = false;        rc_0x01623.rc_0x01623_ur(pthe_0x155_GD).then(d => {
            pthe_0x155_PR_UP = false;        })

        pthe_0x155_GR = false;    }
}

function pthe_0x155_func_fs()
{
    var st_mB = 0;    for(var st_bval = 0; st_bval < pthe_0x155_GD.players.length; st_bval++)
    {
        if(!pthe_0x155_GD.Folded.includes(st_bval + 1))
        {
            if(st_mB < pthe_0x155_GD.PlayerBets[st_bval])
            {
                st_mB = pthe_0x155_GD.PlayerBets[st_bval];            }
        }
    }

    var st_iB = [-1];    for(var st_bval = 0; st_bval < pthe_0x155_GD.players.length; st_bval++)
    {
        if(!pthe_0x155_GD.Folded.includes(st_bval))
        {
            if(pthe_0x155_GD.PlayerBets[st_bval] < st_mB)
            {
                st_iB.push(st_bval + 1);            }
        }
    }

    if(st_iB.length <= 1)
    {
        pthe_0x155_GD.CurrentTurn = 1;        pthe_0x155_GD.CurrentBet = 0;        pthe_0x155_GD.CurrentStage++;        pthe_0x155_GD.CheckingBets = [];        
        switch(pthe_0x155_GD.CurrentStage)
        {
            case 1:
                pthe_0x155_func_rd_ctf();                break;            case 2:
                pthe_0x155_func_rd_ctt();                break;            case 3:
                pthe_0x155_func_rd_ctr();                break;            case 4:
                pthe_0x155_func_fg_M();                break;            case 5:
                pthe_0x155_func_dw();                break;        }
    }else{
        pthe_0x155_GD.CheckingBets = st_iB;        pthe_0x155_GD.CurrentTurn = 1;    }
}

var pthe_0x155_util_r = false;var pthe_0x155_cB = false;function pthe_0x155_func_fg_C()
{
    var i = 1;    for(var p = 0; p < pthe_0x155_GD.players.length; p++)
    {
        if(pthe_0x155_GD.players[p] == pthe_0x155_U.username)
        {
            pthe_0x155_CD.PlayerNum = p + 1;            pthe_0x155_CD.Players[p] = pthe_0x155_U;            continue;        }

        if(pthe_0x155_GD.players[p] != pthe_0x155_CD.Players[p].username)
        {
            const p2 = i;            rc_0x01623.rc_0x01623_gu(pthe_0x155_GD.players[p]).then(user => {
                pthe_0x155_CD.Players[p2] = user;                pu_0x023_func_cpd(p2, user);                pthe_0x155_func_upa();            })
        }

        i++;    }
}

function pthe_0x155_func_fg_M()
{


}

var pthe_0x155_p_sC = false;var pthe_0x155_p_IHSC = false;var pthe_0x155_p_ICRW = false;function pthe_0x155_func_bt()
{
    pthe_0x155_Sp = false;    if(!pthe_0x155_GD.players.includes(pthe_0x155_U.username)){pthe_0x155_Sp = true;return;}

    pthe_0x155_func_U(false, true);    if(!pthe_0x155_func_imt()){return;}

    pu_0x023_UOC = -pthe_0x155_GD.CurrentBet;    pu_0x023_CB = 0;    pu_0x023_QB = [];    pthe_0x155_cB = false;    if(pthe_0x155_GD.CheckingBets.length > 0)
    {
        pthe_0x155_cB = true;        pu_0x023_CB = pthe_0x155_GD.PlayerBets[pthe_0x155_CD.PlayerNum - 1];        pu_0x023_UOC = pu_0x023_CB - pthe_0x155_GD.CurrentBet;    }

    if(pthe_0x155_GD.Winners.length > 0)
    {
        if(JSON.parse(pthe_0x155_GD.Winners[0]).player == pthe_0x155_CD.PlayerNum)
        {
            if(!pthe_0x155_p_ICRW)
            {
                pthe_0x155_p_ICRW = true;                pu_0x023_func_game_vs();            }
        }
    }

    pthe_0x155_func_uap(true);    
    if(pu_0x023_UOC > 0)
    {
        $("#turn_details_info").css("color", "lightgreen");    }else if(pu_0x023_UOC == 0)
    {
        $("#turn_details_info").css("color", "lightblue");    }else{
        $("#turn_details_info").css("color", "red");    }

    $("#turn_details_info").text(pu_0x023_UOC > 0 ? (`+${pu_0x023_UOC}`) : (pu_0x023_UOC == 0 ? "0" : `${pu_0x023_UOC}`))

    if(pthe_0x155_GD.CurrentStage == 0 && !pthe_0x155_cB)
    {
        pthe_0x155_func_upa();    }

    if(!pthe_0x155_HDC && pthe_0x155_GD.CurrentBlind != pthe_0x155_CD.PlayerNum)
    {
        DrawCardsToHand();    }

    for(var b = 0; b < pthe_0x155_GD.QueuedBets.length; b++)
    {
        pu_0x023_func_actpd(pthe_0x155_GD.QueuedBets[b], false, pthe_0x155_GD.Pot);    }
    pu_0x023_func_slgs();    pthe_0x155_GD.QueuedBets = [];    pu_0x023_tC_func_btc();    if(pthe_0x155_GD.CurrentStage == 4)
    {
        pthe_0x155_p_sC = true;    }

    var st_aF = false;    if(pthe_0x155_GD.Folded.length >= pthe_0x155_GD.players.length - 1 && !pthe_0x155_GD.Folded.includes(pthe_0x155_U.username))
    {
        if(!pthe_0x155_p_ICRW)
        {
            pthe_0x155_p_ICRW = true;            st_aF = true;            pu_0x023_func_game_vs();        }
    }

    if((pthe_0x155_GD.CheckingBets.length > 0 && !pthe_0x155_GD.CheckingBets.includes(pthe_0x155_CD.PlayerNum)) || pthe_0x155_p_F || pthe_0x155_GD.Folded.includes(pthe_0x155_CD.PlayerNum))
    {
        pthe_0x155_GD.QueuedBets = [];        pthe_0x155_GD.CurrentBet = 0;        if(!st_aF){pthe_0x155_func_ft(); st_aF = true;}
    }

    if(pthe_0x155_GD.ShowingCards != -1 && (pthe_0x155_p_IHSC || pthe_0x155_GD.Folded.includes(pthe_0x155_CD.PlayerNum)))
    {
        if(!st_aF){pthe_0x155_func_ft(); st_aF = true;}
    }else if(pthe_0x155_GD.Winners.length > 0)
    {
        if(JSON.parse(pthe_0x155_GD.Winners[0]).player != pthe_0x155_CD.PlayerNum)
        {
            if(!st_aF){pthe_0x155_func_ft(); st_aF = true;}
        }
    }
    
}

function pthe_0x155_func_upa()
{
    pu_0x023_func_attr_capa();    if(pthe_0x155_U.username == pthe_0x155_GD.Creator)
    {
        pu_0x023_func_attr_apa(4, PLAYER_ATTRIBUTES.House);    }else {
        var i = 1;        for(var v = 0; v < pthe_0x155_GD.players.length; v++)
        {
            if(pthe_0x155_GD.players[v] == pthe_0x155_GD.Creator)
            {
                pu_0x023_func_attr_apa(i, PLAYER_ATTRIBUTES.House);            }

            if(pthe_0x155_GD.players[v] != pthe_0x155_U.username){ i++; }
        }
    }
    
    if(pthe_0x155_GD.CurrentBlind == pthe_0x155_CD.PlayerNum)
    {
        pu_0x023_func_attr_apa(4, PLAYER_ATTRIBUTES.BigBlind);    }else{
        pu_0x023_func_attr_apa(pthe_0x155_GD.CurrentBlind, PLAYER_ATTRIBUTES.BigBlind);    }

}

function pthe_0x155_func_hamb()
{
    return pthe_0x155_GD.MinimumBet <= pu_0x023_CB;}


var pthe_0x155_HDC = false;function DeckClick()
{
    if(pthe_0x155_HDC){return;}
    if(pthe_0x155_GD.CurrentBlind == pthe_0x155_CD.PlayerNum)
    {
        if(pthe_0x155_func_hamb())
        {
            pthe_0x155_HDC = true;            DrawCardsToHand();        }
    }
}

var pthe_0x155_sBD = ''

var pthe_0x155_sAP = false;function ShowCards(ShowCards_1 = false)
{
    if(pthe_0x155_sAP){return;}

    const dnat = ShowCards_1;    pthe_0x155_sAP = true;    pthe_0x155_GD.ShowingCards = pthe_0x155_CD.PlayerNum;    rc_0x01623.rc_0x01623_ur(pthe_0x155_GD).then(d => {
        $("#hand").attr("style", "transition-duration: 0.6s; transform: translate(0, -100%);")
        $("#hand>img").attr("style", "transition-duration: 0.6s; filter: drop-shadow(0px 200px 3px #00000033); transform: scaleX(-1);")

        const st_oG = $("#hand").html();        setTimeout(function() {
            $("#hand").html("<img src=\"../assets/cards/back.png\" width=\"140\" height=\"200\" class=\"show_card_back no_interpolation\"><img src=\"../assets/cards/back.png\" width=\"140\" height=\"200\" class=\"show_card_back no_interpolation\">")
        
            setTimeout(function() {
                $("#hand").html(st_oG);                $("#hand>img").attr("style", "transition-duration: 0.6s; filter: drop-shadow(0px 200px 3px #00000033); transform: scaleX(1);")

                setTimeout(function() {
                    $("#hand").attr("style", "transition-duration: 0.6s;")
                    $("#hand>img").attr("style", "transition-duration: 0.6s;")

                    const st_c1 = new Card(pthe_0x155_u_MC.c1.split("_")[0], pthe_0x155_u_MC.c1.split("_")[1]);                    const st_c2 = new Card(pthe_0x155_u_MC.c2.split("_")[0], pthe_0x155_u_MC.c2.split("_")[1]);                    $("#player_4_cards>img:first-child").attr("src", "../assets/cards/" + st_c1.GetImage());                    $("#player_4_cards>img:last-child").attr("src", "../assets/cards/" + st_c2.GetImage());                    pthe_0x155_sAP = false;                    if(dnat){return;}
                    pthe_0x155_func_ft();                }, 2000)
            }, 2050)
        }, 1000 * 0.3)
    })

  
}

function pthe_0x155_func_c_p()
{
    if(pthe_0x155_p_ICRW)
    {
       pthe_0x155_func_c_p_a(pthe_0x155_CD.PlayerNum);       setTimeout(() => {
        pthe_0x155_PR_UP = true;        pthe_0x155_U.chips += pthe_0x155_GD.Pot;        pthe_0x155_U.money = pthe_0x155_U.chips;        rc_0x01623.rc_0x01623_uu(pthe_0x155_U).then(d => {

            pthe_0x155_func_sng();            pthe_0x155_PR_UP = false;        })
       }, 3000)
    }
}

function pthe_0x155_func_c_p_a(pthe_0x155_func_c_p_a_1)
{
    const st_cvals = Array.from(document.getElementsByClassName("pot_chip"));    st_cvals.forEach(st_citer => {
        const c = st_citer;        var op = 100;        var get = "top";        var add = 1;        switch(pthe_0x155_func_c_p_a_1)
        {
            case pthe_0x155_CD.PlayerNum:
                break;            case 1:
            case 2:
                get = "left";                add = -1;                break;            case 3:
                get = "top";                add = -1;                break;            case 4:
                get = "left";                break;        }

        const cInt = setInterval(() => {
            c.style[get] = (parseFloat(c.style[get].replace("px", "")) + (add * 2.2)) + "px";            op -= 0.85;            c.style.opacity = op;            if(op < -200)
            {
                c.remove();                clearInterval(cInt);            }
        })
    })
}

function UpdateButtons()
{
    if(pthe_0x155_p_ICRW)
    {
        pthe_0x155_sBD = document.getElementById("button_game_options").innerHTML;        $("#all_in_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");        document.getElementById("all_in_button").setAttribute("disabled", "true");        $("#button_game_options").html(`<button onclick="pthe_0x155_func_c_p()" id="show_cards_button">Claim Pot</button>`);        $("#show_cards_button").attr("style", "width: 95%;");        $("#event_display").attr("style", "font-size: 0.95em;");        $("#event_display").text("Claim pot.");        return;    }else if(pthe_0x155_p_sC && pthe_0x155_func_imt())
    {
        if(pthe_0x155_sBD == '')
        {
            pthe_0x155_sBD = document.getElementById("button_game_options").innerHTML;            $("#button_game_options").html(`<button onclick="ShowCards()" id="show_cards_button">Show Cards</button>`);            $("#all_in_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");            document.getElementById("all_in_button").setAttribute("disabled", "true");            $("#show_cards_button").attr("style", "width: 95%;");            $("#event_display").attr("style", "font-size: 0.95em;");            $("#event_display").text("Show cards.");        }
        
        
        return;    }else if(pthe_0x155_sBD != '')
    {
        document.getElementById("button_game_options").innerHTML = pthe_0x155_sBD;        document.getElementById("all_in_button").setAttribute("disabled", "false");        pthe_0x155_sBD = '';    }

    const st_tCV = pu_0x023_func_ctcv();    if(!pthe_0x155_func_imt() || st_tCV <= 0)
    {
        $("#all_in_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");    }else{
        $("#all_in_button").attr("style", "");    }

    if(pu_0x023_CB >= pthe_0x155_GD.CurrentBet || pthe_0x155_GD.CurrentTurn != pthe_0x155_CD.PlayerNum)
    {
        $("#check_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");    }else{
        $("#check_button").attr("style", "");        if(pthe_0x155_GD.CurrentBlind == pthe_0x155_CD.PlayerNum && pthe_0x155_GD.CurrentStage == 0)
        {
            $("#event_display").attr("style", "font-size: 0.9em;");            $("#event_display").text("Match or raise.");        }else{
            $("#event_display").attr("style", "font-size: 0.75em;");            
            if(pthe_0x155_cB)
            {
                $("#event_display").text("Match or fold.");            }else{
                $("#event_display").text("Match, fold, or raise.");            }
        }
    }

    if(pu_0x023_CB > 0 || pthe_0x155_GD.CurrentTurn != pthe_0x155_CD.PlayerNum)
    {
        $("#fold_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");    }else{
        $("#fold_button").attr("style", "");    }

    if(pu_0x023_CB < pthe_0x155_GD.CurrentBet || pthe_0x155_u_MC.c1 == null || pthe_0x155_u_MC.c2 == null || pthe_0x155_GD.CurrentTurn != pthe_0x155_CD.PlayerNum)
    {
        $("#raise_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");        if((pthe_0x155_u_MC.c1 == null || pthe_0x155_u_MC.c2 == null) && pu_0x023_CB >= pthe_0x155_GD.CurrentBet)
        {
            $("#event_display").attr("style", "font-size: 0.9em;");            $("#event_display").text("Draw your cards.");        }
    }else{
        $("#raise_button").attr("style", "");        $("#event_display").attr("style", "font-size: 0.7em;");        if(pu_0x023_CB > 0 || pthe_0x155_cU.chips < 1)
        {
            $("#raise_button").text("Next Turn");            
            if(st_tCV > 0)
            {
                $("#event_display").text("Raise or end your turn.");            }else{
                $("#event_display").attr("style", "font-size: 0.85em;");                $("#event_display").text("End your turn.");            }
        }else{
            $("#raise_button").text("Check");            
            $("#event_display").text("Check or end your turn.");        }
    }

    if(pthe_0x155_GD.CurrentTurn != pthe_0x155_CD.PlayerNum)
    {
        $("#event_display").attr("style", "font-size: 1em;");        $("#event_display").text("Wait...");    }

}

function pthe_0x155_func_sng()
{
    pthe_0x155_GD.AllIn = [];    pthe_0x155_GD.CheckingBets = [];    pthe_0x155_GD.CurrentBet = pthe_0x155_GD.MinimumBet;    
    pthe_0x155_GD.CurrentTurn = 1;    pthe_0x155_GD.CurrentStage = 0;    pthe_0x155_GD.RoundsPlayed++;    pthe_0x155_GD.QueuedBets = [];    pthe_0x155_GD.PlayerCards = [{c1: null, c2: null},{c1: null, c2: null},{c1: null, c2: null},{c1: null, c2: null}];    pthe_0x155_GD.Folded = [];    pthe_0x155_GD.Pot = 0;    pthe_0x155_GD.PlayerBets = [0,0,0,0];    pthe_0x155_GD.CheckingBets = [];    pthe_0x155_GD.PublicCards = ["","","","",""]
    pthe_0x155_GD.ShowingCards = -1;    pthe_0x155_GD.Waiting = true;    pthe_0x155_GD.Winners = [];    pthe_0x155_GD.Votes = [];    pthe_0x155_GD.G_Fun = {x:0,y:0,p:0}

    pthe_0x155_GD.watching = []

    rc_0x01623.rc_0x01623_ur(pthe_0x155_GD).then(d => {
        pu_0x023_func_gsclgs();        window.location.reload();    });}

function pthe_0x155_func_button_m()
{
    const st_r = pthe_0x155_GD.CurrentBet - pu_0x023_CB;    if(st_r <= 0){return;}
    
    var st_rmval = pu_0x023_func_rcvfs(st_r);    for(var c = 0; c < st_rmval.length; c++)
    {
        for(var amnt = 0; amnt < st_rmval[c]; amnt++)
        {
            pu_0x023_func_actp(c + 1, true);        }
    }
}

function pthe_0x155_func_button_nt()
{
    if(pu_0x023_CB >= pthe_0x155_GD.CurrentBet)
    {
        pthe_0x155_func_ft();    }
}

function pthe_0x155_func_button_ai()
{
    CreateConfirmationMenu("Go All In?", function () {
        if(!pthe_0x155_func_imt()){return;}

        for(var v = 0; v < pu_0x023_CC.length; v++)
        {

            const st_o = pu_0x023_CC[v];            for(var a = 0; a < st_o; a++)
            {
                pu_0x023_func_actp(v + 1);            }
        }
    });}

var pthe_0x155_p_F = false;function pthe_0x155_func_button_f(pthe_0x155_func_button_f_1 = false)
{
    if(pthe_0x155_func_button_f_1)
    {
        if(!pthe_0x155_func_imt()) {return;}

        pthe_0x155_p_F = true;        pthe_0x155_func_ft();        return;    }

    CreateConfirmationMenu("Fold?", function () {
        if(!pthe_0x155_func_imt()) {return;}

        pthe_0x155_p_F = true;        pthe_0x155_func_ft();    })
}

var pthe_0x155_CPC = ["", "", "", "", ""]

function pthe_0x155_func_rd_ctf()
{
    const st_c = [DrawCard(), DrawCard(), DrawCard()]
 
    for(var v = 0; v < 3; v++)
    {
        pthe_0x155_GD.PublicCards[v] = st_c[v].Suit + "_" + st_c[v].Value;        pthe_0x155_CPC[v] = st_c[v].Suit + "_" + st_c[v].Value;        for(var i = 0; i < 4; i++)
        {
            if(pthe_0x155_GD.PlayerCards[i].c1 == pthe_0x155_GD.PublicCards[v] || pthe_0x155_GD.PlayerCards[i].c2 == pthe_0x155_GD.PublicCards[v])
            {
                pthe_0x155_func_rd_ctf();                return;            }
        }

    }
}

function pthe_0x155_func_rd_ctt()
{
    const st_cdr = DrawCard();    pthe_0x155_GD.PublicCards[3] = st_cdr.Suit + "_" + st_cdr.Value;    pthe_0x155_CPC[3] = st_cdr.Suit + "_" + st_cdr.Value;    for(var i = 0; i < 4; i++)
    {
        if(pthe_0x155_GD.PlayerCards[i].c1 == pthe_0x155_GD.PublicCards[3] || pthe_0x155_GD.PlayerCards[i].c2 == pthe_0x155_GD.PublicCards[3])
        {
            pthe_0x155_func_rd_ctt();            return;        }
    }
}

function pthe_0x155_func_rd_ctr()
{
    const st_cdrval = DrawCard();    pthe_0x155_GD.PublicCards[4] = st_cdrval.Suit + "_" + st_cdrval.Value;    pthe_0x155_CPC[4] = st_cdrval.Suit + "_" + st_cdrval.Value;    for(var i = 0; i < 4; i++)
    {
        if(pthe_0x155_GD.PlayerCards[i].c1 == pthe_0x155_GD.PublicCards[4] || pthe_0x155_GD.PlayerCards[i].c2 == pthe_0x155_GD.PublicCards[4])
        {
            pthe_0x155_func_rd_ctr();            return;        }
    }
}

function pthe_0x155_func_dw()
{
    pthe_0x155_GD.ShowingCards = -1;    const st_pc = [
        new Card(pthe_0x155_GD.PublicCards[0].split("_")[0], pthe_0x155_GD.PublicCards[0].split("_")[1]),
        new Card(pthe_0x155_GD.PublicCards[1].split("_")[0], pthe_0x155_GD.PublicCards[1].split("_")[1]),
        new Card(pthe_0x155_GD.PublicCards[2].split("_")[0], pthe_0x155_GD.PublicCards[2].split("_")[1]),
        new Card(pthe_0x155_GD.PublicCards[3].split("_")[0], pthe_0x155_GD.PublicCards[3].split("_")[1]),
        new Card(pthe_0x155_GD.PublicCards[4].split("_")[0], pthe_0x155_GD.PublicCards[4].split("_")[1])
    ]

    var st_h = []
    for(var v = 0; v < 4; v++)
    {
        if(pthe_0x155_GD.PlayerCards[v].c1 != null && pthe_0x155_GD.PlayerCards[v].c2 != null)
        {
            st_h.push([ new Card(pthe_0x155_GD.PlayerCards[v].c1.split("_")[0], pthe_0x155_GD.PlayerCards[v].c1.split("_")[1]),
                         new Card(pthe_0x155_GD.PlayerCards[v].c2.split("_")[0], pthe_0x155_GD.PlayerCards[v].c2.split("_")[1]) ])                           
        }
    }

    const st_w = FindWinner(st_h, st_pc);   

    pthe_0x155_GD.Winners = [JSON.stringify(st_w)]
}

function ShowWaitingScreen()
{
}

var pthe_0x155_func_htt_tT = 0, pthe_0x155_func_htt_lPG = 0;setInterval(pthe_0x155_func_htt, 1100);function pthe_0x155_func_htt()
{
    if(pthe_0x155_func_imt()){return;}

    if(pthe_0x155_func_htt_lPG != pthe_0x155_GD.CurrentTurn)
    {
        pthe_0x155_func_htt_lPG = pthe_0x155_GD.CurrentTurn;        pthe_0x155_func_htt_tT = 40;    }

    
}