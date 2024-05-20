var GameData = {
    CurrentTurn: 0
}

var ClientData = {
    PlayerNum: 1,
    Players: []
}

var User = {
    
}

window.addEventListener('load', function () {
    LoadSwipe(1);
    
    const acc = LocalStorage.GetCurrentAccount();
    if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
    {
        window.open('../signin/index.html?invalid=true', "_self")
    }

    API.GetUser(acc.username).then(user => {
        //Does the user exist?
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }

        User = user;

        CreatePlayerDisplay(4, user);
    })

   // SetBackgroundScroll(0.25);

    const table = GetURLParam("table");

    if(table == null)
    {
        this.window.open('../rooms_and_leaderboard/index.html', '_self');
    }

    BeginGame();

    AddTooltipElement(this.document.getElementById("fold_button"), "<h3>Fold</h3><p style=\"transform: translateY(-7px);\">Stop playing.</p>");
    AddTooltipElement(this.document.getElementById("check_button"), "<h3>Match</h3><p style=\"transform: translateY(-7px);\">Stay in the game.</p>");
    AddTooltipElement(this.document.getElementById("raise_button"), "<h3>Next Turn</h3><p style=\"transform: translateY(-7px);\">Move on.</p>");

    Update();

    document.getElementById("pot").addEventListener('mouseleave', function (event) {
        document.getElementById("bet_display").style = "background-color: #00000000; border: 3px solid #00000000;";
        document.getElementById('bet_display_info').style = "color: #DDDDDD00;";
    })

    document.getElementById("pot").addEventListener('mouseenter', function (event) {
        document.getElementById("bet_display").style = "";
        document.getElementById('bet_display_info').style = "";

        document.getElementById('bet_display_info').innerHTML = `Current Bet: ${GameData.CurrentBet > CurrentBet ? GameData.CurrentBet : CurrentBet}<br><br>Pot: ${PotValue}`
    })

    $("#deck").on('click', DeckClick);
})

function BeginGame()
{
    PopulateDeck();

    RenderDeck("#deck");
}

//Draws two cards to your hand for texas hold em.
function DrawCardsToHand()
{
    const card1 = DrawCard();
    const card2 = DrawCard();

    RenderCard("#hand", card1);
    RenderCard("#hand", card2);
}

function SetCurrentPlayer(playerNum)
{
    if(IsMyTurn())
    {
       

       document.getElementById("fold_button").setAttribute("disabled", "false");
       document.getElementById("check_button").setAttribute("disabled", "false");
       document.getElementById("raise_button").setAttribute("disabled", "false");

       $("#player_4_display").attr("style", "border: 3px solid #796600; transform: scale(1.05);")

       for(var v = 1; v < 4; v++)
       {
            $("#player_" + v + "_display").attr("style", "")
       }
    }else{
        $("#player_4_display").attr("style", "")
        document.getElementById("fold_button").setAttribute("disabled", "true");
        document.getElementById("check_button").setAttribute("disabled", "true");
        document.getElementById("raise_button").setAttribute("disabled", "true");

        var i = 1;
        for(var v = 1; v <= GameData.players.length; v++)
        {
            if(v == GameData.CurrentTurn)
            {
                $("#player_" + i + "_display").attr("style", "border: 3px solid #796600; transform: scale(1.05);")
            }else{
                $("#player_" + i + "_display").attr("style", "")
            }
    
            if(v != ClientData.PlayerNum){i++;}
        }
    }

    
}

setInterval(function () {
    Update();
}, 2000)

var WasMyTurn = false;

var UpdateNum = 0;

function Update()
{
    API.GetRoom_TEST().then(room => {
        UpdateNum++;
        GameData = room;

        //Update the current players array and display to match if any players have disconnected.
        while(GameData.players.length > ClientData.Players.length)
        {
            ClientData.Players.push({ username: "" });
        }

        //Removes players that left.
        var i = 2;
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
        
        
        //Updates players if a player joined in place of another.
        for(var p = 0; p < GameData.players.length; p++)
        {
            if(ClientData.Players[p].username == User.username)
            {
                ClientData.PlayerNum = p + 1;
                ClientData.Players[p] = User;

                if(User.username == GameData.Creator)
                {
                    AddPlayerAttrib(4, PLAYER_ATTRIBUTES.House);
                }

                continue;
            }

            if(GameData.players[p] != ClientData.Players[p].username)
            {
                const p2 = p;
                API.GetUser(GameData.players[p]).then(user => {
                    ClientData.Players[p2] = user;
                    CreatePlayerDisplay(p2, user);
                })
            }

            if(ClientData.Players[p].username == GameData.Creator)
            {
                AddPlayerAttrib(p, PLAYER_ATTRIBUTES.House);
            }
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

        var i = 1;
        for(var v = 0; v < ClientData.Players.length; v++)
        {
            $(`#player_${i}_chipcount`).text(ClientData.Players[v].chips);

            if(v + 1 != ClientData.PlayerNum){i++;}
        }

        //Call the function queue.
        while(funcQueue.length > 0)
        {
            funcQueue[0]();
            funcQueue.splice(0, 1);
        }
    })
}

var funcQueue = []
function queue(v){funcQueue.push(v);}

//Check if it is the current users turn. Functions that modify the server should only be called if it is the users turn.
function IsMyTurn()
{
    return GameData.CurrentTurn == ClientData.PlayerNum;
}

//QUEUE ONLY.
function FinishTurn()
{
    if(IsMyTurn())
    {
        GameData.CurrentTurn++;

        if(GameData.players.length < GameData.CurrentTurn)
        {
            GameData.CurrentTurn = 1;
        }

        API.SetRoom_TEST(GameData);
    }
}

function FinishRound()
{
    //Move the blind to the next player.
    if(GameData.CurrentBlind == ClientData.PlayerNum)
    {
        if(GameData.CurrentBlind + 1 > GameData.Players.length)
        {
            GameData.CurrentBlind = 0;
        }

        GameData.CurrentBlind++;  
        GameData.CurrentTurn = GameData.CurrentBlind;  
    }
}

function BeginTurn()
{
    UpsetOfCurrent = -GameData.CurrentBet;
    CurrentBet = 0;
    QueuedBets = [];

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
    if(GameData.CurrentStage == 0)
    {
        if(GameData.CurrentBlind == ClientData.PlayerNum)
        {
            setTimeout(function () {
                console.log("YOU ARE BLIND")
                AddPlayerAttrib(4, PLAYER_ATTRIBUTES.BigBlind);
            }, 1000)
        }
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

function Check()
{
    const remove = GameData.CurrentBet - CurrentBet;

    if(remove <= 0){return;}
    
    var removal = RemoveChipValueFromSupply(remove);

    for(var c = 0; c < removal.length; c++)
    {
        for(var amnt = 0; amnt < removal[c]; amnt++)
        {
            console.log()
            AddChipToPot(c + 1, true);
        }
    }
}
