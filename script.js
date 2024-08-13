const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text"),
  startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen"),
  submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next"),
  endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score"),
  restartBtn = document.querySelector(".restart");

let questions = [], time = 30, score = 0, currentQuestion = 0, timer;

const startQuiz = () => {
  const url = `https://opentdb.com/api.php?amount=${numQuestions.value}&category=${category.value}&difficulty=${difficulty.value}&type=multiple`;
  
  startBtn.textContent = "Loading...";
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      showQuestion(0);
    });
};

const showQuestion = (index) => {
  const question = questions[index],
        questionText = document.querySelector(".question"),
        answersWrapper = document.querySelector(".answer-wrapper"),
        questionNumber = document.querySelector(".number");
  
  questionText.innerHTML = question.question;
  questionNumber.innerHTML = `Question ${index + 1} / ${questions.length}`;
  
  const answers = [...question.incorrect_answers, question.correct_answer];
  answersWrapper.innerHTML = answers.sort(() => Math.random() - 0.5)
    .map(answer => `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox"><i class="fas fa-check"></i></span>
      </div>
    `).join('');
  
  answersWrapper.querySelectorAll(".answer").forEach(answerDiv => {
    answerDiv.addEventListener("click", () => {
      answersWrapper.querySelectorAll(".answer").forEach(a => a.classList.remove("selected"));
      answerDiv.classList.add("selected");
      submitBtn.disabled = false;
    });
  });
  
  time = timePerQuestion.value;
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    progress(time);
    if (time <= 0) {
      clearInterval(timer);
      checkAnswer();
    }
    time--;
  }, 1000);
};

const progress = (value) => {
  const percentage = (value / timePerQuestion.value) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = value;
};

const checkAnswer = () => {
  clearInterval(timer);
  
  const selectedAnswer = document.querySelector(".answer.selected"),
        correctAnswer = questions[currentQuestion].correct_answer;
  
  if (selectedAnswer) {
    selectedAnswer.classList.add(selectedAnswer.querySelector(".text").textContent === correctAnswer ? "correct" : "wrong");
    if (selectedAnswer.querySelector(".text").textContent === correctAnswer) score++;
  }

  document.querySelectorAll(".answer").forEach(answerDiv => {
    if (answerDiv.querySelector(".text").textContent === correctAnswer) {
      answerDiv.classList.add("correct");
    }
    answerDiv.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
  } else {
    showScore();
  }
};

const showScore = () => {
  quiz.classList.add("hide");
  endScreen.classList.remove("hide");
  finalScore.textContent = score;
  totalScore.textContent = `/ ${questions.length}`;
};

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", () => {
  nextBtn.style.display = "none";
  submitBtn.style.display = "block";
  nextQuestion();
});
restartBtn.addEventListener("click", () => window.location.reload());
