# Sleeper Auction Draft Listener

A simple set of chrome extensions for watching the DOM and sending real-time draft pick and auction bid info during Sleeper auction drafts

Since their UI seems to use some sort of virtualized unordered list, the `projected_cost_reader` directory requires you to actively scroll through the set of draftable players in order to work.

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