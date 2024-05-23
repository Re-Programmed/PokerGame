var ChipCount = [0, 0, 0, 0, 0]

var CurrentPotChips = []

var ChipValues = [
    1,
    10,
    25,
    50,
    100
]

var MonetaryConversions = [
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

var CurrentChipSet = CHIP_SETS.DefaultSet;

const PLAYER_HTML_ATTRIBS = `<div id="%p%_attribs" style="width: 100%; height: 16px;"></div>`
const PLAYER_HTML = `

    <h3>%username%</h3>
    <div style="border: 3px solid #222222; background-color: #182920; height: 17px;"><p id="player_%p%_chipcount" style="transform: translateY(-17px); text-align: center;">%chips%</p></div>
`

var CurrentChipMenu = null;

//Creates the display for a players username, info, and icon.
function CreatePlayerDisplay(playerNumber, user)
{
    var ht = PLAYER_HTML;

    if(user.icon != null && user.icon != undefined && user.icon != "" && user.icon != "null")
    {
        ht = PLAYER_HTML_ATTRIBS + `<img src="%icon%">` + ht;
    }else{
        ht = PLAYER_HTML_ATTRIBS + ht;
    }

    ht = ht.replace("%icon%", atob(user.icon)).replace(/%username%/g, user.username).replace(/%chips%/g, user.chips).replace(/%p%/g, playerNumber);

    $(`#player_${playerNumber}_display`).html(ht).attr("class", "player_display");
}


//Adds the given chip value to the players supply.
function AddChipToSupply(chipValue)
{
    const flip = Math.random() < 0.5;

    const cDisplay = $(`#chip_${chipValue}_display`);

    const newChip = document.createElement("img");
    newChip.classList = "no_interpolation " + (flip ? "chip_f" : "chip")
    newChip.style = `top: ${40 - ChipCount[chipValue - 1] * 4}px;`;

    newChip.src = "../assets/chips/" + CurrentChipSet.folder + "/" + chipValue + ".png";

    AddTooltipElement(newChip, `<h3>${CurrentChipSet.chipNames[chipValue - 1]}</h3><p style="transform: translateY(-7px);">${ChipValues[chipValue - 1]} = $${MonetaryConversions[chipValue - 1]}</p>`)

    newChip.setAttribute("val", chipValue);
    newChip.addEventListener('click', chipHandler);

    cDisplay.append(newChip);

    ChipCount[chipValue - 1]++;
}


//Removes a chip from the players supply and returns true if the removal was successful.
function RemoveChipFromSupply(chipValue)
{
    if(ChipCount[chipValue - 1] <= 0){ return false; }
    ChipCount[chipValue - 1]--;
    const cDisplay = $(`#chip_${chipValue}_display`);
    cDisplay.find(":last-child").remove();

    return true;
}

//Adds the given number in chip value to the player's hand.
function AddChipValueToSupply(value)
{
    var counts = []
    
    for(var i = ChipValues.length - 1; i >= 0; i--)
    {
        counts.push(Math.floor(value / ChipValues[i]));

        console.log(`${i}: ${Math.floor(value / ChipValues[i])}`)

        value = value % ChipValues[i];

        console.log(`NEW: ${value}`)
    }

    console.log(counts)

    for(var c = 0; c < counts.length; c++)
    {
        for(var amnt = 0; amnt < counts[c]; amnt++)
        {
            AddChipToSupply(counts.length - c);
        }
    }
}

//Removes the given number in chip value to the player's hand.
function RemoveChipValueFromSupply(value, TotalRemoval = [0, 0, 0, 0, 0])
{
    const ogValue = value;
    var counts = []

    //Iterate over every chip type, checking how many of each can fit into the attempted removal and adding that value to counts.
    for(var i = ChipValues.length - 1; i >= 0; i--)
    {
        var attempt = Math.floor(value/ChipValues[i]);

        counts[i] = attempt > ChipCount[i] ? ChipCount[i] : attempt;
        TotalRemoval[i] += counts[i];
        value -= counts[i] * ChipValues[i];
    }

    console.log("TRY: " + counts + ", " + value)

    //Not all of the given value was removed, this can occur if the player needs to remove 25 and only has a 50 chip.
    //This means the large chips must be broken down into smaller chips.
    if(value > 0)
    {
        //Break down chip into largest value other chips.
        for(var i = ChipCount.length - 1; i >= 1; i--)
        {
            if(ChipCount[i] > 0)
            {
                RemoveChipFromSupply(i + 1);
                var val = ChipValues[i];

                console.log("BROKE A CHIP DOWN " + (i + 1))

                for(var c = i - 1; c >= 0; c--)
                {
                    if(val == 0){break;}
                    const add = Math.floor(val / ChipValues[c]);
                    val = val % ChipValues[c];

                    console.log(add + ":" + val);

                    for(var v = 0; v < add; v++)
                    {
                        AddChipToSupply(c + 1);
                    }
                }

                for(var i = 0; i < counts.length; i++)
                {
                    for(var amnt = 0; amnt < counts[i]; amnt++)
                    {
                        RemoveChipFromSupply(i + 1);
                    }
                }

                //Successfully broke down a chip, retry the removal.
                return RemoveChipValueFromSupply(value, TotalRemoval);
            }
        }

        //FAILURE, user did not have enough chips.
        console.log("FAILURE")
    }


    //Successful removal.

    for(var i = 0; i < counts.length; i++)
    {
        for(var amnt = 0; amnt < counts[i]; amnt++)
        {
            RemoveChipFromSupply(i + 1);
        }
    }

    CondenseChips();

    return TotalRemoval;
}

//Returns the players current total chip value.
function GetTotalChipValue()
{
    var total = 0;
    for(var chip = 0; chip < ChipCount.length; chip++)
    {
        total += ChipCount[chip] * ChipValues[chip];
    }

    return total;
}

//Moves the chips into the representation that uses the least chips.
function CondenseChips()
{
    const totalValue = GetTotalChipValue();

    for(var chip = 0; chip < ChipCount.length; chip++)
    {
        var nonZero = true;
        while(nonZero)
        {
            nonZero = RemoveChipFromSupply(chip + 1);
        }
        
    }

    AddChipValueToSupply(totalValue);
}

function chipHandler()
{
    if(CurrentChipMenu != null){CurrentChipMenu.remove();}

    const options = document.createElement('div');

    options.id = "chip_menu";
    options.innerHTML = `
        <button val="${this.getAttribute("val")}" onclick="BreakChip(this.getAttribute('val'));">Break</button>
        <button onclick="AddChipToPot(this.getAttribute('val'))" val="${this.getAttribute("val")}">Add</button>
    `

    options.style = "position: fixed; top: " + LastMousePosition.Y + "px; left: " + LastMousePosition.X + "px;";

    document.body.appendChild(options);

    CurrentChipMenu = options;
}

//Splits a chip into its closest smaller value chips.
function BreakChip(chipValue)
{
    if(chipValue <= 1){return;}

    if(ChipCount[chipValue - 1] > 0)
    {
        RemoveChipFromSupply(chipValue);
        var val = ChipValues[chipValue - 1];

        console.log("BROKE A CHIP DOWN " + (chipValue + 1))

        for(var c = chipValue - 2; c >= 0; c--)
        {
            if(val == 0){break;}
            const add = Math.floor(val / ChipValues[c]);
            val = val % ChipValues[c];

            console.log(add + ":" + val);

            for(var v = 0; v < add; v++)
            {
                AddChipToSupply(c + 1);
            }
        }
    }
}

window.addEventListener('click', function (event) {
    if(CurrentChipMenu != null && event.target != CurrentChipMenu && !(event.target.attributes.length > 0 && (event.target.attributes[0].nodeValue.includes("chip") || event.target.attributes[0].nodeValue.includes("chip_f"))))
    {
        CurrentChipMenu.remove();
    }
})

//Attributes that players can have, like BIG BLIND.
const PLAYER_ATTRIBUTES = {
    BigBlind: { icon: "big_blind_chip.png", ToolTip: "<h4>Big Blind</h4><p style=\"transform: translateY(-7px);\">Must Bet</p>" },
    House: { icon: "house_chip.png", ToolTip: "<h4>House</h4><p style=\"transform: translateY(-7px);\">Created The Room</p>"}
}

function AddPlayerAttrib(player, attrib)
{
    const newAtt = document.createElement('img')
    newAtt.classList = "no_interpolation attrib_display";
    newAtt.src = `../assets/chips/${CurrentChipSet.folder}/${attrib.icon}`;

    AddTooltipElement(newAtt, attrib.ToolTip);

    $(`#${player}_attribs`).append(newAtt);
}

function ClearAllPlayerAttribs()
{
    for(var v = 1; v <= 4; v++)
    {
        if(document.getElementById(`${v}_attribs`) == null){continue;}
        document.getElementById(`${v}_attribs`).innerHTML = "";
    }
}

var PotValue = 0;
var CurrentBet = 0;

//Add a chip object to the pot in the middle.
function AddChipToPotDisplay(chipValue, dontUpdatePotChips = false)
{
    if(!dontUpdatePotChips)
    {
        CurrentPotChips.push(chipValue);
    }

    PotValue += ChipValues[chipValue - 1];

    var x = (Math.random() * 180);
    var y = (Math.random() * 180);

    const flip = Math.random() < 0.5;

    const newChip = document.createElement("img");
    newChip.classList = "no_interpolation pot_chip";
    newChip.style = `position: fixed; top: ${y}px; left: ${x}px;`
    newChip.src = "../assets/chips/" + CurrentChipSet.folder + "/" + chipValue + ".png";
    AddTooltipElement(newChip, `<h3>${CurrentChipSet.chipNames[chipValue - 1]}</h3><p style="transform: translateY(-7px);">${ChipValues[chipValue - 1]} = $${MonetaryConversions[chipValue - 1]}</p>`)

    newChip.setAttribute("val", chipValue);
    //newChip.addEventListener('click', chipHandler);

    $("#pot").append(newChip);
}

var QueuedBets = []
var UpsetOfCurrent = 0

//Adds a chip object to the pot in the middle AND REMOVES IT FROM THE SUPPLY.
function AddChipToPot(chipValue, ignoreRemoval = false)
{
    if(!IsMyTurn()){return;}
    if(checkingBets && GameData.CurrentBet < CurrentBet + ChipValues[chipValue - 1]){ return; }

    UpsetOfCurrent += ChipValues[chipValue - 1];

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
    console.log(UpsetOfCurrent)

    CurrentBet += ChipValues[chipValue - 1];
    AddChipToPotDisplay(chipValue);

    if(!ignoreRemoval)
    {
        RemoveChipFromSupply(chipValue);
    }

    QueuedBets.push(chipValue);
}

//Saves variables related to losing connection or reloading the page that should remain consistent.
function SaveLocalGameState()
{
    const LocalGameData = {
        QueuedBets: QueuedBets,
        WasMyTurn: WasMyTurn,
        UpsetOfCurrent: UpsetOfCurrent,
        RoomName: GameData.room_name,
        LastRoomRound: GameData.RoundsPlayed,
        LastRoomEvent: GameData.CurrentStage,
        MyCards: MyCards,
        ChipCount: ChipCount,
        CurrentBet: CurrentBet,
        CurrentPotChips: CurrentPotChips,
        checkingBets: checkingBets,
        Folded: Folded
    }

    LocalStorage.UpdateRoomLocalData(LocalGameData);
}

function CheckIsValidRoomLocalData()
{
    const LocalGameData = LocalStorage.RetrieveRoomLocalData();
    if(LocalGameData.RoomName != current_room || LocalGameData.LastRoomRound != GameData.RoundsPlayed || LocalGameData.LastRoomEvent != GameData.CurrentStage)
    {
        return false;
    }

    return true;
}

//Loads variables related to losing connection or reloading the page that should remain consistent.
//Returns false if the room loaded is different to the room that the user was previously in.
function LoadLocalGameState(current_room)
{
    console.log("LAODDING GAME")

    const LocalGameData = LocalStorage.RetrieveRoomLocalData();

    console.log(LocalGameData);

    if(LocalGameData == null || LocalGameData == undefined){return false;}

    //Check if the data saved pertains to this room.
    if(LocalGameData.RoomName != current_room)
    {
        return false;
    }

    //Set chip amounts to what they were before the reload.
    for(var v = 0; v < LocalGameData.ChipCount.length; v++)
    {
        for(var amnt = 0; amnt < LocalGameData.ChipCount[v]; amnt++)
        {
            AddChipToSupply(v + 1);
        }
    }

    //Change poker hand to match what it was before the reload.
    DrawCardsToHand(LocalGameData.MyCards);

    //Check if BeginTurn() has already called.
    WasMyTurn = LocalGameData.WasMyTurn;
    UpsetOfCurrent = LocalGameData.UpsetOfCurrent;

    Folded = LocalGameData.Folded;

    checkingBets = LocalGameData.checkingBets;
    
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

    //Update what bets have been made.
    QueuedBets = LocalGameData.QueuedBets;
    CurrentPotChips = LocalGameData.CurrentPotChips;
    for(var b = 0; b < CurrentPotChips.length; b++)
    {
        AddChipToPotDisplay(CurrentPotChips[b], true);
    }

    //Update what the current bet is.
    CurrentBet = LocalGameData.CurrentBet;

    return true;
}

//Clears persistent data from games. Should be called when joining a new poker game.
function ClearLocalGameState()
{
    const LocalGameData = {
        QueuedBets: [],
        WasMyTurn: false,
        UpsetOfCurrent: 0,
        RoomName: "New Room",
        MyCards: [],
        ChipCount: [0, 0, 0, 0, 0],
        CurrentBet: 5,
        CurrentPotChips: [],
        Folded: false
    }

    LocalStorage.UpdateRoomLocalData(LocalGameData);
}

var CurrentConfirmMenu = null;

function CreateConfirmationMenu(message, okCallback)
{
    if(CurrentConfirmMenu != null){CurrentConfirmMenu.remove();}

    const menu = document.createElement("div");
    menu.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--bg-color);
        border: 3px solid var(--bg-dark);
        border-radius: 5px;
        padding: 7px;
        text-align: center;
    `

    menu.innerHTML = `<h2>${message}</h2>`;

    const okButton = document.createElement("button");
    const cancelButton = document.createElement("button");
    okButton.textContent = "Continue";
    cancelButton.textContent = "Cancel";

    const okBack = okCallback;
    okButton.addEventListener('click', function () {
        if(CurrentConfirmMenu != null){CurrentConfirmMenu.remove();}

        okBack();
    });
    cancelButton.addEventListener('click', function () {
        if(CurrentConfirmMenu != null){CurrentConfirmMenu.remove();}
    })

    menu.appendChild(okButton);
    menu.appendChild(cancelButton);

    document.body.appendChild(menu)

    CurrentConfirmMenu = menu;
}

//Creates text that scrolls up the screen.
function CreateScrollText(value, color = "#DDDDDD")
{
    const scrollText = document.createElement("div");
    scrollText.style = `
        position: fixed;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 7px;
        text-align: center;
    `

    scrollText.innerHTML = `<h1 style="color: ${color};">${value}</h1>`
    
    document.body.appendChild(scrollText);

    const fadeInt = setInterval(function () {
        scrollText.style.top = (scrollText.style.top.replace("%", "") - 0.1) + "%"; 

        if(parseFloat(scrollText.style.top.replace("%", "")) > 50)
        {
            scrollText.style.color = "#DDDDDDFF";
        }else{
            const value = parseInt((100 * ((scrollText.style.top.replace("%", "") + 50)/50)));
            scrollText.style.color = "#DDDDDD" + value;

            if(parseFloat(scrollText.style.top.replace("%", "")) < -50)
            {
                scrollText.remove();
                clearInterval(fadeInt);
            }
        }
    }, 1)
}