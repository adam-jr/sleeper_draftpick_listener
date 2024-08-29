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

function processExistingDraftedPlayers() {
    const elements = document.querySelectorAll('.drafted');
    const payloads = [];

    elements.forEach(element => {
        const payload = getDraftedPlayerFromElement(element);
        payloads.push(payload);
    });

    if (payloads.length > 0) {
        sendDraftPicks(payloads);
        return true; // Indicate that elements were found
    }

    return false; // Indicate that no elements were found
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

function observeNewDraftedPlayers() {
    const observedElements = new Set();  // Set to store observed elements

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('.drafted') && !observedElements.has(node)) {
                        handleNewDraftedPlayer(node);
                        observedElements.add(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function retryUntilElementsFound() {
    const intervalId = setInterval(() => {
        const found = processExistingDraftedPlayers();

        if (found) {
            clearInterval(intervalId); // Stop retrying once elements are found
            observeNewDraftedPlayers(); // Start observing for new elements
        }
    }, 500); // Retry every 500ms
}

// Start the retry mechanism on page load
retryUntilElementsFound();
