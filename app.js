var context;
var packman = {
	i : 0,
	j : 0,
	diraction : 4,
	color : "yellow",
	mouthOpen : true,
};
var board;
var score;
var start_time;
var time_elapsed;
var interval;
var max_time;
var movingPoints = {
	i : 5,
	j : 5,
	prev_val : 0,
	show : true,
	interval : 0,
  };
var monsterInterval = 0;
var monsters = new Array();
var liveRemained = 5;
var monstersAmount = 2; // according to the setup !!!!!
var ballsNotEaten;
var extraLive = {
	i : 0,
	j : 0,
	show : true,
	interval : 0,
	small : true,
  };
var timeAdder = {
	i : 0,
	j : 0,
	show : true,
}


$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});


function Start() {
	
	board = new Array();
	score = 0;
	var cnt = 100;
	max_time = 15; // according to the setup !!!!!
	var food_remain = 10; // according to the setup !!!!!
	ballsNotEaten = food_remain;
	var food_remain_big = parseInt(0.1*food_remain);
	var food_remain_mid = parseInt(0.3*food_remain);
	var food_remain_small = food_remain - food_remain_big - food_remain_mid;
	//max_score = 5*food_remain_small + 15*food_remain_mid + 25*food_remain_big + 50;
	var pacman_remain = 1;
	start_time = new Date();
	//monsters:
	monstersLocations = [[0,0],[0,10],[10,0],[10,10]];
	for (var m = 0; m < monstersAmount; m++){
		var location = monstersLocations[m];
		monsters[m] = {i:location[0], j:location[1], prev_val:0,};
	}
	var walls = [[2,2], [2,3],[2,7],[2,8],[8,2],[8,3],[8,7],[8,8]];
	// numbers on board:
	//0 = pass.  1 = small food.  2 = mid food.  3 = big food.  4 = wall.  5 = packman.  movingPoints = 6.  monster = 7. exstraLife = 8.
	for (var i = 0; i < 11; i++) {
		board[i] = new Array();
		for (var j = 0; j < 11; j++) {
				
			if(
				(i == 0 && j == 0) ||
				(i == 0 && j == 10) ||
				(i == 10 && j == 0) ||
				(i == 10 && j == 10)
			){
				board[i][j] = 0;// we want to keep those places empty for the monsters
			}
			var isWall = false;	
			for (var w = 0; w < 8; w++){
				if ( walls[w][0] == i && walls[w][1] == j ){
					isWall = true;
				}
			}
			if (isWall){
				board[i][j] = 4;
			}
			
			// else if (
			// 	(i == 3 && j == 3) ||
			// 	(i == 3 && j == 4) ||
			// 	(i == 3 && j == 5) ||
			// 	(i == 6 && j == 1) ||
			// 	(i == 6 && j == 2)
			// ) {
			// 	board[i][j] = 4;
			// }
			else if(i == 5 && j == 5){
				board[i][j] = 6;
				// movingPoints.i = 5; // alredy updated
				// movingPoints.j = 5;
			}
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					//need to choose what point kind of point to draw 
					var randomPointKind = Math.random() * (food_remain - 1) + 1;					
					if (randomPointKind <= food_remain_small){
						board[i][j] = 1;
						food_remain_small -- ;
					} else if (randomPointKind <= food_remain_small+food_remain_mid) {
						board[i][j] = 2;
						food_remain_mid -- ;
					} else {
						board[i][j] = 3;
						food_remain_big -- ;
					}					
					food_remain--;
					
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					packman.i = i;
					packman.j = j;
					pacman_remain--;
					board[i][j] = 5; // packman
				} else {
					board[i][j] = 0; // pass
				}
				cnt--;
			}
		}
	}
	for (var m = 0; m < monstersAmount; m++){ // locate the monsters
		board[monsters[m].i][monsters[m].j] = 7;
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		
		//board[emptyCell[0]][emptyCell[1]] = 1; /////////////////////////////////////////////////
		//food_remain--;

		///
		var i = emptyCell[0];
		var j = emptyCell[1];
		randomPointKind = Math.random() * (food_remain - 1) + 1;					
		if (randomPointKind <= food_remain_small){
			board[i][j] = 1;
			food_remain_small -- ;
		} else if (randomPointKind <= food_remain_small+food_remain_mid) {
			board[i][j] = 2;
			food_remain_mid -- ;
		} else {
			board[i][j] = 3;
			food_remain_big -- ;
		}					
		food_remain--;
		////
	}
	//place exstraLive
	if (extraLive.show){ // no need for this if
		var heartCell = findRandomEmptyCell(board);
		extraLive.i = heartCell[0];
		extraLive.j = heartCell[1];
		board[heartCell[0]][heartCell[1]] = 8;
	}
	//place time adder
	var clockCell = findRandomEmptyCell(board);
	timeAdder.i = clockCell[0];
	timeAdder.j = clockCell[1];
	board[clockCell[0]][clockCell[1]] = 9;

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 200); //milliseconds - (1000 is 1 sec)
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 10 + 1);
	var j = Math.floor(Math.random() * 10 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 10 + 1);
		j = Math.floor(Math.random() * 10 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

///// clock drawing !

function loop(x, y){
	time=new Date();
	h=time.getHours();
	m=time.getMinutes();
	s=time.getSeconds();
	
	context.beginPath();
	context.fillStyle="white";
	//context.arc(x,y,140,0,Math.PI*2,true);
	context.arc(x,y,30,0,Math.PI*2,true);
	context.fill();
	context.strokeStyle="grey";
	context.lineWidth=3;
	context.stroke();
	drawNumber(x,y);
	
	drawPointer(360*(h/12)+(m/60)*30-90,12,"black",3, x, y);
	drawPointer(360*(m/60)+(s/60)*6-90,18,"black",3, x, y);
	drawPointer(360*(s/60)+x-90,23,"grey",1, x, y);
}

function drawNumber(x,y){
	for(n=0;n<12;n++){
		d=-60;
		num = new Number(n+1);
		str = num.toString();
		dd = Math.PI/180*(d+n*30);
		// tx = Math.cos(dd)*120+140;
		// ty = Math.sin(dd)*120+160;
		tx = Math.cos(dd)*25+x -2;
		ty = Math.sin(dd)*25+y +1;
		context.font = "6px Verdana";
		context.fillStyle = "black";
		context.fillText(str, tx, ty);
	}
}

function drawPointer(deg,len,color,w, x, y){
	rad=(Math.PI/180*deg);
	x1=x+Math.cos(rad)*len;
	y1=y+Math.sin(rad)*len;
	
	context.beginPath();
	context.strokeStyle=color;
	context.lineWidth=w;
	context.moveTo(x,y);
	context.lineTo(x1,y1);
	context.stroke();
}
/////// end clock drawing

function Draw(diraction) {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	//lblTime.value = time_elapsed;
	lblTime.value = Math.floor(max_time - time_elapsed);
	if (lblTime.value <= 10){
		document.getElementById("lblTime").style.color = "#ff0000";
	}
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			var center = new Object();
			center.x = i * 60 + 30; /////
			center.y = j * 60 + 30;///////

			if (board[i][j] == 9){ // time adder
				loop(center.x, center.y);
			}
			else if (board[i][j] == 8){ // exstra live
				
				context.beginPath();
				if (extraLive.small == true){
					var w = 37, h = 37;
				}
				else{
					var w = 40, h = 40;
				}
				context.strokeStyle = "#000000";
				context.strokeWeight = 3;
				context.shadowOffsetX = 4.0;
				context.shadowOffsetY = 4.0;
				context.lineWidth = 5.0;
				context.fillStyle = "#FF0000";
				var d = Math.min(w, h);
				var k1 = center.x-15;
				var k2 = center.y-12;			
				context.moveTo(k1, k2 + d / 4);
				context.quadraticCurveTo(k1, k2, k1 + d / 4, k2);
				context.quadraticCurveTo(k1 + d / 2, k2, k1 + d / 2, k2 + d / 4);
				context.quadraticCurveTo(k1 + d / 2, k2, k1 + d * 3/4, k2);
				context.quadraticCurveTo(k1 + d, k2, k1 + d, k2 + d / 4);
				context.quadraticCurveTo(k1 + d, k2 + d / 2, k1 + d * 3/4, k2 + d * 3/4);
				context.lineTo(k1 + d / 2, k2 + d);
				context.lineTo(k1 + d / 4, k2 + d * 3/4);
				context.quadraticCurveTo(k1, k2 + d / 2, k1, k2 + d / 4);
				context.stroke();
				context.fill();

			}
			else if (board[i][j] == 7){ //monster
				DrawMonster(center.x, center.y);
				// context.beginPath();
				// context.arc(center.x, center.y, 25, 0, 2 * Math.PI);
				// context.fillStyle = "purple"; //color
				// context.fill();
			}
			else if (board[i][j] == 6) { // movingPoints
				context.beginPath();
				context.arc(center.x, center.y, 35, 0, 2 * Math.PI);
				context.fillStyle = "blue"; //color
				context.fill();
			} 
			else if (board[i][j] == 5) { // packman
				//diraction: 1 = up.  2 = down.  3 = left.  4 = right
				
				context.beginPath();			
				if (diraction !== undefined){
					packman.direction = diraction;
				}
				
				if (packman.direction == 1){
					if(packman.mouthOpen){
						context.arc(center.x, center.y, 30, 0, 1.35 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 30, 1.65 * Math.PI, 2 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 30, 0, 1.45 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 30, 1.55 * Math.PI, 2 * Math.PI);
					}
				}
				else if(packman.direction == 2){
					if (packman.mouthOpen){
						context.arc(center.x, center.y, 30, 0, 0.35 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 30, 0.65 * Math.PI, 2 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 30, 0, 0.45 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 30, 0.55 * Math.PI, 2 * Math.PI);
					}
				}
				else if(packman.direction == 3){
					if (packman.mouthOpen){
						context.arc(center.x, center.y, 30, 0, 0.85 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 30, 1.15 * Math.PI, 2 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 30, 0, 0.95 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 30, 1.05 * Math.PI, 2 * Math.PI);
					}
				}
				else {
					if(packman.mouthOpen){
						context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 30, 0.05 * Math.PI, 1.95 * Math.PI);
					}
					
					
				}
				
				context.lineTo(center.x, center.y);
				context.fillStyle = packman.color; //color
				context.fill();
				context.beginPath();
				if ( packman.direction == 1 ){
					context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
				}
				else if ( packman.direction == 2 ){
					context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
				}
				else if ( packman.direction == 3 ){
					context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				}
				else{
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				}

				
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) { // food small
				//frame
				// context.beginPath();
				// context.arc(center.x, center.y, 8, 0, 2 * Math.PI);
				// context.stroke();
				//circle
				context.beginPath();
				context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
				context.fillStyle = "#ff9999"; //color
				context.fill();
				//text
				context.font = "10px Verdana";
				context.fillStyle = "black";
				context.fillText("5", center.x -3, center.y + 3);
			} else if (board[i][j] == 2 ) { // food mid
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = "#ff4d4d"; //color
				context.fill();
				//text
				context.font = "10px Verdana";
				context.fillStyle = "black";
				context.fillText("15", center.x -6, center.y + 3);
			} else if (board[i][j] == 3 ) { // food big
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "#ff0000"; //color
				context.fill();	
				//text
				context.font = "10px Verdana";
				context.fillStyle = "black";
				context.fillText("25", center.x -6, center.y + 3);
			} else if (board[i][j] == 4) { // wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function FindMonstersPositions(){
	for(var m = 0; m < monstersAmount; m++){
		var monster = monsters[m];
		var moved = false;
		if(monster.i < packman.i) {
			if (board[monster.i+1][monster.j] == 5){
				liveRemained --;
				score -= 10;
				restart();
				moved = true;
			} else if (board[monster.i+1][monster.j] <= 3){
				board[monster.i][monster.j] = monster.prev_val; // return the board to the value it was before
				monster.prev_val = board[monster.i+1][monster.j]; // keep for later
				monster.i++;
				board[monster.i][monster.j] = 7;
				moved = true;	
			}
		}
		else if (monster.i > packman.i ){
			if (board[monster.i-1][monster.j] == 5){
				liveRemained --;
				score -= 10;
				restart();
				moved = true;
			} else if (board[monster.i-1][monster.j] <= 3) {
				board[monster.i][monster.j] = monster.prev_val; // return the board to the value it was before
				monster.prev_val = board[monster.i-1][monster.j]; // keep for later
				monster.i--;
				board[monster.i][monster.j] = 7;
				moved = true;
			}
		}
		if (monster.j < packman.j &&(!(moved))){
			if (board[monster.i][monster.j+1] == 5){
				liveRemained --;
				score -= 10;
				restart();
			} else if (board[monster.i][monster.j+1] <= 3){
				board[monster.i][monster.j] = monster.prev_val; // return the board to the value it was before
				monster.prev_val = board[monster.i][monster.j+1]; // keep for later
				monster.j++;
				board[monster.i][monster.j] = 7;
			}
		}
		else if (monster.j > packman.j &&(!(moved)) ){
			if (board[monster.i][monster.j-1] == 5){
				liveRemained --;
				score -= 10;
				restart();
			} else if (board[monster.i][monster.j-1] <= 3){
				board[monster.i][monster.j] = monster.prev_val; // return the board to the value it was before
				monster.prev_val = board[monster.i][monster.j-1]; // keep for later
				monster.j--;
				board[monster.i][monster.j] = 7;
			}
		}
	}
}

function FindMovingPointsPosition(){
	//looking for a clear path
	var i = movingPoints.i;
	var j = movingPoints.j;

	if((j != 0 && board[i][j - 1] <= 3) || (j != 10 && board[i][j + 1] <= 3) || ( i != 0 && board[i - 1][j] <= 3) || ( i != 10 && board[i + 1][j] <= 3) ){
		//there is a place to move to
		while (true){
			var moveTo = Math.floor(Math.random() * (4 - 1 + 1) ) + 1; // = 1/2/3/4 (maybe 0? it will go to 4)
			if (moveTo == 1){
				j--;
			}
			else if (moveTo == 2){
				j++;
			}
			else if (moveTo == 3){
				i--;
			}
			else{
				i++;
			}
			if ( 0 <= i <= 10 && 0 <= j <= 10 ){
				var dest = board[i][j]; ///// error here !
				if (dest <= 3){ // pass or points
					board[movingPoints.i][movingPoints.j] = movingPoints.prev_val; // return the board to the value it was before
					movingPoints.prev_val = dest; // keep for later
					movingPoints.i = i;
					movingPoints.j = j;
					board[i][j] = 6;
					break;
				}
			}		
		}
	}	
}

function restart(){

	//clear moving points
	if( movingPoints.show){
		board[movingPoints.i][movingPoints.j] = movingPoints.prev_val;
	}

	//clear heart
	if ( extraLive.show ){
		board[extraLive.i][extraLive.j] = 0;
	}

	//clear clock
	if ( timeAdder.show ){
		board[timeAdder.i][timeAdder.j] = 0;
	}

	//clear packman
	board[packman.i][packman.j] = 0;


	//monsters
	for(var m = 0 ; m < monstersAmount; m++){
		var monster = monsters[m];

		if (monster.prev_val != 5){ // not packman - points - they are not eaten
			board[monster.i][monster.j] = monster.prev_val;
		}
		else{ 
			board[monster.i][monster.j] = 0;
		}
		//place on frame, and update prev val if needed
		var newPosition = monstersLocations[m];
		monster.i = newPosition[0];
		monster.j = newPosition[1];
		monster.prev_val = 0 ; // there are no points there
		board[newPosition[0]][newPosition[1]] = 7;		
	}

	//moving points
	if ( movingPoints.show ){
		movingPoints.i = 5;
		movingPoints.j = 5;
		movingPoints.prev_val = board[5][5]; // should be 0
		board[5][5] = 6;
	}

	//heart
	if ( extraLive.show ){
		var heartCell = findRandomEmptyCell(board);
		extraLive.i = heartCell[0];
		extraLive.j = heartCell[1];
		board[extraLive.i][extraLive.j] = 8;
	}

	//clock
	if ( timeAdder.show ){
		var clockCell = findRandomEmptyCell(board);
		timeAdder.i = clockCell[0];
		timeAdder.j = clockCell[1];
		board[timeAdder.i][timeAdder.j] = 9;
	}

	//packman
	var packmanCell = findRandomEmptyCell(board);
	packman.i = packmanCell[0];
	packman.j = packmanCell[1];
	board[packman.i][packman.j] = 5;
	


}


function UpdatePosition() {
	board[packman.i][packman.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) { //up
		if (packman.j > 0 && board[packman.i][packman.j - 1] != 4) {
			packman.j--;
		}
	}
	if (x == 2) {
		if (packman.j < 10 && board[packman.i][packman.j + 1] != 4) {
			packman.j++;//down
		}
	}
	if (x == 3) {
		if (packman.i > 0 && board[packman.i - 1][packman.j] != 4) {
			packman.i--;//left
		}
	}
	if (x == 4) {
		if (packman.i < 10 && board[packman.i + 1][packman.j] != 4) {
			packman.i++;//right
		}
	}
	
	var cellVal = board[packman.i][packman.j]
	if (cellVal == 1) {
		score += 5;
		ballsNotEaten--;
	} else if (cellVal == 2){
		score += 15;
		ballsNotEaten--;
	} else if (cellVal == 3){
		score += 25;
		ballsNotEaten--;
	} else if(cellVal == 6){
		movingPoints.show = false;
		score += 50;
		if(movingPoints.prev_val != 0){
			score += movingPoints.prev_val; // the points that were here before
			ballsNotEaten--;
		}		
	} else if (cellVal == 7){ // monster
		liveRemained--;
		score -= 10;
		restart()
		//code here to start again . . . .
	} else if(cellVal == 8){ // exstra live
		extraLive.show = false;
		liveRemained++;
	} else if ( cellVal == 9){ // time adder
		timeAdder.show = false;
		max_time += 10; // add 10 sec ////////// need to reverse the clock !!
	}
	board[packman.i][packman.j] = 5;

	//update packman mouth
	packman.mouthOpen = !packman.mouthOpen;

	//update movingPoints object position (only every 5 Intervals)
	if (movingPoints.show){
		if (movingPoints.interval == 5){
			//look for new position for movingPoints
			FindMovingPointsPosition();
			movingPoints.interval = 0;
		}
		else{
			movingPoints.interval++;
		}
	}
	if (monsterInterval == 7){
		//look for new position for movingPoints
		FindMonstersPositions();
		monsterInterval = 0;
	}
	else{
		monsterInterval++;
	}
	if(extraLive.show){
		if (extraLive.interval % 4 == 0){
			extraLive.small = !(extraLive.small); // change size from small to big or opposit (pamping)
			
		}
		if(extraLive.interval == 10){

			var heart_location = findRandomEmptyCell(board);
			board[extraLive.i][extraLive.j] = 0;
			extraLive.i = heart_location[0];
			extraLive.j = heart_location[1];
			board[heart_location[0]][heart_location[1]] = 8;
			extraLive.interval = 0;
		}
		else{
			extraLive.interval++;
		}
	}
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		packman.color = "green";
	}
	if ( time_elapsed >= max_time ){
		window.clearInterval(interval);
		window.alert("Game over"); // change massage
	}
	else if (ballsNotEaten == 0) { 
		window.clearInterval(interval);
		window.alert("Game completed");
	} else if (liveRemained == 0) {
		window.clearInterval(interval);
		window.alert("no more lives!");
	}else {
		Draw(x);
	}
	

}


function DrawMonster(x, y) {
	var canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
	
		ctx.beginPath();
		ctx.moveTo(x+83-83, y+116-116);
		ctx.lineTo(x+83-83, y+102-116);
		ctx.bezierCurveTo(x+83-83, y+94-116, x+89-83, y+88-116, x+97-83, y+88-116);
		ctx.bezierCurveTo(x+105-83, y+88-116, x+111-83, y+94-116, x+111-83, y+102-116);
		ctx.lineTo(x+111-83, y+116-116);
		ctx.lineTo(x+106.333-83, y+111.333-116);
		ctx.lineTo(x+101.666-83, y+116-116);
		ctx.lineTo(x+97-83, y+111.333-116);
		ctx.lineTo(x+92.333-83, y+116-116);
		ctx.lineTo(x+87.666-83, y+111.333-116);
		ctx.lineTo(x+83-83, y+116-116);
		ctx.fill();
	
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.moveTo(x+91-83, y+96-116);
		ctx.bezierCurveTo(x+88-83, y+96-116, x+87-83, y+99-116, x+87-83, y+101-116);
		ctx.bezierCurveTo(x+87-83, y+103-116, x+88-83, y+106-116, x+91-83, y+106-116);
		ctx.bezierCurveTo(x+94-83, y+106-116, x+95-83, y+103-116, x+95-83, y+101-116);
		ctx.bezierCurveTo(x+95-83, y+99-116, x+94-83, y+96-116, x+91-83, y+96-116);
		ctx.moveTo(x+103-83, y+96-116);
		ctx.bezierCurveTo(x+100-83, y+96-116, x+99-83, y+99-116, x+99-83, y+101-116);
		ctx.bezierCurveTo(x+99-83, y+103-116, x+100-83, y+106-116, x+103-83, y+106-116);
		ctx.bezierCurveTo(x+106-83, y+106-116, x+107-83, y+103-116, x+107-83, y+101-116);
		ctx.bezierCurveTo(x+107-83, y+99-116, x+106-83, y+96-116, x+103-83, y+96-116);
		ctx.fill();
	
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.arc(x+101-83, y+102-116, 2, 0, Math.PI * 2, true);
		ctx.fill();
	
		ctx.beginPath();
		ctx.arc(x+89-83, y+102-116, 2, 0, Math.PI * 2, true);
		ctx.fill();
	}
	}
  