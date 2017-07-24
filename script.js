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
var removeNode;
var deleteEdge;
var deleteEdgeBool=false;
var inputLabel;
var lastInsert=null;
var showLabel=-1; //show labels of nodes
var lastNodeClicked = null;

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

	this.draw=function(){
		ctx.beginPath();
		ctx.moveTo(this.l1.x-camerax,this.l1.y-cameray);
		ctx.lineTo(this.l2.x-camerax,this.l2.y-cameray);
		ctx.stroke();
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
	addEdge(lastInsert,selected);
}

function removeSelectedNode(){
		index = nodeArray.indexOf(selected)
		if(index>-1)
			nodeArray.splice(index,1)
		selected=null
}

function addEdge(nf,nt){
	e = new Edge(edgeId,nf,nt);
	if(addEdgeSanityCheck(e)){
		edgeId++;
		edgeArray.push(e)
	}
}

function removeEdge(nf,nt){
	from=nf 
	to=nt
	for(i=0; i<edgeArray.length;i++){
		for(j=0; j<2; j++,temp=from,from=to,to=temp){					// node a to node b and b to a also
			if(edgeArray[i].l1==from && edgeArray[i].l2==to){ 
				edgeArray.splice(i,1)
				lastNodeClicked=null;
				changeSelected(null)
				return;
			}
		}
	}	

}
//CLICK EVENT
document.getElementById('maincanvas').addEventListener('click',function(evt){
	if(evt.which==1){
		if(commandCode=="InsertNode")
			addNode(evt.clientX,evt.clientY)
		else if(commandCode=="SelectNode"){
			n=findNodeNear(evt.clientX,evt.clientY)
			changeSelected(n)
		}
		else if(commandCode=="LinkNode"){
			console.log("here")
			if( lastNodeClicked==null){
				lastNodeClicked=findNodeNear(evt.clientX,evt.clientY)
				changeSelected(lastNodeClicked)
			}
			else{
				n = findNodeNear(evt.clientX,evt.clientY)
				if(n.id != lastNodeClicked.id){
					if(!deleteEdgeBool)
						addEdge(n,lastNodeClicked);	
					else
						removeEdge(n,lastNodeClicked);
				}
				lastNodeClicked=null;		//clear selected node
			}
		}

	}



},false);

//changes currently selected element
function changeSelected(n){
	if(selected!=null){
		selected.active=false
	}
	if(n!=null){
		selected=n
		selected.active=true
	}

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

//checks if edge alredy exists
function addEdgeSanityCheck(e){
	from=e.l1
	to=e.l2
	for(i=0; i<edgeArray.length;i++){
		for(j=0; j<2; j++,temp=from,from=to,to=temp){					// node a to node b and b to a also
			if(edgeArray[i].l1==from && edgeArray[i].l2==to){ 
				alert("Edge alredy exists, with id: "+edgeArray[i].id);
				return false;
			}
		}
	}
	return true;

}

function dist(ax,ay,bx,by){ 
	a= Math.pow((ax-bx),2)
	b = Math.pow((ay-by),2)
	return (a+b);
}

function updateCommandInfo(){
	actionNode = document.getElementById("actions")
	changeSelected(null)
	while (actionNode.secondChild) {
		console.log(secondChild.id)
	    actionNode.removeChild(myNode.secondChild);
	}
	if(commandCode=="SelectNode"){
		actionNode.innerHTML=" Rename Node "
		actionNode.appendChild(inputLabel)
		actionNode.appendChild(submitRename)
		actionNode.appendChild(removeNode);

	}
	else if(commandCode=="InsertNode"){
		actionNode.innerHTML=" Click to Insert Node"
		actionNode.appendChild(removeNode);
	}
	else if(commandCode=="LinkNode"){
		actionNode.innerHTML=" Click on two nodes to link them"
		deleteEdgeBool=false;
		actionNode.appendChild(deleteEdge)
		lastNodeClicked=null;
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

  	deleteEdge = document.createElement("button");  	
	deleteEdge.style="margin-left:15px;"
	deleteEdge.innerHTML = "Delete Edges"
	deleteEdge.onclick = function() {
		changeSelected(null)
		lastNodeClicked=null;
		if(!deleteEdgeBool){
			deleteEdgeBool=true
			deleteEdge.style="margin-left:15px;background-color: #009900;"
		}
		else{
			deleteEdgeBool=false;
			deleteEdge.style="margin-left:15px;background-color:initial;"
		}
  	};

  	removeNode = document.createElement("button");  	
	removeNode.style="margin-left:15px;"
	removeNode.innerHTML = "Remove Node"
	removeNode.onclick = function() { 
		removeSelectedNode();
  	}
	
}


function setMode(calee,arg){
	commandCode=arg
	updateCommandInfo();

	otherButtons = document.getElementById("middle").children;
	for(i=0; i<otherButtons.length;i++){
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