var cards = [1, 2, 2, 2, 2];

var combs = { poker: 1, fullHouse: 2, threeOfAKind: 3, twoPairs: 4, pair: 5, nothing: 0 };

function sameCardSequence() {
	var start = 0;
	var firstLen = 1;
	var secondLen = 1;
	var fillFirst = true;
	
	for (var i = 0; i < 5; i++) {
		if (i != start) {
			if (cards[start] == cards[i]) {
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

console.log(sameCardSequence());