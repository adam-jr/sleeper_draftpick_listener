# Sleeper Auction Draft Listener

A simple set of chrome extensions for watching the DOM and sending real-time draft pick and auction bid info during Sleeper auction drafts

Since their UI seems to use some sort of virtualized list for rendering draftable players, the `projected_cost_reader` extension requires you to actively scroll through the set of draftable players in order to find them on the DOM.

`auction_bid_listener` and `draftpick_listener` can both be easily modified to make requests (or whatever you want them to do instead) with real-time pick info.

## Auction Bid Listener
Payload:
```javascript
    {
        playerName,
        playerPosition,
        playerTeam,
        bidAmount
    }
```

Just update the url/endpoint as needed

## Draft Pick Listener
Payload:
```javascript
    {
        playerName,
        playerPosition,
        playerTeam,
        draftedBy,
        pricePaid
    }
```

## Install
`git clone` the repo, go to `chrome://extensions/` in your Chrome browser, and click "Load Unpacked". Select whichever of the three packages you'd like to run, then just go start a draft to see it working.
