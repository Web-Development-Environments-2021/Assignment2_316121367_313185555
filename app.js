
var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var userAccount = {};
userAccount['k'] = 'k';
var allGoodKeyboard = {"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"d":68,"b":66,"a":65,"s":83,"i":73,"f":70,"k":75,"+":187,"p":80,"o":79,"u":85,"z":90,"t":84,"r":82,"e":69,"w":87,"g":71,"h":72,"j":74,"l":76,"#":191,"y":89,"x":88,"c":67,"v":86,"n":78,"m":77,",":188,".":190,"-":189,"ArrowRight":39,"ArrowLeft":37,"ArrowUp":38,"ArrowDown":40,";":188,":":190,"'":191,"*":187,"Q":81,"W":87,"E":69,"R":82,"T":84,"Z":90,"S":83,"A":65,"D":68,"I":73,"U":85,"O":79,"Y":89,"X":88,"C":67,"F":70,"V":86,"G":71,"B":66,"H":72,"N":78,"J":74,"M":77,"K":75,"L":76,"P":80,"!":49,"/":55,"=":48};
var allPlaySettings;


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
	}
	
}
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
		e.preventDefault(); //saves the account?
		let form = $(this); 
		if(form.valid()){
			let allData = form.serializeArray();
			let newUserName = allData[0]["value"];
			let newPaaword = allData[1]["value"];
			userAccount[newUserName] = newPaaword;
			form.trigger("reset");
			moveTo('registrationPage', 'welcomePage');
			alert("Registration was successful, please log in to continue");
		}

	});
	$("#login-form").submit(function(e){ 
		e.preventDefault(); //saves the account?
		let theForm = $(this);
		let allData = theForm.serializeArray();
		let newUserName = allData[0]["value"];
		let newPaaword = allData[1]["value"];
		if (newUserName in userAccount && userAccount[newUserName] == newPaaword){
			moveTo('loginPage','settingsPage');
			theForm.trigger("reset");
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
	//restart settings
	allPlaySettings = new Object();
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

function uniCharCode(event, diraction) {
	var start = new Date().getTime();
    while (new Date().getTime() < start + 20);
	document.getElementById(diraction).value == '';
	document.getElementById(diraction).value = event.key;
}

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
	return false; //not come back to welcomePage
}

	
//   game- eden

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
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
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
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

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}
