// Define movement directions: up, left, down, right
var dx = [0, -1, 0, 1];
var dy = [1, 0, -1, 0];

function BFS(Grid, startNode, endNode, N, M)
{
    var grid = new Array(N);
    
    for (let i = 0; i < N; i++)
    {
        let arr = [];
        for (let j = 0; j < M; j++)
            arr.push({ x: -1, y: -1, visited: 0 });
        
            grid[i] = arr;
    }
    var visitedNodes = [];
    var path = [];

    var queue = [];
    
    // Start BFS from the start node
    queue.push({ x: startNode.x, y: startNode.y });
    grid[startNode.x][startNode.y].visited = 1;
    visitedNodes.push({ x: startNode.x, y: startNode.y });

    while (queue.length > 0)
    {
        // Take the first element from the queue
        var front = queue.shift();
        // .shift(): This function removes the first element from the array and returns that element.

        for (let i = 0; i < 4; i++)
        {
            var x = dx[i] + front.x;
            var y = dy[i] + front.y;

            // Check if the current node is the end node
            if (x === endNode.x && y === endNode.y)
            {
                // Path found, trace back and return the path
                visitedNodes.push({ x, y });
                grid[x][y].x = front.x;
                grid[x][y].y = front.y;
                var tmp = { x, y };
                path.push({ x: tmp.x, y: tmp.y });
                
                while (grid[tmp.x][tmp.y].x !== -1 || grid[tmp.x][tmp.y].y !== -1) {
                    let tmpX = grid[tmp.x][tmp.y].x;
                    let tmpY = grid[tmp.x][tmp.y].y;
                    tmp.x = tmpX;
                    tmp.y = tmpY;
                    path.push({ x: tmp.x, y: tmp.y });
                }
                return { path, visitedNodes, error: "" };
            }
            // Check if the current node is valid and not visited
            else if (x >= 0 && y >= 0 && x < N && y < M && !Grid[x][y].isWall && !grid[x][y].visited)
            {
                // Mark the cell as visited, record its previous node's coordinates
                grid[x][y].visited = 1;
                visitedNodes.push({ x, y });
                grid[x][y].x = front.x;
                grid[x][y].y = front.y;
                queue.push({ x, y });
            }
        }
    }
    return { path, visitedNodes, error: "Path is not found" };
}

export default BFS;