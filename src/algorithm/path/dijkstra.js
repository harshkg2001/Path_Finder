// Define movement directions: down, up, right, left
var dx = [0, 0, 1, -1];
var dy = [1, -1, 0, 0];

function Dijkstra(Grid, startNode, endNode, N, M)
{
    var visitedNodes = [];
    // Array to store visited nodes during pathfinding
    
    var path = [];
    // Array to store the final path

    // Initialize the grid with high distances and no previous node
    var grid = new Array(N);
    for (let i = 0; i < N; i++)
    {
        let arr = [];
        for (let j = 0; j < M; j++)
            arr.push({ distance: 1e9, x: -1, y: -1 }); // distance: infinity, previous node: none

        grid[i] = arr;
    }

    var priority_queue = [];
    // Priority queue to manage nodes to be explored
    
    priority_queue.push({ cost: 0, x: startNode.x, y: startNode.y });
    // Start with the start node
    
    grid[startNode.x][startNode.y].distance = 0;
    // Set distance to start node as 0
    // The distance property is defined while forming the grid (line 19)

    visitedNodes.push({ x: startNode.x, y: startNode.y }); // Mark start node as visited

    while (priority_queue.length > 0)
    {
        // Sort the priority queue based on cost
        priority_queue.sort((a, b) => a.cost - b.cost);
        // The comparison function (a, b) => a.cost - b.cost subtracts the cost of node b from the cost of node a.


        var top = priority_queue.shift();
        // .shift(): This function removes the first element from the array and returns that element.
        // Get the node with the lowest cost
        
        if (top.cost !== grid[top.x][top.y].distance)
            continue;
        // if the accumulated cost to the current node is greater than the shortest known distance recorded for that node, skip

        // Explore neighbors in all directions
        for (let i = 0; i < 4; i++)
        {
            var x = dx[i] + top.x; // Calculate new x coordinate
            var y = dy[i] + top.y; // Calculate new y coordinate

            // Check if the new coordinates are within the grid and not a wall
            if (!(x >= 0 && x < N && y >= 0 && y < M) || Grid[x][y].isWall)
                continue;

            if (x === endNode.x && y === endNode.y)
            { 
                // Path to end node is found
                visitedNodes.push({ x, y });
                grid[x][y].x = top.x;
                grid[x][y].y = top.y;

                var tmp = { x, y };
                path.push({ x: tmp.x, y: tmp.y });

                // Trace back the path by following previous nodes
                while (grid[tmp.x][tmp.y].x !== -1 || grid[tmp.x][tmp.y].y !== -1)
                {
                    let tmpX = grid[tmp.x][tmp.y].x;
                    let tmpY = grid[tmp.x][tmp.y].y;
                    tmp.x = tmpX;
                    tmp.y = tmpY;
                    path.push({ x: tmp.x, y: tmp.y });
                }
                return { path, visitedNodes, error: "" }; // Return the path and visited nodes
            } 
            else if (grid[x][y].distance > 1 + grid[top.x][top.y].distance) 
            {
                // Update distance and previous node information
                grid[x][y].distance = 1 + grid[top.x][top.y].distance;
                grid[x][y].x = top.x;
                grid[x][y].y = top.y;

                visitedNodes.push({ x, y });
                priority_queue.push({ cost: grid[x][y].distance, x, y });
            }
        }
    }
    return { path, visitedNodes, error: "Path not found" }; // Return if path is not found
}

// Export the Dijkstra's algorithm function
export default Dijkstra;