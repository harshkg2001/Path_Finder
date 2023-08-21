import React, { useEffect, useState } from 'react'
import '../styles/PathfindingVS.css';
import Astar from '../algorithm/path/A_star_algo';
import basicMaze from '../algorithm/maze/basic-maze';
import BFS from '../algorithm/path/bfs';
import DFS from '../algorithm/path/dfs';
import Dijkstra from '../algorithm/path/dijkstra';
import Randomized_dfs from '../algorithm/maze/randomized_dfs';
import recursiveDivision from '../algorithm/maze/recursive_division';
import Navbar from '../components/Navbar';
import Footer from "../components/Footer"

// super(props);
// call the super class constructor and pass in the props parameter

// size of the grid.
var rows = 17;
var cols = 31;

// positions of the starting and ending icons.
var START_NODE_ROW = 4, START_NODE_COL = 6;
var END_NODE_ROW = rows - 6, END_NODE_COL = cols - 6;

// initial row and coloumn. But what for?
var InitSR = START_NODE_ROW, InitSC = START_NODE_COL;
var InitER = END_NODE_ROW, InitEC = END_NODE_COL;

// animate time in milliseconds.
var animateTime = 35;


function App() {
    // what is array destructuring? maybe used here.
    const [Grid, setGrid] = useState([]);

    const [isMousePress, setIsMousePress] = useState(false);
    const [mazeID, setMazeID] = useState(0);
    const [pathID, setPathID] = useState(0);
    const [animateType, setAnimateTimeType] = useState(2);

    // to initialize grid when the code runs for the first time. other use?
    useEffect(() => {
        gridInitialize();
    }, [])

    // function to initialize the grid. later used in the above useEffect.
    function gridInitialize() {
        var grid = new Array(rows);
        for (let i = 0; i < rows; i++)
            grid[i] = new Array(cols);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++)
                grid[i][j] = new Spot(i, j);
        }
        setGrid(grid);
    }

    // algorithm for the animation. know in full detail how it is used.
    async function animateVisitedNodes(visitedNodes) {
        for (let i = 0; i < visitedNodes.length; i++) {
            const node = visitedNodes[i];
            await waitForAnimation(animateTime);

            if (node.x === START_NODE_ROW && node.y === START_NODE_COL)
                document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited START_NODE";

            else if (node.x === END_NODE_ROW && node.y === END_NODE_COL)
                document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited END_NODE";

            else
                document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited";
        }
    }

    async function animateShortestPath(pathNode) {
        pathNode.reverse();

        for (let i = 0; i < pathNode.length; i++) {
            const node = pathNode[i];
            await waitForAnimation(animateTime);

            if (i === 0)
                document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath START_NODE";

            else if (i + 1 === pathNode.length)
                document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath END_NODE";

            else
                document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath";
        }
    }

    const pathFinding = async () => {
        var btns = document.getElementsByClassName('button-4');
        document.getElementsByTagName('select')[0].disabled = true;
        document.getElementsByTagName('select')[1].disabled = true;
        for (let i = 0; i < btns.length; i++) {
            btns[i].disabled = true;
        }

        var startNode = Grid[START_NODE_ROW][START_NODE_COL];
        var endNode = Grid[END_NODE_ROW][END_NODE_COL];

        var obj;
        switch (pathID) {
            case 1:
                obj = Astar(Grid, startNode, endNode, rows, cols);
                await animateVisitedNodes(obj.close_list);
                await animateShortestPath(obj.path);
                break;
            case 2:
                obj = BFS(Grid, startNode, endNode, rows, cols);
                await animateVisitedNodes(obj.visitedNodes);
                await animateShortestPath(obj.path);
                break;
            case 3:
                obj = DFS(Grid, startNode, endNode, rows, cols);
                await animateVisitedNodes(obj.visitedNodes);
                await animateShortestPath(obj.path);
                break;
            case 4:
                obj = Dijkstra(Grid, startNode, endNode, rows, cols);
                await animateVisitedNodes(obj.visitedNodes);
                await animateShortestPath(obj.path);
                break;
            default:
                break;
        }
        document.getElementsByTagName('select')[0].disabled = false;
        document.getElementsByTagName('select')[1].disabled = false;
        for (let i = 0; i < btns.length; i++) {
            btns[i].disabled = false;
        }
    }

    const mazeGenerator = async (ar) => {
        for (var i = 0; i < ar.length; i++) {
            if ((ar[i].r === START_NODE_ROW && ar[i].c === START_NODE_COL) ||
                (ar[i].r === END_NODE_ROW && ar[i].c === END_NODE_COL)) continue;
            await waitForAnimation(animateTime);
            createWall(ar[i].r, ar[i].c);
        }
    }

    const makeAllCellAsAWall = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!((i === START_NODE_ROW && j === START_NODE_COL) || (i === END_NODE_ROW && j === END_NODE_COL))) {
                    createWall(i, j);
                }
            }
        }
    }

    const mazeHandle = async () => {
        var arr = [];
        switch (mazeID) {
            case 1:
                arr = basicMaze(rows, cols);
                mazeGenerator(arr);
                break;
            case 2:
                makeAllCellAsAWall();
                arr = Randomized_dfs(rows, cols);
                mazeGenerator(arr);
                break;
            case 3: // recursive division
                arr = recursiveDivision(rows, cols);
                mazeGenerator(arr);
                break;
            default:
        }
    }

    const clearPathHandle = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (i === START_NODE_ROW && j === START_NODE_COL) {
                    document.getElementById(`row${i}_col${j}`).className = "square START_NODE";
                }
                else if (i === END_NODE_ROW && j === END_NODE_COL) {
                    document.getElementById(`row${i}_col${j}`).className = "square END_NODE";
                }
                else if (!Grid[i][j].isWall)
                    document.getElementById(`row${i}_col${j}`).className = "square";
            }
        }
    }

    const createWall = (row, col) => {
        /*
            ***** the concept should be known array reference and copy *****
        */
        var newGrid = [...Grid] // array copy
        var node = newGrid[row][col];
        node.isWall = !node.isWall;
        newGrid[row][col] = node;
        setGrid(newGrid);
    }

    const onMouseDown = (row, col) => {
        if (isValid(row, col)) {
            setIsMousePress(true);
            createWall(row, col);
        }
    }
    const onMouseEnter = (row, col) => {
        if (isMousePress === true && isValid(row, col)) {
            createWall(row, col);
        }
    }
    const onMouseUp = () => {
        setIsMousePress(() => false);
    }
    const animationTimeHandle = (type) => {
        if (type === 1) animateTime = 8;
        else if (type === 2) animateTime = 35;
        else animateTime = 80;
        setAnimateTimeType(type);
    }

    const setStartEndNode = (id, r, c) => {
        if (id === 1) {
            let newGrid = [...Grid] // array copy
            let preStartNode = newGrid[START_NODE_ROW][START_NODE_COL];
            let curStartNode = newGrid[r][c];
            preStartNode.isStart = !preStartNode.isStart;
            curStartNode.isStart = !curStartNode.isStart;
            setGrid(newGrid);

            START_NODE_ROW = r;
            START_NODE_COL = c;
        }
        else {
            let newGrid = [...Grid] // array copy
            let preEndNode = newGrid[END_NODE_ROW][END_NODE_COL];
            let curEndNode = newGrid[r][c];
            preEndNode.isEnd = !preEndNode.isEnd;
            curEndNode.isEnd = !curEndNode.isEnd;
            setGrid(newGrid);

            END_NODE_ROW = r;
            END_NODE_COL = c;
        }
    }

    return (
        <>
            {/* ALL BUTTONS ARE HERE */}

            <div id="Container-blur">
                <Navbar msg='Path Finder Visualizer'></Navbar>
                <div className='path-container'>
                    <div className='path-header'>
                        <div>
                            <div style={{ "display": "flex", "margin": "6px auto" }}>
                                <div>
                                    <button className='button-4 start-btn' onClick={pathFinding}>Find the possible path</button>
                                </div>
                                <div>
                                    <select className='my-drop-down' value={pathID} onChange={(e) => { setPathID(parseInt(e.target.value)) }}>
                                        <option className='my-drop-down-option' disabled value="0">Select Algorithm</option>
                                        <option value="1">A-Star Search</option>
                                        <option value="2">Breadth-First Search</option>
                                        <option value="3">Depth-First Search</option>
                                        <option value="4">Dijkstra</option>
                                    </select>
                                </div>
                            </div>
                            {/* -------------------------------------------------------------------------------------------------------------------------- */}
                            {/* Fast-slow buttons. Passing number in the animationTimeHandle as time for animation. */}
                            <div className='path-speed-btns'>
                                <button className={`button-1 ${animateType === 1 && 'curr-speed-btn'}`} onClick={() => animationTimeHandle(1)}>Fast</button>
                                <button className={`button-1 ${animateType === 2 && 'curr-speed-btn'}`} onClick={() => animationTimeHandle(2)}>Average</button>
                                <button className={`button-1 ${animateType === 3 && 'curr-speed-btn'}`} onClick={() => animationTimeHandle(3)}>Slow</button>
                            </div>
                            {/* -------------------------------------------------------------------------------------------------------------------------- */}
                        </div>
                        <div>
                            {/* -------------------------------------------------------------------------------------------------------------------------- */}
                            {/* maze design area. */}
                            <div style={{ "display": "flex", "margin": "6px auto" }}>
                                <select className='my-drop-down' value={mazeID} onChange={(e) => { setMazeID(parseInt(e.target.value)) }}>
                                    <option className='my-drop-down-option' disabled value="0">Select Maze</option>
                                    <option value="1">Random basic maze</option>
                                    <option value="2">Randomized_dfs</option>
                                    <option value="3">Recursive division</option>
                                </select>
                                <button className='button-4 start-maze-btn' onClick={mazeHandle}>Create Maze</button>
                                <button className='button-4' onClick={gridInitialize}>Clear walls</button>
                            </div>
                            {/* -------------------------------------------------------------------------------------------------------------------------- */}
                            {/* -------------------------------------------------------------------------------------------------------------------------- */}
                            {/* clear path and reset board options. */}
                            <div style={{ "display": "flex" }}>
                                <button className='button-4' onClick={clearPathHandle}>Clear path</button>
                                <button className='button-4' onClick={() => {
                                    START_NODE_ROW = InitSR;
                                    START_NODE_ROW = InitSC;
                                    END_NODE_ROW = InitER;
                                    END_NODE_COL = InitEC;
                                    clearPathHandle();
                                    gridInitialize();
                                }}>
                                    Reset board
                                </button>
                            </div>
                            {/* -------------------------------------------------------------------------------------------------------------------------- */}
                        </div>
                    </div>
                    {/* -------------------------------------------------------------------------------------------------------------------------- */}
                    <div className='grid'>
                        <div onMouseLeave={() => { setIsMousePress(false) }}>
                            {/* JSX Node Of Grid (2D Array) */}
                            {Grid.map((R, idx_r) => {
                                return (<div key={idx_r} className='ROW'>
                                    {R.map((Value, idx_c) => {
                                        const { x, y, isStart, isEnd, isWall } = Value;
                                        return <Node key={idx_c}
                                            pv={{ x, y, isStart, isEnd, isWall, onMouseDown, onMouseEnter, onMouseUp, setStartEndNode }}>
                                        </Node>
                                    })
                                    }
                                </div>)
                            })}
                        </div>
                    </div>
                    {/* -------------------------------------------------------------------------------------------------------------------------- */}
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}

class Spot {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.isWall = false;
        this.isStart = (i === START_NODE_ROW && j === START_NODE_COL);
        this.isEnd = (i === END_NODE_ROW && j === END_NODE_COL);
    }
}

/*

class Spot: Defines a new class named Spot.

constructor(i, j): This is the constructor. It takes two parameters i and j, which represent the row and column indices of the spot in a grid.

--------------------------------------------------------------------------------------------------------------------------------
this.x = i; and this.y = j;: These lines assign the i parameter to the x property and the j parameter to the y property of the created object. This essentially stores the coordinates of the spot in the grid.
--------------------------------------------------------------------------------------------------------------------------------

this.isWall = false;: This property seems to indicate whether the spot is a wall or an obstacle in the grid. It's assumed to be initially not a wall.

this.isStart = (i === START_NODE_ROW && j === START_NODE_COL);: This line calculates whether the current spot is the starting node. It checks if the i and j coordinates match predefined START_NODE_ROW and START_NODE_COL values. If they match, the isStart property is set to true.

this.isEnd = (i === END_NODE_ROW && j === END_NODE_COL);: Similar to the previous line, this one checks if the spot is the ending node by comparing the coordinates with predefined END_NODE_ROW and END_NODE_COL values. If they match, the isEnd property is set to true.

START_NODE_ROW, START_NODE_COL, END_NODE_ROW, and END_NODE_COL are defined elsewhere in the code and represent the row and column indices of the start and end nodes in the grid.

 */

function Node({ pv }) {
    const { x, y, isStart, isEnd, isWall, onMouseDown, onMouseEnter, onMouseUp, setStartEndNode } = pv;
    const allowDrop = (e) => { e.preventDefault(); }
    const drag = (e) => { e.dataTransfer.setData("myID", e.target.id); }
    const drop = (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData("myID");
        var dom = document.getElementById(data);
        var id = parseInt(dom.attributes.data_type.value);
        if (e.target.attributes.data_type.value !== "3" || e.target.attributes.wall.value === "true") return;

        // call the function
        var r = parseInt(e.target.attributes.data_x.value)
        var c = parseInt(e.target.attributes.data_y.value)
        setStartEndNode(id, r, c);
    }

    var classNode = isStart ? "START_NODE" : (isEnd ? "END_NODE" : (isWall ? "obtacle" : ""));
    var typeId = isStart ? "1" : (isEnd ? "2" : "3");

    if (isStart || isEnd) {
        return (
            <div
                className={'square ' + classNode} id={'row' + x + '_col' + y}
                data_x={x}
                data_y={y}
                data_type={typeId}
                wall="false"
                draggable="true"
                onDragStart={drag}
                onDrop={drop}
                onDragOver={allowDrop}
            >
            </div>
        )
    }
    else {
        return (
            <div onMouseDown={(e) => {
                e.preventDefault(); // it is necessary
                onMouseDown(x, y)
            }
            }
                onMouseEnter={(e) => {
                    e.preventDefault();
                    onMouseEnter(x, y)
                }
                }
                onMouseUp={(e) => {
                    e.preventDefault();
                    onMouseUp()
                }
                }
                className={'square ' + classNode} id={'row' + x + '_col' + y}
                data_x={x}
                data_y={y}
                data_type={typeId}
                wall={isWall.toString()}
                onDrop={drop}
                onDragOver={allowDrop}
            >
            </div>
        )
    }
}

async function waitForAnimation(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('');
        }, time)
    })
}

/*
async function waitForAnimation(time): This line defines an async function named waitForAnimation that takes a single parameter time. The async keyword indicates that this function will always return a Promise.

return new Promise((resolve) => { ... });: Within the waitForAnimation function, a new Promise is created. The Promise takes a single function as an argument, often referred to as the "executor function". This function is passed two arguments, resolve and reject, which are functions to fulfill or reject the Promise.

setTimeout(() => { resolve(''); }, time);: Inside the executor function, a setTimeout function is used to introduce a delay before resolving the Promise. The setTimeout function takes two arguments: a callback function and the time (in milliseconds) to wait before executing the callback.

The callback function is defined using an arrow function: () => { resolve(''); }. Inside this callback, the resolve function is called. The empty string '' is passed to resolve, but in this context, it doesn't carry any significant meaning; it's just a placeholder for the resolution value.

The time argument is the amount of time the function will wait before resolving the Promise. It's in milliseconds.

resolve('');: This line inside the callback function calls the resolve function of the Promise. This effectively fulfills the Promise, indicating that the asynchronous operation (in this case, waiting for a specified time) has completed successfully. The empty string '' is provided as a value to the resolution.
*/ 
const isValid = (r, c) => {
    if ((r === START_NODE_ROW && c === START_NODE_COL) || (r === END_NODE_ROW && c === END_NODE_COL)) return 0;
    else return 1;
}

export default App;