function GomokuAi(BLACK,WHITE){
	this.BLACK=BLACK;
	this.WHITE=WHITE;
	this.callSetChess=function(chessMap){
        var result=this.think(chessMap);
        return result;
	}
	//分析棋局得出落子坐标
	this.think=function(chessMap,color){
		var x=Math.floor(Math.random()*15);
		var y=Math.floor(Math.random()*15);
        return {x:x,y:y};
	}

	

}