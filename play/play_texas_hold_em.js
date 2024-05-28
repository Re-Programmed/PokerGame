//EMPTY ROOM
//eyJwbGF5ZXJzIjpbIldpbGwiLCJKb2UiXSwiY29kZSI6IiIsImdhbWUiOiJwb2tlciIsInRoZW1lIjoicHRnIiwiQ3VycmVudFR1cm4iOjEsIkN1cnJlbnRCbGluZCI6MSwiQ3VycmVudEJldCI6NSwiQ3VycmVudFN0YWdlIjowLCJSb3VuZHNQbGF5ZWQiOjAsIlF1ZXVlZEJldHMiOltdLCJBbGxJbiI6W10sIkNyZWF0b3IiOiJXaWxsIiwiTWluaW11bUJldCI6NSwiUGxheWVyQ2FyZHMiOlt7ImMxIjpudWxsLCJjMiI6bnVsbH0seyJjMSI6bnVsbCwiYzIiOm51bGx9LHsiYzEiOm51bGwsImMyIjpudWxsfSx7ImMxIjpudWxsLCJjMiI6bnVsbH1dLCJGb2xkZWQiOltdLCJQb3QiOiAwLCAiUGxheWVyQmV0cyI6IFswLCAwLCAwLCAwXSwiQ2hlY2tpbmdCZXRzIjogW10sICJQdWJsaWNDYXJkcyI6WyIiLCIiLCIiLCIiLCIiXSwiU2hvd2luZ0NhcmRzIjotMSwiV2lubmVycyI6W10sIldhaXRpbmciOnRydWUsIlZvdGVzIjpbXSwiR19GdW4iOnt4OjAseTowfX0===

//TODO:
    //Somehow the current turn is becoming off sync and two players will be playing at the same time.
    //SOMETIMES ON ENDING YOUR TURN, THE POT WILL RANDOMLY GET CHIPS ADDED TO IT.
    //Show player cards not working for some reason.
    //Add final hand check and winner gets the pot.

var GameData = {
    CurrentTurn: 0
}

var ClientData = {
    PlayerNum: 1,
    Players: []
}

var User = {
    
}

var CurrentRoom = "";

const ERROR_InvalidSession = {
    Message: `
        <h1 style="text-align: center; animation-name: fade_in_text; animation-duration: 0.8s;">Invalid Session</h1>
        <h4 style="text-align: center; animation-name: fade_in_text; animation-duration: 0.8s;">An instance of PokerGame is already ruinning on this device. %s</h4>
        <button style="position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%) scale(1.45);" onclick="MakeDominantSession()">Make Dominant Session</button>
    `,
    ErrorLog: 'Invalid Session: An instance of PokerGame is already ruinning on this device.',
    AlternateSession: 'Joining a alternate session with account: %s.',

    Unauth: (value) => {
        invalidSession = true;
        document.body.innerHTML = ERROR_InvalidSession.Message.replace(/%s/g, alt_account_test == null ? `(${value})` : `(${value}, Alt Account: ${alt_account_test})`);
        console.warn(ERROR_InvalidSession.ErrorLog);

        clearInterval(updateID);
    }
}

const SessionID = Math.floor(Math.random() * 1_000_000_000);
var invalidSession = false;

//Check if another session has overriden this one.
setInterval(function () {
    if(invalidSession){return;}
    const sessionCheck = JSON.parse(localStorage.getItem("PokerWebsite_ActiveSession" + (alt_account_test == null ? "" : alt_account_test)));
    if(sessionCheck && sessionCheck.SessionID != null && sessionCheck.SessionID != SessionID)
    {
        ERROR_InvalidSession.Unauth("Session Overridden");

        return;
    }
},100)

//Forces this window to be the game window.
function MakeDominantSession()
{
    if(window.location.search.includes("&forceValid="))
    {
        window.location.reload();
        return;
    }

    window.open('./index.html' + window.location.search + "&forceValid=true", "_self");
}

//On website closed.
const unload = function () {
    localStorage.removeItem("PokerWebsite_ActiveSession" + (alt_account_test == null ? "" : alt_account_test));
}

var alt_account_test = null;

window.addEventListener('load', function () {

    alt_account_test = GetURLParam("alt");

    //Only allow one window to be open.
    if(localStorage.getItem("PokerWebsite_ActiveSession" + (alt_account_test == null ? "" : alt_account_test)) && !GetURLParam("forceValid"))
    {
        ERROR_InvalidSession.Unauth("401 Unauthorized");
        return;
    }

    if(alt_account_test != null)
    {
        alert(ERROR_InvalidSession.AlternateSession.replace(/%s/g, alt_account_test));       
    }  

    localStorage.setItem("PokerWebsite_ActiveSession" + (alt_account_test == null ? "" : alt_account_test), JSON.stringify({active: true, SessionID: SessionID}));
    window.addEventListener('unload', unload);

    LoadSwipe(1);
    
    const acc = LocalStorage.GetCurrentAccount();
    if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
    {
        window.open('../signin/index.html?invalid=true', "_self")
    }

    //TESTING ACCOUNT
    if(alt_account_test != null)
    {
        acc.username = alt_account_test;
    }

    API.GetUser(acc.username).then(user => {
        //Does the user exist?
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }

        User = user;

        CreatePlayerDisplay(4, user);

        LoadLocalGameState("Cool Room");

        if(GetTotalChipValue() < 1)
        {
            //ADD CONVERSION RATE FOR MONEY TO CHIPS BASED ON ROOM STAKES.
            AddChipValueToSupply(user.money);
            User.chips = GetTotalChipValue();
            API.UpdateUser(User);
        }

        if(IHaveShownCards)
        {
            ShowCards(true);
        }
    })

   // SetBackgroundScroll(0.25);

    const table = GetURLParam("table");

    if(table == null)
    {
        this.window.open('../rooms_and_leaderboard/index.html', '_self');
    }

    CurrentRoom = table;

    BeginGame();

    AddTooltipElement(this.document.getElementById("fold_button"), "<h3>Fold</h3><p style=\"transform: translateY(-7px);\">Stop playing.</p>");
    AddTooltipElement(this.document.getElementById("check_button"), "<h3>Match</h3><p style=\"transform: translateY(-7px);\">Stay in the game.</p>");
    AddTooltipElement(this.document.getElementById("raise_button"), "<h4>Next Turn / Check</h4><p style=\"transform: translateY(-7px);\">Move on.</p>");

    //Load the game state to update everything to how it was when the user left.

    Update();

    this.setInterval(function () {
        UpdateButtons();
    }, 500)

    document.getElementById("pot").addEventListener('mouseleave', function (event) {
        document.getElementById("bet_display").style = "background-color: #00000000; border: 3px solid #00000000;";
        document.getElementById('bet_display_info').style = "color: #DDDDDD00;";
    })

    document.getElementById("pot").addEventListener('mouseenter', function (event) {
        document.getElementById("bet_display").style = "";
        document.getElementById('bet_display_info').style = "";

        document.getElementById('bet_display_info').innerHTML = `Current Bet: ${GameData.CurrentBet > CurrentBet ? GameData.CurrentBet : CurrentBet}<br><br>Pot: ${GameData.Pot}`
    })

    $("#deck").on('click', DeckClick);
})


function BeginGame()
{
    PopulateDeck();

    RenderDeck("#deck");
}

var MyCards = {c1: null, c2: null}

//Draws two cards to your hand for texas hold em.
function DrawCardsToHand(cardsUpdate = null)
{
    if(cardsUpdate != null && cardsUpdate.c1 != null && cardsUpdate.c2 != null)
    {
        const card1 = new Card(cardsUpdate.c1.split("_")[0], cardsUpdate.c1.split("_")[1]);
        const card2 = new Card(cardsUpdate.c2.split("_")[0], cardsUpdate.c2.split("_")[1]);

        RenderCard("#hand", card1);
        RenderCard("#hand", card2);

        MyCards.c1 = card1.Suit + "_" + card1.Value;
        MyCards.c2 = card2.Suit + "_" + card2.Value;
        
        return;
    }

    if(MyCards.c1 != null && MyCards.c2 != null || cardsUpdate != null){ return; }

    const card1 = DrawCard();
    const card2 = DrawCard();

    MyCards.c1 = card1.Suit + "_" + card1.Value;
    MyCards.c2 = card2.Suit + "_" + card2.Value;

    RenderCard("#hand", card1);
    RenderCard("#hand", card2);

    //NO REDRAWING CARDS!!!!!!!! (CHEATING)
    SaveLocalGameState();
}

function SetCurrentPlayer(playerNum)
{
    if(IsMyTurn())
    {
        if(!showingCards)
        {
            document.getElementById("fold_button").removeAttribute("disabled");
            document.getElementById("check_button").removeAttribute("disabled");
            document.getElementById("raise_button").removeAttribute("disabled");
        }

       $("#player_4_display").attr("style", "border: 3px solid #796600; transform: scale(1.05);")

       for(var v = 1; v < 4; v++)
       {
            $("#player_" + v + "_display").attr("style", "")
       }
    }else{
        $("#player_4_display").attr("style", "")
        if(!showingCards)
        {
            document.getElementById("fold_button").setAttribute("disabled", "true");
            document.getElementById("check_button").setAttribute("disabled", "true");
            document.getElementById("raise_button").setAttribute("disabled", "true");
        }

        var i = 1;
        for(var v = 1; v <= GameData.players.length; v++)
        {
            if(v == GameData.CurrentTurn)
            {
                $("#player_" + i + "_display").attr("style", "border: 3px solid #796600; transform: scale(1.05);")
            } else if(GameData.Folded.includes(v))
            {
                $("#player_" + i + "_display").attr("style", "transform: scale(0.95); background-color: #00312a;");
            } else{
                $("#player_" + i + "_display").attr("style", "")
            }
    
            if(v != ClientData.PlayerNum){i++;}
        }
    }

    
}

const updateID = setInterval(function () {
    Update();

    if(accelerateUpdate)
    {
        setTimeout(() => {
            Update();
        }, 500);
        setTimeout(() => {
            Update();
        }, 1000);
        setTimeout(() => {
            Update();
        }, 1500);
    }
}, 2000)

function Waiting_JoinTable()
{
    if($("#wait_join_button").text().startsWith("Loading")){return;}
    $("#wait_join_button").text("Loading...");
    if(!GameData.players.includes(User.username))
    {
        GameData.players.push(User.username);
        API.UpdateRoom(GameData);
    }else{
        GameData.players.splice(GameData.players.indexOf(User.username), 1);
        //Remove players vote if they had voted.
        if(GameData.Votes.includes(User.username))
        {
            GameData.Votes.splice(GameData.Votes.indexOf(User.username), 1);
        }
        API.UpdateRoom(GameData);
    }
}

function Waiting_VoteStart()
{
    if($("#wait_vote_button").text().startsWith("Loading")){return;}
    $("#wait_vote_button").text("Loading...");
    if(!GameData.Votes.includes(User.username))
    {
        GameData.Votes.push(User.username);
        API.UpdateRoom(GameData);
    }else{
        GameData.Votes.splice(GameData.Votes.indexOf(User.username), 1);
        API.UpdateRoom(GameData);
    }
}

var WasMyTurn = false;

var UpdateNum = 0;

var GottenRoom = false;

var PREVENT_UPDATE = false

function Update(ignoreState = false, forceAPI = false)
{
    if(PREVENT_UPDATE){return;}
    if(!IsMyTurn())
    {
        GottenRoom = false;
    }

    const iS = ignoreState;
    
    //Prevent fetching the room constantly if you are the current player.
    if(!GottenRoom || forceAPI || GameData.Waiting)
    {
        console.log("------------------- USED API");
        API.GetRoom(CurrentRoom).then(room => {
            GottenRoom = true;
            performUpdate(room, iS);
        })

    }else{
        console.log("------------------- USED LOCAL");
        performUpdate(GameData, iS);
    }
}

var lastStage = 0, lastShownCards = -1;

var WaitingScreenDisplayed = false;

const playerWaitingChip = `
    <div class="player_waiting_chip" id="player_%playerName%_waiting">%img%<h3>%playerName%</h3></div>
`

var waitingPlayers = []
var startTimer = -500;

var lastGFun = {x:0,y:0,p:0}
var lastMoveFun = null

var accelerateUpdate = false;

function CheckStartGame()
{
    //Force timer to 0.
    setInterval(() => {
        startTimer = 0;
    }, 1);

    if(GameData.Waiting && GameData.Votes.length > 0)
    {
        GameData.Waiting = false;
        GameData.Votes = [];

        //Randomize player order.
        var playerArr = JSON.parse(JSON.stringify(GameData.players));
        const ogLength = playerArr.length;
        for(var i = 0; i < ogLength; i++)
        {
            var id = Math.floor(Math.random() * playerArr.length);
            GameData.players[i] = playerArr[id];
            playerArr.splice(id, 1);
        }
        
        API.UpdateRoom(GameData).then(d => {
            ClearLocalGameState();
            window.location.reload();
        })
    }
}

var wasWaiting = false;
var delayWrongMoveFun = 0, lastFunText = null;

function performUpdate(room, iS)
{
    UpdateNum++;
    GameData = room;

    if(GameData.Waiting)
    {
        $("#waiting_screen").attr("style", "")
        $("#waiting_cover").attr("style", "")

        wasWaiting = true;
        ClearLocalGameState();

        //ShowWaitingScreen();

        var tableText = "Table: <br>";

        if(GameData.players.length < waitingPlayers.length)
        {
            waitingPlayers = []
            $("#waiting_screen_players").html("Table: <br><p>Loading...</p>");
        }

        //Create a little display chip for each player in the room. (display chip can be customized)
        for(var i = 0; i < GameData.players.length; i++)
        {
            if(waitingPlayers.length <= i){waitingPlayers.push({player: "", data: ""});}

            if(waitingPlayers[i].player != GameData.players[i])
            {
                waitingPlayers[i].player = GameData.players[i];
                const i2 = i;
                API.GetUser(waitingPlayers[i2].player).then(user => {
                    console.error("API")
                    var chip = playerWaitingChip.replace(/%playerName%/g, user.username);
                    if(user.icon != null && user.icon != undefined && user.icon != "null" && user.icon != "")
                    {
                        chip = chip.replace(/%img%/g, `<img src="%playerIcon%" width="32" height="32">`).replace(/%playerIcon%/g, atob(user.icon));
                    }
                    chip = chip.replace(/%img%/g, "") + "<br>";
                    waitingPlayers[i2].data = chip;
                })
            }

            tableText += waitingPlayers[i].data;
        }

        if(GameData.players.includes(User.username))
        {
            $("#wait_join_button").text("Leave Table");
            $("#wait_vote_button").attr("style", "visibility: default;");
        }else{
            $("#wait_join_button").text("Join Table");
            $("#wait_vote_button").attr("style", "visibility: hidden;");
        }

        if(GameData.Votes.includes(User.username))
        {
            $("#wait_vote_button").text("Remove Vote");
        }else{
            $("#wait_vote_button").text("Vote");
        }

        var name = GameData.room_name;
 
        //UPDATE START TIMER BASED ON # OF VOTES.
        if(GameData.Votes.length == GameData.players.length - 1)
        {
            if(startTimer < -400)
            {
                //Start timer counts down from 20 if all but one player voted.
                startTimer = 20;
                const id = setInterval(() => {
                    if((startTimer < 0 && startTimer > -400) || GameData.Waiting != true)
                    {
                        CheckStartGame();
                        clearInterval(id);
                    }

                    startTimer--;
                }, 1300)
            }else if(startTimer > 40)
            {
                startTimer = 40;
            }
        }else if(GameData.Votes.length == GameData.players.length)
        {
            if(startTimer < -400)
            {
                //Start timer counts down from 5 if all players voted.
                startTimer = 5;
                const id = setInterval(() => {
                    if((startTimer < 0 && startTimer > -400) || GameData.Waiting != true)
                    {
                        CheckStartGame();
                        clearInterval(id);
                    }

                    startTimer--;
                }, 1300)
            }else if(startTimer > 5)
            {
                startTimer = 5;
            }
        }else if(GameData.Votes.length > 0)
        {
            if(startTimer < -400)
            {
                //Start timer counts down if at least one player voted.
                startTimer = 80;
                const id = setInterval(() => {
                    if((startTimer < 0 && startTimer > -400) || GameData.Waiting != true)
                    {
                        CheckStartGame();
                        clearInterval(id);
                    }

                    startTimer--;
                }, 1300)
            }
        }else{
            startTimer = -500;
        }

        if(startTimer > 0)
        {
            name += " - " + startTimer + "s";
        }else if(startTimer == 0)
        {
            name += " - Loading...";
        }

        $("#waiting_room_name").text(name);

        $("#waiting_screen_players").html(tableText);

        for(var i = 0; i < GameData.Votes.length; i++)
        {
            $(`#player_${GameData.Votes[i]}_waiting`).attr("style", "background-color: #846e3055;")
        }

        return;
    }

    if(wasWaiting)
    {
        ClearLocalGameState();
        window.location.reload();
        //wasWaiting = false;
    }

    //Hide waiting screen.
    $("#waiting_screen").attr("style", "width: 0; height: 0; position: relative; visibility: none; transform: translate(-5000%, -5000%);")
    $("#waiting_cover").attr("style", "width: 0; height: 0; position: relative; visibility: none; transform: translate(-5000%, -5000%);")
    
    accelerateUpdate = false;
    delayWrongMoveFun++;

    //Update players best hand
    if(MyCards.c1 != null && MyCards.c2 != null && GameData.PublicCards[4] != '')
    {
        const PCards = [
            new Card(GameData.PublicCards[0].split("_")[0], GameData.PublicCards[0].split("_")[1]),
            new Card(GameData.PublicCards[1].split("_")[0], GameData.PublicCards[1].split("_")[1]),
            new Card(GameData.PublicCards[2].split("_")[0], GameData.PublicCards[2].split("_")[1]),
            new Card(GameData.PublicCards[3].split("_")[0], GameData.PublicCards[3].split("_")[1]),
            new Card(GameData.PublicCards[4].split("_")[0], GameData.PublicCards[4].split("_")[1])
        ]
    
        const hand = [ new Card(MyCards.c1.split("_")[0], MyCards.c1.split("_")[1]),
        new Card(MyCards.c2.split("_")[0], MyCards.c2.split("_")[1])]

        const BHand = GetBestPlayerHand(PCards, hand);

        $("#player_4_hand").text(BHand.hand);
    }

    if(!IsMyTurn())
    {
        if(GameData.G_Fun.x != lastGFun.x || GameData.G_Fun.y != lastGFun.y)
        {
            accelerateUpdate = true;
            delayWrongMoveFun = 0;
            if(GameData.G_Fun.p != lastGFun.p && $("#pot").children().length > 0)
            {
                lastMoveFun = document.getElementById("pot").children[Math.floor(Math.random() * $("#pot").children().length)];
            }
    
            if(lastMoveFun != null)
            {
                if(lastFunText != null){
                    const rm = lastFunText;
                    lastFunText = null;
                    rm.setAttribute("class", "remove_lft");
                    setTimeout(() => {
                        rm.remove();
                    }, 300);
                }
                lastFunText = document.createElement("p");
                lastFunText.textContent = GameData.players[GameData.CurrentTurn - 1];
                lastFunText.setAttribute("style", `position: fixed; top: ${GameData.G_Fun.y - 60}px; left: ${GameData.G_Fun.x - window.innerWidth/20}px; transition-duration: 0.5s;z-index: 5;`);
                lastFunText.setAttribute("class", "move_fun_text");

                lastMoveFun.setAttribute("style", `position: fixed; top: ${GameData.G_Fun.y - window.innerHeight/2.3}px; left: ${GameData.G_Fun.x - window.innerWidth/2.18}px; transition-duration: 0.5s;z-index: 5;`)
           
                document.body.appendChild(lastFunText);
            }
    
            lastGFun = GameData.G_Fun;
        }
        
    }

    if(delayWrongMoveFun < 10)
    {
        accelerateUpdate = true;
    }else if(lastFunText != null){
        const rm = lastFunText;
        lastFunText = null;
        rm.setAttribute("class", "remove_lft");
        setTimeout(() => {
            rm.remove();
        }, 300);
    }

    //ASSIGN PLAYER ID TO WHAT POSITION IN THE ARRAY OF PLAYERS THEY ARE AT.
    if(!reload)
    {
        for(var i = 0; i < room.players.length; i++)
        {
            if(room.players[i] == User.username)
            {
                ClientData.PlayerNum = i + 1;
            }
        }
    }

    console.log(room)

    //Update the current players array and display to match if any players have disconnected.
    while(GameData.players.length > ClientData.Players.length)
    {
        ClientData.Players.push({ username: "" });
    }

    for(var v = 1; v < 4; v++)
    {
        if($(`#player_${v}_display`).html() != " ")
        {
            if(v >= ClientData.Players.length)
            {
                $(`#player_${v}_display`).html(" ")
            }
            
        }
    }

    //Removes players that left.
    var i = 4;
    while(GameData.players.length < ClientData.Players.length && i > 0)
    {
        console.log("SHOULD REMOVE");
        if(ClientData.Players.length > i)
        {
            console.log("REMOVED DISPLAY" + (i));
            document.getElementById(`player_${i}_display`).setAttribute("class", "player_display_hidden");
            document.getElementById(`player_${i}_display`).setAttribute("style", "");
            document.getElementById(`player_${i}_display`).innerHTML = "";

            ClientData.Players.splice(i, 1);
        }

        i--;
    }
    
    while(lastStage < GameData.CurrentStage)
    {
        lastStage++;

        switch(lastStage)
        {
            //The flop needs to be rendered.
            case 1:
                for(var i = 0; i < 3; i++)
                {
                    const c = new Card(GameData.PublicCards[i].split("_")[0], GameData.PublicCards[i].split("_")[1])
                    setTimeout(function () {
                        RenderCard("#public_cards_display", c, 0.65);
                    }, v * 500)
                }
                break;
            //The turn or river should be rendered.
            case 2:
            case 3:
                const c = new Card(GameData.PublicCards[lastStage + 1].split("_")[0], GameData.PublicCards[lastStage + 1].split("_")[1])
                RenderCard("#public_cards_display", c, 0.65);
                break;
        }
    }
    
    //Updates players if a player joined in place of another.
    UpdateAllPlayers();

    if(!reload)
    {
        setTimeout(function () {
            UpdatePlayerAttribs();
        }, 1500)
    }

    //Update displays.
    SetCurrentPlayer();

    //Update Chip Counts for players.

    $("#player_4_chipcount").text(GetTotalChipValue());

    if(!WasMyTurn && IsMyTurn())
    {
        BeginTurn();
        WasMyTurn = true;
    }

    if(!IsMyTurn())
    {
        WasMyTurn = false;
    }

    if(GameData.ShowingCards != -1)
    {  
        if(lastShownCards != GameData.ShowingCards)
        {
            ShowPlayerCards(GameData.ShowingCards);
            lastShownCards = GameData.ShowingCards;
        }
    }else{
        lastShownCards = -1;
    }

    var i = 1;
    for(var v = 0; v < ClientData.Players.length; v++)
    {
        $(`#player_${i}_chipcount`).text(ClientData.Players[v].chips);

        if(v + 1 != ClientData.PlayerNum){i++;}
    }

    if(PotValue != GameData.Pot)
    {
        //console.error("Pot is off sync");
    }

    //Update player display if folded.
    if(Folded)
    {
        $("#player_4_display").attr("style", "transform: scale(0.85); background-color: #00312a;");
    }

    for(var i = 0; i < GameData.Folded; i++)
    {
        const playerID = GameData.players.indexOf(GameData.Folded[i]) + 1;

        if(playerID == ClientData.PlayerNum){continue;}

        if(playerID < ClientData.PlayerNum)
        {
            $(`#player_${playerID}_display`).attr("style", "transform: scale(0.85);background-color: #00312a;");
        }else{
            $(`#player_${playerID - 1}_display`).attr("style", "transform: scale(0.85);background-color: #00312a;");
        }
        
    }

    //Call the function queue.
    while(funcQueue.length > 0)
    {
        funcQueue[0]();
        funcQueue.splice(0, 1);
    }

    if(!reload)
    {
        UpdatePlayerAttribs();
        reload = true;
    }

    if(iS){return;}

    //Save the local game state to prevent the player from taking back moves that might have been pushed or recieved on the server.
    SaveLocalGameState();
}

function UpdateAllPlayers(refresh = false)
{
    var i = 1;
    for(var p = 0; p < GameData.players.length; p++)
    {
        if(GameData.players[p] == User.username)
        {
            ClientData.PlayerNum = p + 1;
            ClientData.Players[p] = User;

            continue;
        }

        if(GameData.players[p] != ClientData.Players[p].username || refresh || $(`#player_${i}_name_display`).text() != GameData.players[p])
        {
            console.error("UPDATE PLAYER:" + $(`#player_${p}_name_display`).text())
            const p2 = p;
            const i2 = i;
            API.GetUser(GameData.players[p2]).then(user => {
                ClientData.Players[p2] = user;
                CreatePlayerDisplay(i2, user);
                UpdatePlayerAttribs();
            })
        }
        
        i++;
    }
}

var funcQueue = []
function queue(v){funcQueue.push(v);}

//Check if it is the current users turn. Functions that modify the server should only be called if it is the users turn.
function IsMyTurn()
{
    return GameData.CurrentTurn == ClientData.PlayerNum;
}

var activeShowAnimation = false;
function ShowPlayerCards(player)
{
    if(activeShowAnimation){return;}
    if(player == ClientData.PlayerNum){return;}

    activeShowAnimation = true;

    player--;
    //Find which display represents this player.
    var playerDisplay = 0;
    var i = 0;
    for(var v = 0; v < ClientData.Players.length; v++)
    {
        if(ClientData.PlayerNum != v){i++;}

        if(v == player)
        {
            playerDisplay = i;
        }
    }

    console.error(playerDisplay)
    
    $(`#player_${playerDisplay}_cards`).attr("style", "transition-duration: 0.3s; opacity: 0;");
    setTimeout(() => {
        $(`#player_${playerDisplay}_cards`).attr("style", "transition-duration: 0.3s; opacity: 1; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(4);");
        $(`#player_${playerDisplay}_cards>img`).attr("style", "margin: 6.5px;");

        setTimeout(() => {
            $(`#player_${playerDisplay}_cards>img`).attr("style", "transition-duration: 0.3s; transform: scaleX(0);");
            setTimeout(() => {
                const pCard = GameData.PlayerCards[player];
                var card = new Card(pCard.c1.split("_")[0], pCard.c1.split("_")[1]);
   
                $(`#player_${playerDisplay}_cards>img:first-child`).attr("src", "../assets/cards/" + card.GetImage());
                card = new Card(pCard.c2.split("_")[0], pCard.c2.split("_")[1]);
                $(`#player_${playerDisplay}_cards>img:last-child`).attr("src", "../assets/cards/" + card.GetImage());
                $(`#player_${playerDisplay}_cards>img`).attr("style", "transition-duration: 0.3s; transform: scaleX(1); margin: 6.5px;");
                setTimeout(() => {
                    $(`#player_${playerDisplay}_cards`).attr("style", "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(4); transition-duration: 0.3s; opacity: 0;");
               
                    setTimeout(() => {
                        $(`#player_${playerDisplay}_cards`).attr("style", "transition-duration: 0.3s; opacity: 1;");              
                        $(`#player_${playerDisplay}_cards>img`).attr("style", "");     
                        activeShowAnimation = false;
                    }, 0.3 * 1000);
                }, 2000);
            }, 0.3 * 1000);
        }, 0.6 * 1000);
    }, 0.3 * 1000);
}

//QUEUE ONLY.
function FinishTurn()
{
    if(IsMyTurn())
    {
        PREVENT_UPDATE = true;
        var finishStage = false;
        CreateScrollText("Bet: " + CurrentBet, "lightblue");
        GameData.CurrentTurn++;

        if(GameData.players.length < GameData.CurrentTurn)
        {
            finishStage = true;
            GameData.CurrentTurn = 1;
        }

        //Update the bets that were made and the new minimum bet to stay in.
        GameData.QueuedBets = QueuedBets;
        GameData.CurrentBet = CurrentBet;

        //UPDATE USER DATA FOR HOW MUCH MONEY THE USER SPENT!
        User.chips = GetTotalChipValue();

        //ADD CONVERSION RATE FOR MONEY TO CHIPS BASED ON ROOM STAKES.
        User.money -= CurrentBet;

        API.UpdateUser(User);

        GameData.PlayerBets[ClientData.PlayerNum - 1] = CurrentBet;
        
        const LastUpset = UpsetOfCurrent;

        //Check weather to say raised or checked.
        if(LastUpset > 0)
        {
            setTimeout(function () {
                CreateScrollText("Raised: " + LastUpset, "blue");
            }, 1000)
        }else
        {
            if(GameData.CurrentBet == 0)
            {
                if(!Folded)
                {
                    setTimeout(function () {
                        CreateScrollText("Checked", "lightgreen");
                    }, 1000)
                }
            }else if(!Folded)
            {
                setTimeout(function () {
                    CreateScrollText("Matched: " + CurrentBet, "lightgreen");
                }, 1000)
            }
        }

        GameData.PlayerCards[ClientData.PlayerNum - 1] = MyCards;

        UpsetOfCurrent = -CurrentBet;
        CurrentBet = 0;
        QueuedBets = [];

        GameData.Pot = PotValue;

        if(UpsetOfCurrent > 0)
        {
            $("#turn_details_info").css("color", "lightgreen");
        }else if(UpsetOfCurrent == 0)
        {
            $("#turn_details_info").css("color", "lightblue");
        }else{
            $("#turn_details_info").css("color", "red");
        }
    
        $("#turn_details_info").text(UpsetOfCurrent > 0 ? (`+${UpsetOfCurrent}`) : (UpsetOfCurrent == 0 ? "0" : `${UpsetOfCurrent}`))

        if(Folded)
        {
            GameData.Folded.push(ClientData.PlayerNum);
            setTimeout(function () {
                CreateScrollText("Folded", "red");
            }, 2000)
        }else if(GetTotalChipValue() < 1)
        {
            setTimeout(function () {
                CreateScrollText("All In!", "gold");
            }, 2000)
        }

        
        if(finishStage)
        {
            FinishStage();
        }

        if(checkingBets)
        {
            if(GameData.CheckingBets.includes(ClientData.PlayerNum))
            {
                GameData.CheckingBets.splice(GameData.CheckingBets.indexOf(ClientData.PlayerNum), 1);
            }

            checkingBets = false;
        }

        //Save local game state on end.
        SaveLocalGameState();

        WasMyTurn = false;

        API.UpdateRoom(GameData).then(d => {
            PREVENT_UPDATE = false;
        })

        GottenRoom = false;
    }
}

//Called when the last player at the table has gone.
function FinishStage()
{
    console.log("FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG FINISG ");

    //Check if all players have bet the same amount, otherwise the game will have to go around one more time and force every player to match or fold.
    var maxBet = 0;

    for(var bet = 0; bet < GameData.players.length; bet++)
    {
        if(!GameData.Folded.includes(bet + 1))
        {
            if(maxBet < GameData.PlayerBets[bet])
            {
                maxBet = GameData.PlayerBets[bet];
            }
        }
    }

    var invalidBets = [-1];
    for(var bet = 0; bet < GameData.players.length; bet++)
    {
        if(!GameData.Folded.includes(bet))
        {
            if(GameData.PlayerBets[bet] < maxBet)
            {
                invalidBets.push(bet + 1);
            }
        }
    }

    console.log("INVALID BETS: " + invalidBets);

    if(invalidBets.length <= 1)
    {
        GameData.CurrentTurn = 1;
        GameData.CurrentBet = 0;
        GameData.CurrentStage++;
        GameData.CheckingBets = [];
        
        switch(GameData.CurrentStage)
        {
            case 1:
                CreateTheFlop();
                break;
            case 2:
                CreateTheTurn();
                break;
            case 3:
                CreateTheRiver();
                break;
            case 4:
                //Show cards.
                FinishGame_MAIN();
                break;
            case 5:
                //Determine pot payouts.
                DetermineWinners();
                break;
        }
    }else{
        console.log('INVALID BETS')
        GameData.CheckingBets = invalidBets;
        GameData.CurrentTurn = 1;
    }
}

var reload = false;
var checkingBets = false;

function FinishGame_CLIENT()
{
    //Update all players money.
    var i = 1;
    for(var p = 0; p < GameData.players.length; p++)
    {
        if(GameData.players[p] == User.username)
        {
            ClientData.PlayerNum = p + 1;
            ClientData.Players[p] = User;

            continue;
        }

        if(GameData.players[p] != ClientData.Players[p].username)
        {
            console.log("PLAYER " + p + " IS NOT ME AND ")
            const p2 = i;
            API.GetUser(GameData.players[p]).then(user => {
                ClientData.Players[p2] = user;
                CreatePlayerDisplay(p2, user);
                UpdatePlayerAttribs();
            })
        }

        i++;
    }
}

function FinishGame_MAIN()
{


}

var showingCards = false;

var IHaveShownCards = false;
var ICanRecieveWinnings = false;

function BeginTurn()
{
    Update(false, true);
    if(!IsMyTurn()){return;}

    UpsetOfCurrent = -GameData.CurrentBet;
    CurrentBet = 0;
    QueuedBets = [];
    checkingBets = false;

    if(GameData.CheckingBets.length > 0)
    {
        console.log("CHECKING BETS");
        checkingBets = true;
        CurrentBet = GameData.PlayerBets[ClientData.PlayerNum - 1];
        UpsetOfCurrent = CurrentBet - GameData.CurrentBet;
    }

    if(GameData.Winners.length > 0)
    {
        if(JSON.parse(GameData.Winners[0]).player == ClientData.PlayerNum)
        {
            if(!ICanRecieveWinnings)
            {
                ICanRecieveWinnings = true;
                VictoryScreen();
            }
        }
    }

    //Update all players chip counts.
    UpdateAllPlayers(true);
    
    //Update the text showing how much under or over the current bet you are.
    if(UpsetOfCurrent > 0)
    {
        $("#turn_details_info").css("color", "lightgreen");
    }else if(UpsetOfCurrent == 0)
    {
        $("#turn_details_info").css("color", "lightblue");
    }else{
        $("#turn_details_info").css("color", "red");
    }

    $("#turn_details_info").text(UpsetOfCurrent > 0 ? (`+${UpsetOfCurrent}`) : (UpsetOfCurrent == 0 ? "0" : `${UpsetOfCurrent}`))

    //Check if the game is starting and the current player is a big blind.
    if(GameData.CurrentStage == 0 && !checkingBets)
    {
        UpdatePlayerAttribs();
    }

    //Draw cards if we are not the blind and it is the first turn of the game.
    if(!HasDrawnCards && GameData.CurrentBlind != ClientData.PlayerNum)
    {
        DrawCardsToHand();
    }

    for(var b = 0; b < GameData.QueuedBets.length; b++)
    {
        AddChipToPotDisplay(GameData.QueuedBets[b], false, GameData.Pot);
    }
    //Save local game state on turn begin.
    SaveLocalGameState();

    GameData.QueuedBets = [];

    //We are currently on the reveal hands stage.
    if(GameData.CurrentStage == 4)
    {
        showingCards = true;
    }

    //Ensures that FinishTurn() is not called 2 times.
    var alreadyFinished = false;

    //All but one player have folded, and you havent folded!, you win!
    if(GameData.Folded.length >= GameData.players.length - 1 && !GameData.Folded.includes(User.username))
    {
        if(!ICanRecieveWinnings)
        {
            //Can recieve winnings.
            ICanRecieveWinnings = true;
            alreadyFinished = true;
            VictoryScreen();
        }
    }

    //We are checking bets and have already matched the given bet. Skip turn.
    if((GameData.CheckingBets.length > 0 && !GameData.CheckingBets.includes(ClientData.PlayerNum)) || Folded || GameData.Folded.includes(ClientData.PlayerNum))
    {
        GameData.QueuedBets = [];
        GameData.CurrentBet = 0;
        if(!alreadyFinished){FinishTurn(); alreadyFinished = true;}
    }

    //Full cycle of showing cards.
    if(GameData.ShowingCards != -1 && (IHaveShownCards || GameData.Folded.includes(ClientData.PlayerNum)))
    {
        if(!alreadyFinished){FinishTurn(); alreadyFinished = true;}
    }else if(GameData.Winners.length > 0)
    {
        if(JSON.parse(GameData.Winners[0]).player != ClientData.PlayerNum)
        {
            if(!alreadyFinished){FinishTurn(); alreadyFinished = true;}
        }
    }
    
}

function UpdatePlayerAttribs()
{
    ClearAllPlayerAttribs();

    if(User.username == GameData.Creator)
    {
        AddPlayerAttrib(4, PLAYER_ATTRIBUTES.House);
    }else {
        var i = 1;
        for(var v = 0; v < GameData.players.length; v++)
        {
            if(GameData.players[v] == GameData.Creator)
            {
                console.log("FOUND HOUSE");
                AddPlayerAttrib(i, PLAYER_ATTRIBUTES.House);
            }

            if(GameData.players[v] != User.username){ i++; }
        }
    }
    
    if(GameData.CurrentBlind == ClientData.PlayerNum)
    {
        console.log("YOU ARE BLIND")
        AddPlayerAttrib(4, PLAYER_ATTRIBUTES.BigBlind);
    }else{
        AddPlayerAttrib(GameData.CurrentBlind, PLAYER_ATTRIBUTES.BigBlind);
    }

}

//Returns true if the player has achieved the minimum bet. (Game shouldn't advance without this being true)
function HasAchievedMinBet()
{
    return GameData.MinimumBet <= CurrentBet;
}


var HasDrawnCards = false;
//Handles the beginning of the game when you draw your 2 cards.
function DeckClick()
{
    if(HasDrawnCards){return;}
    if(GameData.CurrentBlind == ClientData.PlayerNum)
    {
        if(HasAchievedMinBet())
        {
            HasDrawnCards = true;
            DrawCardsToHand();
        }
    }
}

var storedButtonData = ''

var showAnimPlaying = false;

function ShowCards(doNotAdvanceTurn = false)
{
    if(showAnimPlaying){return;}

    const dnat = doNotAdvanceTurn;

    showAnimPlaying = true;
    GameData.ShowingCards = ClientData.PlayerNum;
    API.UpdateRoom(GameData).then(d => {
        //Cards flipping up animation!
        $("#hand").attr("style", "transition-duration: 0.6s; transform: translate(0, -100%);")
        $("#hand>img").attr("style", "transition-duration: 0.6s; filter: drop-shadow(0px 200px 3px #00000033); transform: scaleX(-1);")

        const ogCards = $("#hand").html();

        setTimeout(function() {
            $("#hand").html("<img src=\"../assets/cards/back.png\" width=\"140\" height=\"200\" class=\"show_card_back no_interpolation\"><img src=\"../assets/cards/back.png\" width=\"140\" height=\"200\" class=\"show_card_back no_interpolation\">")
        
            setTimeout(function() {
                $("#hand").html(ogCards);
                $("#hand>img").attr("style", "transition-duration: 0.6s; filter: drop-shadow(0px 200px 3px #00000033); transform: scaleX(1);")

                setTimeout(function() {
                    $("#hand").attr("style", "transition-duration: 0.6s;")
                    $("#hand>img").attr("style", "transition-duration: 0.6s;")

                    //Update name cards display.
                    const card1 = new Card(MyCards.c1.split("_")[0], MyCards.c1.split("_")[1]);
                    const card2 = new Card(MyCards.c2.split("_")[0], MyCards.c2.split("_")[1]);

                    $("#player_4_cards>img:first-child").attr("src", "../assets/cards/" + card1.GetImage());
                    $("#player_4_cards>img:last-child").attr("src", "../assets/cards/" + card2.GetImage());

                    showAnimPlaying = false;

                    if(dnat){return;}
                    //Finish turn.
                    FinishTurn();
                }, 2000)
            }, 2050)
        }, 1000 * 0.3)
    })

  
}

function ClaimPot()
{
    if(ICanRecieveWinnings)
    {
        PREVENT_UPDATE = true;

        User.chips += GameData.Pot;

        //ADD CONVERSION FROM CHIPS TO MONEY!
        User.money = User.chips;

        API.UpdateUser(User).then(d => {

            StartNewGame();

            PREVENT_UPDATE = false;
        })
    }
}

function UpdateButtons()
{
    if(ICanRecieveWinnings)
    {
        $("#all_in_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");
        document.getElementById("all_in_button").setAttribute("disabled", "true");

        $("#check_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");
        $("#fold_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");
        $("#raise_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");

        $("#event_display").attr("style", "font-size: 0.95em;");
        $("#event_display").text("Claim pot.");

        return;
    }

    if(showingCards && IsMyTurn())
    {
        if(storedButtonData == '')
        {
            storedButtonData = document.getElementById("button_game_options").innerHTML;

            $("#button_game_options").html(`<button onclick="ShowCards()" id="show_cards_button">Show Cards</button>`);
            $("#all_in_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");
            document.getElementById("all_in_button").setAttribute("disabled", "true");

            $("#show_cards_button").attr("style", "width: 95%;");

            $("#event_display").attr("style", "font-size: 0.95em;");
            $("#event_display").text("Show cards.");
        }
        
        
        return;
    }else if(storedButtonData != '')
    {
        document.getElementById("button_game_options").innerHTML = storedButtonData;
        document.getElementById("all_in_button").setAttribute("disabled", "false");
        storedButtonData = '';
    }

    const tChipValue = GetTotalChipValue();
    if(!IsMyTurn() || tChipValue <= 0)
    {
        $("#all_in_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");
    }else{
        $("#all_in_button").attr("style", "");
    }

    if(CurrentBet >= GameData.CurrentBet || GameData.CurrentTurn != ClientData.PlayerNum)
    {
        $("#check_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");
    }else{
        $("#check_button").attr("style", "");
        if(GameData.CurrentBlind == ClientData.PlayerNum && GameData.CurrentStage == 0)
        {
            $("#event_display").attr("style", "font-size: 0.9em;");
            $("#event_display").text("Match or raise.");
        }else{
            $("#event_display").attr("style", "font-size: 0.75em;");
            
            if(checkingBets)
            {
                $("#event_display").text("Match or fold.");
            }else{
                $("#event_display").text("Match, fold, or raise.");
            }
        }
    }

    if(CurrentBet > 0 || GameData.CurrentTurn != ClientData.PlayerNum)
    {
        $("#fold_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");
    }else{
        $("#fold_button").attr("style", "");
    }

    if(CurrentBet < GameData.CurrentBet || MyCards.c1 == null || MyCards.c2 == null || GameData.CurrentTurn != ClientData.PlayerNum)
    {
        $("#raise_button").attr("style", "background-color: #51212155; color: #DDDDDD55; border: #1d614055; transform: scale(1);");

        if((MyCards.c1 == null || MyCards.c2 == null) && CurrentBet >= GameData.CurrentBet)
        {
            $("#event_display").attr("style", "font-size: 0.9em;");
            $("#event_display").text("Draw your cards.");
        }
    }else{
        $("#raise_button").attr("style", "");

        $("#event_display").attr("style", "font-size: 0.7em;");

        if(CurrentBet > 0)
        {
            $("#raise_button").text("Next Turn");
            
            if(tChipValue > 0)
            {
                $("#event_display").text("Raise or end your turn.");
            }else{
                $("#event_display").attr("style", "font-size: 0.85em;");
                $("#event_display").text("End your turn.");
            }
        }else{
            $("#raise_button").text("Check");
            
            $("#event_display").text("Check or end your turn.");
        }
    }

    if(GameData.CurrentTurn != ClientData.PlayerNum)
    {
        $("#event_display").attr("style", "font-size: 1em;");
        $("#event_display").text("Wait...");
    }

}

//Called after a game has ended to bring up waiting screens etc.
function StartNewGame()
{
    GameData.AllIn = [];
    GameData.CheckingBets = [];
    GameData.CurrentBet = GameData.MinimumBet;
    
    GameData.CurrentTurn = 1;
    GameData.CurrentStage = 0;

    GameData.RoundsPlayed++;
    GameData.QueuedBets = [];
    GameData.PlayerCards = [{c1: null, c2: null},{c1: null, c2: null},{c1: null, c2: null},{c1: null, c2: null}];
    GameData.Folded = [];
    GameData.Pot = 0;
    GameData.PlayerBets = [0,0,0,0];
    GameData.CheckingBets = [];
    GameData.PublicCards = ["","","","",""]
    GameData.ShowingCards = -1;
    GameData.Waiting = true;
    GameData.Winners = [];
    GameData.Votes = [];
    GameData.G_Fun = {x:0,y:0,p:0}

    API.UpdateRoom(GameData).then(d => {
        ClearLocalGameState();
        window.location.reload();
    });
}

function Match()
{
    const remove = GameData.CurrentBet - CurrentBet;

    if(remove <= 0){return;}
    
    var removal = RemoveChipValueFromSupply(remove);

    for(var c = 0; c < removal.length; c++)
    {
        for(var amnt = 0; amnt < removal[c]; amnt++)
        {
            AddChipToPot(c + 1, true);
        }
    }
}

function NextTurn()
{
    if(CurrentBet >= GameData.CurrentBet)
    {
        FinishTurn();
    }
}

function AllIn()
{
    CreateConfirmationMenu("Go All In?", function () {
        if(!IsMyTurn()){return;}

        for(var v = 0; v < ChipCount.length; v++)
        {

            const OGcount = ChipCount[v];
            for(var amnt = 0; amnt < OGcount; amnt++)
            {
                AddChipToPot(v + 1);
            }
        }
    });
}

var Folded = false;

function Fold()
{
    CreateConfirmationMenu("Fold?", function () {
        if(!IsMyTurn()) {return;}

        Folded = true;
        FinishTurn();
    })
}

var CurrentPublicCards = ["", "", "", "", ""]

function CreateTheFlop()
{
    const cards = [DrawCard(), DrawCard(), DrawCard()]
 
    for(var v = 0; v < 3; v++)
    {
        GameData.PublicCards[v] = cards[v].Suit + "_" + cards[v].Value;
        CurrentPublicCards[v] = cards[v].Suit + "_" + cards[v].Value;

        //Ensure no player has the cards that were put into the flop.
        for(var i = 0; i < 4; i++)
        {
            if(GameData.PlayerCards[i].c1 == GameData.PublicCards[v] || GameData.PlayerCards[i].c2 == GameData.PublicCards[v])
            {
                CreateTheFlop();
                return;
            }
        }

       // const myId = v;
       // setTimeout(function () {
       //     RenderCard("#public_cards_display", cards[myId], 0.65);
      //  }, v * 500)
    }
}

function CreateTheTurn()
{
   // lastStage = 2;
    const card = DrawCard();
    GameData.PublicCards[3] = card.Suit + "_" + card.Value;
    CurrentPublicCards[3] = card.Suit + "_" + card.Value;

    for(var i = 0; i < 4; i++)
    {
        if(GameData.PlayerCards[i].c1 == GameData.PublicCards[3] || GameData.PlayerCards[i].c2 == GameData.PublicCards[3])
        {
            CreateTheTurn();
            return;
        }
    }

   // RenderCard("#public_cards_display", card, 0.65);
}

function CreateTheRiver()
{
   // lastStage = 3;
    const card = DrawCard();
    GameData.PublicCards[4] = card.Suit + "_" + card.Value;
    CurrentPublicCards[4] = card.Suit + "_" + card.Value;

    for(var i = 0; i < 4; i++)
    {
        if(GameData.PlayerCards[i].c1 == GameData.PublicCards[4] || GameData.PlayerCards[i].c2 == GameData.PublicCards[4])
        {
            CreateTheRiver();
            return;
        }
    }

   // RenderCard("#public_cards_display", card, 0.65);
}

function DetermineWinners()
{
    GameData.ShowingCards = -1;

    const PCards = [
        new Card(GameData.PublicCards[0].split("_")[0], GameData.PublicCards[0].split("_")[1]),
        new Card(GameData.PublicCards[1].split("_")[0], GameData.PublicCards[1].split("_")[1]),
        new Card(GameData.PublicCards[2].split("_")[0], GameData.PublicCards[2].split("_")[1]),
        new Card(GameData.PublicCards[3].split("_")[0], GameData.PublicCards[3].split("_")[1]),
        new Card(GameData.PublicCards[4].split("_")[0], GameData.PublicCards[4].split("_")[1])
    ]

    var hands = []
    for(var v = 0; v < 4; v++)
    {
        if(GameData.PlayerCards[v].c1 != null && GameData.PlayerCards[v].c2 != null)
        {
            hands.push([ new Card(GameData.PlayerCards[v].c1.split("_")[0], GameData.PlayerCards[v].c1.split("_")[1]),
                         new Card(GameData.PlayerCards[v].c2.split("_")[0], GameData.PlayerCards[v].c2.split("_")[1]) ])                           
        }
    }

    const winner = FindWinner(hands, PCards);   

    GameData.Winners = [JSON.stringify(winner)]
}

function ShowWaitingScreen()
{
    console.error("WAITING")
}

var timeoutTimer = 0, lastPlayerGoing = 0;

//Handles the information to detect if the current player has left or gone AFK, forcing them to fold.
setInterval(HandleTimeoutTimer, 1100);
function HandleTimeoutTimer()
{
    if(IsMyTurn()){return;}

    if(lastPlayerGoing != GameData.CurrentTurn)
    {
        lastPlayerGoing = GameData.CurrentTurn;
        timeoutTimer = 40;
    }

    
}