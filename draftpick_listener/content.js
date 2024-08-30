function getDraftedPlayerFromElement(element) {
    const playerName = element.querySelector('.player-name')?.textContent.trim();
    const playerPosition = element.querySelector('.position')?.textContent.trim();
    const pricePaid = element.querySelector('.pick')?.textContent.trim();

    // Finding the team name by traversing up the DOM
    const teamElement = element.closest('.team-column');
    const teamName = teamElement ? teamElement.querySelector('.header-text')?.textContent.trim() : 'Unknown Team';

    // Construct the payload
    return {
        player_name: playerName,
        position: playerPosition,
        drafted_by: teamName,
        price: pricePaid
    };
}

function sendDraftPicks(payloads) {
    fetch('http://localhost:4001/draft_picks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloads)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Batch Success:', data);
        })
        .catch((error) => {
            console.error('Batch Error:', error);
        });
}

function handleNewDraftedPlayer(element) {
    const payload = getDraftedPlayerFromElement(element);

    // Send the payload for the newly added drafted player
    fetch('http://localhost:4001/draft_pick', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            console.log('New Player Success:', data);
        })
        .catch((error) => {
            console.error('New Player Error:', error);
        });

    // Example of sending to another endpoint as well
    fetch('http://localhost:4000/api/sleeper/draftpick', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            console.log('New Player Success (Sleeper):', data);
        })
        .catch((error) => {
            console.error('New Player Error (Sleeper):', error);
        });
}

const observedElements = new Set(); // Set to store observed elements

function processExistingDraftedPlayers() {
    const elements = document.querySelectorAll('.drafted');
    const payloads = [];

    elements.forEach(element => {
        const payload = getDraftedPlayerFromElement(element);
        payloads.push(payload);
        observedElements.add(element);
    });

    if (payloads.length > 0) {
        sendDraftPicks(payloads);
        return true; // Indicate that elements were found
    }

    return false; // Indicate that no elements were found
}

function observeNewDraftedPlayers() {
    const observer = new MutationObserver((mutations) => {
        const draftPicks = document.querySelectorAll('.drafted')
        draftPicks.forEach(node => {
            if (!observedElements.has(node)) {
                handleNewDraftedPlayer(node);
                observedElements.add(node);
            }
        });
    });

    // Start observing the entire document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true // Observe the entire subtree
    });
}


function retryUntilElementsFound() {
    let tries = 0

    const intervalId = setInterval(() => {
        const found = processExistingDraftedPlayers();
        tries = tries + 1;

        if (found || tries >= 5) {
            clearInterval(intervalId); // Stop retrying once elements are found
            observeNewDraftedPlayers(); // Start observing for new elements
        }
    }, 500); // Retry every 500ms
}

// Start the retry mechanism on page load
retryUntilElementsFound(tries);

