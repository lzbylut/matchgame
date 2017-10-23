var MatchGame = {};

//sets up a new game after HTML document has loaded
//renders a 4x4 board of cards
$(document).ready(function() {
	var $game = $('#game');
	var $cards = MatchGame.generateCardValues();
	MatchGame.renderCards($cards, $game);
});

//generates and returns an array of matching card values
MatchGame.generateCardValues = function () {
	var ordered_cards = [];

	//add 16 numbers to the array, 2 copies of each number to form a pair
	for (var i = 1; i < 9; i++) {
	  ordered_cards.push(i);
	  ordered_cards.push(i);
	};
	//console.log(ordered_cards);

	var randomized_cards = [];

	//randomly add numbers from the ordered array to the randomized array
	while (ordered_cards.length != 0) {
		//console.log(ordered_cards.length);
		var selected_card = Math.floor(Math.random() * ordered_cards.length);
		randomized_cards.push(ordered_cards[selected_card]);
		//after the number is added to the randomized array, it is removed from the ordered array
		ordered_cards.splice(selected_card, 1);
	};
	//console.log(ordered_cards);	
	console.log(randomized_cards);

	return randomized_cards;
};

//converts card values to jQuery card objects 
//and adds them to the supplied game object
MatchGame.renderCards = function(card_values, $game) {
	//clear the contents of the game board
	$game.empty();

	//create an empty arry to keep track of what cards have been flipped
	$game.data('flippedcards', []);

	//create an array of colors that will be the background of clicked cards
	var colors = [
		'hsl(25, 85%, 65%)',
		'hsl(55, 85%, 65%)',
		'hsl(90, 85%, 65%)',
		'hsl(160, 85%, 65%)',
		'hsl(220, 85%, 65%)',
		'hsl(265, 85%, 65%)',
		'hsl(310, 85%, 65%)',
		'hsl(360, 85%, 65%)'
	];

	//for each item in the randomized array, insert a new html div
	//and give it a card value, a flipped attribute, and a background color
	for (var i = 0; i < card_values.length; i++) {
		//console.log(card_values[i]);
		var $card = $('<div class="col-xs-3 card"></div>');
		var card_data = {
			value: card_values[i],
      color: colors[card_values[i]-1],
      isFlipped: false
		};

		//add card data to the card
		$card.data(card_data);

		//add the card to the game board
		$game.append($card);
	};

	//add an event listener that activates whenever a card is clicked
	//and make it call the flipCard method to decide what happens
	$('.card').click(function() {
			MatchGame.flipCard($(this), $game);
		}
	);

};

//flips over a given card and checks to see if two cards are flipped over
//updates styles on flipped cards depending whether they are a match or not
MatchGame.flipCard = function($card, $game) {
	//do nothing if the clicked card is already flipped
	if ($($card).data('flipped') == true) {
		return;
	}
	//otherwise, make the background color and card value visible, and set it to flipped
	else {
		$card.css("background-color", $card.data('color'))
		     .text($card.data('value'))
		     .data('flipped', true);

		//update the flipped cards array so it knows which numbers were flipped
		var flipped_cards = $game.data('flippedcards')
		flipped_cards.push($card);
		//console.log(flipped_cards);
	}

	//if two cards were flipped
	if (flipped_cards.length === 2) {
		console.log('flipped two cards '
								+flipped_cards[0].data('value')+' and '
								+flipped_cards[1].data('value'));
		//if the two cards are the same, update their coloring to show that
		if (flipped_cards[0].data('value') === flipped_cards[1].data('value')) {
			console.log('Success!')
			//decide how to change the css of the matched cards
      var matchCss = {
        backgroundColor: 'rgb(153, 153, 153)',
        color: 'rgb(204, 204, 204)'
      };
      //update the css of the 2 matching cards
      flipped_cards[0].css(matchCss);
      flipped_cards[1].css(matchCss);
		}
		//if the two cards are different
		//wait a moment and thren reset the cards
		else {
			window.setTimeout(function() {
				flipped_cards[0].css('background-color', 'rgb(32, 64, 86)')
            						.text('')
            						.data('flipped', false);
        flipped_cards[1].css('background-color', 'rgb(32, 64, 86)')
            						.text('')
            						.data('flipped', false);

			}, 300);
		}
		//remember to clear the flipped cards array after 2 cards are flipped
		//whether or not the match is successful
		$game.data('flippedcards', []);
	}
};