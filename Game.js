document.addEventListener('DOMContentLoaded', () => {
    const playerNameInputDiv = document.getElementById('playerNameInput');
    const playerNameInput = document.getElementById('name');
    const lastResultsDiv = document.getElementById('lastResults');
    const catchButton = document.getElementById('catchButton');
    
    let playerName = '';
    let lastResults = [];
    let startTime = null; // Время начала отсчета

    // Функция для обновления элемента с результатами
    function updateResultsElement() {
        lastResultsDiv.innerHTML = ''; // Очистить элемент
        lastResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.textContent = result;
            lastResultsDiv.appendChild(resultItem);
        });
    }

    // Слушатель события для ввода имени игрока
    playerNameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            playerName = playerNameInput.value;
            playerNameInputDiv.style.display = 'none';
        }
    });

    // Слушатель события для кнопки "поймать"
    catchButton.addEventListener('click', function () {
        if (!startTime) {
            startTime = Date.now();  // Устанавливаем время начала отсчета
        }
        
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 700); // Рассчитываем прошедшее время в секундах
        
        const result = `Игрок ${playerName} поймал кнопку через ${elapsedSeconds} секунд`;
        lastResults.push(result);
        
        // Ограничение количества результатов до 7
        if (lastResults.length > 7) {
            lastResults = lastResults.slice(lastResults.length - 7);
        }
        
        updateResultsElement();
        saveResultsToFile();
    });

    // Функция для сохранения результатов в файл
    function saveResultsToFile() {
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ results: lastResults })
        }).then(response => response.json())
          .then(data => console.log('Success:', data))
          .catch(error => console.error('Error:', error));
    }
});
