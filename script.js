var ImgLevels = new Array();
var nodeArray = new Array();
var pic = new Image();
var camerax=cameray=0;
var running
var FRAME_INTERVAL=30
var nextId=0
var ptrSelectedNode;
var selected

var canvas = document.getElementById("maincanvas")
var ctx = canvas.getContext("2d")
function sub(){
	pic.src=document.getElementById("picField").value;
	running=setInterval(update,FRAME_INTERVAL);
}

function update(){
	
	ctx.drawImage(pic,-camerax,-cameray)
	for(i=0; i<nodeArray.length; i++){
		nodeArray[i].draw(ctx);
	}

}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
       camerax-=20
    }
    else if(event.keyCode == 39) {
        camerax+=20
    }
    else if(event.keyCode == 40) {
       cameray+=20
    }
    else if(event.keyCode == 38) {
        cameray-=20
    }
    else if(event.keyCode == 83) { // s
		console.log("ASDASD")    
		var e = window.event;

    var posX = e.clientX;
    var posY = e.clientY;
		//@TOTEST selezionare nodo sotto al mouse (o a distanza di 20 px)
		changeSelected(findNodeNear(event.clientX,event.clientY))
    }
    console.log(event.keyCode)
},false);

function Node(idd,string,ax,ay){
	this.id=idd;
	this.label=string;
	this.x=ax;
	this.y=ay;
	this.active=true
	this.links = new Array();

	this.setInfoPanel=function(){
		document.getElementById("infoLabel").innerHTML="Selected: Node at "+this.x+","+this.y;

	}

	this.draw=function(ctx){
		ctx.beginPath();
		ctx.arc(this.x-camerax,this.y-cameray,20,0,2*Math.PI);
		if(this.active==true){
			console.log("should be red")
			this.setInfoPanel()
			ctx.fillStyle="#FF0000"
		}
		else
			ctx.fillStyle="#000000"
		ctx.fill();
	}
}

function addNode(x,y){
	n = new Node("",nextId,x+camerax,y+cameray)
	changeSelected(n)
	nodeArray.push(n)
	nextId++;
}

document.getElementById('maincanvas').addEventListener('click',function(evt){
	console.log(evt.clientX + ',' + evt.clientY);
	if(evt.which==1){
		addNode(evt.clientX,evt.clientY)
	}



},false);

//changes currently selected element
function changeSelected(n){
	if(selected!=null){
		selected.active=false
	}
	selected=n

}

//finds nearest node to argument x y (with draw "notation")
function findNodeNear(viewx,viewy){
	//transform coords
	var xt=viewx+camerax
	yt=viewy+cameray
	if(nodeArray.length>0)
		nearestNode=nodeArray[0]
	nearDist = dist(nearestNode.x,nearestNode.y,xt,yt)
	console.log(xt,yt,nearDist)
	for(i=0;i<nodeArray.length;i++){		//one loop wasted, lazyness
		candidateNode = nodeArray[i]
		candDist=dist(candidateNode.x, candidateNode.y,xt,yt)
		if(candDist<nearDist){
			nearDist=candDist
			nearestNode=candidateNode
		}

	}


}

function dist(ax,ay,bx,by){ 
	a= Math.pow((ax-bx),2)
	b = Math.pow((ay-by),2)
	console.log(a,b,a+b)
	return (a+b);
}
/*



console.log("ciao")

var WIN_X=600
var WIN_Y=500
var AL_ROWS=6
var AL_COLS=10
var FRAME_INTERVAL=50
var loadArray={}
var al_direction=1;
var aliens = new Array()
var al_speed=1
var play;
var key_dir=0
var key_space=0
var ship;

loadArray["alien"]=false
loadArray["ship"]=false
//loadArray["las"]=false

console.log(loadArray)


var info = document.getElementById("textInfo")
var pause_button = document.getElementById("pause")
//init matrix alienz
var allAl = new Array(AL_ROWS)
for(i=0;i<AL_ROWS;i++)
	allAl[i]=new Array(10)
var x_off=0
var y_off=0

var alien_sprite = new Image(198,198)
alien_sprite.src='./a4.png'
var ship_sprite = new Image(60,30)
ship_sprite.src='./ship.png'
ship_sprite.onload=function(){
	loadArray["ship"]=true
	checkLoad()
}

function Shot(ax,ay){
	this.x=ax
	this.y=ay

	this.draw=function(ctx){
		ctx.drawImage(ship_sprite,30,0,30,30,this.x,this.y,30,30)
	}
	this.update=function(){
		this.y-=10
		if(this.y<=-30)
			return 1
		//check alieni collisione
		return 0
	}
}

function Ship(){
	this.x=WIN_X/2-15;
	this.y=WIN_Y-30
	this.shots=new Array()

	this.update=function(){
		//input
		this.x+=key_dir
		if(this.x>WIN_X-30)
			this.x=WIN_X-30
		else if(this.x<1)
			this.x=1
		console.log("dir in this frame: "+key_dir)
		key_dir=0
		if(key_space==true){
			if(this.shots.length<3){
				this.shots.push(new Shot(this.x,WIN_Y-30))
				console.log("fire")
				key_space=false
			}
		}
		//end input
		for(i=0; i<this.shots.length;i++){
			if(this.shots[i].update()){
				this.shots.splice(i,1)
				i-=1
			}
		}

	}

	this.draw=function(ctx){
		//@TODO ship sprite
		ctx.drawImage(ship_sprite,0,0,30,30,this.x,this.y,30,30)
		for(i=0; i<this.shots.length;i++){
			this.shots[i].draw(ctx)
		}
	}



}

function Alien(a,b,ia=parseInt((Math.random()*10)%6)){
	this.x=a
	this.y=b
	this.img_type_x=ia

	this.draw_alien = function(ctx){

		ctx.drawImage(alien_sprite,33*this.img_type_x,0,33,33,this.x,this.y,30,30);
	}

	this.alien_check=function(){

	//chk colpito

	//spara?
	}

	this.check_lato = function(){
		if((this.x>=575 || this.x<=15)){
			for(i=0; i<aliens.length; i++){
				aliens[i].y+=15
			}
			return true;
		}

		return false

	}
	this.move = function move() {
		this.x+=al_speed * al_direction
	}

}

function start(){
	prova()
}

function check_aliens_lato(){
	for(x=0; x<aliens.length; x+=1){
		if(aliens[x].check_lato()){
			al_direction*=-1;
			break;
		}
	}
}

//checks all sprites loaded
function checkLoad(){
	go=true
	for( var key in loadArray){
		if(loadArray[key]==false){
			go=false;
			break;
		}
	}
	if(go){
		start()
	}
}

function writeInfo(stringa){
	info.innerHTML=stringa

}

function prova(){
	var ctx = canvas.getContext("2d")

	place_aliens()
	ship = new Ship()

	play=setInterval(update,FRAME_INTERVAL)

}

function pause_button_function(){
	if(pause_button.innerHTML=="Ok, ci sono"){
		console.log("resumed")
		resume_game()
	}
	else{
		console.log("paused")
		pause_game()
	}

}

function pause_game(){
	pause_button.innerHTML="Ok, ci sono"
	clearInterval(play)

}

function resume_game(){
	pause_button.innerHTML="   PAUSA   "
	play=setInterval(update,FRAME_INTERVAL)

}

function place_aliens(){
	for(i=0; i<AL_ROWS;i++){
		for(j=0; j<AL_COLS;j++){
			aliens.push(new Alien(j*50+31,i*30))
		}
	}
	console.log(aliens)
}

function update_aliens_pos(){
	for(x=0; x<aliens.length; x+=1){
		aliens[x].move()
	}
}

function update(){
	var ctx = canvas.getContext("2d")
	//fai i controlli
	check_aliens_lato()
	//controlla alieno colpito

	//aggiorna la posizioni
	update_aliens_pos()
	ship.update()

	//disegna
	ctx.fillStyle="#000000"
	ctx.fillRect(0,0,600,500)	
	for(x=0; x<aliens.length; x+=1){
		aliens[x].draw_alien(ctx)
	}
	ship.draw(ctx)

}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        key_dir-=5
    }
    else if(event.keyCode == 39) {
        key_dir+=5
    }
    if(event.keyCode==67)
    	key_space=true
    console.log(event.keyCode)
},false);




alien_sprite.onload=function(){
	loadArray["alien"]=true;
	console.log("alien sprite loaded")
	checkLoad()
}
*/