const processedPlayers = new Set();

function extractPlayersInfo(adpElements) {
    const playersToProcess = [];

    adpElements.forEach(adpElement => {
        const playerElement = adpElement.closest('.show-watchlist-action');
        if (!playerElement) return;

        const playerName = playerElement.querySelector('.name-wrapper').firstChild.textContent.trim();
        const position = playerElement.querySelector('.position').textContent.split(' ')[0].trim();
        const team = playerElement.querySelector('.team').textContent.trim();
        const cost = adpElement.textContent.trim();

        if (!processedPlayers.has(playerName)) {
            playersToProcess.push({
                playerName,
                position,
                team,
                cost
            });

            // Mark the player as processed
            processedPlayers.add(playerName);
        }
    });

    // If there are any players to process, send them as a batch
    if (playersToProcess.length > 0) {
        fetch('http://localhost:4001/projections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playersToProcess)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Batch Success:', data);
            })
            .catch(error => {
                console.error('Batch Error:', error);
            });
    }
}

// This interval will check for new .adp elements every 100 milliseconds
setTimeout(() => {
    setInterval(() => {
        const elements = document.querySelectorAll('.adp');
        extractPlayersInfo(elements);
    }, 100);
}, 2000)

