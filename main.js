const GAME_VERSION = "1.0.0";
const TURN_LENGTH_LIMIT = 90;

const OudatedMessage = ` <h1 style="text-align: center; animation-name: fade_in_text; animation-duration: 0.8s;">Outdated Game Version</h1>
<h4 style="text-align: center; animation-name: fade_in_text; animation-duration: 0.8s;">The version of the game you are using is outdated and may cause certain store items to not function as intended.<br> Either use the online version or download the latest version.</h4>
<center><button onclick="">Online Version</button><button onclick="">Download Latest</button></center>`

var scrollFunc = () => {}, scrollPos = 0;

function LoadSwipe(mult)
{
    var pos = 102.5*(mult < 0 ? 1 : -1);
    document.body.setAttribute("style", `transform: translate(${pos}%, 0);background-position-x: 9px; background-position-y: 0px;`);

    SwipePage(mult, pos);
}

window.addEventListener('load', function () {
    this.setInterval(function () {
        scrollFunc();
    }, 10)

    document.getElementById('sign_in_button').addEventListener('click', function (){
        if(this.hasAttribute('enabled')){return;}

        SwipePage(1);
        setTimeout(function () {
            window.open('../signin/index.html?invalid=true', '_self')
        }, 220)
    })

    document.getElementById('acc_button').addEventListener('click', function (){
        if(this.hasAttribute('enabled')){return;}

        SwipePage(-1);
        setTimeout(function () {
            window.open('../home/index.html', '_self')
        }, 220)
    })

    document.getElementById('ral_button').addEventListener('click', function (){
        if(this.hasAttribute('enabled')){return;}

        SwipePage(1);
        setTimeout(function () {
            window.open('../rooms_and_leaderboard/index.html', '_self')
        }, 220)
    })

    document.getElementById('store_button').addEventListener('click', function () {
        if(this.hasAttribute('enabled')){return;}

        SwipePage(-1);
        setTimeout(function () {
            window.open('../store/index.html', '_self');
        }, 220);
    })

    document.getElementById('settings_button').addEventListener('click', function () {
        if(this.hasAttribute('enabled')){return;}

        SwipePage(1);
        setTimeout(function () {
            window.open('../settings/index.html', '_self');
        }, 220);
    })

})

function SetBackgroundScroll(speed)
{
    scrollFunc = function () {
        scrollPos += speed;
        document.body.style.backgroundPositionX = `${scrollPos}px`;
        document.body.style.backgroundPositionY = `${scrollPos/2}px`;
        document.body.style.transform = "";
    }
}

function SwipePage(mult, initpos = 0)
{
    var pos = initpos;
    scrollFunc = function () {};

    for(var x = 0; x < 100; x++)
    {
        setTimeout(function () {
            pos += 1.025 * mult;
            document.body.setAttribute("style", `transform: translate(${pos}%, 0);background-position-x: ${scrollPos}px; background-position-y: ${scrollPos/2}px;`);
        }, x * 2);
    }
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
        z-index: 5;
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

const SearchPages = [
    {n: "Home", p: "home"},
    {n: "Account", p: "home"},
    {n: "Sign In", p: "signin"},
    {n: "Create Account", p: "create_account"},
    {n: "Store", p: "store"},
    {n: "Leaderboard", p: "leaderboard"},
    {n: "Join Game", p: "leaderboard"},
    {n: "Tables", p: "leaderboard"},
    {n: "Rooms", p: "leaderboard"},
    {n: "Settings", p: "settings"}
]

var savedUserSearches = []

var lastSearchTerm = null;
function CreateSearchMenu(term, player = false, table = false)
{
    if(term == null){term = lastSearchTerm;}
    lastSearchTerm = term;

    $(".search_menu").remove();
    if(term.length < 1){return;}

    if(table)
    {
        API.GetRoom(term).then(table => {
            if(table == null)
            {
                $(menu).append("<p style=\"color: red;\">No table found.</p>")
                return;
            }

            $(menu).append(`<p>${table.room_name}</p>`)
        })
    }

    if(player)
    {
        API.GetUser(term).then(user => {
            if(user == null)
            {
                $(menu).append("<p style=\"color: red;\">No user found.</p>")
                return;
            }

            if(user.icon == "")
            {
                userHTML = `<span onclick=\"window.open('../home/index.html?view=${user.username}', '_self');\"><center><p>${user.username}</p></center></span>`;
            }else{
                userHTML = `<span onclick=\"window.open('../home/index.html?view=${user.username}', '_self');\"><center><img style="display: inline;text-align:center;" src=\"${atob(user.icon)}\" width="32" height="32"><p>${user.username}</p></center></span>`;
            }
           
            var found = false;
            for(var i = 0; i < savedUserSearches.length; i++)
            {
                if(user.username == savedUserSearches[i].n){found = true;break;}
            }
            
            if(!found){savedUserSearches.push({html: userHTML, n: user.username});}
            $(menu).append(userHTML)

            for(var i = 0; i < savedUserSearches.length; i++)
            {
                if(user.username == savedUserSearches[i].n){continue;}
                $(menu).append(savedUserSearches[i].html);
            }
        })
    }

    const menu = document.createElement("div");
    menu.className = "search_menu";

    if(!player && !table)
    {
        $(menu).append("<p onclick='CreateSearchMenu(null, true);'>Search for player...</p>")
        $(menu).append("<p onclick='CreateSearchMenu(null, false, true);'>Search for table...</p>")
    }

    document.body.appendChild(menu);

    for(var i = 0; i < SearchPages.length; i++)
    {
        if(SearchPages[i].n.toLowerCase().includes(term.toLowerCase()) || term.toLowerCase().includes(SearchPages[i].n.toLowerCase()))
        {
            $(menu).append(`<p onclick="window.open('../${SearchPages[i].p}/index.html', '_self')">Page - ${SearchPages[i].n}</p>`)
        }
    }
}

//Classes:
//theme_bg_change - updates background and border color.
//theme_dark_bg_change - updates background to darkBG and border.
//theme_border_only_change - updates only the border color.
//dark_bottom_theme - updates only the bottom border to a very dark color.

var forceInterval = null;
var firstBG = true;
function SetTheme(theme, pID, liveUpdate = false)
{
    if(forceInterval != null){clearInterval(forceInterval);forceInterval = null;}
    if(theme == "default")
    {
        if(!liveUpdate){return;}
        //Update all classes listed at top.
        $(".theme_bg_change, .theme_dark_bg_change").css({"background-color": "", "border-color": "", "transition-duration": "0.3s"});
        $(".theme_border_only_change, .dark_bottom_theme").css({"border-color": "", "transition-duration": "0.3s"});

        //Update buttons and selections.
        $("button, input, select").css({"background-color": "", "border-color": "", "transition-duration": "0.3s"});
        $("option").css("background-color", "");

        $("#selection_menu").css({"background-color": "", "transition-duration": "0.3s"})

        //Update pot.
        $("#pot_image").css('background-image', "url('../assets/pot.png')");

        //Update BG.
        setTimeout(function () {
            document.body.style.backgroundImage = "url('../assets/bg_tile.png')"
            document.body.style.transitionDuration = "0.3s";
        }, firstBG ? 1000 : 1)

        setTimeout(() => {
            document.body.style.transitionDuration = "";
        }, firstBG ? 1400 : 350)
    }else{
       const productID = pID;
       forceInterval = setInterval(function () {
         //Update all classes listed at top.
         $(".theme_bg_change").css({"background-color": MAIN_CATALOG[productID].Data.bgColor, "border-color": MAIN_CATALOG[productID].Data.borderColor, "transition-duration": "0.3s"});
         $(".theme_border_only_change").css({"border-color": MAIN_CATALOG[productID].Data.borderColor, "transition-duration": "0.3s"});
         $(".theme_dark_bg_change").css({"background-color": MAIN_CATALOG[productID].Data.bgDark, "border-color": MAIN_CATALOG[productID].Data.borderColor, "transition-duration": "0.3s"});
         $(".dark_bottom_theme").css({"border-bottom": "2px solid " + MAIN_CATALOG[productID].Data.borderDark, "transition-duration": "0.3s"});
 
         $("#selection_menu").css({"background-color": MAIN_CATALOG[productID].Data.selectionMenuColor, "transition-duration": "0.3s"})
 
         //Update pot.
         $("#pot_image").css('background-image', "url('../assets/themes/" + theme + "/pot.png')");
 
        
        //Update buttons and selections.
        $("button, input, select").css({"background-color": MAIN_CATALOG[productID].Data.bgDark, "border-color": MAIN_CATALOG[productID].Data.borderColor, "transition-duration": "0.3s"});
        
        $("option").css("background-color", MAIN_CATALOG[productID].Data.bgDark);
       }, 5)

        //Update BG.
        const themeS = theme;
        setTimeout(function () {
            document.body.style.backgroundImage = `url('../assets/themes/${themeS}/bg_tile.png')`
            document.body.style.transitionDuration = "0.3s";
        }, firstBG ? 1000 : 1)

        setTimeout(() => {
            document.body.style.transitionDuration = "";
        }, firstBG ? 1400 : 350)

    }
}

function UpdateThemeOnLoad(currentUser)
{
    if(currentUser.customize != undefined)
    {
        if(currentUser.customize.Theme != undefined && currentUser.customize.Theme != null && currentUser.customize.Theme != "" && currentUser.customize.Theme != "default")
        {
            for(var i = 0; i < MAIN_CATALOG.length; i++)
            {
                if(MAIN_CATALOG[i].Data.value == currentUser.customize.Theme)
                {
                    SetTheme(currentUser.customize.Theme, i);
                }
            }
        }
    }
}