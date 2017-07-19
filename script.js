var ImgLevels = new Array();
var nodeArray = new Array();
var edgeArray = new Array();
var pic = new Image();
var camerax=cameray=0;
var running
var FRAME_INTERVAL=30
var nextId=0
var edgeId=0
var ptrSelectedNode;
var selected
var submitRename;
var inputLabel;
var lastInsert=null;
var showLabel=-1; //show labels of nodes

var commandCode="InsertNode"
dimCanvas()

var canvas = document.getElementById("maincanvas")
var ctx = canvas.getContext("2d")
ctx.font="20px Georgia";


function sub(){
	pic.src=document.getElementById("picField").value;
	running=setInterval(update,FRAME_INTERVAL);
}

function update(){
	
	ctx.drawImage(pic,-camerax,-cameray)
	for(i=0; i<edgeArray.length; i++){
		edgeArray[i].draw();
	}
	for(i=0; i<nodeArray.length; i++){
		nodeArray[i].draw();
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

    console.log(event.keyCode)
},false);

function Node(idd,string,ax,ay){
	this.id=idd;
	this.label=string;
	this.x=ax;
	this.y=ay;
	this.active=true

	this.setInfoPanel=function(){
		document.getElementById("infoLabel").innerHTML="Selected: Node "+this.label+" id:"+this.id+" at "+this.x+","+this.y;

	}

	this.draw=function(){
		ctx.beginPath();
		ctx.arc(this.x-camerax,this.y-cameray,20,0,2*Math.PI);
		if(this.active==true){
			this.setInfoPanel()
			ctx.fillStyle="#00aa00"
		}
		else
			ctx.fillStyle="#808080"
		ctx.fill();
		ctx.fillStyle="#000000"
		ctx.fillText(this.id+" ",this.x-camerax-5,this.y-cameray+5)
		if(showLabel==1){
			ctx.fillText(this.label,this.x-camerax+22,this.y-cameray)

		}
	}
}
function Edge(idd,from,to){
	this.l1=from;
	this.l2=to;
	this.id=idd;
	this.active=false;

	this.draw=function(ctx){
		ctx.moveTo(this.l1.x-camerax,this.l1.y-cameray)
		//@TODO active or not fill style
		ctx.fillStyle("#808080")
		//
		ctx.lineTo(this.l2.x-camerax,this.l2.y-cameray)
		ctx.stroke()

	}
	this.getX=function(){return abs(this.l1.x-this.l2.x)/2;}
	this.getY=function(){return abs(this.l1.y-this.l2.y)/2;}
}

function addNode(x,y){
	lastInsert=selected
	n = new Node(nextId,"default label",x+camerax,y+cameray)
	changeSelected(n)
	nodeArray.push(n)
	nextId++;
	if(lastInsert!=null)
	makeEdge(lastInsert,selected);
}

function makeEdge(nf,nt){
	console.log("here")
	e = new Edge(edgeId,nf,nt);
	edgeId++;
	edgeArray.push(n)

}

document.getElementById('maincanvas').addEventListener('click',function(evt){
	if(evt.which==1){
		if(commandCode=="InsertNode")
			addNode(evt.clientX,evt.clientY)
		else if(commandCode="SelectNode"){
			n=findNodeNear(evt.clientX,evt.clientY)
			changeSelected(n)

		}

	}



},false);

//changes currently selected element
function changeSelected(n){
	if(selected!=null){
		selected.active=false
	}
	selected=n
	selected.active=true

}

//finds nearest node to argument x y (with draw "notation")
function findNodeNear(viewx,viewy){
	//transform coords
	xt=viewx+camerax
	yt=viewy+cameray
	if(nodeArray.length>1){
		nearestNode=nodeArray[0]
	}
	nearDist = dist(nearestNode.x,nearestNode.y,xt,yt)
	for(i=0;i<nodeArray.length;i++){		//one loop wasted, lazyness
		candidateNode = nodeArray[i]
		candDist=dist(candidateNode.x, candidateNode.y,xt,yt)
		if(candDist<nearDist){
			nearDist=candDist
			nearestNode=candidateNode
		}

	}
	return nearestNode

}

function dist(ax,ay,bx,by){ 
	a= Math.pow((ax-bx),2)
	b = Math.pow((ay-by),2)
	return (a+b);
}

function updateCommandInfo(){
	actionNode = document.getElementById("actions")
	if(commandCode=="SelectNode"){
		actionNode.innerHTML=" Rename Node "
		actionNode.appendChild(inputLabel)
		actionNode.appendChild(submitRename)
		actionNode.appendChild(submitRename)

	}
	else if(commandCode=="InsertNode"){
		actionNode.innerHTML=" Click to Insert Node"
		while (actionNode.secondChild) {
		    actionNode.removeChild(myNode.secondChild);
		}
	}

}

function switchLabels(){
	showLabel*=-1
	if(showLabel>0)
		document.getElementById("buttonShowLabel").style="background-color: #00dd00;"
	else
		document.getElementById("buttonShowLabel").style="background-color: #ee0000;"

}

initButtons()
function initButtons(){

  	submitRename = document.createElement("button");
	submitRename.style="margin-left:15px;"
	submitRename.innerHTML = "Remove"
	submitRename.onclick = function() { 
		if(selected){
			selected.label=inputLabel.value
			inputLabel.value=" "
		}
  	};
  	submitRename.innerHTML="Submit label"
  	inputLabel = document.createElement("input")
  	inputLabel.type="text"
  	inputLabel.style="padding-left:10px;"
  	if(selected)
  		inputLabel.value = selected.label
	
}

function removeSelectedNode(){
		index = nodeArray.indexOf(selected)
		if(index>-1)
			nodeArray.splice(index,1)
		selected=null
}

function setMode(calee,arg){
	commandCode=arg
	updateCommandInfo();

	otherButtons = document.getElementById("middle").children;
	console.log(otherButtons)
	for(i=0; i<otherButtons.length;i++){
		console.log(otherButtons[i])
		otherButtons[i].style="background-color: initial;"
	}
	calee.style = "background-color: #00dd00;"
}

function dimCanvas(){
	d=document.getElementsByTagName("body")[0]
	wi=d.clientWidth;
	he=d.clientHeight;
	canvas = document.getElementById("maincanvas")
	canvas.width=wi
	canvas.height=he-100

}