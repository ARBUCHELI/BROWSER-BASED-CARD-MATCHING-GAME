/*
 * Global Variables
 */
let matchedCards     = [],
    currentOpenedCards = [],
    moves            = 0,
    rateHTML = "",
    rateStep = 6,
    firstClick = true,
    hours, minutes, seconds,
    totalTime = 0,
    incrementer;

const iconsList          = ["fab fa-apple", "fab fa-apple", "fas fa-ban", "fas fa-ban", "far fa-bell", "far fa-bell", "fab fa-bluetooth-b", "fab fa-bluetooth-b", "fas fa-camera-retro", "fas fa-camera-retro", "fas fa-car", "fas fa-car", "fas fa-chess", "fas fa-chess", "far fa-envelope", "far fa-envelope"],
      cardsList          = document.querySelector(".cards"),
      cards              = cardsList.children,
      movesContainer     = document.querySelector(".moves"),
      modal              = document.querySelector(".modal"),
      repeatBtn          = document.querySelector(".features .play-again");
      repeatBtnFromModal = document.querySelector(".modal .play-again"),
      rateContainer      = document.querySelector("#total_rate"),
      exactMoves         = iconsList.length / 2,
      maxStars = exactMoves + rateStep,
      minStars = exactMoves + ( 2 * rateStep),
      stars    = document.querySelectorAll(".star"),
      secondsContainer = document.querySelector("#seconds"),
      minutesContainer = document.querySelector("#minutes"),
      hoursContainer   = document.querySelector("#hours"); 

/*
 * Shuffle
 */
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

/*
 * Init Game
 */
function init() {
    // Shuffle the current `iconsList`
    const icons = shuffle(iconsList);
    // Using `createDocumentFragment` for a better performance, but you can `appendChild` to the parent directly!
    const cardsFragment = document.createDocumentFragment();
    
    /*
     *
     * 1) Create the cards based on the given length of `icons` array
     * 2) Put a random icon in each card
     * 3) Append the created cards to the container `cardsList`
     *
     */
    for (let i = 0; i < icons.length; i++) {
        const card = document.createElement("li");
        card.innerHTML = "<i class='" + icons[i] + "'></i>";
        cardsFragment.appendChild(card);
    }
    cardsList.appendChild(cardsFragment);
}

/*
 * Start Game
 */
function start() {
    
    // Initialize Game
    init();

    // Start the 'Click' Functionality
    cardClick();
}

/* 
 * Click
 */
function cardClick() {
    for (let i = 0; i < cards.length; i++) {
        
        // Add a "click" event to each card [ The following function will only be executed if a card was clicked! ]
        cards[i].addEventListener("click", function () {

            // Cache the `current` and `previous` clicked cards
            const currentCard = this; // current card
            const previousCard = currentOpenedCards[0]; // the previous one
            
            // The First Click? Start the timer!
            if(firstClick) {
                startTimer();
                firstClick = false; // This will prevent the timer to start again if the user clicked on another card
            }

            /*
             *
             * If we have ONE card inside our `currentOpenedCards`
             * Do the following:
             *
             * 1) Make sure that the user didn't click on the same card twice
             * 2) Compare the `current` clicked card with the exisiting one on our `currentOpenedCards` array
             * 3) Delete both cards from our `currentOpenedCards`
             * 4) Add a move
             * 5) Change the rating
             *
             */
            if (currentOpenedCards.length === 1) {

                /* 
                 *
                 * show: Allows you to see the icon
                 * disabled: To avoid clicking on the same card again!
                 * animated & flipInY: Both of the are `animate.css` classes for a nicer animation effect
                 *
                 */ 
                currentCard.className = "show disabled animated flipInY";

                // Add this card to the `currentOpenedCards` array
                currentOpenedCards.push(currentCard);

                // Compare the `current` card with the `previous` card (the first one in `currentOpenedCards` array) 
                isMatched(currentCard, previousCard);

                /*
                 *
                 * Empty `currentOpenedCards`
                 *
                 * The `currentOpenedCards` array MUST be empty
                 * Next time the user click on a card, that card would become the first index,
                 * Then, when click on another one, both of them will be compared,
                 * If they are MATCHED or NOT, that doesn't matter here.
                 * We have to reset the `currentOpenedCards` array, to start filling it again with 2 new clicked cards!
                 *
                 */
                currentOpenedCards = [];

                // Add a move
                addMove();

                // Change the rating
                rating();

            } else {
                
                /*
                 *
                 * If we don't have any card inside our `currentOpenedCards` array
                 * Do the following:
                 *
                 * 1) Add the follwing CSS Classes: 
                 *    - show: To see the icon inside your card
                 *    - disabled: To avoid clicking on the same card again!
                 *    - animated & flipInY: Both of the are `animate.css` classes for a nicer animation effect
                 * 2) Add this card to the `currentOpenedCards` array
                 * 
                 */
                currentCard.className = "show disabled animated flipInY";
                currentOpenedCards.push(currentCard);
            }
        });
    }
}

// Compare the 2 opened cards
function isMatched(currentCard, previousCard) {
    
    /* 
     * Matched?
     * Do the following:
     * 
     * 1) Change them to success state:
     *    - Keep displaying the icon
     *    - Animate
     *    - Disable them (cannot be clickable anymore)
     * 2) Add both cards to `matchedCards` array
     * 3) Check if the game is over or not
     *
     */
    if (currentCard.innerHTML === previousCard.innerHTML) {

        // Change them to success state
        currentCard.className = "show matched animated bounceOutDown disabled";
        previousCard.className = "show matched animated bounceOutDown disabled";

        // Add Current & Previous card to `matchedCards` array
        matchedCards.push(currentCard, previousCard);

        // Game Over?
        isOver();

    } else {
        
        /*
         * Not Matched?
         * Do the following:
         *
         * 1) Back both cards to the normal state:
         *    - Hide the icon
         *    - Animate
         *
         */
        setTimeout(function () {
            // Use `className` to replace existing classes with the given ones
            currentCard.className = "animated jello";
            previousCard.className = "animated jello";
        }, 500)

    }
}


/*
 * Add a move
 */
function addMove() {
    moves++;
    movesContainer.innerHTML = moves;
}


/*
 * Game Over?
 */
function isOver() {
    // Check if the `matchedCards` length equals to the `iconsList` array
    if (iconsList.length === matchedCards.length) {
        // If it is over, display a popup message!
        gameOverMessage();
    }
}

/* 
 * Game Over Message
 */
function gameOverMessage() {

    // Display the modal
    modal.style.top = "0";

    // Add moves to the Modal
    const totalMoves = document.querySelector("#total_moves");
    totalMoves.innerHTML = moves + 1; // [bug]: `moves` returns the count - 1

    // Add Rate
    rateContainer.innerHTML = rateHTML;

    // Stop Timer
    stopTimer();

    // Add time to the Modal
    const totalHours       = document.querySelector("#totalHours");
    const totalMinutes     = document.querySelector("#totalMinutes");
    const totalSeconds     = document.querySelector("#totalSeconds");
    totalHours.innerHTML   = hours;
    totalMinutes.innerHTML = minutes;
    totalSeconds.innerHTML = seconds;

}


/*
 * Play Again Buttons
 */
repeatBtn.addEventListener("click", function() {

    // Start the game again
    repeat();

});
repeatBtnFromModal.addEventListener("click", function () {

    // Hide the modal
    modal.style.top = "-150%";

    // Start the game again
    repeat();

});


/* 
 * Star Rating
 */
function rating() {
    
    // This condition below relies on the value of `maxStars` & `minStars` variables
    if(moves < maxStars) {
        rateHTML = "<i class='star fas fa-star'></i><i class='star fas fa-star'></i><i class='star fas fa-star'></i>";
    } else if(moves < minStars) {
        stars[2].style.color = "#444";
        rateHTML = "<i class='star fas fa-star'></i><i class='star fas fa-star'></i>";
    } else {
        stars[1].style.color = "#444";
        rateHTML = "<i class='star fas fa-star'></i>";
    }

} 

/*
 * Timer [ Start ] 
 */
function startTimer() {

    // Start Incrementer
    incrementer = setInterval(function() {

        // Add totalTime by 1
        totalTime += 1;

        // Convert Total Time to H:M:S
        calculateTime(totalTime);

        // Change the current time values
        secondsContainer.innerHTML = seconds;
        minutesContainer.innerHTML = minutes;
        hoursContainer.innerHTML   = hours;

    }, 1000);

    
}

/*
 * Timer [ Calculate Time ] 
 */
function calculateTime(totalTime) {
    hours   = Math.floor( totalTime / 60 / 60);
    minutes = Math.floor( (totalTime / 60) % 60);
    seconds = totalTime % 60;
}

/*
 * Timer [ Stop ] 
 */
function stopTimer() {
    // Stop Timer
    clearInterval(incrementer);
}


/*
 * Reset Current Values
 */
function resetValues() {
    matchedCards = [];
    currentOpenedCards = [];
    moves = 0;
    movesContainer.innerHTML = "--";
    stars[1].style.color = "#ffb400";
    stars[2].style.color = "#ffb400";
    rateHTML = "";
    hoursContainer.innerHTML = "00";
    minutesContainer.innerHTML = "00";
    secondsContainer.innerHTML = "00";
    stopTimer();
    firstClick = true;
    totalTime = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
}


/* 
 * Repeat Game 
 */
function repeat() {

    // Remove all cards, as they will get rebuild again when we invoke `start()` which invokes `init()` that create the cards
    cardsList.innerHTML = "";

    // Reset Current Values
    resetValues();

    // Start the game again
    start();
}



// Start the game for the first time!
start(); 