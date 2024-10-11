const questionContainer = document.querySelector(".question-container");
const optionContainer = document.querySelector(".option-container");
const nextButton = document.querySelector(".next");
const quitButton = document.querySelector(".quit");
const questionCategory = document.querySelector(".question-category");
const questionCount = document.querySelector(".question-count");
const scoreCount = document.querySelector(".score-count");
const quizInstructions = document.querySelector(".instructions");
const startButton = document.querySelector(".start-btn");
const totalQuizLogic = document.querySelector(".quiz");
const resultElement = document.querySelector(".result");

let quizzes = [];
let questionIndex = 0;
let score = 0;

const URL = "https://opentdb.com/api.php?amount=5&category=29&difficulty=easy&type=multiple"

const getData = async (url) => {
    try {
        const {
            data: { results }, } = await axios.get(url);
        return results;
    } catch (err) {
        console.log(err);
    }
}

//directly giving getData(URL) will return a promise so we create an another async function getQuiz and call it inside it

const getQuiz = async () => {
    quizzes = await getData(URL);
    console.log(quizzes);
    //console.log(quizzes[0].question);
};

getQuiz();

startButton.addEventListener("click",()=> {
    totalQuizLogic.classList.remove("hide");
    quizInstructions.classList.add("hide")
})


function questionAndOptions(quizzArray, index) {
    questionCategory.innerText = quizzArray[index].category;
    questionCount.innerText = `Q${index+1}/${quizzArray.length}`;
    scoreCount.innerText = `Score:${score}`;
    const questionElement = document.createElement("p");
    questionElement.innerText = quizzArray[index].question;
    questionContainer.appendChild(questionElement);
    let options = [quizzArray[index].correct_answer, ...quizzArray[index].incorrect_answers].sort(() => Math.random() - 0.5);
    console.log(options);
    for (let option of options) {
        const optionElement = document.createElement("button");
        optionElement.classList.add("button");
        optionElement.innerText = option;
        optionElement.setAttribute("name", option);
        optionContainer.appendChild(optionElement);
    }
}

function disableOption() {
    document
        .querySelectorAll(".button")
        .forEach((button) => (button.disabled = true));
}

//event bubbling - "applying event listener on option parent element instead of each option element"
optionContainer.addEventListener("click", (e) => {
    if (e.target.name === quizzes[questionIndex].correct_answer) {
        disableOption();
        e.target.classList.add("correct");
        score++;
        //console.log("correct")
    } else if (e.target.name !== quizzes[questionIndex].correct_answer) {
        disableOption();
        e.target.classList.add("incorrect");
        //console.log("incorrect");
    }
})

quitButton.addEventListener("click", () => {
    questionIndex = 0;
    questionContainer.innerText = "";
    optionContainer.innerText = "";
    score=0;
    questionAndOptions(quizzes, questionIndex);
    totalQuizLogic.classList.add("hide");
    quizInstructions.classList.remove("hide")

});

nextButton.addEventListener("click", () => {
    if(nextButton.innerText==="Next") {
        questionIndex++;
        questionContainer.innerHTML = "";
        optionContainer.innerHTML = "";
        questionAndOptions(quizzes, questionIndex);
        if(questionIndex === 4){
            nextButton.innerText = "Submit" ;
            return;
        }
    }
    if(nextButton.innerText === "Submit"){
        totalQuizLogic.classList.add("hide");
        resultElement.classList.remove("hide");
        resultElement.innerText= `Your Total Score is ${score}`;

    }   
});

setTimeout(() => questionAndOptions(quizzes, questionIndex), 2000);




/* function questionAndOptions(quizzes) {
console.log(quizzes);

}

questionAndOptions(quizzes)
The console.log(quizzes) gives an empty array because the getdata() and getquiz() will be implemented after the page gets loaded so until then  as we initialized quizzes to be empty it will give you empty so... we use settimeout

setTimeout(() => questionAndOptions(quizzes),2000);
as this is a async it will be implemented along with async operation so you will get array of 5 questions 

but generally you dont need this settimeout because by the time the quiz instructions are loaded and visible ...this async operation getdata and getquiz will also will be ready but in case you are not getting the questions visible because of some issue then implement setTimeout 
*/