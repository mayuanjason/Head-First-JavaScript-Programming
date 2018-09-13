var model = {
    boardSize: 7,    /* The size of the grid for the board */
    numShips: 3,     /* The number of ships in the game */
    shipLength: 3,   /* The number of locations in each ship */
    shipsSunk: 0,    /* How many ships have been sunk */

    /* ships: [        // The ship locations and hits
        {locations: ["06", "16", "26"], hits: ["", "", ""]},
        {locations: ["24", "34", "44"], hits: ["", "", ""]},
        {locations: ["10", "11", "12"], hits: ["", "", ""]}
    ], */

    ships: [
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]}
    ],

    /* Fire on a ship and figure out if the shot is a hit or miss */
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (ship.hits[index] === "hit") {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            }

            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }

        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }

        return true;
    },

    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));

            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            // Generate a starting location for a horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
        } else {
            // Generate a starting location for a vertical ship
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                // add location to array for new horizontal ship
                newShipLocations.push(row + "" + (col + i));
            } else {
                // add location to array for new vertical ship
                newShipLocations.push((row + i) + "" + col);
            }
        }

        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }

        return false;
    }
};

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var controller = {
    guesses: 0,   /* keeps number of guesses */

    /* Processes guesses and passes to the model. 
       Detects the end of the game */
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk == model.numShips) {
                view.displayMessage("You sank all my battleships in " + this.guesses + " guesses");
            }
        }
    }
};

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a latter and a number on the board.");
        return null;
    }

    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
        alert("Oops, that isn't on the board.");
        return null;
    }

    if (row < 0 || row >= model.boardSize ||
        column < 0 || column >= model.boardSize) {
        alert("Oops, that's off the board!");
        return null;
    }

    return row + column;
}

function init() {
    /* Fire! button onclick handler */
    var fireButton = document.getElementById("fireButton")
    fireButton.onclick = handleFireButton;
    
    /* handle "return" key press */
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    /* place the ships on the game board */
    model.generateShipLocations();
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;

    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

/* view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");

view.displayMessage("Tap tap, is this thing on?"); */

/* model.fire("53"); // miss

model.fire("06");  // hit
model.fire("16");  // hit
model.fire("26");  // hit

model.fire("34");  // hit
model.fire("24");  // hit
model.fire("44");  // hit

model.fire("12");  // hit
model.fire("11");  // hit
model.fire("10");  // hit */

/* console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7")); */

/* controller.processGuess("A0");  // miss

controller.processGuess("A6");  // hit
controller.processGuess("B6");  // hit
controller.processGuess("C6");  // hit

controller.processGuess("C4");  // hit
controller.processGuess("D4");  // hit
controller.processGuess("E4");  // hit

controller.processGuess("B0");  // hit
controller.processGuess("B1");  // hit
controller.processGuess("B2");  // hit */