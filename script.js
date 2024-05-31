document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.chase-button');
    const restrictedArea = document.querySelector('.restricted-area');
    const timerElement = document.querySelector('.timer');
    const playerNameInput = document.querySelector('#playerNameInput');
    const lastResults = document.querySelector('#lastResults');
    
    let isPlaying = false;
    let timer;
    let secondsElapsed = 0;
    let name;

    playerNameInput.style.display = 'none';
    
    button.addEventListener('mouseover', () => {
        if (!isPlaying) {
            isPlaying = true;
            secondsElapsed = 0;
            startTimer();
        }

        const restrictedRect = restrictedArea.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        const newX = Math.random() * (restrictedRect.width - buttonRect.width);
        const newY = Math.random() * (restrictedRect.height - buttonRect.height);
        
        button.style.left = restrictedRect.left + newX + 'px';
        button.style.top = restrictedRect.top + newY + 'px';
    });

    button.addEventListener('click', () => {
        isPlaying = false;
        clearInterval(timer);
        name = prompt("Введите ваше имя:");
        saveResult(name, secondsElapsed);
        showLastResults();
        saveToFile();
    });

    function startTimer() {
        timer = setInterval(() => {
            secondsElapsed++;
            timerElement.textContent = `Секунды: ${secondsElapsed}`;
        }, 1000);
    }

    function saveResult(name, time) {
        const currentResults = JSON.parse(localStorage.getItem('results')) || [];
        currentResults.push({ name, time });
        localStorage.setItem('results', JSON.stringify(currentResults));
    }

    function showLastResults() {
        const results = JSON.parse(localStorage.getItem('results')) || [];
        lastResults.innerHTML = "<h3>Последние результаты:</h3>";
        results.slice(-5).reverse().forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.textContent = `${result.name}: ${result.time} секунд`;
            lastResults.appendChild(resultElement);
        });
    }
    
    function saveToFile() {
        const results = JSON.parse(localStorage.getItem('results')) || [];
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Save.txt';
        link.click();
    }

    showLastResults(); // Показать результаты при загрузке страницы
});

const resultsWindow = document.getElementById('lastResults');
let isDragging = false;
let initialX;
let initialY;

resultsWindow.addEventListener('mousedown', (e) => {
    isDragging = true;
    initialX = e.clientX - resultsWindow.offsetLeft;
    initialY = e.clientY - resultsWindow.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        resultsWindow.style.left = `${e.clientX - initialX}px`;
        resultsWindow.style.top = `${e.clientY - initialY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

resultsWindow.addEventListener('dblclick', () => {
    if (resultsWindow.style.width === '300px') {
        resultsWindow.style.width = '600px';
        resultsWindow.style.height = '600px';
    } else {
        resultsWindow.style.width = '300px';
        resultsWindow.style.height = '300px';
    }
});