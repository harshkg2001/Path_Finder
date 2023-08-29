// Define the possible movement directions: right, left, down, up
var dx = [+2, -2, 0, 0];
var dy = [0, 0, +2, -2];

// Declare global arrays to track visited cells and the nodes visited in order
var vis = [];
var visitedNodes = [];

// Randomized Depth-First Search function to generate a maze
function Randomized_dfs(N, M)
{
    // N: Number of rows in the maze grid.
    // M: Number of columns in the maze grid.

    // Reset visitedNodes and initialize the vis array
    visitedNodes = [];

    // vis = new Array(N): This creates an array with N elements, where each element will represent a row in the maze grid.
    vis = new Array(N);
    for (let i = 0; i < N; i++)
    {
        let arr = [];
        for (let j = 0; j < M; j++)
            arr.push(false);

        vis[i] = arr;
    }
    
    // Start DFS from the initial cell (1, 1)
    dfs(1, 1, N, M);
    return visitedNodes; // Return the list of visited nodes in order
}

// Depth-First Search function
function dfs(r, c, N, M)
{
    vis[r][c] = true;
    visitedNodes.push({ r, c });

    var s = []; // Initialize the stack
    s.push({ x: r, y: c });
    // { x: r, y: c }: This is an object with x and y, representing the row and column coordinates of a cell in the maze grid.

    while (s.length > 0)
    {
        let top = s[s.length - 1]; 
        // Get the top cell from the stack

        let neighbours = getNeighbors(top, N, M);
        // Get unvisited neighbors
        
        if(neighbours.length)
        {
            let rand_id = Math.floor(Math.random() * neighbours.length);
            // Choose a random neighbor
            
            goForward(top.x, top.y, neighbours[rand_id][0], neighbours[rand_id][1]);
            // Create a passage
            
            s.push({ x: neighbours[rand_id][0], y: neighbours[rand_id][1] });
            // Push the chosen neighbor onto the stack
            
            vis[neighbours[rand_id][0]][neighbours[rand_id][1]] = true;
            // Mark the chosen neighbor as visited
        }
        else
        {
            s.pop();
            // If no valid neighbors, backtrack by popping the stack
        }
    }
}

// Create a passage from the parent cell to the target cell
function goForward(pr, pc, r, c)
{
    if (r === pr)
    {
        if (c < pc)
            for (let i = pc - 1; i >= c; i--) 
                visitedNodes.push({ r, c: i }); // Move left
        else
            for (let i = pc + 1; i <= c; i++)
                visitedNodes.push({ r, c: i }); // Move right
    }
    else
    {
        if (r < pr)
            for (let i = pr - 1; i >= r; i--)
                visitedNodes.push({ r: i, c }); // Move up
        else
            for (let i = pr + 1; i <= r; i++) 
                visitedNodes.push({ r: i, c }); // Move down
    }
}

// Get unvisited neighbors of a given cell
function getNeighbors(top, N, M)
{
    let arr = [];
    for (let i = 0; i < 4; i++)
    {
        let x = top.x + dx[i];
        let y = top.y + dy[i];

        // Check if the potential neighbor is within the boundaries of the maze and is unvisited.
        if (x >= 0 && y >= 0 && x < N && y < M && !vis[x][y])
        {
            arr.push([x, y]);
        }
    }
    return arr;
}

// Export the Randomized_dfs function as the default export of the module
export default Randomized_dfs;