var ImgLevels = new Array();
var nodeArray = new Array();
var pic = new Image();
var camerax=cameray=0;
var running
var FRAME_INTERVAL=30
var nextId=0
var ptrSelectedNode;
var selected

var commandCode="InsertNode"

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
    else if(event.keyCode == 83) { 		// s
		commandCode="SelectNode"
		updateCommandInfo();
    }
    else if(event.keyCode == 73) { 		// s
		commandCode="InsertNode"
		updateCommandInfo();
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
		document.getElementById("infoLabel").innerHTML="Selected: Node"+this.label+" id:"+this.id+" at "+this.x+","+this.y;

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
	n = new Node(nextId,"label",x+camerax,y+cameray)
	changeSelected(n)
	nodeArray.push(n)
	nextId++;
}

document.getElementById('maincanvas').addEventListener('click',function(evt){
	console.log(evt.clientX + ',' + evt.clientY);
	if(evt.which==1){
		if(commandCode=="InsertNode")
			addNode(evt.clientX,evt.clientY)
		else if(commandCode="SelectNode"){
			n=findNodeNear(evt.clientX,evt.clientY)
			console.log("id Selezionato",n.id,n)
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
	console.log(xt,yt,nearDist)
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
	console.log("dist",a,b,a+b,ax,ay,bx,by)
	return (a+b);
}

function updateCommandInfo(){
	document.getElementById("commandMode").innerHTML="Command Mode: "+commandCode
}