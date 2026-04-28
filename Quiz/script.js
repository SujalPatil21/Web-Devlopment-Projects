const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Preprocessor",
            "Hyper Text Markup Language",
            "Hyper Text Multiple Language",
            "Hyper Tool Multi Language"
        ],
        answer: 1
    },
    {
        question: "Which CSS property is used to control the spacing between elements?",
        options: [
            "margin",
            "padding",
            "spacing",
            "border"
        ],
        answer: 0
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Common Style Sheet",
            "Colorful Style Sheet",
            "Computer Style Sheet",
            "Cascading Style Sheet"
        ],
        answer: 3
    },
    {
        question: "Which JavaScript method is used to write text into an HTML element?",
        options: [
            "document.write()",
            "console.log()",
            "innerHTML",
            "window.alert()"
        ],
        answer: 2
    },
    {
        question: "How do you declare a JavaScript variable?",
        options: [
            "v carName;",
            "variable carName;",
            "let carName;",
            "def carName;"
        ],
        answer: 2
    }
];

// DOM Elements
const screens = {
    registration: document.getElementById('registration-screen'),
    quiz: document.getElementById('quiz-screen'),
    end: document.getElementById('end-screen')
};

const elements = {
    registrationForm: document.getElementById('registration-form'),
    regName: document.getElementById('reg-name'),
    regEmail: document.getElementById('reg-email'),
    regMobile: document.getElementById('reg-mobile'),
    errorName: document.getElementById('error-name'),
    errorEmail: document.getElementById('error-email'),
    errorMobile: document.getElementById('error-mobile'),
    welcomeMessage: document.getElementById('welcome-message'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    questionCount: document.getElementById('question-count'),
    progressBar: document.getElementById('progress-bar'),
    currentScore: document.getElementById('current-score'),
    timeLeft: document.getElementById('time-left'),
    finalScore: document.getElementById('final-score'),
    totalPoints: document.getElementById('total-points'),
    scoreMessage: document.getElementById('score-message'),
    userFinalMessage: document.getElementById('user-final-message'),
    endHighScore: document.getElementById('end-high-score')
};

// User Data Object
let currentUser = null;

// State
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timer;
const TIME_LIMIT = 15;
let timeRemaining = TIME_LIMIT;
let highScore = localStorage.getItem('quizHighScore') || 0;

// Initialize
function init() {
    updateHighScoreDisplay();
    elements.registrationForm.addEventListener('submit', handleRegistration);
    elements.nextBtn.addEventListener('click', handleNextButton);
    elements.restartBtn.addEventListener('click', resetQuiz);
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function updateHighScoreDisplay() {
    elements.endHighScore.textContent = highScore;
}

function validateForm() {
    let isValid = true;
    
    // Reset errors
    elements.errorName.textContent = '';
    elements.errorEmail.textContent = '';
    elements.errorMobile.textContent = '';
    
    const name = elements.regName.value.trim();
    const email = elements.regEmail.value.trim();
    const mobile = elements.regMobile.value.trim();
    
    if (!name) {
        elements.errorName.textContent = 'Full Name is required';
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        elements.errorEmail.textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        elements.errorEmail.textContent = 'Please enter a valid email';
        isValid = false;
    }
    
    const mobileRegex = /^\d{10}$/;
    if (!mobile) {
        elements.errorMobile.textContent = 'Mobile Number is required';
        isValid = false;
    } else if (!mobileRegex.test(mobile)) {
        elements.errorMobile.textContent = 'Mobile number must be exactly 10 digits';
        isValid = false;
    }
    
    if (isValid) {
        currentUser = { name, email, mobile };
    }
    
    return isValid;
}

function handleRegistration(e) {
    e.preventDefault();
    if (validateForm()) {
        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showQuizScreen();
    }
}

function showQuizScreen() {
    elements.welcomeMessage.textContent = `Welcome, ${currentUser.name}`;
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    elements.currentScore.textContent = score;
    elements.totalPoints.textContent = questions.length * 10;
    showScreen('quiz');
    loadQuestion();
}

function loadQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    
    // Update progress
    elements.questionCount.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
    elements.progressBar.style.width = `${progressPercentage}%`;
    
    // Load question text
    elements.questionText.textContent = currentQuestion.question;
    
    // Load options
    currentQuestion.options.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.textContent = optionText;
        button.classList.add('option');
        button.dataset.index = index;
        button.addEventListener('click', () => selectOption(button, index));
        elements.optionsContainer.appendChild(button);
    });
    
    startTimer();
}

function resetState() {
    clearInterval(timer);
    timeRemaining = TIME_LIMIT;
    elements.timeLeft.textContent = timeRemaining;
    elements.timeLeft.parentElement.style.color = 'inherit';
    
    elements.nextBtn.disabled = true;
    selectedOption = null;
    while (elements.optionsContainer.firstChild) {
        elements.optionsContainer.removeChild(elements.optionsContainer.firstChild);
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        elements.timeLeft.textContent = timeRemaining;
        
        if (timeRemaining <= 5) {
            elements.timeLeft.parentElement.style.color = 'var(--danger-color)';
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.add('disabled'));
    
    // Highlight correct answer
    const currentQuestion = questions[currentQuestionIndex];
    options[currentQuestion.answer].classList.add('correct');
    
    elements.nextBtn.disabled = false;
}

function selectOption(selectedBtn, index) {
    if (selectedOption !== null || timeRemaining <= 0) return; // Prevent multiple selections
    
    clearInterval(timer);
    selectedOption = index;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = index === currentQuestion.answer;
    
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.add('disabled'));
    
    selectedBtn.classList.add('selected');
    
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score += 10;
        elements.currentScore.textContent = score;
    } else {
        selectedBtn.classList.add('wrong');
        options[currentQuestion.answer].classList.add('correct');
    }
    
    elements.nextBtn.disabled = false;
}

function handleNextButton() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showEndScreen();
    }
}

function showEndScreen() {
    elements.progressBar.style.width = '100%'; // Complete progress bar
    setTimeout(() => {
        showScreen('end');
        elements.finalScore.textContent = score;
        
        // Save high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('quizHighScore', highScore);
            updateHighScoreDisplay();
        }
        
        // Save user score
        if (currentUser) {
            currentUser.score = score;
            localStorage.setItem('lastUser', JSON.stringify(currentUser));
            elements.userFinalMessage.textContent = `${currentUser.name}, your score is ${score}/${questions.length * 10}`;
        }
        
        // Set message based on score
        const percentage = score / (questions.length * 10);
        if (percentage === 1) {
            elements.scoreMessage.textContent = "Perfect! You're an expert!";
        } else if (percentage >= 0.8) {
            elements.scoreMessage.textContent = "Great job! Almost perfect.";
        } else if (percentage >= 0.5) {
            elements.scoreMessage.textContent = "Good effort! Keep practicing.";
        } else {
            elements.scoreMessage.textContent = "You can do better next time!";
        }
    }, 300); // Small delay to let progress bar animation finish
}

function resetQuiz() {
    showScreen('registration');
    elements.registrationForm.reset();
    elements.errorName.textContent = '';
    elements.errorEmail.textContent = '';
    elements.errorMobile.textContent = '';
    currentUser = null;
}

// Start the app
init();
