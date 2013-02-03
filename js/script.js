$(document).ready(function () {
    $('.move-card').click(function () {
        var num = $(this).attr('id').replace(/card/, '');

        if (currentGameState == GameState.secondDeal) {
            if (holdCards[num - 1]) {
                holdCards[num - 1] = false;
                $(this).parent().removeClass("selected-card");
            } else {
                holdCards[num - 1] = true;
                $(this).parent().addClass("selected-card");
            }
            
        } 
        
    });

    $('#deal').click(function () {
        if (currentGameState === GameState.startGame) {
            $(".move-card").css("display", "block");
            initCards();
        }
        if ((currentGameState != GameState.bigOrSmall) || (currentGameState != GameState.noDeal)) {
            deal();
            
            console.log("currentGameState " + currentGameState);
        } 
    });

    $("#smallBtn, #bigBtn").click(function () {
        if (currentGameState === GameState.bigOrSmall) {
            var CheckBigOrSmall = bigOrSmall();
            if (($(this).attr("id") === 'smallBtn' && CheckBigOrSmall == -1) ||
                ($(this).attr("id") === 'bigBtn' && CheckBigOrSmall == 1)) {
                gain *= 2;
                $(".gain span").html(gain);
                console.log(gain);
            } else {
                gain = 0;
                currentGameState = GameState.firstDeal;
                $(".gain span").html(gain);
            }
        }
    });

    $('#gainDraw').click(function () {
        credit += gain;
        gain = 0;
        currentGameState = GameState.firstDeal;
        $("#credit-value").html(credit);
        $("#gain-value").html(gain);
    });
    
});

    function Card(top, left, value, suit) {
        this.top = top;
        this.left = left;
        this.value = value;
        this.suit = suit;
    }

    var GameState = {
        startGame: "startGame",
        noDeal: "noDeal",
        firstDeal: "firstDeal",
        secondDeal: "secondDeal",
        bigOrSmall: "bigOrSmall",
        gameOver: "gameOver"
    }

   function shuffle() {
        for (var i = 0; i < 52; i++) {
            var shuff = Math.floor(Math.random()*52);
            var temp = allCards[i];
            allCards[i] = allCards[shuff];
            allCards[shuff] = temp;
        }
        console.log(allCards.length);
    }

    var allCards;
    var dealCards = new Array(5);
    var holdCards = new Array(5);
    var currentGameState = GameState.startGame;
    var canHold = false;
    var bet = 0;
    var gain = 0;
    var credit = 5000;

    function initCards() {
        var topPos = 0;
        var leftPos = 0;
        allCards = new Array(52);
        var topNum = 98;
        var leftNum = 73;
        $("#big-or-small").html("");
        for (var i = 0; i < 4; i++) {
            topPos = i * topNum;
            for (var j = 0; j < 13; j++) {
                leftPos = j * leftNum;
                allCards[(i * 13) + j] = new Card(topPos, leftPos, j + 1, i);
            }
            leftPos = 0; //reset left position
        }
        //console.log(allCards);
        shuffle();
        currentGameState = GameState.firstDeal;
        console.log("currentGameState init - " + currentGameState);
    }
    
    function updateCredit() {
        // Get bet and update credit
        bet = parseInt($("#bet").val());
        if (credit == 0) {
            currentGameState = GameState.gameOver;
            alert(currentGameState);
        } else if (credit < bet) {
            bet = credit;
            credit = 0;
            $("#credit-value").html(credit);
            $("#bet").val(bet);
        } else {
            credit -= bet;
        }
        $("#credit-value").html(credit);
    }

    function deal() {
        
        if (currentGameState === GameState.firstDeal) {
            $(".card-hold").children().removeClass("selected-card");
            $(".show-card").addClass("transformed");
            $(".move-card").addClass("visual");
            var tempState = currentGameState;
            currentGameState = GameState.noDeal;
            setTimeout(function () {
                
                $(".show-card").removeClass("transformed");
                $(".move-card").removeClass("visual");
                console.log("in interval");

                //currentGameState = GameState.noDeal;
            }, 1800);
           
            currentGameState = tempState;
            console.log("out interval");
            updateCredit();
            initCards();

            for (var i = 0; i < 5; i++) {
                dealCards[i] = allCards.shift();
                var cssCard = {
                    top: -dealCards[i].top,
                    left: -dealCards[i].left
                }
                $("#card" + (i + 1)).css(cssCard);
                //console.log(dealCards[i]);
                holdCards[i] = false;
            }
            currentGameState = GameState.secondDeal;
        } else if (currentGameState === GameState.secondDeal) {
            $(".show-card").addClass("transformed");
            $(".move-card").addClass("visual");
            var tempState = currentGameState;
            currentGameState = GameState.noDeal;
            setTimeout(function () {

                $(".show-card").removeClass("transformed");
                $(".move-card").removeClass("visual");
                console.log("in interval");
                
                //currentGameState = GameState.noDeal;
            }, 1800);
            currentGameState = tempState;
            console.log("out interval");

            for (var i = 0; i < 5; i++) {
                if (!holdCards[i]) {
                    dealCards[i] = allCards.shift();
                    var cssCard = {
                        top: -dealCards[i].top,
                        left: -dealCards[i].left
                    }
                    $("#card" + (i + 1)).css(cssCard);
                } else {
                    $(".show-card").removeClass("transformed");
                    $(".move-card").removeClass("visual");
                }
                gain = checkAllHands(bet);
            }

            $(".gain span").html(gain);
            if (gain === 0) {
                initCards();
            } else {
                currentGameState = GameState.bigOrSmall;
            }
        }
    }

    function checkAllHands(bet) {
        var temp = new Array();
        for (var i = 0; i < 5; i++) {
            temp[i] = dealCards[i];
        }
        temp.sort(function (a, b) {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
            } else {
                return 0;
            }
        });

        function isSequence() {
            for (var i = 0; i < 5; i++) {
                if (temp[0].value + i != temp[i].value) {
                    return false;
                }
            }
            return true;
        }

        function isSameSuit() {
            var suit = temp[0].suit;
            for (var i = 1; i < 5; i++) {
                if (temp[0].suit != temp[i].suit) {
                    return false;
                }
            }
            return true;
        }
		
		var combs = { 
			poker: 1, 
			fullHouse: 2, 
			threeOfAKind: 3, 
			twoPairs: 4, 
			pair: 5, 
			nothing: 0 
		};
		
        function sameCardSequence() {
			var start = 0;
			var firstLen = 1;
			var secondLen = 1;
			var fillFirst = true;

			for (var i = 0; i < 5; i++) {
				if (i != start) {
					if (temp[start].value == temp[i].value) {
					    if (fillFirst) {
							firstLen++;
						} else {
							secondLen++;
						}
					} else {
						if (firstLen != 1) {
							fillFirst = false;
						}
						start = i;
					}
				}
			}
			
			

			if (firstLen == 4) {
				return combs.poker;
			} else if ((firstLen == 3 && secondLen == 2) || (firstLen == 2 && secondLen == 3)) {
				return combs.fullHouse;
			} else if (firstLen == 3 || secondLen == 3) {
				return combs.threeOfAKind;
			} else if (firstLen == 2 && secondLen == 2) {
				return combs.twoPairs;
			} else if (firstLen == 2) {
				return combs.pair;
			}
			
			return combs.nothing;
		}
        
        var isSeq = isSequence();
        var sameSuit = isSameSuit();
		var combination = sameCardSequence();

        if (isSeq && sameSuit && temp[4].value == 13) { 
            // Royal flush
            return bet * 1000; 
        } else if (isSeq && sameSuit) {
            // Straight flush
            return bet * 50;
        } else if (combination == combs.poker) {
            // Four of a kind
            return bet * 25;
        } else if (combination == combs.fullHouse) {
            // Full house
            return bet * 9;
        } else if (sameSuit) {
            // Flush
            return bet * 6;
        } else if (isSeq) {
            // Straight
            return bet * 4;
        } else if (combination == combs.threeOfAKind) {
            // Three of a kind
            return bet * 3;
        } else if (combination == combs.twoPairs) {
            // Two pair
            return bet * 2;
        } else if (combination == combs.pair) {
            // One pair
            return bet;
        }
        console.log("currentGameState sameCardSequence - " + currentGameState);
        return 0;
    }
    var divId = 1;

    function bigOrSmall() {
        var card = allCards.shift();
        var cssCard = {
            top: -card.top,
            left: -card.left,
            "z-index": divId
        }
        $("#big-or-small")
            .append("<div class='show-card transformed big-or-small'>" +
			   "<img id='bigOrSmallCard" + divId + "' class='move-card visual dblock' />" +
               "<img class='card-back dblock' />" +
			"</div>");
        $("#bigOrSmallCard" + (divId)).css(cssCard);
        divId++;
        if (card.value < 8) {
            return -1;
        } else {
            return 1;
        }
        console.log("currentGameState bigOrSmall - " + currentGameState);
    }


    
