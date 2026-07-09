let currentMode = 'single';
let selectedTime = 600;
let currentQuestions = [];
let currentQ = 0;
let score = 0;
let timer;
let timeLeft = 600;
let currentCourse = '';

function setMode(mode) {
    currentMode = mode;
    alert("Mode set to: " + (mode === 'single'? 'Single Player' : 'Two Players'));
}

function setTime(seconds) {
    selectedTime = seconds;
    alert("Timer set to: " + (seconds/60) + " Minutes");
}

function loadCourse(course) {
    currentCourse = course;
    document.querySelector('.courses').classList.add('hidden');
    document.querySelector('.mode-select').classList.add('hidden');
    document.querySelector('.time-select').classList.add('hidden');
    document.getElementById('topics-section').classList.remove('hidden');
    document.getElementById('course-title').innerText = course.toUpperCase() + " COURSES";

    let data = window[course + 'Data'];
    loadTopics(data['101'], 'topics101');
    loadTopics(data['102'], 'topics102');
}

function loadTopics(topics, id) {
    let container = document.getElementById(id);
    container.innerHTML = '';
    topics.forEach(topic => {
        let btn = document.createElement('button');
        btn.innerText = topic.name;
        btn.onclick = () => startQuiz(topic.questions, topic.name);
        container.appendChild(btn);
    });
}

function startQuiz(questions, topicName) {
    currentQuestions = shuffleArray([...questions]);
    currentQ = 0;
    score = 0;
    document.getElementById('topics-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    document.getElementById('quiz-topic').innerText = topicName;
    document.getElementById('total').innerText = currentQuestions.length;
    showQuestion();
    startTimer(selectedTime);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showQuestion() {
    let q = currentQuestions[currentQ];
    let optionsHtml = shuffleArray([...q.options]).map(opt =>
        `<button onclick="checkAnswer('${opt}', '${q.a}')">${opt}</button>`
    ).join('');

    document.getElementById('question-box').innerHTML = `
        <h4>Question ${currentQ+1} of ${currentQuestions.length}</h4>
        <p>${q.q}</p>
        <div class="options">${optionsHtml}</div>
    `;
}

function checkAnswer(selected, correct) {
    if(selected === correct) score++;
    document.getElementById('score').innerText = score;
    setTimeout(nextQuestion, 300);
}

function nextQuestion() {
    currentQ++;
    if(currentQ < currentQuestions.length) showQuestion();
    else endQuiz();
}

function startTimer(seconds) {
    timeLeft = seconds;
    clearInterval(timer);
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if(timeLeft <= 0) { clearInterval(timer); endQuiz(); }
    }, 1000);
}

function updateTimerDisplay() {
    let min = Math.floor(timeLeft/60);
    let sec = timeLeft%60;
    document.getElementById('timer').innerText = `${min}:${sec < 10? '0' : ''}${sec}`;
}

function endQuiz() {
    clearInterval(timer);
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('final-score').innerText = `${score} / ${currentQuestions.length}`;
}

function restartQuiz() {
    document.getElementById('result-section').classList.add('hidden');
    startQuiz(currentQuestions, document.getElementById('quiz-topic').innerText);
}

function exitQuiz() {
    clearInterval(timer);
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('topics-section').classList.remove('hidden');
}

function goBack() {
    document.getElementById('topics-section').classList.add('hidden');
    document.querySelector('.courses').classList.remove('hidden');
    document.querySelector('.mode-select').classList.remove('hidden');
    document.querySelector('.time-select').classList.remove('hidden');
}
