window.addEventListener('load', function () {
    LoadSwipe(1);
    SetBackgroundScroll(0.25);

     //Check what account we are currently logged in on.
     const acc = LocalStorage.GetCurrentAccount();
     if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
     {
        window.open('../signin/index.html?invalid=true', "_self")
     }

     API.GetUser(acc.username).then(user => {
        //Does the user exist?
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }
        
        //Get a list of rooms for the room list.
        API.GetAllRooms().then(rooms => {
            for(var v = 0; v < rooms.length; v++)
            {
                //Don't display full rooms.
                if(rooms[v].players.length >= 4){continue;}

                CreateRoomGUI(rooms[v].room_name, rooms[v].players.length);
            }
        })

        API.GetLeaderboard().then(leaderboard => {
            pl = -1;

            CreateLeaderboardSlot("Name", "$", "Games Played");

            for(var v = 0; v < leaderboard.length; v++)
            {
                CreateLeaderboardSlot(leaderboard[v].username, leaderboard[v].s, leaderboard[v].g);
            }
        })
     })

})

const room_HTML = `<p class="room_info">%code%</p>
<p class="room_info" style="color: #229922;">Texas Hold 'Em</p>
<p class="room_info" style="border-right: none;">%size%</p>`

function CreateRoomGUI(code, size)
{
    const room = document.createElement('div');
    room.className = "room";

    room.innerHTML = room_HTML.replace(/%code%/g, code).replace(/%size%/g, `${size}/4`);

    $("#room_list").append(room);
}

const leaderboard_HTML = `
            <p style="width: 15px;max-width: 15px;min-width: 15px;text-align:center;margin:0;display:inline;margin-top: 5px;">%pl%</p>
            <p class="user_leaderboard_info">%name%</p>
            <p class="user_leaderboard_info">%sc%</p>
            <p class="user_leaderboard_info">%g%</p>
`

var pl = 0;

function CreateLeaderboardSlot(username, score, games_played)
{
    const lb = document.createElement('div');
    lb.className = "user_leaderboard";
    lb.style = "display: flex;"

    lb.innerHTML = leaderboard_HTML.replace(/%name%/g, username).replace(/%sc%/g, `$${score}`).replace(/%pl%/g, pl < 0 ? "#" : ++pl).replace(/%g%/g, games_played);
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
        <p>Table Theme:</p>  
        <select id="tbl_theme">
            <option value="ptg">Poker Table Green</option>
        </select>

        <button onclick="FinishCreate();" id="tbl_create">Create</button>
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

    API.GetAllRooms().then(rooms => {
    
        for(var v = 0; v < rooms.length; v++)
        {
            if(rooms[v].room_name == name)
            {
                alert('A room with that name already exists!')
                $("#tbl_create").text("Create");
                return;
            }
        }

        var newRoom = {players: [], code: "", game: gType, theme: tTheme, room_name: name}
        
        API.UpdateRoom(newRoom).then(r => {
            //JOIN ROOM
            $("#tbl_create").text("Done");
        })
    })
}

function CreateRoom()
{
    $("#room_list_container").html(create_room_HTML)
}