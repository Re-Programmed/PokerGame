
//Each hand has a given value and a function that takes in a given hand and returns all cards that are pertinent to the specified hand (returning null if no hand exists).
const POKER_HANDS = {

    RoyalFlush: {
        value: 10,
        name: "Royal Flush",
        Has: function (cards) {
            //Check for a straight flush.
            const straightFlush = POKER_HANDS.StraightFlush.Has(cards);
            if(straightFlush == null){return null;}

            //Check if the highest card in that straight is an ace.
            const highCard = POKER_HANDS.HighCard.Has(cards)[0];
            if(highCard.Value == "Ace")
            {
                return cards;
            }

            return null;
        }
    },

    StraightFlush: {
        value: 9,
        name: "Straight Flush",
        Has: function (cards) {
            //Check for a straight.
            if(POKER_HANDS.Straight.Has(cards) == null){return null;}

            //Check for a flush.
            if(POKER_HANDS.Flush.Has(cards) == null){return null;}

            return cards;
        }
    },

    FourOfAKind: {
        value: 8,
        name: "Four of a Kind",
        Has: function (cards) {
            //Copy the cards array.
            var cardsCopy = []
            for(var c = 0; c < cards.length; c++){cardsCopy.push(cards[c]);}

            //Check for the first pair.
            var pair1 = HAND_EVAL_getPair(cardsCopy);
            if(pair1 == null) {return null;}

            cardsCopy.splice(cardsCopy.indexOf(pair1[0]), 1);
            cardsCopy.splice(cardsCopy.indexOf(pair1[1]), 1);

            //Check for a second pair not including the first pair.
            var pair2 = HAND_EVAL_getPair(cardsCopy);
            if(pair2 == null) {return null;}

            //Check if the two pairs have the same value.
            if(pair2[0].Value == pair1[0].Value)
            {
                return [pair1[0], pair1[1], pair2[0], pair2[1]];
            }

            return null;
        }
    },
    
    FullHouse: {
        value: 7,
        name: "Full House",
        Has: function (cards) {
            //Copy the cards array.
            var cardsCopy = []
            for(var c = 0; c < cards.length; c++){cardsCopy.push(cards[c]);}
            
            //Check for a 3x.
            var threeOfAKind = POKER_HANDS.ThreeOfAKind.Has(cards);
            if(threeOfAKind == null) {return null;}

            cardsCopy.splice(cardsCopy.indexOf(threeOfAKind[0]), 1);
            cardsCopy.splice(cardsCopy.indexOf(threeOfAKind[1]), 1);
            cardsCopy.splice(cardsCopy.indexOf(threeOfAKind[2]), 1);

            //Check for a 2x without considering the cards in the 3x.
            var pair = HAND_EVAL_getPair(cardsCopy);
            if(pair == null) {return null;}

            return cards;
        }
    },

    Flush: {
        value: 6,
        name: "Flush",
        Has: function (cards) {         
            //If any card has a suit not matching that of the first card, a flush cannot be present.   
            for(var c = 0; c < cards.length; c++)
            {
                if(cards[c].Suit != cards[0].Suit)
                {
                    return null;
                }
            }

            return cards;
        }
    },

    Straight: {
        value: 5,  
        name: "Straight",
        Has: function (cards)
        {
            //Copy the cards array.
            var cardsCopy = []
            for(var c = 0; c < cards.length; c++){cardsCopy.push(cards[c]);}

            //Create a variable to store the last checked highest card.
            var highestCard = null;
            while(cardsCopy.length > 0)
            {
                //Get the highest card in the hand.
                var checkCard = POKER_HANDS.HighCard.Has(cardsCopy)[0];
                //Remove the highest card from the array.
                cardsCopy.splice(cardsCopy.indexOf(checkCard), 1);

                if(highestCard != null)
                {
                    //Check if the new highest card is one less than the value of the previous highest card.
                    if(GetCardValue(highestCard) - 1 != GetCardValue(checkCard))
                    {
                        return null;
                    }
                }

                //Update the last highest card.
                highestCard = checkCard;
            }

            return cards;
        }
    },

    ThreeOfAKind: {
        value: 4,
        name: "Three of a Kind",
        Has: function (cards)
        {
            //Copy the cards array.
            var cardsCopy = []
            for(var c = 0; c < cards.length; c++){cardsCopy.push(cards[c]);}

            //pairCheck is used to store the last gotten pair in the hand.
            var pairCheck = POKER_HANDS.OnePair.Has(cardsCopy);

            //If the hand contains a pair.
            while(pairCheck != null)
            {
                //Remove the gotten pair from the hand to avoid checking them in the 3x check and in the rare case that a full house has tied and 
                //should be checked by the ThreeOfAKind calculation.
                cardsCopy.splice(cardsCopy.indexOf(pairCheck[0]), 1);
                cardsCopy.splice(cardsCopy.indexOf(pairCheck[1]), 1);

                for(var c = 0; c < cardsCopy.length; c++)
                {
                    //A third card in the hand, not including the pair, exists such that its value is equivelent to the pair.
                    if(cardsCopy[c].Value == pairCheck[0].Value)
                    {
                        return [pairCheck[0], pairCheck[1], cardsCopy[c]];
                    }
                }
                
                pairCheck = POKER_HANDS.OnePair.Has(cardsCopy);
            }
        } 
    },

    TwoPair: { 
        value: 3,
        name: "Two Pair",
        Has: function (cards) 
        {
            var cardsCopy = []
            for(var c = 0; c < cards.length; c++){cardsCopy.push(cards[c]);}

            var firstPair = HAND_EVAL_getPair(cardsCopy);
            if(firstPair == null){return null;}

            cardsCopy.splice(cardsCopy.indexOf(firstPair[0]), 1);
            cardsCopy.splice(cardsCopy.indexOf(firstPair[1]), 1);

            var secondPair = HAND_EVAL_getPair(cardsCopy);
            if(secondPair == null){return null;}
            
            return [firstPair[0], firstPair[1], secondPair[0], secondPair[1]];
        }
    },

    OnePair: {
        value: 2,
        name: "Pair",
        //Returns the pair in the hand as an array of 2 elements.
        //Returns null if no pair exists.
        Has: function (cards) 
        {
            return HAND_EVAL_getPair(cards);
        }
    },

    HighCard: {
        value: 1,
        name: "High Card",
        //Returns an array with the highest card in the player's hand.
        Has: function (cards) 
        {
            var highest = 0;
            for(var card = 0; card < cards.length; card++)
            {
                if(GetCardValue(cards[highest]) < GetCardValue(cards[card]))
                {
                    highest = card;
                }
            }

            return [cards[highest]];
        }
    }
}

//List of the strings representing each poker hand, used for iteration.
const POKER_HAND_LIST = ["RoyalFlush", "StraightFlush", "FourOfAKind", "FullHouse", "Flush", "Straight", "ThreeOfAKind", "TwoPair", "OnePair", "HighCard"]

function HAND_EVAL_getPair(cards)
{
    var highestPair = {c1: -1, c2: -1}
    for(var x = 0; x < cards.length; x++)
    {
        for(var y = 0; y < cards.length; y++)
        {
            if(x == y){continue;}
            if(cards[x].Value == cards[y].Value)
            {
                if(highestPair.c1 == -1 || highestPair.c2 == -1 || GetCardValue(cards[x]) > GetCardValue(cards[highestPair.c1]))
                {
                    highestPair.c1 = x;
                    highestPair.c2 = y;
                }
            }
        }
    }

    if(highestPair.c1 == -1 || highestPair.c2 == -1)
    {
        return null;
    }else{
        return [cards[highestPair.c1], cards[highestPair.c2]];
    }
}

function GetBestPlayerHand(publicCards, myCards)
{
    var bestHand = null;
    for(var c = 0; c < publicCards.length; c++)
    {
        for(var d = c + 1; d < publicCards.length; d++)
        {
            for(var e = d + 1; e < publicCards.length; e++)
            {
                const currHand = HAND_EVAL_determinePokerHand([publicCards[c], publicCards[d], publicCards[e], myCards[0], myCards[1]]);
                if(bestHand == null)
                {
                    bestHand = currHand;
                    continue;
                }

                var isBetter = POKER_HANDS[bestHand.hand].value < POKER_HANDS[currHand.hand].value;

                if(!isBetter && POKER_HANDS[bestHand.hand].value == POKER_HANDS[currHand.hand].value)
                {
                    const bHighCard = POKER_HANDS.HighCard.Has(bestHand.cards)[0];
                    const cHighCard = POKER_HANDS.HighCard.Has(currHand.cards)[0];

                    if(GetCardValue(cHighCard) > GetCardValue(bHighCard))
                    {
                        isBetter = true;
                    }
                }

                if(isBetter)
                {
                    bestHand = currHand;
                }
            }
        }
    }

    return bestHand;
}

function GetCardValue(card)
{
    for(var v = 2; v < 15; v++)
    {
        if(CARD_VALUE[v] == card.Value)
        {   
            return v;
        }
    }
}

//Returns an object representing the hand that the given cards represent and the cards that make up that hand.
function HAND_EVAL_determinePokerHand(cards)
{
    var lastHand = null, i = 0;
    while(lastHand == null && i < POKER_HAND_LIST.length)
    {
        lastHand = POKER_HANDS[POKER_HAND_LIST[i]].Has(cards);
        i++;
    }

    return {hand: POKER_HAND_LIST[i - 1], cards: lastHand};
}

//Hand refers to the return value of GetBestHand().
//Returns true if the first given hand is better.
function PlayerHand1Better(h1, h2)
{
    var isBetter = POKER_HANDS[h2.hand].value < POKER_HANDS[h1.hand].value;

    if(!isBetter && POKER_HANDS[h2.hand].value == POKER_HANDS[h1.hand].value)
    {
        //Determine if the highest not equal card is greater or less than each hand.
        var c1Copy = [];
        for(var c = 0; c < h1.cards.length; c++){c1Copy.push(h1.cards[c])};
        var c2Copy = [];
        for(var c = 0; c < h2.cards.length; c++){c2Copy.push(h2.cards[c])};

        while(c1Copy.length > 0 && c2Copy.length > 0)
        {
            const highCard2 = POKER_HANDS.HighCard.Has(c2Copy)[0];
            const highCard1 = POKER_HANDS.HighCard.Has(c1Copy)[0];

            if(GetCardValue(highCard1) > GetCardValue(highCard2))
            {
                return true;
            }

            c1Copy.splice(c1Copy.indexOf(highCard1), 1);
            c2Copy.splice(c2Copy.indexOf(highCard2), 1);
        }

        
    }

    return isBetter;
}

//Hands should be a 2d array of players cards.
function FindWinner(hands, publicCards)
{
    var i = 1;
    var bestHand = GetBestPlayerHand(publicCards, hands[0]);
    for(var h = 1; h < hands.length; h++)
    {
        const hand = GetBestPlayerHand(publicCards, hands[h]);
        if(PlayerHand1Better(hand, bestHand))
        {
            bestHand = hand;
            i = h + 1;
        }
    }

    return {player: i, hand: bestHand};
}