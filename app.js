
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
var userAccount = {};
userAccount['k'] = 'k';
var allGoodKeyboard = {"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"d":68,"b":66,"a":65,"s":83,"i":73,"f":70,"k":75,"+":187,"p":80,"o":79,"u":85,"z":90,"t":84,"r":82,"e":69,"w":87,"g":71,"h":72,"j":74,"l":76,"#":191,"y":89,"x":88,"c":67,"v":86,"n":78,"m":77,",":188,".":190,"-":189,"ArrowRight":39,"ArrowLeft":37,"ArrowUp":38,"ArrowDown":40,";":188,":":190,"'":191,"*":187,"Q":81,"W":87,"E":69,"R":82,"T":84,"Z":90,"S":83,"A":65,"D":68,"I":73,"U":85,"O":79,"Y":89,"X":88,"C":67,"F":70,"V":86,"G":71,"B":66,"H":72,"N":78,"J":74,"M":77,"K":75,"L":76,"P":80,"!":49,"/":55,"=":48};
var allPlaySettings;
var userLogIn ="";

var up;
var down;
var left;
var right;
var food_remain;
var smallColor;
var midColor;
var bigColor;
var max_time;
var monstersAmount;


function clearAllForms(){
	$("#registration-form").trigger("reset");
	$("#registration-form").data('validator').resetForm();
	$("#login-form").trigger("reset");
	$("#settings-form").trigger("reset");
	$("#settings-form").data('validator').resetForm();
}

// handle Dialog open and exit

function closeDialog(){
	document.getElementById("aboutDialog").close(); 
	$(document).off('click');// off click hendele, we dont need him
	$("#aboutDialog").off('keydown'); // off esc hendele, we dont need him
}

function openDialog(e){
	e.stopImmediatePropagation() // stop the click so the click listener not handle this click to get here.
	document.getElementById("aboutDialog").show();
	window.scrollTo(0, 0);
	outsideClickDialogHeandlear();
}

function outsideClickDialogHeandlear(){
	let ignoreClickOnMeElement = document.getElementById('aboutDialog');
	$(document).ready(function() {
		$(document).on('click' ,function(e) {
			let isClickInsideElement = ignoreClickOnMeElement.contains(e.target);
    		if (!isClickInsideElement) {
				closeDialog();
			}
		});
		$(document).on('keydown', function(e) {
    		if (e.which == 27) {
				closeDialog();
			}
		});
	 });
}

// changeing pages from cur to next: 
function moveTo(cur, next){
	if (cur == 'settingsPage' && document.getElementById('gamePage').style.display == ''){ //we are in game mode 
		exitGame();
	}
	let toHidde = document.getElementById(cur);
	toHidde.style.display = 'none';
	let toShow = document.getElementById(next);
	toShow.style.display = "";
	if (next == 'gamePage'){ 
		Start();
		window.scrollTo(0, 0);
		return;
	}
	clearAllForms(); //befor moving to diffrent page, clear all forms
}
// changeing pages to next when we dont know cur: 
function moveFromMenu(next){
	let allPotantiolCur = document.getElementsByClassName("page");
	let cur;
	for (let i =0; i< allPotantiolCur.length; i++){
		if (allPotantiolCur[i].style.display == ''){
			cur = allPotantiolCur[i].id;
			break;
		}
	}
	moveTo(cur,next);
}

// all forms hendaling using jquery
$(document).ready(function() {

	window.addEventListener("keydown", function(e) {
		if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
			e.preventDefault();
		}
	}, false);
	
	context = canvas.getContext("2d");

	// add methods to validate acoording to assignment
	$.validator.addMethod('validPassword', function(value, element) {
		return this.optional(element) || (value.match(/[a-zA-Z]/) && value.match(/[0-9]/));
	});
	$.validator.addMethod('validUserName', function(value, element) {
		return this.optional(element) || ! (value in userAccount);
	});
	$.validator.addMethod('validKeyboard', function(value, element) {
		return this.optional(element) ||  (value in allGoodKeyboard);
	});
	$.validator.addMethod('validFullName', function(value, element) {
		return this.optional(element) ||   !(/\d/.test(value));
	});
	$.validator.addMethod('keypress', function(value, element, param) {
		for (let i=0;i<3;i++){
			if (value == $(param[i]).val()){
				return false;
			}
		}
		return true;
  }, 'Invalid value');

	// registration form validation
	$("#registration-form").validate({
	  rules: {
		username : {
			required: true,
			validUserName: true
		  },
		password: {
			required: true,
			minlength: 6,
			validPassword: true
		},
		fullname : {
			required: true,
			validFullName:true
		},
		email: {
			required: true,
			email: true
		},
		date: {
			required: true
		}
	  },
	  messages : {
		username: {
			required: "Please enter your user name",
		  	validUserName: "The username you selected already exists in the system, please select another username"
		},
		password: {
			required: "Please enter your password",
		  	minlength: "The password must contain at least 6 characters",
		  	validPassword: "The password should include letters and numbers"
		},
		fullname : {
			required: "Please enter your full name",
			validFullName: "Please enter input without digit"
		},
		email: {
			required: "Please enter your mail",
		  	email: "The email should be in the format: abc@domain.tld"
		},
		date: {
			required: "Please enter your birthday"
		},
		submitHandler: function(form) {
			form.submit();}
	  }
	});
	// setting form validation
	$("#settings-form").validate({
		rules: {
			up: {
				required: true,
				validKeyboard: true,
				keypress: ['#down', '#left', '#right']
			},
			down: {
				required: true,
				validKeyboard: true,
				keypress: ['#up', '#left', '#right']
			},
			left: {
				required: true,
				validKeyboard: true,
				keypress: ['#down', '#up', '#right']
			},
			right: {
				required: true,
				validKeyboard: true,
				keypress: ['#down', '#left', '#up']
			},
			food : {
				required: true,
				min: 50,
				max: 90
			},
			time: {
			  required: true,
			  min: 60
			},
			monsters: {
				required: true,
				min: 1,
			  	max: 4
			}
		},
		messages : {
			up: {
				required: "Please enter key",
				validKeyboard: "Key not confirmed, select another key",
				keypress: 'Please do not select the same key for two or more different directions'
			},
			down: {
				required: "Please enter key",
				validKeyboard: "Key not confirmed, select another key",
				keypress: 'Please do not select the same key for two or more different directions'
			},
			left: {
				required: "Please enter key",
				validKeyboard: "Key not confirmed, select another key",
				keypress: 'Please do not select the same key for two or more different directions'
			},
			right: {
				required: "Please enter key",
				validKeyboard: "Key not confirmed, select another key",
				keypress: 'Please do not select the same key for two or more different directions'
			},
			food : {
				required: "Please enter number",
				min: "Please enter number greater than 49",
				max: "Please enter number less than 91"
			  },
			time: {
				required: "Please enter number",
				min: "Please enter number greater than 49"
			},
			monsters : {
				required: "Please enter number",
				min: "Please enter number greater than 0",
				max: "Please enter number less than 5"
			},
		}
	  });
	// submit forms
	$("#registration-form").submit(function(e){
		e.preventDefault(); 
		let form = $(this); 
		if(form.valid()){
			let allData = form.serializeArray();
			let newUserName = allData[0]["value"];
			let newPaaword = allData[1]["value"];
			userAccount[newUserName] = newPaaword;
			moveTo('registrationPage', 'welcomePage');
			alert("Registration was successful, please log in to continue");
		}

	});
	$("#login-form").submit(function(e){ 
		e.preventDefault(); 
		let theForm = $(this);
		let allData = theForm.serializeArray();
		let newUserName = allData[0]["value"];
		let newPaaword = allData[1]["value"];
		if (newUserName in userAccount && userAccount[newUserName] == newPaaword){
			moveTo('loginPage','settingsPage');
			userLogIn = newUserName;
			e.preventDefault(); 
		}
		else{
			alert("Please select a valid username and password");
			theForm.trigger("reset");
		}
	});
	$("#settings-form").submit(function(e){ 
		e.preventDefault(); 
		let form = $(this); 
		if(form.valid()){
			allPlaySettings = form.serializeArray();//store all settings
			let childs = document.getElementById("settingsPage").childNodes;
			disableForm(childs);// form become static and without button
			document.getElementById("settingsSubmit").style.display = 'none';
			document.getElementById("settingsRandom").style.display = 'none';
			moveTo('loginPage', 'gamePage');}
		});
  });

//show static form 
function disableForm(allChildren){
	for (let i=0 ;i<allChildren.length;i++){
		allChildren[i].disabled = true;
		disableForm(allChildren[i].childNodes);
	}
}
//show unstatic form
function inableForm(c){
	for (let i=0 ;i<c.length;i++){
		c[i].disabled = false;
		inableForm(c[i].childNodes);
	}
}

function exitGame(){
	//stop music
	audio.pause();
	// kill interval
	clearInterval(interval);
	//restart settings
	allPlaySettings = {}; // new Onject()
	//reset settingsForm
	let allChildren = document.getElementById("settingsPage").childNodes;
	inableForm(allChildren);
	document.getElementById("settingsSubmit").style.display = '';
	document.getElementById("settingsRandom").style.display = '';
	document.getElementById("settings-form").reset();
	document.getElementById("gamePage").style.display='none';
}
function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// let the user chhose key, change acocrding to user click
function uniCharCode(event, diraction) {
	var start = new Date().getTime();
    while (new Date().getTime() < start + 20);
	document.getElementById(diraction).value == '';
	document.getElementById(diraction).value = event.key;
}

// random settings
function fillRandomly() {
	document.getElementById('up').value = 'ArrowUp';
	document.getElementById('down').value = 'ArrowDown';
	document.getElementById('left').value = 'ArrowLeft';
	document.getElementById('right').value = 'ArrowRight';
	document.getElementById('food').value = randomNum(50,90);
	document.getElementById('color5poinets').value = "#" + Math.floor(Math.random()*16777215).toString(16);
	document.getElementById('color15poinets').value = "#" + Math.floor(Math.random()*16777215).toString(16);
	document.getElementById('color25poinets').value = "#" + Math.floor(Math.random()*16777215).toString(16);
	document.getElementById('time').value = randomNum(60,6000);
	document.getElementById('monsters').value = randomNum(1,4);
	$("#settings-form").valid(); // all coments will disaper because all inputs are valid

	return false; //not come back to welcomePage
}

	
//   game
var audio; 

function Start() {

	//set loged in user name
	document.getElementById("loginUserName1").value = userLogIn;
	document.getElementById("loginUserName1").disabled = true;

	//set red hearts
	for (var h = 1; h <= 5; h++ ){
		var id = "heart".concat(h.toString());
		document.getElementById(id).src = "img/heart_red.png";
	}
	
	//audio
	audio = document.getElementById("themeMusic");
	audio.volume = 0.2;
	audio.loop = true;
	audio.play();

	//setting adjustment
	up = allGoodKeyboard[allPlaySettings[0].value]; // ascii val
	down = allGoodKeyboard[allPlaySettings[1].value];
	left = allGoodKeyboard[allPlaySettings[2].value];
	right = allGoodKeyboard[allPlaySettings[3].value];
	food_remain = parseInt(allPlaySettings[4].value);
	smallColor = allPlaySettings[5].value;
	midColor = allPlaySettings[6].value;
	bigColor = allPlaySettings[7].value;
	max_time = parseInt(allPlaySettings[8].value);
	monstersAmount = parseInt(allPlaySettings[9].value);
	
	packman = {
		i : 0,
		j : 0,
		diraction : 4,
		color : "yellow",
		mouthOpen : true,
	};
	board = new Array();
	score = 0;
	start_time = new Date();
	movingPoints = {
		i : 7,
		j : 4,
		prev_val : 0,
		show : true,
		interval : 0,
	};
	monsterInterval = 0;
	monsters = new Array();
	liveRemained = 5;
	ballsNotEaten = food_remain;
	extraLive = {
		i : 0,
		j : 0,
		show : true,
		interval : 0,
		small : true,
	};
	timeAdder = {
		i : 0,
		j : 0,
		show : true,
	};

	var cnt = 100;
	var food_remain_big = parseInt(0.1*food_remain);
	var food_remain_mid = parseInt(0.3*food_remain);
	var food_remain_small = food_remain - food_remain_big - food_remain_mid;
	var pacman_remain = 1;
	
	//monsters:
	monstersLocations = [[0,0],[0,7],[13,0],[13,7]];
	for (var m = 0; m < monstersAmount; m++){
		var location = monstersLocations[m];
		monsters[m] = {i:location[0], j:location[1], prev_val:0,};
	}
	
	var walls = [[2,1],[2,2],[2,5],[2,6],[3,1],[3,6],[10,1],[10,6],[11,1],[11,2],[11,5],[11,6]];
	
	// numbers on board:
	//0 = pass.  1 = small food.  2 = mid food.  3 = big food.  4 = wall.  5 = packman.  movingPoints = 6.  monster = 7. exstraLife = 8.
	for (var i = 0; i < 14; i++) {
		board[i] = new Array();
		for (var j = 0; j < 8; j++) {
				
			if(
				(i == 0 && j == 0) ||
				(i == 0 && j == 7) ||
				(i == 13 && j == 0) ||
				(i == 13 && j == 7)
			){
				board[i][j] = 0;// we want to keep those places empty for the monsters
			}
			var isWall = false;	
			for (var w = 0; w < 12; w++){
				if ( walls[w][0] == i && walls[w][1] == j ){
					isWall = true;
					break;
				}
			}
			if (isWall){
				board[i][j] = 4;
			}
			else if(i == 7 && j == 4){
				board[i][j] = 6; // movingPoints
			}
			else {
				board[i][j] = 0;
				
			}
		}
	}
	

	for (var m = 0; m < monstersAmount; m++){ // locate the monsters
		board[monsters[m].i][monsters[m].j] = 7;
	}
	//place pac-man
	var pacCell = findRandomEmptyCell(board);
	packman.i = pacCell[0];
	packman.j = pacCell[1];
	board[packman.i][packman.j] = 5;

	//place food
	while (food_remain > 0){
		var emptyCell = findRandomEmptyCell(board);
		var i = emptyCell[0];
		var j = emptyCell[1];
		if (food_remain_small > 0){
			board[i][j] = 1;
			food_remain_small--;
		}
		else if (food_remain_mid > 0){
			board[i][j] = 2;
			food_remain_mid--;
		}
		else{
			board[i][j] = 3;
			food_remain_mid--;
		}
		food_remain--;
	}
	
	//place exstraLive
	if (extraLive.show){ 
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
	// for board 14x8
	var i = Math.floor(Math.random() * 14);
	if ( i == 14){ i = 13;}
	var j = Math.floor(Math.random() * 8);
	if ( j == 8){ j = 7;}
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 14);
		if ( i == 14){ i = 13;}
		j = Math.floor(Math.random() * 8);
		if ( j == 8){ j = 7;}
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[up]) {
		return 1;
	}
	if (keysDown[down]) {
		return 2;
	}
	if (keysDown[left]) {
		return 3;
	}
	if (keysDown[right]) {
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
	context.arc(x,y,23,0,Math.PI*2,true);
	context.fill();
	context.strokeStyle="grey";
	context.lineWidth=2;
	context.stroke();
	drawNumber(x,y);
	
	drawPointer(360*(h/12)+(m/60)*30-90,8,"black",3, x, y);
	drawPointer(360*(m/60)+(s/60)*6-90,12,"black",3, x, y);
	drawPointer(360*(s/60)+x-90,16,"grey",1, x, y);
}

function drawNumber(x,y){
	for(n=0;n<12;n++){
		d=-60;
		num = new Number(n+1);
		str = num.toString();
		dd = Math.PI/180*(d+n*30);
		tx = Math.cos(dd)*18+x -2;
		ty = Math.sin(dd)*18+y +1;
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
/// end clock drawing

function Draw(diraction) {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;

	lblTime.value = Math.floor(max_time - time_elapsed);
	if (lblTime.value <= 10){
		document.getElementById("lblTime").style.color = "#ff0000";
	}
	for (var i = 0; i < 14; i++) {
		for (var j = 0; j < 8; j++) {
			var center = new Object();
			center.x = i * 50 + 25;
			center.y = j * 50 + 25;

			if (board[i][j] == 9){ // time adder
				loop(center.x-2, center.y);
			}
			else if (board[i][j] == 8){ // exstra live
				
				context.beginPath();
				if (extraLive.small == true){ // beating heat - changes sizes
					var w = 32, h = 32;
				}
				else{
					var w = 36, h = 36;
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
				DrawMonster(center.x-20 , center.y+10);
			}
			else if (board[i][j] == 6) { // movingPoints
				var img = document.getElementById("bag50");
				context.drawImage(img, center.x-22, center.y-25);
			} 
			else if (board[i][j] == 5) { // pac-man
				//diraction: 1 = up.  2 = down.  3 = left.  4 = right
				
				context.beginPath();			
				if (diraction !== undefined){
					packman.direction = diraction;
				}
				
				if (packman.direction == 1){
					if(packman.mouthOpen){
						context.arc(center.x, center.y, 22, 0, 1.35 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 22, 1.65 * Math.PI, 2 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 22, 0, 1.45 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 22, 1.55 * Math.PI, 2 * Math.PI);
					}
				}
				else if(packman.direction == 2){
					if (packman.mouthOpen){
						context.arc(center.x, center.y, 22, 0, 0.35 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 22, 0.65 * Math.PI, 2 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 22, 0, 0.45 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 22, 0.55 * Math.PI, 2 * Math.PI);
					}
				}
				else if(packman.direction == 3){
					if (packman.mouthOpen){
						context.arc(center.x, center.y, 22, 0, 0.85 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 22, 1.15 * Math.PI, 2 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 22, 0, 0.95 * Math.PI);
						context.lineTo(center.x, center.y);
						context.arc(center.x, center.y, 22, 1.05 * Math.PI, 2 * Math.PI);
					}
				}
				else {
					if(packman.mouthOpen){
						context.arc(center.x, center.y, 22, 0.15 * Math.PI, 1.85 * Math.PI);
					}
					else{
						context.arc(center.x, center.y, 22, 0.05 * Math.PI, 1.95 * Math.PI);
					}
					
					
				}
				
				context.lineTo(center.x, center.y);
				context.fillStyle = packman.color; //color
				context.fill();
				context.beginPath();
				if ( packman.direction == 1 ){
					context.arc(center.x - 12, center.y - 3, 4, 0, 2 * Math.PI); // circle
				}
				else if ( packman.direction == 2 ){
					context.arc(center.x + 12, center.y + 3, 4, 0, 2 * Math.PI); // circle
				}
				else if ( packman.direction == 3 ){
					context.arc(center.x - 3, center.y - 12, 4, 0, 2 * Math.PI); // circle
				}
				else{
					context.arc(center.x + 3, center.y - 12, 4, 0, 2 * Math.PI); // circle
				}

				
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) { // food small
				context.beginPath();
				context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
				context.fillStyle = smallColor; //color
				context.fill();
				//text
				context.font = "10px Verdana";
				context.fillStyle = "black";
				context.fillText("5", center.x -3, center.y + 3);
			} else if (board[i][j] == 2 ) { // food mid
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = midColor; //color
				context.fill();
				//text
				context.font = "10px Verdana";
				context.fillStyle = "black";
				context.fillText("15", center.x -6, center.y + 3);
			} else if (board[i][j] == 3 ) { // food big
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = bigColor; //color
				context.fill();	
				//text
				context.font = "10px Verdana";
				context.fillStyle = "black";
				context.fillText("25", center.x -6, center.y + 3);
			} else if (board[i][j] == 4) { // wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 50, 50);
				context.fillStyle = "rgb(97, 85, 173)"; //color
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
		if ( monster.j < packman.j && !( moved ) ){
			if (board[monster.i][monster.j+1] == 5){
				restart();
			} else if (board[monster.i][monster.j+1] <= 3){
				board[monster.i][monster.j] = monster.prev_val; // return the board to the value it was before
				monster.prev_val = board[monster.i][monster.j+1]; // keep for later
				monster.j++;
				board[monster.i][monster.j] = 7;
			}
		}
		else if ( monster.j > packman.j &&(!(moved)) ){
			if (board[monster.i][monster.j-1] == 5){
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

	if((j != 0 && board[i][j - 1] <= 3) || (j != 8 && board[i][j + 1] <= 3) || ( i != 0 && board[i - 1][j] <= 3) || ( i != 14 && board[i + 1][j] <= 3) ){
		//there is a place to move to
		while (true){
			i = movingPoints.i;
			j = movingPoints.j;
			var moveTo = Math.floor(Math.random() * (4 - 1 + 1) ) + 1; // = 1/2/3/4 (maybe 0 - it will go to 4)
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
			if (i >= 0 && i <= 13 && j >= 0 && j <= 7){
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


function ChangeHeartColor(toWhite){
	var id = "heart".concat(liveRemained.toString());
	if (toWhite){
		document.getElementById(id).src = "img/heart_white.png";

		var music = document.getElementById("loseLive");
		music.play();
	}
	else{
		document.getElementById(id).src = "img/heart_red.png";
		var winObject = document.getElementById("winObject");
		winObject.play();
	}
}

function restart(){

	//make curent heart red
	ChangeHeartColor(true);
	liveRemained--;
	score -= 10;

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
		board[monster.i][monster.j] = monster.prev_val;
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

	//pac-man
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
		if (packman.j < 7 && board[packman.i][packman.j + 1] != 4) {
			packman.j++;//down
		}
	}
	if (x == 3) {
		if (packman.i > 0 && board[packman.i - 1][packman.j] != 4) {
			packman.i--;//left
		}
	}
	if (x == 4) {
		if (packman.i < 13 && board[packman.i + 1][packman.j] != 4) {
			packman.i++;//right
		}
	}

	var pointAudio = document.getElementById("eatPointAudio");

	var cellVal = board[packman.i][packman.j]
	if (cellVal == 1) {
		pointAudio.play();
		score += 5;
		ballsNotEaten--;
	} else if (cellVal == 2){
		pointAudio.play();
		score += 15;
		ballsNotEaten--;
	} else if (cellVal == 3){
		pointAudio.play();
		score += 25;
		ballsNotEaten--;
	} else if(cellVal == 6){
		var winObject = document.getElementById("winObject");
		winObject.play();
		movingPoints.show = false;
		score += 50;
		if(movingPoints.prev_val != 0){
			score += movingPoints.prev_val; // the points that were here before
			ballsNotEaten--;
		}		
	} else if (cellVal == 7){ // monster
		restart();
	} else if(cellVal == 8){ // exstra live
		extraLive.show = false;
		if (liveRemained < 5){ // cant have more then 5 lives
			liveRemained++;
			ChangeHeartColor(false);
		}
	} else if ( cellVal == 9){ // time adder
		var winObject = document.getElementById("winObject");
		winObject.play();
		timeAdder.show = false;
		max_time += 10; // add 10 sec
	}
	board[packman.i][packman.j] = 5;

	//update packman mouth - every interval
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
	if ( time_elapsed >= max_time ){ // time over
		audio.pause();
		window.clearInterval(interval);
		if (score < 100){
			window.alert("you are better than ".concat( score.toString() ).concat(" points!"));
		}
		else{
			window.alert("Winner!!!"); 
		}	
	}
	else if (ballsNotEaten == 0) { 
		audio.pause();
		window.clearInterval(interval);
		window.alert("Well done - game completed with ".concat(score.toString()).concat(" points!"));
	} else if (liveRemained == 0) {
		audio.pause();
		window.clearInterval(interval);
		window.alert("Loser!");
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
  