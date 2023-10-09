let cnv;
let grid = [];
let nextGrid = [];
let pop = ["R", "P", "S","B"];
let gsz = 160//10//80; // 32
let sz = 5//80;//10  //25 
let gen = 1;
let clr;
let goff; // variable for showing only part of the grid

function setup() {
  // center canvas in sketch
  cnv = createCanvas(800, 800);
  let cx = floor((windowWidth - cnv.width) / 2);
  let cy = floor((windowHeight - cnv.height) / 2);
  cnv.position(cx, cy);
  background(127);
  clr = [color(139, 0, 0), color(255, 105, 180), color(127), color(0)];
  textAlign(LEFT, TOP);
  noStroke()//stroke(255);
  makeGrid();
  showGrid();
  frameRate(20)
   
}

function draw(){
  updateGrid2();
  showGrid();
  //noLoop()
}

function makeGrid() {
  for (let j = 0; j < gsz; j++) {
    grid[j] = [];
    for (let i = 0; i < gsz; i++) {
      grid[j][i] = "B" //random(pop); // put in a random
    }
  }
  grid[14][13]= "R"
  grid[22][11]= "P"
  grid[11][22]= "S"
  grid[20][7] = "R"

  for (let j = 0; j < gsz; j++) {
    nextGrid[j] = [];
    for (let i = 0; i < gsz; i++) {
      nextGrid[j][i] = grid[j][i];
    }
  }
}

function showGrid() {
  if (mouseX<width/4){
    // small grid big cell
    sz =25
    goff = 128
  }else{
    // small cell big grid
    sz = 5
    goff =0
  }
  for (let j = 0; j < gsz; j++) {
    for (let i = 0; i < gsz; i++) {
      fill(clr[pop.indexOf(grid[j][i])]);
      rect(i * sz, j * sz, sz, sz);

      if(sz===25){

      fill(255);
      text(grid[j][i], i * sz + sz / 4, j * sz + sz / 4);
      }
    }
  }
}

function updateGrid() {
  // if any in the neighborhood kill you you die
  // small prob of mutation to when copying
  // loop through all cells
  for (let j = 0; j < gsz ; j++) {
    for (let i = 0; i < gsz ; i++) {
      //if anything can kill it will
      // make neighbors array
      let na = [];
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          ny = (j+y+gsz)%gsz
          nx = (i+x+gsz)%gsz
          na.push(grid[ny][nx]);
        }
      }
      //print(grid[j][i], na);

      // check if its killer is in the neighbor array
      if (grid[j][i] === "R" && na.includes("P")) {
        // paper beats rock, change to paper
        nextGrid[j][i] = "P";
        //print("paper kills rock");
      } else if (grid[j][i] === "P" && na.includes("S")) {
        // scissors beat paper, change to scissors
        nextGrid[j][i] = "S";
      } else if (grid[j][i] === "S" && na.includes("R")) {
        // rock kills scissors 
        nextGrid[j][i] = "R";
      } else {
        // no killer not die 
        nextGrid[j][i] = grid[j][i];
    }
  }
}

  // copy new grid into old grid

  for (let j = 0; j < gsz; j++) {
    for (let i = 0; i < gsz; i++) {
      // sometimes make a copy error
      if(random(1)<0.0){
        grid[j][i]= random(pop)
        print("bing")
      }else{
       grid[j][i] = nextGrid[j][i];
      }
     
    }
  }
  
}


function updateGrid2() {
  //print("ding")
  // if the neighborhood has more of that cell's killer kind than numbers of that cell's kind it is replaced with killers kind (more not any) 
  // if cell is empty it takes the color of the kind (R,P,S) that is most in that neighborhood
  /*
  const arr = ['a', 'b', 'a', 'a', 'c', 'c'];

const count = {};

for (const element of arr) {
  if (count[element]) {
    count[element] += 1;
  } else {
    count[element] = 1;
  }
}

  */
  // loop through all cells
  for (let j = 0; j < gsz ; j++) {
    for (let i = 0; i < gsz ; i++) {
      //if anything can kill it will
      // make neighbors array
      let na ={R:0,P:0,S:0,B:0} // I know what the data will look like already, so I don't need the above structure 
      // maybe I dont need to count blank spaces but will then I will remove them. I may use this later
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          ny = (j+y+gsz)%gsz // use modulo to handle edges
          nx = (i+x+gsz)%gsz
          if(grid[ny][nx]== "R") na.R+=1;
          else if(grid[ny][nx]== "P") na.P+=1;
          else if(grid[ny][nx]== "S") na.S+=1;
          else if(grid[ny][nx]== "B") na.B+=1;

        }
      }
      //print(na)
      // sort neighbors array
      // Convert the object into an array of key-value pairs
      const keyValueArray = Object.entries(na);

      // Sort the array based on values in descending order
      keyValueArray.sort((a, b) => b[1] - a[1]);

      // Create a new object from the sorted array
      const sortedNeigh = Object.fromEntries(keyValueArray);
      
      //console.log(sortedNeigh)

      // delete the blank spaces from sorted list so you don't fill with blank
      delete sortedNeigh.B

      const largestKey = Object.keys(sortedNeigh)[0];
      // check for all zero
      let rpsTotal = na.P+na.S+na.R

      // the grid cell is blank
      if (grid[j][i]==="B" && rpsTotal >0 ){
        // if cell == B  then fill with largest key that is not B
        //print("oof")

         
         nextGrid[j][i] = largestKey

      }
      else if(grid[j][i] === "R" && (na.P>na.R)) {
        // paper beats rock, change to paper
        nextGrid[j][i] = "P";
        //print("paper kills rock");
      } else if (grid[j][i] === "P" && (na.S>na.P)) {
        // scissors beat paper, change to scissors
        nextGrid[j][i] = "S";
      } else if (grid[j][i] === "S" && (na.R>na.S)) {
        // rock kills scissors
        nextGrid[j][i] = "R";
      } else {
        // no killer not die 
        
        nextGrid[j][i] = grid[j][i];
    }
  }
}

  // copy new grid into old grid
  //let mcount =0 // to count number of mutations each generation 
  for (let j = 0; j < gsz; j++) {
    for (let i = 0; i < gsz; i++) {
      // sometimes make a copy error
      if(random(1)<0.03){
        grid[j][i]= random(["R","P","S"])
        
        //mcount++
      }else{
       grid[j][i] = nextGrid[j][i];
      }
     
    }
  }
  //print(mcount)
  
}

