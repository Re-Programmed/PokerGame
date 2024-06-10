var viewingAccount = "";

$(window).bind("beforeunload",function(event) {
    if(changeWasMade)
    {
        return "You have unapplied changes.";
    }
});

window.addEventListener('load', function () {
    LoadSwipe(-1);
    SetBackgroundScroll(0.25)

    TOOLTIP_OFFSET = {X: -100, Y: -2125}

    if(GetURLParam("view") != undefined)
    {
        const upd = GetURLParam("view");
        viewingAccount = upd;
        setInterval(() => {
            viewingAccount = upd;
        }, 3)

        //Remove customization features.
        $("#customize_options").remove();
        $("#chip_set_picker").remove();
        $("#card_pack_picker").remove();
    }

    //Check what account we are currently logged in on.
    const acc = LocalStorage.GetCurrentAccount();
    if(acc == undefined || acc == null || acc == "null" || acc.username == undefined)
    {
        window.open('../signin/index.html?invalid=true', "_self")
    }

    API.GetUser(viewingAccount == "" ? acc.username : viewingAccount).then(user => {
        //Does the user exist?
        if(user == undefined || user == null) { window.open('../signin/index.html?invalid=true', "_self") }
        if(!viewingAccount && user.passcode != acc.passcode) { window.open('../signin/index.html?invalid=true', "_self") }

        //NO SEEING PASSCODE IF YOU ARE NOT THIS USER.
        if(viewingAccount)
        {
            user.passcode = null;

            UpdateThemeOnLoad(user);
        }

        //Update icon.
        if(user.icon != null && user.icon != undefined && user.icon != "null")
        {
            $("#user_icon").attr("src", atob(user.icon));
        }

        //Update name.
        $("#user_username").text(user.username);

        //Update chip count to show money.
        $("#chip_display_count").text("$" + user.money);

        console.log(user);

        currentUser = user;

        if(user.customize != null && viewingAccount == "")
        {
            for(var i = 0; i < Object.keys(NAME_CustomizeOptions).length; i++)
            {
                const opt = NAME_CustomizeOptions[Object.keys(NAME_CustomizeOptions)[i]];
                opt.Init(user.customize);

                if(!user.c_unlock.includes(opt.Field))
                {
                    LockCustomizationField(opt);
                }
            }

            //The changes that were made were just the site loading, cancel all change updates.
            SetChangeWasMade(false);

            //Check for null fields.
            if(user.customize.Set == undefined)
            {
                user.customize.Set = [-1]
            }

            if(user.customize.Pack == undefined)
            {
                user.customize.Pack = [-1]
            }

            this.setTimeout(() => {
                LoadChipSetApplicator();
                ApplyChipSetDisplay(currentUser.customize.Set);

                LoadCardPackApplicator();
                ApplyCardPackDisplay(currentUser.customize.Pack);
            }, 40)
        }else if(user.customize == null){
            user.customize = {};
        }

        if(viewingAccount != "")
        {
            setTimeout(() => {
                ApplyChipSetDisplay(currentUser.customize.Set);

                ApplyCardPackDisplay(currentUser.customize.Pack);
            }, 40)

            document.getElementById("account_display").setAttribute("style", "width: calc(100% - 30px);");
            document.getElementById("my_pot_display").setAttribute("style", "width: calc(100% - 6px);");
            document.getElementById("my_cards_display_parent").setAttribute("style", "width: calc(100% - 6px);");

            document.getElementById("user_icon_border").setAttribute("style", "background-size: cover; image-rendering: pixelated;")
            document.getElementById("user_username").style.fontFamily = `"${currentUser.customize.Font}", "Merriweather", serif`
            document.getElementById("user_username").style.color = currentUser.customize.NameColor.startsWith("#") ? currentUser.customize.NameColor : "#" + currentUser.customize.NameColor;
            document.getElementById("user_icon_border").style.backgroundImage = "url('../assets/user_borders/" + currentUser.customize.Border + ".png')";

            this.document.getElementById("account_display").style.backgroundColor = currentUser.customize.BGColor.startsWith("#") ? currentUser.customize.BGColor : "#" + currentUser.customize.BGColor;

            //Add options for viewers.

            //Add to local board options.
            if(user.l_board == null || user.l_board == undefined || user.l_board == "")
            {
                const localLeaderboardButton = document.createElement("button");
                localLeaderboardButton.textContent = "Add to Local Leaderboard";
                $("#account_display").append(localLeaderboardButton);
                localLeaderboardButton.addEventListener('click', AddToLocalLeaderboard);
            }

            const reportButton = document.createElement("button");

            reportButton.addEventListener("click", () => {FileAReport();});

            reportButton.textContent = "Report Player";
            $("#account_display").append(reportButton);
            
        } 

        LoadPlayerPotDisplay();
        LoadPlayerCardsDisplay();
    })
    
    
})

var currentUser = null;

//Stores all customization options, their inputs, their costs, their name in the server, and what to do when they are loaded or modified.
const NAME_CustomizeOptions = {
    BackgroundColor: {
        Query: "#customize_bg_color>input",
        Field: "BGColor",
        Name: "Background Color",
        Cost: 1000,
        Init: function(custom)
        {
            NAME_CustomizeOptions_genericINIT(custom, NAME_CustomizeOptions.BackgroundColor, function (value) {
              
                if(!value.startsWith("#"))
                {
                    value = "#" + value;
                }

                if(value == "#default")
                {
                    value = "var(--bg-color)";
                }    

                document.getElementById("account_display").style.transitionDuration = "0.3s";
                document.getElementById("account_display").style.backgroundColor = value;
            });
        }
    },

    NameColor: {
        Query: "#customize_name_color>input",
        Field: "NameColor",
        Name: "Name Color",
        Cost: 2000,
        Init: function (custom)
        {
            NAME_CustomizeOptions_genericINIT(custom, NAME_CustomizeOptions.NameColor, function (value) {
                if(!value.startsWith("#"))
                {
                    value = "#" + value;
                }

                if(value == "#default")
                {
                    value = "#DDDDDD";
                }    

                document.getElementById("user_username").style.transitionDuration = "0.3s";
                document.getElementById("user_username").style.color = value;
            })
        }
    },

    Font: {
        Query: "#customize_font>select",
        Field: "Font",
        Name: "Font",
        Cost: 3000,
        Init: function (custom)
        {
            NAME_CustomizeOptions_genericINIT(custom, NAME_CustomizeOptions.Font, function (value) {
                
                if(value == "default")
                {
                    value = `"Merriweather", serif`;
                }    

                document.getElementById("user_username").style.transitionDuration = "0.3s";
                document.getElementById("user_username").style.fontFamily = value.startsWith("\"") ? value : "\"" + value + "\"";
            }, function (value) { return true; })

            LoadCustomizeItems($("#customize_font>select").get()[0], PRODUCT_TYPE.FONT);

            //Update current selected font.
            $(this.Query).get()[0].value = custom.Font;
        }
    },

    Border: {
        Query: "#customize_border>select",
        Field: "Border",
        Name: "Border",
        Cost: 5000,
        Init: function (custom)
        {
            NAME_CustomizeOptions_genericINIT(custom, NAME_CustomizeOptions.Border, function (value) {
                if(value == "default")
                {
                    document.getElementById("user_icon_border").setAttribute("style", "transition-duration: 0.3s;");
                    return;
                }

                document.getElementById("user_icon_border").setAttribute("style", "transition-duration: 0.3s;image-rendering: pixelated;background-size:contain;background-image: url('../assets/user_borders/" + value + ".png');")
            }, function (value) { return true; })

            LoadCustomizeItems($("#customize_border>select").get()[0], PRODUCT_TYPE.BORDER);

            //Update current selected border.
            $(this.Query).get()[0].value = custom.Border;
        }
    },

    Theme: {
        Query: "#customize_theme>select",
        Field: "Theme",
        Name: "Theme",
        Cost: 7500,
        Init: function (custom)
        {
            NAME_CustomizeOptions_genericINIT(custom, NAME_CustomizeOptions.Theme, function (value) {
                if(value == "default"){
                    SetTheme(value, -1, true);
                }
                for(var i = 0; i < MAIN_CATALOG.length; i++)
                {
                    if(MAIN_CATALOG[i].Data.value == value)
                    {
                        SetTheme(value, i, true);
                        break;
                    }
                }
            }, function (value) { return true; })

            LoadCustomizeItems($("#customize_theme>select").get()[0], PRODUCT_TYPE.THEME);

            
            //Update current selected border.
            $(this.Query).get()[0].value = custom.Theme;
        }
    }
}

//Returns true if the given string is a valid hex code (w/ or wo/ "#").
function IsValidHex(str)
{
    var reg=/^([0-9a-f]{3}){1,2}$/i;

    if(str.startsWith("#"))
    {
        return reg.test(str.substring(1));
    }

    return reg.test(str);
}


//Updates fields based on the values in NAME_CustomizeOptions and takes in the field that is updating (thizz), the user custom property (custom), and a function to update visual displays in real time.
function NAME_CustomizeOptions_genericINIT(custom, thizz, updateGraphics = null, validate = null)
{
    if(custom[thizz.Field] == null)
    {
        custom[thizz.Field] = "default";
    }

    const tUp = thizz.Field;
    const upGraph = updateGraphics;
    const vCheck = validate;

    const changeFunc = function (val, inp){
        if((vCheck == null && (IsValidHex(val) || val == "default")) || (vCheck != null && vCheck(val)))
        {
            currentUser.customize[tUp] = val;
            if(inp != null){inp.style.backgroundColor = "var(--bg-dark)";}

            if(upGraph != null)
            {
                SetChangeWasMade(true);
                upGraph(val);
            }

            return; 
        }

        if(inp != null){inp.style.backgroundColor = "#AA6666";}
    };

    $(thizz.Query).val(custom[thizz.Field]);
    changeFunc(custom[thizz.Field], null);
    $(thizz.Query).on('change', function() {changeFunc(this.value, this);});

    return $(thizz.Query).get();
}

function LockCustomizationField(option)
{
    const fieldParent = $(option.Query).get()[0].parentElement;

    fieldParent.innerHTML = `<div class="block_field" onclick="AttemptUnlockCustomizeFeature('${option.Field}', ${option.Cost}, '${option.Name}');"><h2>Unlock - $${option.Cost}</h2></div>` + fieldParent.innerHTML;
}

//Iterates over all owned items and adds all owned "type" to the "drop" dropdown.
function LoadCustomizeItems(drop, type)
{
    const prod = GetProducts(currentUser.c_owned);
    for(var i = 0; i < currentUser.c_owned.length; i++)
    {
        if(prod[i].Type == type)
        {
            const option = document.createElement('option');
            option.text = prod[i].Name;
            option.value = prod[i].Data.value;
            drop.appendChild(option);
        }
    }
}

//Prevents the user from applying changes that haven't been made.
var changeWasMade = false;
function SetChangeWasMade(val)
{
    changeWasMade = val;
    if(changeWasMade)
    {
        $("#apply_button").attr("style", "");
        AttemptCreateApplyButton();
    }else{
        $("#apply_button").attr("style", "opacity: 0.5;transform: scale(1);");
        RemoveApplyButtonAtTop();
    }
}

//Saves all changes to the server.
function ApplyChanges()
{
    if(!changeWasMade){return;}

    SetChangeWasMade(false);

    $("#apply_button").text("Loading...");
    API.UpdateUser(currentUser).then(d => {
        $("#apply_button").text("Apply"); 
    });
}

var numChips = 0;

//Creates a mess of chips in the pot display corresponding with the amount of money the player has.
function LoadPlayerPotDisplay()
{
    var moneyLeft = currentUser.money;

    //Limit pot display so its not too crazy.
    if(moneyLeft > 9199){moneyLeft = 9199;}

    var values = [100, 50, 25, 10, 1]

    var i = 0;
    while(i < values.length && moneyLeft > 0)
    {
        if((moneyLeft / values[i]) >= 1)
        {
            numChips++;
            const newChip = document.createElement("img");
            newChip.width = "48";
            newChip.height = "48";
            newChip.classList = "no_interpolation pot_chip";
            const x = Math.floor(Math.random() * 64);
            const y = Math.floor(Math.random() * 200) - numChips * 10;
            newChip.style = `transform: translate(${x}px, ${y}px);`
            newChip.src = "../assets/chips/" + "default_set" + "/" + (5 - i) + ".png";

            $("#pot_image").append(newChip);

            moneyLeft -= values[i];
        }else{
            i++;
        }
    }
}

//Shows the players deck display based on what packs they have applied.
function LoadPlayerCardsDisplay()
{
    for(var s = 0; s < 4; s++)
    {
        for(var i = 2; i < 15; i++)
        {
            const c = new Card(SUIT[s], CARD_VALUE[i]);

            const display = document.createElement("img");
            display.src = "../assets/cards/" + c.GetImage();

            display.className = "player_card_display";
            AddTooltipElement(display, "<h3>" + CARD_VALUE[i] + " of " + SUIT[s] + "</h3>")

            $("#my_cards_display").get()[0].children[s].append(display);
        }
    }
}

//Applies a given chip set to the existing chips in the pot and updates the currentUser.
function ApplyChipSet(itemID)
{
    if(currentUser.customize.Set == undefined)
    {
        currentUser.customize.Set = [-1];
    }

    if(currentUser.customize.Set.includes(itemID))
    {
        return;
    }

    SetChangeWasMade(true);
    currentUser.customize.Set.unshift(itemID);

   ApplyChipSetDisplay(currentUser.customize.Set);
}


function ApplyCardPack(itemID)
{
    if(currentUser.customize.Pack == undefined)
    {
        currentUser.customize.Pack = [-1];
    }

    if(currentUser.customize.Pack.includes(itemID))
    {
        return;
    }

    SetChangeWasMade(true);
    currentUser.customize.Pack.unshift(itemID);

    ApplyCardPackDisplay(currentUser.customize.Pack);
}

function UnapplyChipSet(itemID)
{
    if(!currentUser.customize.Set.includes(itemID))
    {
        return;
    }

    SetChangeWasMade(true);
    //SPLICE MUTATES
    currentUser.customize.Set.splice(currentUser.customize.Set.indexOf(itemID), 1);

    ApplyChipSetDisplay(currentUser.customize.Set);
}

function UnapplyCardPack(itemID)
{
    if(!currentUser.customize.Pack.includes(itemID))
    {
        return;
    }

    SetChangeWasMade(true);
    currentUser.customize.Pack.splice(currentUser.customize.Pack.indexOf(itemID), 1);

    ApplyCardPackDisplay(currentUser.customize.Pack);
}


//Applies the textures for each chip in reverse order of the given array of chip set IDs.
function ApplyChipSetDisplay(itemIDArr)
{
    var appliedBigBlind = false;
    for(var s = itemIDArr.length - 1; s >= 0; s--)
    {
        const itemID = itemIDArr[s];
        const isDefault = itemID < 0;

        if(isDefault || MAIN_CATALOG[itemID].Data.replaces_bb_chip == true){$("#user_big_blind_chip_display").prop('src', "../assets/chips/" + (isDefault ? "default_set" : MAIN_CATALOG[itemID].Data.value) + "/big_blind_chip.png")}

        const children = Array.from(document.getElementById("pot_image").children);

        for(var i = 0; i < children.length; i++)
        {
            const chipImageValue = children[i].src.split("/")[children[i].src.split("/").length - 1];
            if(!isDefault && !MAIN_CATALOG[itemID].Data.replaces.includes(parseInt(chipImageValue.substring(0, 1)))){continue;}

            const newDest = "../assets/chips/" + (isDefault ? "default_set" : MAIN_CATALOG[itemID].Data.value) + "/" + chipImageValue;
            children[i].src = newDest;
        }
    }
}

function ApplyCardPackDisplay(itemIDArr)
{
    document.getElementById("my_cards_display").innerHTML = "<span></span><span></span><span></span><span></span>";

    //3x FOR LOOP (AHHH O(n^3)) except 2 loops have a static range so its not really.

    for(var s = 0; s < 4; s++)
    {
        for(var v = 2; v < 15; v++)
        {
            const card = new Card(SUIT[s], CARD_VALUE[v]);
            for(var i = 0; i < itemIDArr.length; i++)
            {
                const itemID = itemIDArr[i];

                //Default pack.
                if(itemID < 0) 
                { 
                    const display = document.createElement("img");
                    display.src = "../assets/cards/" + card.GetImage();

                    display.className = "player_card_display";
                    AddTooltipElement(display, "<h3>" + CARD_VALUE[v] + " of " + SUIT[s] + "</h3>");

                    $("#my_cards_display").get()[0].children[s].append(display);
                    break;

                    //Custom pack is overriding.
                }else if(MAIN_CATALOG[itemID].Data.replaces.includes(card.GetImage().replace(".png", "")))
                {
                    const display = document.createElement("img");
                    display.src = "../assets/cards/" + MAIN_CATALOG[itemID].Data.value + "/" + card.GetImage();

                    display.className = "player_card_display";
                    AddTooltipElement(display, "<h3>" + CARD_VALUE[v] + " of " + SUIT[s] + "</h3>");

                    $("#my_cards_display").get()[0].children[s].append(display);
                    break;
                }
            }
        }
    }
}

function LoadCardPackApplicator()
{
    for(var i = 0; i < currentUser.c_owned.length; i++)
    {
        const item = MAIN_CATALOG[currentUser.c_owned[i]];
        if(item.Type == PRODUCT_TYPE.CARD_PACKS)
        {
            var created = null;
            if(currentUser.customize.Pack.includes(currentUser.c_owned[i]))
            {
                created = item.CreateDisplay($("#applied_card_packs").get()[0], "75px", "75px", true);
                created.setAttribute("applied", "true");
            }else{
                created = item.CreateDisplay($("#unapplied_card_packs").get()[0], "75px", "75px", true);
                created.setAttribute("applied", "false");
            }

            created.setAttribute("my_pack", currentUser.c_owned[i]);
            created.addEventListener('click', function () {ApplyPackGraphic(this.getAttribute("my_pack"), this.getAttribute("applied") == "true", this);});
        }
    }

    //Always show the default set as the rightmost applied set.
    const defaultSetApply = new Product("Default Pack", 0, PRODUCT_TYPE.CARD_PACKS, {value: "default"});
    const defaultDisplay = defaultSetApply.CreateDisplay($("#applied_card_packs").get()[0], "75px", "75px", true);
    defaultDisplay.setAttribute("my_pack", "default");
    
}

function LoadChipSetApplicator()
{
    for(var i = 0; i < currentUser.c_owned.length; i++)
    {
        const item = MAIN_CATALOG[currentUser.c_owned[i]];
        if(item.Type == PRODUCT_TYPE.CHIP_SETS)
        {
            var created = null;
            if(currentUser.customize.Set.includes(currentUser.c_owned[i]))
            {
                created = item.CreateDisplay($("#applied_chip_sets").get()[0], "75px", "75px", true);
                created.setAttribute("applied", "true");
            }else{
                created = item.CreateDisplay($("#unapplied_chip_sets").get()[0], "75px", "75px", true);
                created.setAttribute("applied", "false");
            }

            created.setAttribute("my_set", currentUser.c_owned[i]);
            created.addEventListener('click', function () {ApplySetGraphic(this.getAttribute("my_set"), this.getAttribute("applied") == "true", this);});
        }
    }

    //Always show the default set as the rightmost applied set.
    const defaultSetApply = new Product("Default Set", 0, PRODUCT_TYPE.CHIP_SETS, {value: "default_set"});
    defaultSetApply.CreateDisplay($("#applied_chip_sets").get()[0], "75px", "75px", true).setAttribute("my_set", "default");    

}



//Switches weather a sets graphic is applied or not (ALSO CALLS ApplyChipSet()), applying to the leftmost spot. CALLED WHEN CLICKING A SET GRAPHIC.
function ApplySetGraphic(set, applied, graphic)
{
    if(set == "default"){return;}

    if(applied)
    {
        $("#unapplied_chip_sets").prepend(graphic);
        graphic.setAttribute("applied", "false");
        UnapplyChipSet(parseInt(set));
    }else{
        $("#applied_chip_sets").prepend(graphic);
        graphic.setAttribute("applied", "true");
        ApplyChipSet(parseInt(set));
    }
}

function ApplyPackGraphic(pack, applied, graphic)
{
    if(pack == "default"){return;}

    if(applied)
    {
        $("#unapplied_card_packs").prepend(graphic);
        graphic.setAttribute("applied", "false");
        UnapplyCardPack(parseInt(pack));
    }else{
        $("#applied_card_packs").prepend(graphic);
        graphic.setAttribute("applied", "true");
        ApplyCardPack(parseInt(pack));
    }
}

var currentTopApplyButton = null;
//When the user scrolls down, THEY MIGHT FORGET TO APPLY !!!!!!!!!!!!!!!! :O
//Add an apply button.
function CreateApplyButtonAtTop()
{
    if(!changeWasMade){return;}
    if(currentTopApplyButton != null){return;}

    const applyButton = document.createElement("button");
    applyButton.setAttribute("style", "position: fixed;top: 0px;left: 7px;width: calc(100% - 14px);height: 50px;font-size: 16px;transform: scale(1);transition-duration: 0.3s;")
    applyButton.className = "apply_button"
    applyButton.textContent = "Apply";
    document.body.appendChild(applyButton);

    applyButton.addEventListener('click', function () {
        ApplyChanges();
    })

    currentTopApplyButton = applyButton;
}

window.addEventListener('scroll', AttemptCreateApplyButton)

function AttemptCreateApplyButton()
{
    if(window.scrollY >= 100)
    {
        CreateApplyButtonAtTop();
    }else if(currentTopApplyButton != null)
    {
        RemoveApplyButtonAtTop();   
    }
    
}

function RemoveApplyButtonAtTop()
{
    if(currentTopApplyButton == null){return;}
    //Save the button so it can be deleted after fading, but also set to null for calculations.
    const saveRem = currentTopApplyButton;
    saveRem.style.opacity = "0"; 

    currentTopApplyButton = null;
    setTimeout(() => {
        saveRem.remove();
    }, 320)
}

//Sends a request to a player to join a local leaderboard.
function AddToLocalLeaderboard()
{
    if(viewingAccount != "")
    {
        const acc = LocalStorage.GetCurrentAccount();

        //Get the current user that is asking to add the player.
        API.GetUser(acc.username).then(myUser => {

            const myU = myUser;
            if(myUser.l_board != null && myUser.l_board != undefined && myUser.l_board != "")
            {
                const askToJoin = document.createElement("div");
                askToJoin.setAttribute("style", "position:fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 45%; height: 30%; background-color: var(--bg-color); border: 3px solid var(--bg-dark); border-radius: 5px; display: flex; justify-content: center;align-items: center;flex-direction:column;");

                askToJoin.innerHTML = `
                    <img id="local_board_icon">
                    <h3>Ask ${currentUser.username} To Join ${myUser.l_board}?</h3>
                    <span><button id="ask_button">Ask</button><button id="ask_cancel_button">Cancel</button></span>
                `;

                setTimeout(() => {
                    document.getElementById("ask_button").addEventListener('click', function () {
                        if(this.textContent != "Ask"){return;}
                        this.textContent = "Loading...";

                        //Re-retrieve the user data since they may have gained money or other stats during the time spent viewing their profile.
                        API.GetUser(currentUser.username).then(updatedUser => {
                            if(updatedUser.l_board != null && updatedUser.l_board != undefined && updatedUser.l_board != "")
                            {
                                alert('This user is either already in a local leaderboard or was asked to join a different board.')
                                askToJoin.remove();   
                                return;
                            }

                            //Update the user.
                            updatedUser.l_board = "REQUEST_" + myU.l_board;
                            API.UpdateUser(updatedUser);

                            askToJoin.remove();
                            alert('Sent an invite!')
                        })
                    })

                    document.getElementById("ask_cancel_button").addEventListener('click', function () {
                        askToJoin.remove();
                    })
                }, 200)

                document.body.appendChild(askToJoin);
            }

        })
    }
}

function AttemptUnlockCustomizeFeature(feature, cost, featureName = feature)
{
    //Check if this is a valid unlock, user has enough money and does not already own the item.
    if(currentUser.money >= cost && !currentUser.c_unlock.includes(feature))
    {
        //Confirm with the user, explaining how much they will have left.
        CreateConfirmationMenu(`Do you want to unlock ${featureName}? (You will have $${currentUser.money - cost} left)`, () => {
            currentUser.money -= cost;
            currentUser.c_unlock.push(feature);

            //Update and reload.
            API.UpdateUser(currentUser).then(d => {window.location.reload();});
        });
    }
}