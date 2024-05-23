///Represents each card values display (ace, queen, king) and its corresponding value.
const CARD_VALUE = {
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "Jack",
    12: "Queen",
    13: "King",
    14: "Ace"
}

const SUIT = ["Hearts", "Diamonds", "Spades", "Clubs"]

class Card
{
    Suit;
    Value;

    constructor(suit, value)
    {
        this.Suit = suit;
        this.Value = value;
    }

    //Returns true if this card's value is greater than the input card's value.
    GreaterThan(otherCard)
    {
        return this.Value > otherCard.Value;
    }

    //Returns the name of the image file that this card represents. (ex. 2 of Hearts would be "h_2.png")
    GetImage()
    {
        //Return image name, check if its a 10, 2 character name.
        return this.Suit.charAt(0).toLowerCase() + "_" + (this.Value == CARD_VALUE[10] ? "10" : this.Value.charAt(0).toLowerCase()) + ".png";
    }
}

var Deck = []

//Fills the deck with 52 cards.
function PopulateDeck()
{
    Deck = [];
    for(var s = 0; s < 4; s++)
    {
        for(var v = 2; v <= 14; v++)
        {
            const c = new Card(SUIT[s], CARD_VALUE[v]);
            Deck.push(c);
        }
    }
}

//Removes a random card from the deck and returns it.
function DrawCard()
{
    if(Deck.length < 1)
    {
        return null;
    }

    var rand = Math.floor(Math.random() * Deck.length)

    const card = Deck[rand]

    Deck.splice(rand, 1);

    return card;
}

//Takes in the query to an element and renders the card deck using the given element as the parent.
function RenderDeck(deckParent)
{
    document.getElementById(deckParent.replace("#", "")).innerHTML = ""

   for(var c = 0; c < Deck.length; c++)
    {
        const deckCard = document.createElement("img");
        deckCard.src = "../assets/cards/back.png";
        deckCard.width = "140";
        deckCard.height = "200";
        deckCard.classList = "no_interpolation deck_card"
        deckCard.style = `position: fixed; transform: translateX(-100%) translateY(${-c - 200}px);`
    
        if(c == Deck.length - 1)
        {
            AddTooltipElement(deckCard, "<h3>The Deck</h3>");
        }
        
        $(deckParent).append(deckCard)
    }
}

//Renders a card as a child of the given element query.
//cardParent: string, card: Card
function RenderCard(cardParent, card, scale = 1)
{
    const cardobj = document.createElement("img");
    cardobj.src = "../assets/cards/" + card.GetImage();
    cardobj.width = 140 * scale;
    cardobj.height = 200 * scale;
    cardobj.classList = "no_interpolation card_render"

    AddTooltipElement(cardobj, `<h4>${card.Value + " of " + card.Suit}`)

    $(cardParent).append(cardobj)
}