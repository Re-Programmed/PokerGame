var pthe_0x155_cU = null;

window.addEventListener('resize', function () {
    TOOLTIP_OFFSET = {X: -90, Y: -this.window.innerHeight + 685}
})

window.addEventListener('load', function () {
    pageMusicModifier = 0; //Chords only on settings page.

    LoadSwipe(-1);
    SetBackgroundScroll(0.25)

    console.log(window.innerHeight)
    TOOLTIP_OFFSET = {X: -90, Y: -this.window.innerHeight + 685}

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

        //User found
        pthe_0x155_cU = user;

        UpdateThemeOnLoad(pthe_0x155_cU);

        $("#user_dollar_count").text("$" + user.money);
        $("#money_display>h2:first-child").text(user.username);
        $("#money_display>h2:last-child").text(user.cpoints);
        AddTooltipElement($("#user_cosmetic_points").get()[0], "<h3>Cosmetic Points</h3>")
        AddTooltipElement($("#user_dollar_count").get()[0], "<h3>Money</h3>")


        //Load store items.
        LoadStoreFromAPI();
    })
})

var storeData = null;

//Retrieves all the data about the store from the current API and loads it to the screen.
//This function also checks if the current store is outdated and updates it globally.
function LoadStoreFromAPI()
{
    rc_0x01623.rc_0x01623_gi("content_store").then(store => {

        storeData = JSON.parse(atob(store.data));
        console.log(storeData)

        //Check if user is on an outdated version, (SOME NEWER STORE ITEMS MAY NOT WORK)
        if(storeData.v != GAME_VERSION)
        {
            document.body.innerHTML = OudatedMessage;
            return;
        }

        //It has been a day since the last store. Make a new one.
        if(GetHoursSinceLastStore() > 24)
        {
            CreateNewStore();
            return;
        }

        $("#daily_shop_items>h2:first-child").text(`Daily Shop (${storeData.d_off}% off) - New Items in ${Math.floor(24 - GetHoursSinceLastStore())} hours.`);

        GetProducts(storeData.daily).forEach(product => {
            product.SetDiscount(storeData.d_off);

            product.CreateDisplay($("#daily_shop_items_content").get()[0], "25%");

            //Check if the item is onwed by the user.
            for(var i = 0; i < pthe_0x155_cU.c_owned.length; i++)
            {
                if(MAIN_CATALOG[pthe_0x155_cU.c_owned[i]].Name == product.Name)
                {
                    //Item is already owned by the user!
                    product.SetOwned();
                    break;
                }
            }
    
        })

        storeData.packs.forEach(pack => {
            GetPackAsProduct(MAIN_PACK_CATALOG[pack]).CreateDisplay($("#shop_packs_content").get()[0], "25%");
        })

        //Must be called after loading the API. (could use await but lazy)
        LoadPermanentItems();
    })
}

//All items in the catalog. (never changes, always available)
const PermanentStoreItems = [0,29,31,1,2,
    5, //Black Chip Border
    6, //Blue Chip Border
    8, //Green Chip Border
    11, //Pink Chip Border
    13, //Teal Chip Border
    15, //Copper Plate Border
    16, //Iron Plate Border
    17, //Gold Plate Border
    19, //Ruby Plate Border
    21, //Topaz Plate Border
    18, //Diamond Plate Border
    23, //Rectangle Chips
    3, //Gold 5 Chip
    25, //Blue Clubs
    27, //Green Diamonds
    22, //Invert Theme
]
function LoadPermanentItems()
{
    const prod = GetProducts(PermanentStoreItems);
    for(var i = 0; i < PermanentStoreItems.length; i++)
    {
        //Make sure not to include any items already in the daily shop.
        if(storeData.daily.includes(PermanentStoreItems[i])){continue;}

        prod[i].CreateDisplay($("#shop_permanent_items").get()[0], "100%");
    
    }

     //Check if the item is onwed by the user.
     for(var j = 0; j < pthe_0x155_cU.c_owned.length; j++)
    {
        console.log(pthe_0x155_cU.c_owned[j])
        if(!PermanentStoreItems.includes(pthe_0x155_cU.c_owned[j])){continue;}

        //Item is already owned by the user!
        prod[PermanentStoreItems.indexOf(pthe_0x155_cU.c_owned[j])].SetOwned();
    }
}

//Displays what it is possible to get from opening a certain pack and allows confirmation.
function DisplayPackContents(prodDisplay)
{
    for(var i = 0; i < MAIN_PACK_CATALOG.length; i++)
    {
        //Found what pack is currently getting opened.
        if(MAIN_PACK_CATALOG[i].name == prodDisplay.getAttribute("item_name"))
        {
            const mainPackDisplay = document.createElement("div"); 
            //Center the mainPackDisplay and make it a flex box.
            mainPackDisplay.setAttribute("style", "width:50%;height:50%;position:fixed;top:50%;left:50%;transform: translate(-50%, -50%);background-color: var(--bg-light);border: 3px solid var(--bg-color);border-radius: 5px;");

            const contentDisplay = document.createElement("span");
            contentDisplay.className = "scroll_fancy";
            contentDisplay.setAttribute("style", "display:flex;align-items: center;justify-content: center;flex-wrap: wrap;overflow-y: scroll; overflow-x:hidden; height: calc(100% - 96px);");

            mainPackDisplay.innerHTML = `<h2 style="text-align:center;font-size:20px;margin:0;margin-top:7px;margin-bottom:7px;">${prodDisplay.getAttribute("item_name")} Contents</h2>`;

            mainPackDisplay.appendChild(contentDisplay);

            for(var j = 0; j < MAIN_PACK_CATALOG[i].contains.length; j++)
            {
                const item = MAIN_CATALOG[MAIN_PACK_CATALOG[i].contains[j]];
                if(item == undefined){continue;}
                const display = item.CreateDisplay(contentDisplay, "115px", "150px", true);
                if(item.Price > parseInt(prodDisplay.getAttribute("item_cost")))
                {
                    //Remove any theme modifiers and add the background color.
                    display.className = "product_display theme_border_only_change";
                    display.style.backgroundColor = "#888800"; 
                }
            }
            
            mainPackDisplay.className = "pack_item_below_reveal theme_bg_change";
            mainPackDisplay.style.zIndex = "5";

            document.body.appendChild(mainPackDisplay);

            /*
             * Create continue and cancel buttons.
             */

            const buttonContainer = document.createElement("div");
            buttonContainer.setAttribute("style", "display: flex;width: 100%;height: 50px;justify-content:center;align-items:center;")
            
            const continueButton = document.createElement("button");
            const cancelButton = document.createElement("button");

            continueButton.textContent = "Open";
            cancelButton.textContent = "Cancel";

            continueButton.setAttribute("style", "height: 50px; width: 48%;border: 3px solid var(--bg-color);");
            cancelButton.setAttribute("style", "height: 50px; width: 48%;border: 3px solid var(--bg-color);");

            const btnProdDisplay = prodDisplay;

            const cancelFunc = () => {
                PlaySound(SOUNDS.Swipe);
                mainPackDisplay.remove();
            };

            continueButton.addEventListener("click", function () {
                BuyItemAnimation(btnProdDisplay);
                cancelFunc();
            });

            cancelButton.addEventListener('click', cancelFunc);

            buttonContainer.appendChild(continueButton);
            buttonContainer.appendChild(cancelButton);
            mainPackDisplay.appendChild(buttonContainer);

            return;
        }
    }
}

var packRetries = 0;
function buyPackAnimation(prodDisplay, mainIcon, dim, originalMainIconStyle)
{
    PlaySound(SOUNDS.Crumple);

    setTimeout(function () {
        PlaySound(SOUNDS.SineUp);
    }, 4000);

    packRetries = 0;
    mainIcon.style.transitionDuration = "0.25s";
    //Shake pack.
    for(var i = 0; i < 15; i++)
    {
        const eO = i % 2;
        setTimeout(function () {
            if(eO == 1)
            {
                mainIcon.style.transform = "translate(-50%, -50%) translateX(-25px) scale(2)"
            }else{
                mainIcon.style.transform = "translate(-50%, -50%) translateX(25px) scale(2)"
            }
        }, i * 250)
    }

    setTimeout(() => {
        mainIcon.style.transitionDuration = "0.1s";
        //Ensure pack is on top of the item that is shown below it.
        mainIcon.style.zIndex = "10";
        for(var i = 0; i < 25; i++)
        {
            const iS = i;
            setTimeout(function () {
                mainIcon.style.boxShadow = `0px 0px ${iS * 3}px #fff`;
                if(iS % 2 == 1)
                {
                    mainIcon.style.transform = "translate(-50%, -50%) translateX(-11px) scale(2)"
                }else{
                    mainIcon.style.transform = "translate(-50%, -50%) translateX(11px) scale(2)"
                }
            }, i * 100)
        }

        setTimeout(function () {
            mainIcon.style.transitionDuration = "0.75s";
            mainIcon.style.transform = "translate(-50%, -50%) scale(3)";

            //SPAWN RESULTING COSMETIC BELOW PACK HERE! (With confirm button)
            const itemDisplay = document.createElement("div");

            //Find the pack currently being bought.
            for(var i = 0; i < MAIN_PACK_CATALOG.length; i++)
            {
                //Found what pack is currently getting opened.
                if(MAIN_PACK_CATALOG[i].name == prodDisplay.getAttribute("item_name"))
                {
                    //Gets a random item from the list of contained items in the pack.
                    var resultingItemID = MAIN_PACK_CATALOG[i].contains[Math.floor(Math.random() * MAIN_PACK_CATALOG[i].contains.length)];

                    //Attept to give the player an item they do not already own.
                    while(pthe_0x155_cU.c_owned.includes(resultingItemID) && packRetries < 100)
                    {
                        resultingItemID = MAIN_PACK_CATALOG[i].contains[Math.floor(Math.random() * MAIN_PACK_CATALOG[i].contains.length)];
                        packRetries++;
                    }

                    const resultingItem = MAIN_CATALOG[resultingItemID];
                    resultingItem.CreateDisplay(itemDisplay, "175px", "175px", true);
                    PlaySound(SOUNDS.PackJingle);

                    //Hide background and center item.
                    itemDisplay.setAttribute("style", "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9; display: flex; align-items: center; flex-direction: column; transition-duration: 0.6s;");
                    itemDisplay.className = "pack_item_below_reveal";

                    //Create button to claim item.
                    const confirmButton = document.createElement("button");
                    confirmButton.textContent = "Claim";

                    //Finalize pack transaction.  (DONE BEFORE CLICKING confirmButton TO PREVENT THE USER FROM RELOADING THE PAGE AND OPENING THE PACK AGAIN!)
                    pthe_0x155_cU.money -= parseInt(prodDisplay.getAttribute("item_cost"));
                    $("#user_dollar_count").text("$" + pthe_0x155_cU.money);
                    
                    //Give the user the item only if they do not already have it.
                    if(!pthe_0x155_cU.c_owned.includes(resultingItemID))
                    {
                        pthe_0x155_cU.c_owned.push(resultingItemID);
                    }

                    resultingItem.SetOwned();

                    rc_0x01623.rc_0x01623_uu(pthe_0x155_cU);

                    confirmButton.addEventListener('click', function () {
                      //Hide visuals.
                      itemDisplay.style.transform = "translate(-50%, -50%) scale(0)";
                      dim.style.backgroundColor = "#00000000";

                      setTimeout(() => {
                        dim.remove();
                        itemDisplay.remove();

                        //Move the pack graphic back to its normal location.
                        mainIcon.setAttribute("style", originalMainIconStyle + "transform: scale(0);transition-duration: 0.6s;");
                        prodDisplay.prepend(mainIcon);
                        setTimeout(() => {
                            mainIcon.setAttribute("style", originalMainIconStyle + "transform: scale(1);transition-duration: 0.6s;");
                            setTimeout(() => {
                                mainIcon.setAttribute("style", originalMainIconStyle);
                            }, 700)
                        }, 3)
                      }, 725)
                    })

                    itemDisplay.appendChild(confirmButton);

                    document.body.appendChild(itemDisplay);
                    break;
                }
            }            

            setTimeout(function () {
                mainIcon.style.transform = "translate(-50%, 1000px) scale(3)";
                mainIcon.style.opacity = "0";
            }, 1500)
        }, 2560)
    }, 15 * 250)
}

function BuyItemAnimation(prodDisplay, bypass66Check = false)
{
    if(prodDisplay.getAttribute("owned") == "true"){return;}

    if(parseInt(prodDisplay.getAttribute("item_cost")) > pthe_0x155_cU.money)
    {
        return;
    }

    if(!bypass66Check && parseInt(prodDisplay.getAttribute("item_cost")) > pthe_0x155_cU.money * 0.66)
    {
        const pDispSave = prodDisplay;
        CreateConfirmationMenu("This item is worth more than 2/3 of the current money you have.<br> Are you sure?", () => {
            BuyItemAnimation(pDispSave, true);
        })

        return;
    }

    const dim = document.createElement("div");
    $(dim).attr("style", "position: fixed;top:0;left:0;width: 100%;height: 100%;z-index: 6;background-color: #00000000;transition-duration:0.6s;")

    setTimeout(() => {
        dim.style.backgroundColor = "#00000077";
    }, 3)
    
    //Swipe if it is not a pack.
    if(!prodDisplay.getAttribute("item_name").toLowerCase().endsWith("pack"))
     {
        PlaySound(SOUNDS.Swipe);
     }

    document.body.appendChild(dim)

    const mainIcon = prodDisplay.children[0];

    const originalMainIconStyle = mainIcon.getAttribute("style");

    //ANIMATION FOR PURCHASING AN ITEM!!
    mainIcon.setAttribute("style", "position: absolute;top: -10%;left: -10%;opacity: 0;z-index: 7;");
    setTimeout(function () {
        mainIcon.style.transitionDuration = "0.8s";
        mainIcon.style.transitionTimingFunction = "ease-in-out";
        mainIcon.style.position = "absolute";
        mainIcon.style.top = "50%";
        mainIcon.style.left = "50%";
        mainIcon.style.opacity = "1";
        mainIcon.style.userSelect = "none";
        mainIcon.style.transform = "translate(-50%, -50%)";

        setTimeout(function () {
            mainIcon.style.filter = "drop-shadow(7px 7px 2px #00000092)";
            mainIcon.style.transform = "translate(-50%, -50%) scale(2)";

            setTimeout(function () {

                if(prodDisplay.getAttribute("item_name").toLowerCase().endsWith("pack"))
                {
                    buyPackAnimation(prodDisplay, mainIcon, dim, originalMainIconStyle);
                    return;
                }   
                PlaySound(SOUNDS.Chip);

                mainIcon.style.filter = "drop-shadow(12px 12px 2px #00000092)";
                mainIcon.style.transform = "translate(-50%, -50%) scale(3) rotate(10deg)";

                setTimeout(function () {
                    mainIcon.style.filter = "drop-shadow(12px 12px 2px #00000092)";
                    mainIcon.style.transform = "translate(-50%, -50%) scale(9) rotate(16deg)";
                    setTimeout(function () {
                        mainIcon.style.filter = "drop-shadow(12px 12px 2px #00000092)";
                        mainIcon.style.transform = "translate(-50%, -50%) scale(0) rotate(359deg)";
                        setTimeout(function () {
                            const text = document.createElement("h1");
                            text.className = "purchased_text";
                            text.textContent = prodDisplay.getAttribute("item_name") + " Purchased!";

                            document.body.appendChild(text);
                            PlaySound(SOUNDS.SineUp);

                            setTimeout(function () {
                                text.style.left = "-50%"
                                setTimeout(function () {
                                    dim.style.backgroundColor = "#00000000";
                                    setTimeout(function () {
                                        //Remove dimming and put chip back in its place on the store icon.
                                        
                                        dim.remove();

                                        mainIcon.setAttribute("style", originalMainIconStyle + "transform: scale(0);transition-duration: 0.6s;");
                                        prodDisplay.prepend(mainIcon);

                                        //Await before making chip grow up back in the place it should be.
                                        setTimeout(function () {
                                            mainIcon.setAttribute("style", originalMainIconStyle + "transform: scale(1);transition-duration: 0.6s;");

                                            //Set item as purchased.
                                            for(var i = 0; i < MAIN_CATALOG.length; i++)
                                            {
                                                if(prodDisplay.getAttribute("item_name") == MAIN_CATALOG[i].Name)
                                                {
                                                    MAIN_CATALOG[i].SetOwned();

                                                    //Finalize all of the transaction on the server.
                                                    pthe_0x155_cU.money -= MAIN_CATALOG[i].GetTotalPrice();
                                                    $("#user_dollar_count").text("$" + pthe_0x155_cU.money);
                                                    pthe_0x155_cU.c_owned.push(i);
                                                    rc_0x01623.rc_0x01623_uu(pthe_0x155_cU);
                                                    break;
                                                }
                                            }
                                        }, 3)
                                    }, 600)
                                }, 500)
                            }, 1800)
                        }, 750);
                    }, 1203);
                }, 1203);
            }, 1203);
        }, 1203);
    }, 3)

    document.body.appendChild(mainIcon);
}

function CreateNewStore(dItems = null)
{
    var dailyItems = [Math.floor(Math.random() * MAIN_CATALOG.length), Math.floor(Math.random() * MAIN_CATALOG.length), Math.floor(Math.random() * MAIN_CATALOG.length), Math.floor(Math.random() * MAIN_CATALOG.length)];
    
    if(dItems != null)
    {
        dailyItems = dItems;
    }
    
    const dailyPacks = [Math.floor(Math.random() * MAIN_PACK_CATALOG.length), Math.floor(Math.random() * MAIN_PACK_CATALOG.length)];

    const dOff = Math.floor(Math.random() * 16);

    const newStore = `{"daily":[${dailyItems[0]},${dailyItems[1]},${dailyItems[2]},${dailyItems[3]}],"d_off":${dOff},"packs":[${dailyPacks[0]},${dailyPacks[1]}],"v":"1.0.0","last_update":${Date.now()}}`;

    rc_0x01623.rc_0x01623_si("content_store", btoa(newStore)).then(d => {
        window.location.reload();
    });
}

function GetHoursSinceLastStore()
{
    return (Date.now() - storeData.last_update)/3600000;
}