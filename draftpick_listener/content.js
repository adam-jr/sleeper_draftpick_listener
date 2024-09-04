const baseUrl = 'http://localhost:4001'
const batchEndpoint = '/draftPicks'
const draftPickEndpoint = '/draftPick'

function extractDraftPick(element) {
    const playerName = element.querySelector('.player-name')?.textContent.trim();
    const positionAndTeamText = element.querySelector('.position')?.textContent.trim();
    const pricePaid = element.querySelector('.pick')?.textContent.trim();

    // Finding the team name by traversing up the DOM
    const teamElement = element.closest('.team-column');
    const draftedBy = teamElement ? teamElement.querySelector('.header-text')?.textContent.trim() : 'Unknown Team';
    const [playerPosition, playerTeam] = positionAndTeamText.split(' - ')

    // Construct the payload
    return {
        playerName,
        playerPosition,
        playerTeam,
        draftedBy,
        pricePaid
    };
}

function postRequest(url, endpoint, payload) {
    console.log(payload)
    fetch(new URL(url, endpoint), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            // console.log('Batch Success:', data);
        })
}

const observedElements = new Set(); // Set to store observed elements

function processExistingDraftedPlayers() {
    const elements = document.querySelectorAll('.drafted');
    const payloads = [];

    elements.forEach(element => {
        const payload = extractDraftPick(element);
        payloads.push(payload);
        observedElements.add(element);
    });

    if (payloads.length > 0) {
        postRequest(baseUrl, batchEndpoint, payloads);
        return true; // Indicate that elements were found
    }

    return false; // Indicate that no elements were found
}

function observeNewDraftedPlayers() {
    const observer = new MutationObserver((mutations) => {
        const draftPicks = document.querySelectorAll('.drafted')
        draftPicks.forEach(node => {
            if (!observedElements.has(node)) {
                observedElements.add(node);
                const payload = extractDraftPick(node);
                postRequest(baseUrl, draftPickEndpoint, payload)
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
            clearInterval(intervalId); // Stop retrying once elements are found or tries = 5
            observeNewDraftedPlayers(); // Start observing for new elements
        }
    }, 500); // Retry every 500ms
}

// Start the retry mechanism on page load
retryUntilElementsFound();

