// Initialize arrays to track visited cells and store visited nodes
var vis = [];
var visitedNodes = [];

// Main maze generation function using the recursive division algorithm
function recursiveDivision(N, M)
{
    // N: Number of rows in the maze grid.
    // M: Number of columns in the maze grid.

    visitedNodes = [];
    vis = new Array(N);
    // Initialize the 'vis' array to track visited cells
    
    for (let i = 0; i < N; i++)
    {
        let arr = [];
        for (let j = 0; j < M; j++)
        {
            arr.push(false);
        }
        vis[i] = arr;
    }

    // Create boundary cells along the maze edges
    for (let i = 0; i < M; i++)
    {
        visitedNodes.push({ r: 0, c: i });
        vis[0][i] = true;
    }
    for (let i = 1; i < N; i++) {
        visitedNodes.push({ r: i, c: M - 1 });
        vis[i][M - 1] = true;
    }
    for (let i = M - 2; i >= 0; i--) {
        visitedNodes.push({ r: N - 1, c: i });
        vis[N - 1][i] = true;
    }
    for (let i = N - 2; i > 0; i--) {
        visitedNodes.push({ r: i, c: 0 });
        vis[i][0] = true;
    }

    // Start the recursive division process to create inner passages
    divide(1, N - 2, 1, M - 2);

    return visitedNodes;
    // Return the array of visited nodes representing the maze layout
}

// Recursive function to divide the maze area and create passages
function divide(startRow, endRow, startCol, endCol)
{
    if (endRow - startRow <= 1 && endCol - startCol <= 1)
    {
        return;
    }

    if (endRow - startRow > endCol - startCol)
    {
        // Number of rows are greater than the number of columns in the division.
        // Divide horizontally
        let mid = Math.floor((startRow + endRow) / 2);
        let ran_id = Math.floor((Math.random() * 100) % (endCol - startCol + 1)) + startCol;

        // Adjust the division line if there are openings
        let start = startCol;
        if (!vis[mid][startCol - 1])
        {
            ran_id = start;
            start++;
        }

        let end = endCol;
        if (!vis[mid][endCol + 1])
        {
            ran_id = end;
            end--;
        }

        // Create passages and continue dividing
        for (let i = start; i <= end; i++)
        {
            if (i !== ran_id)
            {
                visitedNodes.push({ r: mid, c: i });
                vis[mid][i] = true;
            }
        }

        divide(startRow, mid - 1, startCol, endCol);
        divide(mid + 1, endRow, startCol, endCol);
    }
    else
    {
        // Divide vertically
        let mid = Math.floor((startCol + endCol) / 2);
        let ran_id = Math.floor((Math.random() * 100) % (endRow - startRow + 1)) + startRow;

        // Adjust the division line if there are openings
        let start = startRow;
        if (!vis[startRow - 1][mid])
        {
            ran_id = start;
            start++;
        }

        let end = endRow;
        if (!vis[end + 1][mid])
        {
            ran_id = end;
            end--;
        }

        // Create passages and continue dividing
        for (let i = start; i <= end; i++)
        {
            if (i !== ran_id) {
                visitedNodes.push({ r: i, c: mid });
                vis[i][mid] = true;
            }
        }

        divide(startRow, endRow, startCol, mid - 1);
        divide(startRow, endRow, mid + 1, endCol);
    }
}

// Export the maze generation function
export default recursiveDivision;