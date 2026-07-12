let currentMode = 'single';
let selectedTime = 600;
let currentQuestions = [];
let currentQ = 0;
let score = 0;
let timer;
let timeLeft = 600;

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-select button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function setTime(seconds) {
    selectedTime = seconds;
    document.querySelectorAll('.time-select button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function loadCourse(course) {
    document.querySelector('.courses').style.display = 'none';
    document.querySelector('.mode-select').style.display = 'none';
    document.querySelector('.time-select').style.display = 'none';
    document.getElementById('topics-section').style.display = 'block';
    document.getElementById('course-title').innerText = course.toUpperCase() + " COURSES";

    let data;
    if(course === 'physics') data = physicsData;
    if(course === 'chemistry') data = chemistryData;
    if(course === 'biology') data = biologyData;
    if(course === 'mathematics') data = mathematicsData;
    if(course === 'gst') data = gstData;

    if(!data){ alert("Error: " + course + "Data not found. Check data-" + course + ".js file"); return; }

    loadTopics(data['101'], 'topics101');
    loadTopics(data['102'], 'topics102');
}

function loadTopics(topics, id) {
    let container = document.getElementById(id);
    container.innerHTML = '';
    if(!topics || topics.length === 0){ container.innerHTML = "<p>No topics yet</p>"; return; }
    topics.forEach(topic => {
        let btn = document.createElement('button');
        btn.innerText = topic.name + " - " + topic.questions.length + " Qs";
        btn.onclick = () => startQuiz(topic.questions, topic.name);
        container.appendChild(btn);
    });
}

function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

function startQuiz(questions, topicName) {
    currentQuestions = shuffleArray([...questions]);
    currentQ = 0; score = 0;
    document.getElementById('topics-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('quiz-topic').innerText = topicName;
    document.getElementById('total').innerText = currentQuestions.length;
    document.getElementById('score').innerText = score;
    showQuestion();
    startTimer(selectedTime);
}

function showQuestion() {
    let q = currentQuestions[currentQ];
    let shuffledOptions = shuffleArray([...q.options]);
    let optionsHtml = shuffledOptions.map(opt => `<button onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${q.a.replace(/'/g, "\\'")}')">${opt}</button>`).join('');
    document.getElementById('question-box').innerHTML = `<h4>Question ${currentQ+1} of ${currentQuestions.length}</h4><p>${q.q}</p><div class="options">${optionsHtml}</div>`;
}

function checkAnswer(selected, correct) { if(selected === correct) score++; document.getElementById('score').innerText = score; setTimeout(nextQuestion, 400); }
function nextQuestion() { currentQ++; if(currentQ < currentQuestions.length) showQuestion(); else endQuiz(); }
function startTimer(seconds) { timeLeft = seconds; clearInterval(timer); updateTimerDisplay(); timer = setInterval(() => { timeLeft--; updateTimerDisplay(); if(timeLeft <= 0) { clearInterval(timer); endQuiz(); } }, 1000); }
function updateTimerDisplay() { let min = Math.floor(timeLeft/60); let sec = timeLeft%60; document.getElementById('timer').innerText = `${min}:${sec < 10? '0' : ''}${sec}`; }
function endQuiz() { clearInterval(timer); document.getElementById('quiz-section').style.display = 'none'; document.getElementById('result-section').style.display = 'block'; document.getElementById('final-score').innerText = `${score} / ${currentQuestions.length}`; }
function restartQuiz() { document.getElementById('result-section').style.display = 'none'; startQuiz(currentQuestions, document.getElementById('quiz-topic').innerText); }
function exitQuiz() { clearInterval(timer); document.getElementById('quiz-section').style.display = 'none'; document.getElementById('topics-section').style.display = 'block'; }
function goBack() { document.getElementById('topics-section').style.display = 'none'; document.querySelector('.courses').style.display = 'flex'; document.querySelector('.mode-select').style.display = 'block'; document.querySelector('.time-select').style.display = 'block'; }
