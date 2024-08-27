function handleDraftedPlayer(element) {
    const playerName = element.querySelector('.player-name')?.textContent.trim();
    const playerPosition = element.querySelector('.position')?.textContent.trim();
    const pricePaid = element.querySelector('.pick')?.textContent.trim();

    // Finding the team name by traversing up the DOM
    const teamElement = element.closest('.team-column');
    const teamName = teamElement ? teamElement.querySelector('.header-text')?.textContent.trim() : 'Unknown Team';

    // Extract pick and round from your logic or add elements containing them
    const pick = 1;  // Replace this with actual logic to determine the pick
    const round = 1; // Replace this with actual logic to determine the round

    console.log(`Player Drafted: ${playerName}`);
    console.log(`Team: ${teamName}`);
    console.log(`Position: ${playerPosition}`);
    console.log(`Price Paid: ${pricePaid}`);

    // Construct the payload
    const payload = {
        player_name: playerName,
        position: playerPosition,
        pick: pick,
        round: round,
        price: pricePaid
    };

    // Make the POST request
    fetch('http://localhost:4000/api/sleeper/draftpick', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function waitForElement(selector) {
    const observedElements = new Set();  // Set to store observed elements

    const observer = new MutationObserver((mutations, observerInstance) => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    // Check if the element has already been logged
                    if (!observedElements.has(element)) {
                        handleDraftedPlayer(element);
                        observedElements.add(element);  // Mark element as logged
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

// Replace '.drafted' with the class or selector for the drafted player cell
waitForElement('.drafted');
