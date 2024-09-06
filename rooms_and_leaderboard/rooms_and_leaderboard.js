var pthe_0x155_cU = null;

var currentLocalBoard = null;

var leaderboardData = null;

const DAILY_CURRENCY_MAX = 150;
const DAILY_CURRENCY_MIN = 50;

window.addEventListener('load', function () {
    pageMusicModifier = 3; //Force Full Chill Song.

    LoadSwipe(1);
    SetBackgroundScroll(0.25);

     //Check what account we are currently logged in on.
     const acc = ls_0x15.ls_0x15_gca();
     if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
     {
        window.open('../signin/index.html?invalid=true', "_self")
     }

     rc_0x01623.rc_0x01623_gu(acc.username).then(user => {
        //Does the user exist?
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }
        
        pthe_0x155_cU = user;

        /*
            Prevent anyone from having negative money.
        */
        if(pthe_0x155_cU.money < 0)
        {
            pthe_0x155_cU.money = 0;
            rc_0x01623.rc_0x01623_uu(pthe_0x155_cU).then(done => {
                this.window.location.reload();
            })
            return;
        }

        //Last time user logged in was 24 hours ago. Give them a daily bonus and update time.
        if(pthe_0x155_cU.ll_check == undefined || Date.now() - pthe_0x155_cU.ll_check > 86400000)
        {
            var amount = Math.floor(Math.random() * (DAILY_CURRENCY_MAX - DAILY_CURRENCY_MIN)) + DAILY_CURRENCY_MIN;
            //Update last log in.
            pthe_0x155_cU.money += amount;
            News.push({type: "DailyCurrency", name: amount});
            pthe_0x155_cU.ll_check = Date.now();
            rc_0x01623.rc_0x01623_uu(pthe_0x155_cU);

            if(!newsHasAdvanced)
            {
                AdvanceNews();
            }
        }

       UpdateThemeOnLoad(pthe_0x155_cU);

        //Get a list of rooms for the room list.
        rc_0x01623.rc_0x01623_gar().then(rooms => {
            var addedRooms = 0;
            for(var v = 0; v < rooms.length; v++)
            {
                console.error(rooms[v])
                //Don't display full rooms.
                if(rooms[v].players.length >= 4){continue;}

                //Don't display rooms older than 12 hours.
                if(rooms[v].c_time != null)
                {
                    const d = new Date(atob(rooms[v].c_time));
                    //Older than 12 hours.
                    if(d.getTime() - Date.now() < -43200000)
                    {
                        console.error("ROOM WAS TO OLD")
                        console.log(rooms[v]);
                        continue;
                    } 
                }

                addedRooms++;
                CreateRoomGUI(rooms[v].room_name, rooms[v].players.length, rooms[v]);

                //Prevent adding more than 15 rooms.
                if(addedRooms >= 15){break;}
            }
        })


        rc_0x01623.rc_0x01623_gl().then(leaderboard_data => {
            leaderboardData = leaderboard_data;
            var leaderboard = leaderboardData.board;

            //Determine if the user should be added to the board.
            const addResult = UpdateUserLeaderboardSlot(leaderboard, {username: pthe_0x155_cU.username, s: pthe_0x155_cU.money, g: 0, c: pthe_0x155_cU.customize});
            
            //Creates graphics for the global leaderboard.
            //Calling of this function should take in the latest leaderboard.
            const graphicsFunction = (leaderboard) => {
                 /*
                Create graphics.
                */

                pl = -1;

                CreateLeaderboardSlot("Name", "$", "Games Played");

                for(var v = 0; v < leaderboard.length; v++)
                {
                    CreateLeaderboardSlot(leaderboard[v].username, leaderboard[v].s, leaderboard[v].g, leaderboard[v].c);
                }
            }

            //The player was either updated or added to the leaderboard.
            if(addResult != null)
            {
                console.log("UPDATING BOARD");
                graphicsFunction(addResult);
                rc_0x01623.rc_0x01623_sl({board: addResult, update: leaderboardData.update});
                return;
            }

            graphicsFunction(leaderboard);

                //A new update for the news is out.
                if(localStorage.getItem("poker_game_last_news") == null || parseInt(this.localStorage.getItem("poker_game_last_news")) != leaderboardData.update.n)
                {
                    console.log("NEW NEWS");
                    News.push({type: "GameUpdate", name: leaderboardData.update.txt});
                }

            //Create the daily news popup if news exists.
            if(News.length > 0)
            {
                AdvanceNews();
            }
        })



        //User is either in a local leaderboard or was asked to be.
        if(user.l_board != null && user.l_board != undefined && user.l_board != "")
        {
            if(user.l_board.startsWith("REQUEST_"))
            {
                //The user requested to not get invites.
                if(GetSetting("allowleaderboardinvites", true) == true)
                {

                    //The user has been requested, add it as a news article.
                    News.push({type: "LLInvite", name: user.l_board.replace("REQUEST_", "")});
                }
            }else{
                //User is in a local leaderboard. Create navigation for local boards.
                const buttonSpan = document.createElement("span");
                buttonSpan.setAttribute('style', "display: flex; justify-content: center;align-items: center;")
                const localButton = document.createElement("button");
                localButton.textContent = "Local";
                localButton.style.width = "100%";
                const globalButton = document.createElement("button");
                globalButton.textContent = "Global";
                globalButton.style.width = "100%";
                $(buttonSpan).append(localButton);
                $(buttonSpan).append(globalButton);
                $("#leaderboard").append(buttonSpan);

                globalButton.style.backgroundColor = "#666600";

                globalButton.addEventListener('click', function () {
                    this.style.backgroundColor = "#666600";
                    localButton.style.backgroundColor = "";

                    $("#leaderboard>h1:first-child").text("Leaderboard");
                    $(".local_option").remove();
                
                    //Repopulate the leaderboard with global winners.
                    pl = -1; //Reset place counter.
                    $(".user_leaderboard").remove();
                    for(var i = 0; i < globalBoardSave.length; i++)
                    {
                        CreateLeaderboardSlot(globalBoardSave[i].username, globalBoardSave[i].score, globalBoardSave[i].games_played, globalBoardSave[i].customize, false, true);
                    }
                })

                rc_0x01623.rc_0x01623_gi("local_leaderboard_" + user.l_board).then(localBoard => {
                    currentLocalBoard = localBoard;
                    const board_data = JSON.parse(atob(currentLocalBoard.data));
                    const updateLocal = UpdateUserLeaderboardSlot(board_data, {username: pthe_0x155_cU.username, s: pthe_0x155_cU.money, g: 0, c: pthe_0x155_cU.customize});
                    console.log(updateLocal);

                    if(updateLocal != null)
                    {
                        rc_0x01623.rc_0x01623_si("local_leaderboard_" + pthe_0x155_cU.l_board, btoa(JSON.stringify(updateLocal)));

                        currentLocalBoard.data = btoa(JSON.stringify(updateLocal));
                    }
                })

                localButton.addEventListener('click', function () {
                    this.style.backgroundColor = "#666600";
                    globalButton.style.backgroundColor = "";

                    $("#leaderboard>h1:first-child").text(currentLocalBoard.id.replace("local_leaderboard_", "") + " Leaderboard");
                    
                    const board_data = JSON.parse(atob(currentLocalBoard.data));
                    //Repopulate the leaderboard with local winners.
                    pl = -1;
                    $(".user_leaderboard").remove();

                    pl = -1;
                    CreateLeaderboardSlot("Name", "$", "Games Played", null, false);

                    //Load all local leaderboard players.
                    for(var i = 0; i < board_data.length; i++)
                    {
                        CreateLeaderboardSlot(board_data[i].username, board_data[i].s, board_data[i].g, board_data[i].c, false);
                    }

                    $("#leaderboard").append("<span class=\"local_option\" style=\"display: flex;justify-content: center;\"><button onclick=\"LeaveLocalBoard()\">Leave</button></span>");
                })
            }
            //If the user has local leaderboards allowed, create the create leaderboard option.
        }else if(GetSetting("allowleaderboardinvites") != false){
            //Timeout is to put button at the bottom, if its at the top it dosent really matter.
           this.setTimeout(() => {
            const createLocalLeaderboardButton = document.createElement("button");
            createLocalLeaderboardButton.textContent = "Create Local"

            $("#leaderboard").append(createLocalLeaderboardButton);

            createLocalLeaderboardButton.addEventListener('click', function () {
                createLocalLeaderboardButton.textContent = "Loading...";

                var userResponse = prompt("Local board name: ");

                //Fix userResponse to send to API.
                userResponse = userResponse.replace(/\//g, '').replace(/\\/g, '').replace(/\"/g, '');
                if(userResponse.length > 20){ userResponse = userResponse.substring(0, 20); }
                

                rc_0x01623.rc_0x01623_gi("local_leaderboard_" + userResponse).then(item => {
                    console.log(item)

                    if(item == null || item == undefined || item == "" || item == "null")
                    {
                        //GOOD TO CREATE

                        rc_0x01623.rc_0x01623_si("local_leaderboard_" + userResponse, "W10=").then(d0 => {
                            pthe_0x155_cU.l_board = userResponse;

                            rc_0x01623.rc_0x01623_uu(pthe_0x155_cU).then(d1 => {
                                window.location.reload();
                            })
                        })

                    }else{
                        //UH OH
                        alert('A board with that name already exists!')
                        createLocalLeaderboardButton.textContent = "Create Local"
                    }
                });
            });
           }, 500)
        }


     })

})

function LeaveLocalBoard()
{
    CreateConfirmationMenu("Are you sure you want to leave " + pthe_0x155_cU.l_board + "?", () => {
        $(".local_option>button").text("Loading...");   
        rc_0x01623.rc_0x01623_gi("local_leaderboard_" + pthe_0x155_cU.l_board).then(lBoard => {
            //Remove the user from the local board.
            var board_data = JSON.parse(atob(currentLocalBoard.data));
            for(var i = 0; i < board_data.length; i++)
            {
                if(board_data[i].username == pthe_0x155_cU.username)
                {
                    board_data.splice(i, 1);
                }
            }

            //Update the local board.
            rc_0x01623.rc_0x01623_si("local_leaderboard_" + pthe_0x155_cU.l_board, btoa(JSON.stringify(board_data))).then(d => {
                //Remove the users current l_board.
                pthe_0x155_cU.l_board = "";
                rc_0x01623.rc_0x01623_uu(pthe_0x155_cU).then(d => {
                    //Reload to remove the local options.
                    window.location.reload();
                });
            });
        });
    });
}

function UpdateUserLeaderboardSlot(currentLeaderboard, newData)
{
    console.log("SORTING NEW LEADERBOARD!");

    var boardContainsUser = false;
    var newBoard = JSON.parse(JSON.stringify(currentLeaderboard))

    for(var i = 0; i < newBoard.length; i++)
    {
        if(newBoard[i].username == newData.username)
        {
            //The user has the same amount of money as last time the board was updated, no need to update!
            if(newBoard[i].s == newData.s){return null;}

            boardContainsUser = true;

            newBoard[i] = newData;
            break;
        }
    }

    /*
        Swap sort implementation, attempts to sort existing entries then adds a new one. 
        (THE LEADERBOARD SHOULD ALWAYS BE LIMITED TO 10 PLACES, IF THE CURRENT USER DATA IS LESS THAN THE 10th MEMBER, DON'T DO ANYTHING)
    */

    for(var i = 0; i < newBoard.length; i++)
    {
        for(var j = i + 1; j < newBoard.length; j++)
        {
            if(newBoard[i].s < newBoard[j].s)
            {
                const temp = newBoard[i];
                newBoard[i] = newBoard[j];
                newBoard[j] = temp;
            }
        }
    }

    //Board already has user, no need to insert.
    if(boardContainsUser){return newBoard;}

    //Loop through the board, looking for a spot for the new user.
    var hasAdded = false;
    for(var i = 0; i < newBoard.length; i++)
    {
        if(newBoard[i].s < newData.s)
        {
            newBoard = [...newBoard.slice(0, i), newData, ...newBoard.slice(i)];
            hasAdded = true;
            break;
        }
    }

    if(!hasAdded)
    {
        newBoard.push(newData);

        
        if(newBoard.length > 10)
        {
            //Board too long, do not add new player since they are going to be at the bottom.
            return null;
        }
    }

    if(newBoard.length > 10)
    {
        //Player must have been added somewhere above the leaderboard so a different user is now at the bottom. Trim the array to match.
        newBoard = newBoard.slice(0, 10);
    }

    return newBoard;
}

const room_HTML = `<p class="room_info theme_bg_change">%code%</p>
<p class="room_info theme_bg_change" style="color: #229922;">Texas Hold 'Em</p>
<p class="room_info theme_bg_change">%size%</p>
<p class="room_info theme_bg_change" style="color: %stakeColor%;">%stake%</p>
<p class="room_info theme_bg_change" style="border-right: none;">%minBet%</p>`

function CreateRoomGUI(code, size, data = null)
{
    const room = document.createElement('div');
    room.className = "room theme_bg_change";

    room.setAttribute('table_name', code);
    room.addEventListener("click", function () {
        window.open('../play/index.html?table=' + this.getAttribute("table_name"), "_self");
    })
    
    var stake = "";
    var stakeColor = "#DDDDDD";

    /*
        <option value="stake_beginner">Beginner Stake ($1 = 1c)</option>
        <option value="stake_low">Low Stake ($5 = 1c)</option>
        <option value="stake_medium">Medium Stake ($10 = 1c)</option>
        <option value="stake_high">High Stake ($20 = 1c)</option>
        <option value="stake_extreme">Extreme Stake ($50 = 1c)</option>
        <option value="stake_mega">Mega Stake ($100 = 1c)</option>
        <option value="stake_broke">Broke Stake ($500 = 1c)</option>
    */
    switch(data.stake)
    {
        case "stake_low":
            stake = "Low Stake";
            stakeColor = "lime";
            break;
        case "stake_medium":
            stake = "Medium Stake";
            stakeColor = "aqua";
            break;
        case "stake_high":
            stake = "High Stake";
            stakeColor = "orange";
            break;
        case "stake_extreme":
            stake = "Extreme Stake";
            stakeColor = "gold";
            break;
        case "stake_mega":
            stake = "Mega Stake";
            stakeColor = "purple";
            break;
        case "stake_broke":
            stake = "Broke Stake";
            stakeColor = "red";
            break;
        default:
        case "stake_beginner":
            stake = "Beginner Stake";
            stakeColor = "green";
            break;
    }

    room.innerHTML = room_HTML.replace(/%code%/g, censorText(code)).replace(/%size%/g, `${size}/4`).replace(/%stake%/g, stake).replace(/%stakeColor%/g, stakeColor).replace(/%minBet%/g, data.MinimumBet);

    $("#room_list").append(room);

    //Set up censoring for table name.
   setTimeout(function() {
        if($("#tbl_name").get().length == 0){return;}
        $("#tbl_name").get()[0].addEventListener('change', function () {
            this.value = censorText(this.value);
        })
   }, 1000)
}

const leaderboard_HTML = `
            <p style="width: 52px;min-height:33px;max-width: 56px;min-width: 15px;height:100%;text-align:center;margin:0;display:inline;margin-top:1px;margin-left:1px;background-repeat:no-repeat;image-rendering: pixelated;">%pl%</p>
            <span class="user_leaderboard_info">%crown%%name%</span>
            <p class="user_leaderboard_info">%sc%</p>
            <p class="user_leaderboard_info">%g%</p>
`

var pl = 0;

var globalBoardSave = []

var hasFirstCrown = []

//username: string
//score: int
//games_played: int
//customize?: UserCustomizeObject
//global?: boolean
function CreateLeaderboardSlot(username, score, games_played, customize = null, global = true, forceCrown = false)
{
    if(global)
    {
        if(pl < 3 && pl >= 0){hasFirstCrown.push(username);}
        globalBoardSave.push({username: username, score: score, games_played: games_played, customize: customize})
    }

    const lb = document.createElement('div');
    lb.className = "user_leaderboard";
    lb.style = "display: flex;"

    if(username != "Name")
    {
        lb.setAttribute("username", username);

        lb.addEventListener("click", function () {
            if(pthe_0x155_cU.username != this.getAttribute("username"))
            {
                window.open("../home/index.html?view=" + this.getAttribute("username"), "_self");
            }else{
                window.open("../home/index.html", "_self");
            }
        })
    }else{
        lb.className += " theme_bg_change";
    }

    var html = leaderboard_HTML.replace(/%name%/g, censorText(username)).replace(/%sc%/g, `$${score}`).replace(/%pl%/g, pl < 0 ? "#" : ++pl).replace(/%g%/g, games_played);

    var hasCrown = ((global || forceCrown) && (pl <= 3 && pl >= 0));

    if(!global && !forceCrown)
    {
        hasCrown = hasFirstCrown.includes(username);
    }

    if(hasCrown)
    {
        html = html.replace(/%crown%/g, "<img style=\"display: inline;\" src=\"../assets/first_crown.png\">  ")
    } else {
        html = html.replace(/%crown%/g, "")
    }

    lb.innerHTML = html;


    if(username == "Name")
    {
        Array.from(lb.children).forEach(child => {
            child.setAttribute("class", child.getAttribute("class") + " theme_bg_change");
        })
    }

    if(pl < 0)
    {
        pl = 0;
    }

    if(pl == 1)
    {
        lb.style.color = "gold";
    } else if(pl == 2)
    {
        lb.style.color = "silver";
    }else if(pl == 3)
    {
        lb.style.color = "bronze";
    }

    if(customize != null)
    {
        console.log("CUSTOM: ")
        console.log(customize)
        lb.style.backgroundColor = customize.BGColor.startsWith("#") ? customize.BGColor : "#" + customize.BGColor;

        if(customize.Border != "default")
        {
            lb.children[0].style.backgroundImage = "url('../assets/user_borders/" + customize.Border + ".png')";
        }

        if(customize.Font != "default")
        {
            lb.style.fontFamily = `"${customize.Font}", serif`
        }
    }

    $("#leaderboard").append(lb);
}


const create_room_HTML = `
    <h1>Create Table</h1>
    <div style="display:flex; justify-content: center; flex-direction: column; align-items: center;">
        <input id="tbl_name" placeholder="Table Name" style="width: 75%;text-align:center;" maxlength="16">  
        <p>Table Type:</p>  
        <select id="tbl_game">
            <option value="the">Texas Hold 'Em</option>
        </select>

        <p>Minimum Bet (in chips):</p>
        <input id="tbl_minimum_bet" maxlength="2" value="5" placeholder="Minimum Bet" onchange="
            if(parseInt(this.value) < 5){this.value = 5;}
            if(parseInt(this.value) > 99){this.value = 99;}
        ">

        <p>Stake</p>
        <select id="tbl_stake">
            <option value="stake_beginner">Beginner Stake ($1 = 1c)</option>
            <option value="stake_low">Low Stake ($5 = 1c)</option>
            <option value="stake_medium">Medium Stake ($10 = 1c)</option>
            <option value="stake_high">High Stake ($20 = 1c)</option>
            <option value="stake_extreme">Extreme Stake ($50 = 1c)</option>
            <option value="stake_mega">Mega Stake ($100 = 1c)</option>
            <option value="stake_broke">Broke Stake ($500 = 1c)</option>
        </select>

        <p>Table Theme:</p>  
        <select id="tbl_theme">
            <option value="ptg">Poker Table Green</option>
        </select>

        <p>Table Cards:</p>  
        <select id="tbl_cards">
            <option value="shared">Shared</option>
            <option value="independent">(Not available in Texas Hold 'Em)</option>
        </select>

        <p>Table Chips:</p>  
        <select id="tbl_chips">
            <option value="shared">Shared</option>
            <option value="independent">(Not available in Texas Hold 'Em)</option>
        </select>

        <button onclick="FinishCreate();" id="tbl_create">Create</button>

        <input disabled="true" placeholder="version" value="%currentVersion%" style="transform: scale(0.75);color: gray;">
    </div>
`

function FinishCreate()
{
    $("#tbl_create").text("Loading...");

    const name = $("#tbl_name").val();
    const gType = $("#tbl_game").val();
    const tTheme = $("#tbl_theme").val();

    if(name.length < 4){
        alert('Room name must be longer than 4 characters.');
        $("#tbl_create").text("Create");
        return;
    }

    if(name.length > 16){
        alert('Room name must be shorter than 16 characters.');
        $("#tbl_create").text("Create");
        return;
    }

    rc_0x01623.rc_0x01623_gar().then(rooms => {
    
        for(var v = 0; v < rooms.length; v++)
        {
            if(rooms[v].room_name == name)
            {
                alert('A room with that name already exists!')
                $("#tbl_create").text("Create");
                return;
            }
        }

        var minBet = parseInt($("#tbl_minimum_bet").val());

        const stake = $("#tbl_stake").val();

        if(minBet > 99){minBet = 99;}
        if(minBet < 5){minBet = 5;}

        var packs = pthe_0x155_cU.customize.Pack;
        for(var i = 0; i < packs.length; i++)
        {
            if(packs[i] == null)
            {
                packs.splice(i, 1);
            }
        }

        const json = `{"c_time":"${btoa(new Date().toLocaleString())}","players":[],"code":"","game":"${gType}","theme":"${tTheme}","CurrentTurn":1,"CurrentBlind":1,"CurrentBet":${minBet},"CurrentStage":0,"RoundsPlayed":0,"QueuedBets":[],"AllIn":[],"Creator":"${pthe_0x155_cU.username}","MinimumBet":${minBet},"PlayerCards":[{"c1":null,"c2":null},{"c1":null,"c2":null},{"c1":null,"c2":null},{"c1":null,"c2":null}],"Folded":[],"Pot":0,"PlayerBets":[0,0,0,0],"CheckingBets":[],"PublicCards":["","","","",""],"ShowingCards":-1,"Winners":[],"Waiting":true,"Votes":[],"G_Fun":{"x":0,"y":0,"p":0},"watching":[],"stake":"${stake}","custom":{"Set":[${pthe_0x155_cU.customize.Set}],"Pack":[${packs}]}}`;
        console.log(json);
        var newRoom = JSON.parse(json);
        newRoom.room_name = name; 

        rc_0x01623.rc_0x01623_ur(newRoom).then(r => {
            //JOIN ROOM
            window.open('../play/index.html?table=' + name, "_self");
        })
    })
}

function CreateRoom()
{
    $("#room_list_container").html(create_room_HTML.replace(/%currentVersion%/g, "Room Version: v" + GAME_VERSION));

    //Update minimum stake created room.
    if(pthe_0x155_cU.money > 5000)
    {
        $("#tbl_stake>option:first-child").remove();
    }   
    if(pthe_0x155_cU.money > 10000)
    {
        $("#tbl_stake>option:first-child").remove();
    }  
    if(pthe_0x155_cU.money > 15000)
    {
        $("#tbl_stake>option:first-child").remove();
    }  
    if(pthe_0x155_cU.money > 20000)
    {
        $("#tbl_stake>option:first-child").remove();
    }  
    if(pthe_0x155_cU.money > 30000)
    {
        $("#tbl_stake>option:first-child").remove();
    }  
    
}

var newsCenter = null;
var currNewsContainer = null;

var News = []
var currentNewsID = -1;
var hasMadeNewsButtons = false;

function CreateDailyNews()
{
    const newsContainer = document.createElement("div");
    newsContainer.className = "center_popup";
    newsContainer.id = "news_article";
    newsContainer.setAttribute("style", "width: 50%;height:75%;max-height: 600px;")

    setTimeout(() => {
        newsContainer.id = "float_news_article";
    }, 900)

    const scrollTop = document.createElement("img");
    scrollTop.src = "../assets/news/scroll_top.png";
    scrollTop.style.width = "100%";
    scrollTop.style.imageRendering = "pixelated";
    scrollTop.style.maxWidth = "551px";

    newsCenter = document.createElement("div");
    newsCenter.setAttribute("style", "width: 100%;max-height: 400px;")

    const scrollBottom = document.createElement("img");
    scrollBottom.src = "../assets/news/scroll_bottom.png";
    scrollBottom.style.width = "100%";
    scrollBottom.style.imageRendering = "pixelated";
    scrollBottom.style.maxWidth = "551px";

    newsContainer.appendChild(scrollTop);
    newsContainer.appendChild(newsCenter);
    newsContainer.appendChild(scrollBottom);
    document.body.appendChild(newsContainer)

    if(!hasMadeNewsButtons)
    {
        hasMadeNewsButtons = true;
        const backButton = document.createElement("button");
        backButton.className = "news_button";
        backButton.textContent = "<- Back";
        document.body.appendChild(backButton);

        const nextButton = document.createElement("button");
        nextButton.className = "news_button";
        nextButton.textContent = "Next ->";
        nextButton.setAttribute("style", "float: right;")
        document.body.appendChild(nextButton);

        nextButton.addEventListener('click', () => {
            AdvanceNews(1);
        });

        backButton.addEventListener('click', () => {
            AdvanceNews(-1);
        });
    }

    currNewsContainer = newsContainer;
}

var newsHasAdvanced = false;
function AdvanceNews(amount = 1)
{
    newsHasAdvanced = true;
    if(currentNewsID + amount < 0)
    {
        return;
    }

    if(currNewsContainer != null)
    {
        currNewsContainer.id = "dead_news";
        //Save the news container as it is about to be overwritten by a new article.
        const dNews = currNewsContainer;
        setTimeout(() => {
            dNews.remove();
        }, 900)
    }


    //News was advanced without accepting the current local board invite, the user will now no longer recieve messages about joining.
    if(currentNewsID >= 0 && News[currentNewsID].type == "LLInvite")
    {
        if(pthe_0x155_cU.l_board.startsWith("REQUEST_"))
        {
            pthe_0x155_cU.l_board = "";
            rc_0x01623.rc_0x01623_uu(pthe_0x155_cU);
        }
    }

    //News was advanced and update was read, the user will no longer be shown this update.
    if(currentNewsID >= 0 && News[currentNewsID].type == "GameUpdate")
    {
        localStorage.setItem("poker_game_last_news", leaderboardData.update.n);
    }

   setTimeout(() => {
    currentNewsID += amount;

    if(News.length > currentNewsID)
    {
        CreateDailyNews();
        if(News[currentNewsID].type == "LLInvite")
        {
            CreateNews_LLInvite(News[currentNewsID].name);
        } else if(News[currentNewsID].type == "GameUpdate")
        {
            CreateNews_GameUpdate(News[currentNewsID].name);
        } else if(News[currentNewsID].type == "DailyCurrency")
        {
            CreateNews_DailyCurrency(News[currentNewsID].name);
        }
    }else{
        $(".news_button").remove();
    }
   }, 900);
}

function CreateNews_LLInvite(inviteName)
{
    if(newsCenter == null){return;}

    newsCenter.innerHTML = "";

    const background = document.createElement("div");
    background.setAttribute('style', "width: 100%;height: 375px;background-image: url('../assets/news/news_back.png');background-size: contain;background-repeat:repeat-y;margin: 0;margin-top: -208px;image-rendering:pixelated;");

    const image = document.createElement("img");
    image.setAttribute('style', "transform: translate(18px, 4px);width: 258px;image-rendering: pixelated;")
    image.src = "../assets/news/leaderboard_icon.png";
    image.style.margin = "0";
    newsCenter.appendChild(image);

    const name = document.createElement("h3");
    name.setAttribute("style", "transform: translate(18px, 272px);width: 50%;color: #906a38;")
    name.style.margin = "0";
    name.innerHTML = inviteName + " have invited you to their leaderboard.";
    background.appendChild(name);

    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Accept";
    acceptButton.className = "hover_green";
    acceptButton.setAttribute("style", "transform: translate(9px, 272px) scale(0.75);width: 50%;color: #906a38;border: none;")
    background.appendChild(acceptButton);

    acceptButton.addEventListener('click', function () {
        this.textContent = "Loading...";
        pthe_0x155_cU.l_board = pthe_0x155_cU.l_board.replace("REQUEST_", "");
        rc_0x01623.rc_0x01623_uu(pthe_0x155_cU).then(d => {
            alert('You have joined the local board \"' + pthe_0x155_cU.l_board + "\"");
            
            AdvanceNews();
        })
    })

    newsCenter.appendChild(background);
}

function CreateNews_GameUpdate(text)
{
    if(newsCenter == null){return;}

    newsCenter.innerHTML = "";

    const background = document.createElement("div");
    background.setAttribute('style', "width: 100%;height: 375px;background-image: url('../assets/news/news_back.png');background-size: contain;background-repeat:repeat-y;margin: 0;margin-top: -38px;image-rendering:pixelated;");
    
    const header = document.createElement("h2");
    header.setAttribute("style", "transform: translate(18px, 18px);width: 50%;color: #906a38;")
    header.textContent = "Update";
    background.appendChild(header);

    const name = document.createElement("h3");
    name.setAttribute("style", "transform: translate(45px, 18px);width: 75%;color: #906a38;height: 300px;overflow: wrap;")
    name.style.margin = "0";
    name.textContent = text;
    background.appendChild(name);

    newsCenter.appendChild(background);
}

const RANDOM_DAILY_INCOME_MESSAGES = ["You've been hard at work and earned $%d%!", "Your assets have grown by $%d%!", "You were given $%d% for free!",
    "Your family donated $%d% for you to gamble with!", "The stocks went up and you got $%d%!", "You found $%d% on your front porch!"]

function CreateNews_DailyCurrency(amount)
{
    if(newsCenter == null){return;}

    newsCenter.innerHTML = "";

    const background = document.createElement("div");
    background.setAttribute('style', "width: 100%;height: 375px;background-image: url('../assets/news/news_back.png');background-size: contain;background-repeat:repeat-y;margin: 0;margin-top: -38px;image-rendering:pixelated;");
    
    const header = document.createElement("h2");
    header.setAttribute("style", "transform: translate(18px, 18px);width: 50%;color: #906a38;")
    header.textContent = "Daily Income";
    background.appendChild(header);

    const name = document.createElement("h3");
    name.setAttribute("style", "transform: translate(45px, 18px);width: 75%;color: #906a38;height: 300px;overflow: wrap;");
    name.style.margin = "0";
    name.textContent = RANDOM_DAILY_INCOME_MESSAGES[Math.floor(Math.random() * RANDOM_DAILY_INCOME_MESSAGES.length)].replace(/%d%/g, amount);
    background.appendChild(name);

    newsCenter.appendChild(background);
}

const EnterRoomNameGUI = `
<div id="enter_room_name_box" style="display:flex;justify-content:center;align-items:center;flex-direction:column;">
    <h2>Enter Room Name</h2>
    <input id="room_search" placeholder="Room Name" maxlength="20">
    <button onclick="SearchForRoom(document.getElementById('room_search').value);">Search</button>
</div>
`
function CreateEnterRoomNameGUI()
{
    $("#room_list_container").html(EnterRoomNameGUI);
}

function SearchForRoom(name)
{
    rc_0x01623.rc_0x01623_gr(name).then(room => {
        console.log(room);
        $(".no_room_found").remove();

        if(room == null)
        {
            $("#enter_room_name_box").append("<h2 class=\"no_room_found\">That room could not be found.</h2>");
        }else{
            $("#enter_room_name_box").append("<div id=\"room_list\"></div>");
            CreateRoomGUI(room.room_name, room.players.length, room);
        }
    })
}

function ShowOutdatedRooms()
{
    $("#room_list>div:not(:first-child)").remove();

    rc_0x01623.rc_0x01623_gar().then(rooms => {
        //ADD ALL ROOMS NO MATTER WHAT
        for(var v = 0; v < rooms.length; v++)
        {
            CreateRoomGUI(rooms[v].room_name, rooms[v].players.length, rooms[v]);
        }
    })
}

function JoinRandom()
{
    $("#random_room_button").text("Loading...");
    rc_0x01623.rc_0x01623_gar().then(rooms => {
        for(var i = 0; i < rooms.length; i++)
        {
            if(rooms[i].Waiting)
            {
                $("#random_room_button").text("Joining...");
                window.open('../play/index.html?table=' + rooms[i].room_name, '_self');
                break;
            }
        }

        setTimeout(function () {
            alert('No waiting available rooms!');
        }, 500)
        
        $("#random_room_button").text("Join Random");
    })
}