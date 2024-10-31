const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.'
];
let words = [];
let wordIndex = 0;
let startTime = Date.now();
let timerInterval;
const timeLimit = 20; // 타임어택 시간 60초 설정

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const highscoreElement = document.getElementById('best-score');
const timerElement = document.getElementById('time-left');
const modal = document.getElementById('modal');
const resultMessage = document.getElementById('result-message');
const closeModal = document.getElementsByClassName('close')[0];

// 최고 기록 로드
const highScore = localStorage.getItem('highScore') || Infinity;
highscoreElement.innerText = highScore !== Infinity ? (highScore / 1000).toFixed(2) : '0';

startButton.addEventListener('click', () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;
    const spanWords = words.map(word => `<span>${word} </span>`);
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';
    typedValueElement.value = '';
    typedValueElement.disabled = false;
    typedValueElement.focus();
    startTime = new Date().getTime();
    startButton.disabled = true;

    // 타이머 초기화
    clearInterval(timerInterval);
    timerElement.innerText = timeLimit;
    timerElement.classList.remove("time-running-low");
    startTimer();
});

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        gameWin();
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
});

function startTimer() {
    let timeRemaining = timeLimit;
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.innerText = timeRemaining;

        // 남은 시간이 10초 이하일 때 색상 변경
        if (timeRemaining <= 10) {
            timerElement.classList.add("time-running-low");
        }

        // 시간이 다 되었을 때 게임 실패 처리
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function gameWin() {
    const elapsedTime = new Date().getTime() - startTime;
    typedValueElement.disabled = true;
    startButton.disabled = false;
    clearInterval(timerInterval);

    if (elapsedTime < highScore) {
        localStorage.setItem('highScore', elapsedTime);
        highscoreElement.innerText = (elapsedTime / 1000).toFixed(2);
        resultMessage.innerText = `최고 기록 갱신! ${elapsedTime / 1000} 초에 완료했습니다!`;
    } else {
        resultMessage.innerText = `축하합니다! ${elapsedTime / 1000} 초에 완료했습니다!`;
    }

    modal.style.display = "block";
}

function gameOver() {
    typedValueElement.disabled = true;
    startButton.disabled = false;
    resultMessage.innerText = "타임아웃! \n 제한 시간 내에 완료하지 못했습니다.";
    modal.style.display = "block";
}

// 모달 닫기
closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}