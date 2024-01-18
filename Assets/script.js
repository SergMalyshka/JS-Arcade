var startButton = document.querySelector("#start-button")
var gameEndForm = document.querySelector("#submit-form")
var gameOverMessage = document.querySelector("#game-over-message")
var answerOne = document.querySelector("#button-1")
var answerTwo = document.querySelector("#button-2")
var answerThree = document.querySelector("#button-3")
var answerFour = document.querySelector("#button-4")
var questionContent = document.querySelector("#question-content")
var timeLeft = document.querySelector("#time-left")
var questionContainer = document.querySelector("#question-container")
var buttons = document.querySelectorAll(".answer")
var submitButton = document.querySelector("#submit")
var playerName = document.querySelector("#playerName")
var highScoreDisplay = document.querySelector("#highScores")
var highScoreList = document.querySelector("#high-score-list")
var currentPlayer;
var secondsLeft;
var currentQuestion;
var currentScore;
var questions;
var timerInterval;
var currentHighScore;
var timeRemaining;



startButton.addEventListener("click", function(event) {
//run code to properly define all attributes, reset questions, and displays
    gameStartPrep();

//setup the timer
    timerInterval = setInterval(function() {
        secondsLeft--;
        timeLeft.textContent = "Time remaining: " + secondsLeft;

        if(secondsLeft < 1) {
            //end game if time expires
            clearInterval(timerInterval);
            endOfGame();
                }
        }, 1000);

    presentQuestion(selectRandomQuestion());
})

//define event listeners for all answer buttons
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(event) {
        if(event.target.textContent === currentQuestion.correctAnswer) {
            //if user answers correctly, proceed down correct answer route
            selectedCorrect(event.target);
        } else {
            //if user answers wrong proceed down wrong answer route
            selectedWrong(event.target)
        }
    })
}

//high score submission event listener, prevent page from reloading
submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    highScoreSubmition();
})

//selects a random question from the pool of questions not yet presented
function selectRandomQuestion(){
    //if no questions are remaining, return null for a later null check to end the game
    if(questions.length === 0) {
        return null;
    } else {
        //chose a random integer, grab the question from the array by that index, reassign current question value to that question
        var randomInt = Math.floor(Math.random() * questions.length)
        var selectedQuestion = questions[randomInt];
        //remove question from array of possible future questions
        questions.splice(randomInt, 1);
        currentQuestion = selectedQuestion;
        return selectedQuestion;
    }
 

}

//populate question content and possible answers into buttons and present it to the user
function presentQuestion(question) {
        questionContent.textContent = question.content;
        //add correct answer to the wrong answers array and shuffle to prevent repetitive quizes
        var answers = shuffle(question.wrongAnswer.concat(question.correctAnswer));
        answerOne.textContent = answers[0];
        answerTwo.textContent = answers[1];
        answerThree.textContent = answers[2];
        answerFour.textContent = answers[3];
    }


//logic if the user selected correct answer
function selectedCorrect(element) {
    //increment the score
    currentScore++;
    //visual feedback on button background to show correct selection was made
    element.setAttribute("style", "box-shadow:0 4px 8px 0 rgba(61, 213, 15")
    //sets timeout of half a second, after which the shadow goes back to black and new question is presented 
    setTimeout(function() {
        element.setAttribute("style", "0 4px 8px 0 rgba(0,0,0, 1)")
        currentQuestion = selectRandomQuestion();
    if (currentQuestion !== null) {
        //if current question is not null, present it
        presentQuestion(currentQuestion);
    } else {
        //if questions is null (no questions left), end of game logic kicks in
        endOfGame();
    }
    }, 500);
}

//logic if user selects wrong answer
function selectedWrong(element) {
    //reduce timer by 20 seconds
    secondsLeft -= 20;
    //red shadow on button for wrong answer feedback
    element.setAttribute("style", "box-shadow:0 4px 8px 0 rgba(218, 10, 10")
    //half a second time out, next question is presented if available
    setTimeout(function() {
        element.setAttribute("style", "0 4px 8px 0 rgba(0,0,0, 1)")
        currentQuestion = selectRandomQuestion();
    if (currentQuestion !== null) {
        presentQuestion(currentQuestion);
    } else {
        endOfGame();
    }
    }, 500);
}

//game end procedure, hiding timer, question container, clearing time interval, display the game end message and high score submission form 
function endOfGame() {
    if (secondsLeft > 0) {
        currentScore = currentScore + secondsLeft;
    }
    timeLeft.setAttribute("style", "display:none")
    questionContainer.setAttribute("style", "display:none")
    clearInterval(timerInterval);
    gameEndForm.setAttribute("style", "display:block")
    gameOverMessage.textContent = "Game over. Your final score was: " + currentScore + ". Please enter your name to save your score"
}

//local storage and saving high scores logic
function highScoreSubmition() {
    currentPlayer = playerName.value;

    //pulling existing scores from local storage
    var highScores = JSON.parse(localStorage.getItem("highScores"));

    //if scores are null (on the very first play through) set it to an empty array
    if (highScores === null) {
        highScores = [];
    }

    //build a new high score using the player input and their score
    currentHighScore = {
        player: currentPlayer,
        score: currentScore,
        };

    //add new score to the high scores array
    highScores.push(currentHighScore);
    //sort the array based on logic define below (descending order for aesthetic purposes)
    highScores.sort(compare);
    //push the array back into local storage including the new high score
    localStorage.setItem("highScores", JSON.stringify(highScores));

    //display the high scores for the user
    renderScores(highScores);
}

//dispalying high score for the user
function renderScores(scores) {

    //change the button text to play again for clarity, if user wants to play again
    startButton.textContent = "Play Again"
    //show the high scores div element
    highScoreDisplay.setAttribute("style", "display:block")
    //iterate through the high scores array, format the data into a user friendly format, and append it to the ul
    for (var i = 0; i < scores.length; i++) {
        var listItem = document.createElement("li");
        listItem.textContent = scores[i].player + ": " + scores[i].score
        highScoreList.appendChild(listItem);
    }
}

//helper methods
//Fisher–Yates shuffle, example found on stack overflow and wikipedia
function shuffle(array) {
    var currentIndex = array.length;  
    var randomIndex;
  
    while (currentIndex > 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

//custom compare method for high scores object, sorts using the high score property
  function compare(firstScore, secondScore) {
        if ( firstScore.score < secondScore.score ){
          return 1;
        }
        if ( firstScore.score > secondScore.score ){
          return -1;
        }
        return 0;
      }


//start of game procedure
function gameStartPrep() {
    
    //define all questions
    var question1 = {
        content: "What syntax is used to define an array?",
        wrongAnswer: ["Curly Brackets", "Parenthesis", "Quotations"],
        correctAnswer: "Square Brackets"
    };

    var question2 = {
        content: "Inside which HTML element do we put the JavaScript??",
        wrongAnswer: ["<js>", "<scripting>", "<javascript>"],
        correctAnswer: "<script>"
    };

    var question3 = {
        content: "What is Dan's favourite color?",
        wrongAnswer: ["Black", "White", "Blue"],
        correctAnswer: "Chartreuese"
    };

    var question4 = {
        content: "What is the return type of a confirm() function?",
        wrongAnswer: ["String", "Number", "HTML"],
        correctAnswer: "Boolean"
    };

    var question5 = {
        content: "What syntax is used to define a string?",
        wrongAnswer: ["Square Brackets", "Parenthesus", "Curly Brackets"],
        correctAnswer: "Quotations"
    };

    var question6 = {
        content: "What is the name of the best cat ever?",
        wrongAnswer: ["Garfield", "Comet", "Slam"],
        correctAnswer: "Clementine"
    };

    var question7 = {
        content: "What syntax is used to do a strict compare of two elements?",
        wrongAnswer: ["==", "=", "!="],
        correctAnswer: "==="
    };

    var question8 = {
        content: "How do you write \"Hello World\" in an alert box??",
        wrongAnswer: ["msgBox(\"Hello World\")", "msgUser(\"Hello World\")", "alertBox(\"Hello World\")"],
        correctAnswer: "alert(\"Hello World\")"
    };

    var question9 = {
        content: "Which one of these is a proper if statement?",
        wrongAnswer: ["if i = 10", "if (i = 10 then)", "if i == 10"],
        correctAnswer: "if (i == 10)"
    };

    var question10 = {
        content: "What is the outcome of this comparison: (\"5\" == 5)?",
        wrongAnswer: ["false", "code does not compile", "error"],
        correctAnswer: "true"
    };

    //make and shuffle a new array containing all questions
    questions = shuffle([question1, question2, question3, question4, question5, question6, question7, question8, question9, question10]);

    //other miscellaneous parameters reset back to default values for game start
    //windows 
    secondsLeft = 100;
    currentScore = 0;
    questionContainer.setAttribute("style", "display:block")
    timeLeft.textContent = "Time remaining: " + secondsLeft;
    timeLeft.setAttribute("style", "display:block")
    gameEndForm.setAttribute("style", "display:none")
    //reset innerHTML for high scores list to make sure same elements dont get rendered multiple times
    highScoreList.innerHTML = "";
    highScoreDisplay.setAttribute("style", "display:none")
  }