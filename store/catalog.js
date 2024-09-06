const PRODUCT_TYPE = {
    FONT: "Font",
    STAT_DISPLAY: "Stat",
    BORDER: "Border",
    CHIP_SETS: "ChipSet",
    CARD_PACKS: "CardPack",
    THEME: "Theme"
}

class Product
{
    Name;
    //Price does not have discount applied.
    Price;
    Type;
    Data;
    #discount;

    #pDisplay;

    constructor(name, price, type, data)
    {
        this.Name = name;
        this.Price = price;
        this.Type = type;
        this.Data = data;

        this.#discount = 0;
        this.#pDisplay = null;
    }

    SetDiscount(val)
    {
        this.#discount = val;
    }

    //Creates the graphic display of this product with parent, width, height, and if it should be a functional button to purchase this item.
    CreateDisplay(parent, width = "175px", height = "175px", ignoreFunctionality = false)
    {
        const product = document.createElement("div");
        product.className = "product_display theme_dark_bg_change";
        
        product.style.width = width;
        product.style.height = height;

        if(pthe_0x155_cU != undefined && !ignoreFunctionality)
        {
            if(this.GetTotalPrice() > pthe_0x155_cU.money)
            {
                const stamp = document.createElement("img");
                stamp.src = "../assets/store/too_much_stamp.png";
                stamp.className = "too_much_stamp";

                product.appendChild(stamp);
            }
        }

        //Clicking a product plays a sound.
        product.addEventListener('click', () => {PlaySound(SOUNDS.SwitchButton)});

        //This product is a pack.
        if(this.Data.pack != undefined)
        {
            const packDisplay = document.createElement("img");
            packDisplay.width = "72";
            packDisplay.height = "115.2";
            packDisplay.className = "no_interpolation"
            packDisplay.style.marginTop = "20px";
            product.setAttribute("style", "display: flex;flex-direction:column;align-items:center;")

            //Determine which pack graphic to use.
            switch(this.Type)
            {
                case PRODUCT_TYPE.FONT:
                    packDisplay.src = `../assets/store/${this.Data.rarity}_font_pack.png`;
                    break;
                case PRODUCT_TYPE.STAT_DISPLAY:
                    packDisplay.src = `../assets/store/${this.Data.rarity}_stat_pack.png`;
                    break;
                case PRODUCT_TYPE.BORDER:
                    packDisplay.src = `../assets/store/${this.Data.rarity}_border_pack.png`;
                    break;
                case PRODUCT_TYPE.CHIP_SETS:
                    packDisplay.src = `../assets/store/${this.Data.rarity}_chip_set_pack.png`;
                    break;
                case PRODUCT_TYPE.CARD_PACKS:
                    packDisplay.src = `../assets/store/${this.Data.rarity}_card_pack.png`;
                    break;
                case PRODUCT_TYPE.THEME:
                    packDisplay.src = `../assets/store/${this.Data.rarity}_card_pack.png`;
                    break;
            }

            product.appendChild(packDisplay);
        }else{
            
            //Switch for how to display each item that can be bought.
            switch(this.Type)
            {
                case PRODUCT_TYPE.FONT:
                    const fontDisplay = document.createElement("h1");
                    fontDisplay.textContent = "abc123";
                    fontDisplay.setAttribute("style", `font-family: "${this.Data.value}", "Merriweather", serif;text-align:center;width:100%;margin-top:14px;background-color:#00000011;height:35%;padding-top:7.5%;`);
                    product.appendChild(fontDisplay);
                    break;
                case PRODUCT_TYPE.STAT_DISPLAY:
                    const statDisplay = document.createElement("h2");
                    if(this.Data.suffix != undefined)
                    {
                        statDisplay.textContent = pthe_0x155_cU.stats[this.Data.value] + this.Data.suffix;
                    }else{
                        statDisplay.textContent = this.Name + ": " + pthe_0x155_cU.stats[this.Data.value];
                    }
                    statDisplay.setAttribute("style", "background-color: #00000033;text-align: center;margin-top:14px;padding-bottom: 7.5%;padding-top: 7.5%;color:" + this.Data.color + ";")
                    product.appendChild(statDisplay);
                    break;
                case PRODUCT_TYPE.CHIP_SETS:
                    const chipSetIcon = document.createElement("img");
                    chipSetIcon.src = "../assets/chips/" + this.Data.value + "/icon.png";
                    chipSetIcon.width = "64";
                    chipSetIcon.height = "64";
                    chipSetIcon.className = "no_interpolation";
                    chipSetIcon.setAttribute("style", "margin-left: calc(50% - 32px);margin-top: 14px;")
                    product.appendChild(chipSetIcon);
                    break;
                case PRODUCT_TYPE.CARD_PACKS:
                    const cardPackIcon = document.createElement("img");
                    cardPackIcon.src = "../assets/cards/" + this.Data.value + "/icon.png";
                    cardPackIcon.width = "64";
                    cardPackIcon.height = "64";
                    cardPackIcon.className = "no_interpolation";
                    cardPackIcon.setAttribute("style", "margin-left: calc(50% - 32px);margin-top: 14px;");
                    product.appendChild(cardPackIcon);
                    break;
                case PRODUCT_TYPE.BORDER:
                    const borderDisplay = document.createElement("img");
                    borderDisplay.src = "../assets/user_borders/" + this.Data.value + ".png";
                    borderDisplay.width = "64";
                    borderDisplay.height = "64";
                    borderDisplay.className = "no_interpolation";
                    borderDisplay.setAttribute("style", "margin-left: calc(50% - 32px);margin-top: 14px;")
                    product.appendChild(borderDisplay);
                    break;
                case PRODUCT_TYPE.THEME:
                    const themeIcon = document.createElement("img");
                    themeIcon.src = "../assets/themes/" + this.Data.value + "/icon.png";
                    themeIcon.width = "64";
                    themeIcon.height = "64";
                    themeIcon.className = "no_interpolation";
                    themeIcon.setAttribute("style", "margin-left: calc(50% - 32px);margin-top: 14px;")
                    product.appendChild(themeIcon);
                    break;
                default:
                    break;
            }
        }

        const nameDisplay = document.createElement("h4");
        nameDisplay.textContent = this.Name + (ignoreFunctionality ? "" : (" - $" + this.GetTotalPrice()));
        nameDisplay.style.textAlign = "center";
        product.appendChild(nameDisplay);

        if(!ignoreFunctionality)
        {
            if(pthe_0x155_cU != undefined && this.GetTotalPrice() > pthe_0x155_cU.money)
            {
                AddTooltipElement(product, `<p style="margin-top: -5px;">${this.Name}<br>$${this.GetTotalPrice()}<br>${this.Type}<br><em>TOO EXPENSIVE.</em></p>`);
            }else{
                AddTooltipElement(product, `<p style="margin-top: -5px;">${this.Name}<br>$${this.GetTotalPrice()}<br>${this.Type}<br><em>Click to purchase.</em></p>`);
            }

            product.setAttribute("item_name", this.Name);
            product.setAttribute("item_cost", this.GetTotalPrice());
            product.addEventListener('click', function () {
                if(this.getAttribute("item_name").toLowerCase().endsWith("pack"))
                {
                    DisplayPackContents(this);
                }else{
                    BuyItemAnimation(this);
                }
            });
        }

        parent.appendChild(product);

        if(!ignoreFunctionality)
        {
            this.#pDisplay = product;
        }

        return product;
    }

    GetTotalPrice()
    {
        return Math.floor(this.Price - (this.Price * (this.#discount/100)));
    }

    SetOwned()
    {
        console.log("OWNED: " + this.Name);
        $(this.#pDisplay).attr("owned", "true");
        $(this.#pDisplay).children(".too_much_stamp").remove();

        if($(this.#pDisplay).get().length == 0){return;}
        $(this.#pDisplay).get()[0].setAttribute("tooltip", "<h2 style=\"color: #AA7777;\">Owned</h2>");

        $(this.#pDisplay).children("h4")[0].textContent = this.Name + " - Owned";
        $(this.#pDisplay).children("h4")[0].setAttribute("style", "color: #AA7777;")
        $(this.#pDisplay).get()[0].style.backgroundColor = "#1d422f";
        $(this.#pDisplay).get()[0].style.transform = "scale(1)"
    }
}

//A list of all products in the game, stored by id on the API, ex: 0 is Mono1.
const MAIN_CATALOG = [
    new Product("Mono 1", 500, PRODUCT_TYPE.FONT, {value: "RobotoMono"}),
    new Product("Wins Stat", 1500, PRODUCT_TYPE.STAT_DISPLAY, {value: "wins", color: "gold", suffix: "👑"}),
    new Product("Gold Chip Border", 1250, PRODUCT_TYPE.BORDER, {value: "gold_chip", animated: false}),
    new Product("Golden Five Chip", 7500, PRODUCT_TYPE.CHIP_SETS, {value: "golden_5_chip", replaces: [5]}),
    new Product("Golden Aces Cards", 7500, PRODUCT_TYPE.CARD_PACKS, {value: "golden_aces", replaces: ["h_a", "d_a", "s_a", "c_a"]}),

    //  --COLORED CHIP BORDERS. [5 - 13 inc.]
    new Product("Black Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "black_chip", animated: false}),
    new Product("Blue Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "blue_chip", animated: false}),
    new Product("Gray Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "gray_chip", animated: false}), //BASIC PACK EXCLUSIVE
    new Product("Green Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "green_chip", animated: false}),
    new Product("Lime Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "lime_chip", animated: false}), //BASIC PACK EXCLUSIVE
    new Product("Orange Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "orange_chip", animated: false}), //BASIC PACK EXCLUSIVE
    new Product("Pink Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "pink_chip", animated: false}), 
    new Product("Purple Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "purple_chip", animated: false}), //BASIC PACK EXCLUSIVE
    new Product("Teal Chip Border", 500, PRODUCT_TYPE.BORDER, {value: "teal_chip", animated: false}),

    new Product("Rainbow Border", 1100, PRODUCT_TYPE.BORDER, {value: "rainbow", animated: false}), //BASIC PACK EXCLUSIVE

    //Catalog plate borders. [15 - 18 inc.]
    new Product("Copper Plate Border", 750, PRODUCT_TYPE.BORDER, {value: "copper_plate", animated: false}),
    new Product("Iron Plate Border", 750, PRODUCT_TYPE.BORDER, {value: "iron_plate", animated: false}),
    new Product("Gold Plate Border", 850, PRODUCT_TYPE.BORDER, {value: "gold_plate", animated: false}),
    new Product("Diamond Plate Border", 1500, PRODUCT_TYPE.BORDER, {value: "diamond_plate", animated: false}),

    //Exclusive plate borders [19 - 21 inc.] (19 and 21 found in basic pack.)
    new Product("Ruby Plate Border", 1000, PRODUCT_TYPE.BORDER, {value: "ruby_plate", animated: false}),
    new Product("Emerald Plate Border", 1000, PRODUCT_TYPE.BORDER, {value: "emerald_plate", animated: false}), //DAILY EXCLUSIVE
    new Product("Topaz Plate Border", 1000, PRODUCT_TYPE.BORDER, {value: "topaz_plate", animated: false}),

    new Product("Invert Theme", 1750, PRODUCT_TYPE.THEME, {value: "invert", bgColor: "#b18199", borderColor: "#8c6578", bgDark: "#775b69", borderDark: "#5b434f", selectionMenuColor: "#775b69"}), //22

    new Product("Rectangle Chips", 1000, PRODUCT_TYPE.CHIP_SETS, {value: "rectangle", replaces: [1,2,3,4,5], replaces_bb_chip: true}), //23
    new Product("Gemtle Chips", 3000, PRODUCT_TYPE.CHIP_SETS, {value: "gemtle_chips", replaces: [1,2,3,4,5]}), //24
    
    new Product("Blue Clubs", 1500, PRODUCT_TYPE.CARD_PACKS, {value: "blue_clubs", replaces: ["c_a", "c_2", "c_3", "c_4", "c_5", "c_6", "c_7", "c_8", "c_9", "c_10", "c_j", "c_q", "c_k"]}), //25

    new Product("Rainbow Snake Border", 9999, PRODUCT_TYPE.BORDER, {value: "basic_rainbow_snake_border", animated: true}), //26

    new Product("Green Diamonds", 1500, PRODUCT_TYPE.CARD_PACKS, {value: "green_diamonds", replaces: ["d_a", "d_2", "d_3", "d_4", "d_5", "d_6", "d_7", "d_8", "d_9", "d_10", "d_j", "d_q", "d_k"]}), //27
    new Product("Royal Deck", 8000, PRODUCT_TYPE.CARD_PACKS, {value: "royal_deck", replaces: ["c_k", "c_q", "c_j", "d_k", "d_q", "d_j", "s_k", "s_q", "s_j", "h_k", "h_q", "h_j"]}), //28

    //Fonts [29 - 31]
    new Product("Times New Roman", 500, PRODUCT_TYPE.FONT, {value: "Times New Roman"}), //29
    new Product("Impact", 1500, PRODUCT_TYPE.FONT, {value: "Impact"}), //30
    new Product("Georgia", 750, PRODUCT_TYPE.FONT, {value: "Georgia"}), //31
    new Product("Playwrite Cuba", 2000, PRODUCT_TYPE.FONT, {value: "Playwrite CU"}), //32

    new Product("Solid Chips", 3500, PRODUCT_TYPE.CHIP_SETS, {value: "solid_chips", replaces: [1,2,3,4,5], replaces_bb_chip: false}), //33
    new Product("Bronze One Chip", 3750, PRODUCT_TYPE.CHIP_SETS, {value: "bronze_1_chip", replaces: [1], replaces_bb_chip: false}), //34
    new Product("Firey Chips", 5300, PRODUCT_TYPE.CHIP_SETS, {value: "firey_chips", replaces: [1,2,3,4,5], replaces_bb_chip: false}), //35

    new Product("Metal Theme", 1250, PRODUCT_TYPE.THEME, {value: "metal", bgColor: "#a8b0b2", borderColor: "#9d9d9d", bgDark: "#6d879f", borderDark: "#637a90", selectionMenuColor: "#6d879f"}), //36

    //new Product("Games Played Stat", 2000, PRODUCT_TYPE.STAT_DISPLAY, {value: "games", color: "silver", suffix: "🎮"}), //33

]

const MAIN_PACK_CATALOG = [
    {name: "Basic Font Pack", price: 750, contains: [32, 30, 31, 0, 29], rarity: "basic"},
    {name: "Basic Stat Pack", price: 1250, contains: [1], rarity: "basic"},
    {name: "Basic Border Pack", price: 1000, contains: [2,14,19,21,15,16,5,6,7,8,9,10,11,12,13], rarity: "basic"},
    {name: "Basic Chip Set Pack", price: 5250, contains: [3, 35, 33, 34, 23], rarity: "basic"},
    {name: "Basic Card Pack", price: 5000, contains: [28, 4, 27, 25], rarity: "basic"}
]

//Returns a product that represents a pack of unlockables.
function GetPackAsProduct(pack)
{
    return new Product(pack.name, pack.price,  MAIN_CATALOG[pack.contains[0]].Type, {pack: true, contents: pack.contains, rarity: pack.rarity});
}

//Takes an array of numbers and converts it to the array of corresponding products. (ex. daily shop items: [1, 2, 3] becomes [Product1, Product2, Product3])
function GetProducts(arr)
{
    var ret = [];
    for(var i = 0; i < arr.length; i++)
    {
        ret.push(MAIN_CATALOG[arr[i]]);
    }

    return ret;
}