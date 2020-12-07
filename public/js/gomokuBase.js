var gameCon;
var WHITE=1;
var BLACK=10;
var NO_COLOR=0;//无子值
var globalParams={
	start_x:4,//棋盘开始位置
	start_y:4,//棋盘开始位置
    chessman_Btw:35,//棋子间距
    playerColor:BLACK,//玩家走子顺序1,2
    playerNum:1,
    drawing:$('#drawing')[0],
    position:$('#position')[0]
}
$(function(){
	imgLoader({
		qipanSrc:"../img/game/qipan.jpg",
		chessManSrc_black:"../img/game/chessman_black.png",
        chessManSrc_white:"../img/game/chessman_white.png",
        chessManSrc_black_red:"../img/game/chessman_black_red.png",
		chessManSrc_white_red:"../img/game/chessman_white_red.png",
		loadFinish:gameIni});

});     


function backChess(){
    gameCon.backChess();
}

//鼠标左键点击事件
function onLeftMouseDown(e){
	if(0==e.button){
		var x;
		var y;
		/*if((e.pageX==e.layerX)||(e.pageY==e.layerY)){//兼容浏览器
           var locParams=getPointOnCanvas(globalParams.drawing,e.pageX,e.pageY);
           x=locParams.x;
           y=locParams.y;
		}else{
			x=e.layerX;
	        y=e.layerY;
		}*/

		var locParams=getPointOnCanvas(globalParams.drawing,e.pageX,e.pageY);
		x=locParams.x;
		y=locParams.y;
		
        var chessX=Math.floor((x-globalParams.start_x)/globalParams.chessman_Btw);
	    var chessY=Math.floor((y-globalParams.start_y)/globalParams.chessman_Btw);

        gameCon.setChess(chessX,chessY,globalParams.playerColor);
		}
}

function onMyMouseMove(e){
    var locParams=getPointOnCanvas(globalParams.drawing,e.pageX,e.pageY);
		x=locParams.x;
        y=locParams.y;
        var chessX=Math.floor((x-globalParams.start_x)/globalParams.chessman_Btw);
	    var chessY=Math.floor((y-globalParams.start_y)/globalParams.chessman_Btw);
    globalParams.position.innerText='( '+chessX+' , '+chessY+' )';
}


function Painter(params){

	this.ct=params.ct,
    this.imgObj=params.imgObj;
    
    this.qipanX=params.imgObj.imgQipan.width;
    this.qipanY=params.imgObj.imgQipan.height;
    this.chessX=params.imgObj.imgBlack.width;
    this.chessY=params.imgObj.imgBlack.height;

    this.sizeR=params.sizeR||1;

    this.qipanDX=this.qipanX*this.sizeR;
    this.qipanDY=this.qipanY*this.sizeR;
    this.chessDX=this.chessX*this.sizeR;
    this.chessDY=this.chessY*this.sizeR;

    this.chessMap=params.chessMap||getChessMap(15,15);

    this.paint=function(){
    	this.paintBackground();
    };

/*    this.paintPoint=function(x,y){
    	var startX=x-this.chessDX/2;
    	var startY=y-this.chessDY/2;
    	this.paintBackground();
    }*/

    this.paintChess=function(x,y,chess,currentX,currentY){
    	var start_x=globalParams.start_x;
	    var start_y=globalParams.start_y;
        var chessman_Btw=globalParams.chessman_Btw;
        
        var thisX=start_x+chessman_Btw*x;
        var thisY=start_x+chessman_Btw*y;

        if(typeof(currentX)!="undefined"&&x === currentX &&y === currentY && WHITE==chess){
            this.ct.drawImage(this.imgObj.imgWhiteRed, 0, 0,this.chessX,this.chessY,
                thisX,thisY,this.chessDX,this.chessDY);
        }else if(typeof(currentY)!="undefined"&&x === currentX &&y === currentY  && BLACK==chess){
            this.ct.drawImage(this.imgObj.imgBlackRed, 0, 0,this.chessX,this.chessY,
                thisX,thisY,this.chessDX,this.chessDY);
        }else if(WHITE==chess){
           this.ct.drawImage(this.imgObj.imgWhite, 0, 0,this.chessX,this.chessY,
           	thisX,thisY,this.chessDX,this.chessDY);
    	}else if(BLACK==chess){
           this.ct.drawImage(this.imgObj.imgBlack, 0, 0,this.chessX,this.chessY,
           	thisX,thisY,this.chessDX,this.chessDY);
    	}
        
    }

    // 当前落子点 x,y
    this.rePaintAll=function(x,y){
    	this.paintBackground();
    	for(var i=this.chessMap.length-1;i>=0;i--){
    		var thisVal=this.chessMap[i];
    		for(var j=thisVal.length-1;j>=0;j--){
                 this.paintChess(i,j,thisVal[j],x,y);
    		}
    	}
    }

    this.paintBackground=function(){
    	this.ct.drawImage(this.imgObj.imgQipan, 0, 0,this.qipanX,this.qipanY,0,0,this.qipanDX,this.qipanDY);
    }
}

function gameIni(imgObj){
	var drawing=globalParams.drawing;
	if(drawing.getContext){
		
		var ct=drawing.getContext('2d');	

		var painter=new Painter({
		ct:ct,
		imgObj:imgObj});

        //创建游戏控制器
		gameCon=new GameController({
            painter:painter,
            BLACK:BLACK,
            WHITE:WHITE,
            NO_COLOR:NO_COLOR
		});
        
        
        drawing.onmousedown = onLeftMouseDown;
        //鼠标移动
        drawing.onmousemove = onMyMouseMove;
        
        //初始化游戏
		gameCon.ini();
	}
}

function imgLoader(params){
    qipanSrc=params.qipanSrc;
    chessManSrc_black=params.chessManSrc_black;
    chessManSrc_white=params.chessManSrc_white;
    chessManSrc_black_red=params.chessManSrc_black_red;
    chessManSrc_white_red=params.chessManSrc_white_red;
    imgLoadNum=0;
    loadFinish=params.loadFinish||function(){
		console.log('未指定图片加载完成回调函数');
	}
	var imgObj=new Object();
    var imgQipan=new Image();
    var imgBlack=new Image();
    var imgWhite=new Image();
    var imgBlackRed=new Image();
    var imgWhiteRed=new Image();

    imgObj.imgQipan=imgQipan;
    imgObj.imgBlack=imgBlack;
    imgObj.imgWhite=imgWhite;
    imgObj.imgBlackRed=imgBlackRed;
    imgObj.imgWhiteRed=imgWhiteRed;

    imgNum=imgObj.imgObj;

    imgQipan.src=qipanSrc;
    imgBlack.src=chessManSrc_black;
    imgWhite.src=chessManSrc_white;
    imgBlackRed.src=chessManSrc_black_red;
    imgWhiteRed.src=chessManSrc_white_red;

    imgObj.length=-1;
    for(var ele in imgObj){
        imgObj.length++;
    }

    for(var ele in imgObj){
        imgObj[ele].onload=function(){
       	    imgLoadNum++;
    	    if(imgLoadNum>=imgObj.length){
                loadFinish(imgObj);
	        }
       }
   }
}

function getChessMap(x,y){
	var chessMap=new Array();
		for(var i=0;i<x;i++){
			var thisVal=chessMap[i]=new Array();
			for(var j=0;j<y;j++){
                thisVal[j]=NO_COLOR;
			}
		}
    return chessMap;
}

//根据获取的相对屏幕的相对位置获取相对于容器的相对位置
function getPointOnCanvas(canvas, x, y) {
    var bbox =canvas.getBoundingClientRect();
    return { x: x- bbox.left *(canvas.width / bbox.width),
            y:y - bbox.top  * (canvas.height / bbox.height)
            };
}

//demo
/*ct.beginPath();
        ct.fillStyle='#ff0000';
        ct.strokeStyle='#ff0000';*/
        //ct.fillRect(10,10,50,50);
        //ct.moveTo(0,0);
        //ct.lineTo(40,20);
        //ct.stroke();

        /*ct.beginPath();
        	ct.fillStyle='#ff0000';
        	ct.fillRect(10,10,50,50);*/
	
