export const playTooltipText = 
`You are playing as white.   
• To move a dice:   
Click the desired white checker (its border will turn yellow).
Click the destination point to move the checker.
Once you’ve used all your moves, the computer will take its turn.
`;

export const graphTooltipText = 
`This tree visualizes the expectiminimax search, where each node’s score is computed as follows:
• Pink = MAX (AI decision)
𝑉(𝑠)  =  max⁡𝑎∈Moves(𝑠)𝑉(𝑠,𝑎)
The AI picks the move 𝑎 that yields the highest value.
• Blue = MIN (player response)
𝑉(𝑠)  =  min⁡𝑎∈Moves(𝑠)𝑉(𝑠,𝑎)
The opponent is assumed to choose the move that minimizes the value.
• Yellow = Chance (dice rolls)
𝑉(𝑠)  =  ∑𝑟𝑃(𝑟) [𝑉(𝑠,𝑟)]
We average over every possible roll 𝑟, weighted by its probability 𝑃(𝑟).
Each node is labelled "move: score", where score is the 𝑉-value computed by these rules.
• Additionally, this search uses alpha‑beta pruning to eliminate branches that cannot possibly affect the final decision. 
During the MAX and MIN evaluations we carry two bounds,
α=max(score‐so‐far), β=min(score‐so‐far),
and whenever 𝛼 ≥ 𝛽 we stop exploring further down that branch.
As a result, some subtrees are never expanded and the visualization may look “incomplete”.
`;