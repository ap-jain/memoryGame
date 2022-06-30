const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;


//Items array
const items = [
    { name: "anaconda", image: "images/anaconda.png" },
    { name: "bee", image: "images/bee.png" },
    { name: "chameleon", image: "images/chameleon.png" },
    { name: "cockatoo", image: "images/cockatoo.png" },
    { name: "crocodile", image: "images/crocodile.png" },
    { name: "gorilla", image: "images/gorilla.png" },
    { name: "macaw", image: "images/macaw.png" },
    { name: "monkey", image: "images/monkey.png" },
    { name: "piranha", image: "images/piranha.png" },
    { name: "sloth", image: "images/sloth.png" },
    { name: "tiger", image: "images/tiger.png" },
    { name: "toucan", image: "images/toucan.png" },
];

//Initial Time
let seconds = 0;
let minutes = 0;

//Initial moves and win count
let movesCount = 0;
let winCount = 0;

//Timer
const timeGenerator = () => {
    seconds += 1;
    //minutes
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //time formating
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`
};

//moves Calculator
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`
}

//pick random objects from the array
const generateRandom = (size = 4) => {
    //temp array
    let tempArray = [...items];
    //card values array
    let cardValues = [];
    //size should be 4*4/2
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
        const randomValue = Math.floor(Math.random() * tempArray.length);
        //push in the array
        cardValues.push(tempArray[randomValue]);
        //remove it from temp array
        tempArray.splice(randomValue, 1);
    }
    return cardValues;

};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = " ";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        //cards, ? first then image
        gameContainer.innerHTML += `<div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after"><img src = "${cardValues[i].image}" class = "image"/>
        </div>`;

    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;
    //cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                // console.log("flip")
                //if its firstcard then update first card

                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    //if match
                    if (firstCardValue == secondCardValue) {
                        //add matched as to ignore next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        //now first card = false
                        firstCard = false;
                        //increase win count as matched
                        winCount++;
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won!</h2><h4>Moves: ${movesCount}</h4>`;
                            confetti.start();
                            stopGame();
                        }
                    } else {
                        //if dont match flip them back
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900)
                    }
                }
            }

        }
        );
    });
};

//start game

//stop game


startButton.addEventListener("click", () => {
    confetti.stop();
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //change visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();

})
stopButton.addEventListener('click', (stopGame = () => {
    controls.classList.remove("hide");
    startButton.classList.remove("hide");
    stopButton.classList.add("hide");
    clearInterval(interval);
}));
const initializer = () => {
    result.innerHTML = "";
    winCount = 0;
    let cardValues = generateRandom();
    // console.log(cardValues);
    matrixGenerator(cardValues);
}