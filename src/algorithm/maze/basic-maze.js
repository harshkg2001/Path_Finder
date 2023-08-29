// Define a function called basicMaze that takes two parameters: rows and cols
function basicMaze(rows, cols)
{
    // Create an empty array to store maze coordinates
    var arr = [];
    
    // Loop through each row
    for (var r = 0; r < rows; r++)
    {
        // Create an empty Set to store unique column values for each row
        const st = new Set();
        
        // Loop a fraction of cols/4 times
        for (var j = 0; j < cols / 4; j++)
        {
            // Generate a random number between 0 and 99
            var c = Math.floor((Math.random() * 100));
            
            // Calculate the modulo to ensure c is within the range of cols
            c %= cols;
            
            // Add the random column value to the Set
            st.add(c);
        }
        
        // Loop through the Set elements and push {r, c} objects into the arr array
        for (let c of st)
            arr.push({ r, c });
    }
    
    // Return the array containing maze coordinates
    return arr;
}

// Export the basicMaze function as the default export of the module
export default basicMaze;