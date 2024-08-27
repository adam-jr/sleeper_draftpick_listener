// Function to extract and log the bid amount along with player details and send a POST request
function handleBid(bidInfoElement) {
    let bidAmount;

    // Extract bid amount from bidInfoElement or fallback to the first .bidInfo element
    if (bidInfoElement && bidInfoElement.innerText) {
        bidAmount = bidInfoElement.innerText.split(' ')[0];
    } else {
        const el = document.querySelector('.bidInfo');
        if (el && el.innerText) {
            bidAmount = el.innerText.split(' ')[0];
        } else {
            console.log('Bid amount not found.');
            return;
        }
    }

    // Find the playerInfoText element for team and position
    const playerInfoElement = document.querySelector('.playerInfoText');
    if (playerInfoElement) {
        const playerPosition = playerInfoElement.innerText;
        const playerTeam = playerInfoElement.nextElementSibling?.innerText.split(' ')[1];

        // Find the player's name from the sibling element
        const playerNameElement = playerInfoElement.closest('.left-component').querySelector('.headerText');
        const playerName = playerNameElement ? playerNameElement.innerText : 'Unknown Player';

        // Log the details to the console
        console.log(`Player: ${playerName}, Position: ${playerPosition}, Team: ${playerTeam}, Bid amount: ${bidAmount}`);

        // Prepare the payload for the POST request
        const payload = {
            player_name: playerName,
            position: playerPosition,
            team: playerTeam,
            bid_amount: bidAmount
        };

        // Send the POST request to the server
        fetch('http://localhost:4001/bid_made', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
    } else {
        console.log('Player details not found.');
    }
}


// Function to observe changes to elements with the bidInfo class
function observeBidInfo() {
    // Select the element you want to observe
    const bidInfoElements = document.querySelectorAll('.bidInfo');

    let lastBid;

    // Create a new MutationObserver instance
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            let bidInfoElement = null;

            // Check if the mutation target is an Element node
            if (mutation.target.nodeType === Node.ELEMENT_NODE) {
                bidInfoElement = mutation.target.closest('.bidInfo');
            }
            // Check if the mutation target is a Text node and find the closest .bidInfo element
            else if (mutation.target.nodeType === Node.TEXT_NODE) {
                bidInfoElement = mutation.target.parentElement.closest('.bidInfo');
            }

            if (bidInfoElement && bidInfoElement.innerText != lastBid) {
                handleBid(bidInfoElement);
                lastBid = bidInfoElement.innerText;
            }
        }
    });

    // Observe each bidInfo element for changes
    bidInfoElements.forEach((element) => {
        observer.observe(element, {
            childList: true,
            characterData: true,
            subtree: true,
        });

        // Log the initial bid details if the element is already on screen
        console.log('observed!')
        handleBid(element);
    });

    // Monitor the entire document for new bidInfo elements appearing
    const documentObserver = new MutationObserver(() => {
        const newBidInfoElements = document.querySelectorAll('.bidInfo');

        newBidInfoElements.forEach((element) => {
            if (!element._observed) {
                observer.observe(element, {
                    childList: true,
                    characterData: true,
                    subtree: true,
                });
                handleBid(element);
                element._observed = true; // Mark this element as observed
            }
        });
    });

    // Observe the document body for changes (e.g., new elements appearing)
    documentObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Run the observer when the page is loaded
window.addEventListener('load', observeBidInfo);
