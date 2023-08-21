// the function takes the size of the grid as paramters, i.e., rows and columns
function basicMaze(rows, cols)
{
    // the array that will store pair(r_i, c_i) that will be blacked.
    var arr=[];
    for(var r=0; r<rows; r++)
    {
        // set for distinct values of (r_i, c_i)
        const st=new Set()

        // here columns can be divided by any numbers. This will decide, how compact the walls are.
        for(var j=0; j<cols/4; j++)
        {
            var c=Math.floor((Math.random()*100));
            c%=cols;
            st.add(c);
        }

        // Finally the elements of the set are pushed in the array.
        for(let c of st)
            arr.push({r, c});
    }
    // The array is returned.
    return arr;
}

export default basicMaze;