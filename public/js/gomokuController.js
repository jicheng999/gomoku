function GameController(params){
    this.WHITE=params.WHITE;
    this.BLACK=params.BLACK;
    this.NO_COLOR=params.NO_COLOR;
	this.painter=params.painter;
	this.chessMap=params.chessMap||getChessMap(15,15);
	this.players=params.players||[BLACK,WHITE];
	this.ai=params.ai;
	this.disabled=false;
    var stepNum=0;

    function Node(x,y,color,pre) {
        return {x:x,y:y,color:color,next:null,pre:pre};
    }

    // 落子记录
    this.history = new Node();

    this.pushHistory= function(x,y,color){
        var node = this.history;
        while(null !== node.next){
            node = node.next;
        }
        node.next = new Node(x,y,color,node);
        stepNum++;
    }

    // 回退
    this.backHistory = function(){
        if(0==stepNum){
            return null;
        }
        var node = this.history;
        while(null !== node.next){
            node = node.next;
        }
        this.chessMap[node.x][node.y] = this.NO_COLOR;
        node = node.pre;
        node.next = null;
        this.chessMap[node.x][node.y] = this.NO_COLOR;
        node = node.pre;
        node.next = null;
        stepNum-=2;
        return node;
    }

    this.ini=function(){
    	this.painter.paint();
    	this.disabled=false;
        this.stepNum=0;
        
        //如果是单人游戏,则创建一个电脑对手
    	if(1==globalParams.playerNum){
           this.createAi();
        }
        //如果玩家的颜色不是黑子，则让电脑先落子
    	if(globalParams.playerColor!=BLACK){
           this.callAi();
    	}
    }

    this.setChess=function(x,y,chess){
    	if(this.disabled){
    		return true;//返回true表示正常返回无异常
        }
        //校验步数和颜色是否对应
    	if(this.players[stepNum%2]!=chess){
    		return false;
        }
        //落子处是否无子
    	if(this.chessMap[x][y]!=0){
           return false;
        }
        //落子处是否超出棋盘
        if(x<0||y<0||x>14||y>14){
          return false;
        }
        this.chessMap[x][y]=chess; 
        this.painter.chessMap=this.chessMap;
        this.pushHistory(x,y,chess);
        this.painter.rePaintAll(x,y);
        if(iswin2(x,y,this.chessMap,chess)){
           var winStr=(chess==BLACK?'黑棋':'白棋')+'胜利！';
           alert(winStr);
           return true;
        }
        //this.afterSetChess();
         setTimeout(this.afterSetChess,1);
        return true;
    }

    this.rePaintAll=function(x,y){
    	this.painter.rePaintAll(x,y);
    }

    this.createAi=function(){
    	this.ai=new GomokuAi(this.BLACK,this.WHITE);
    	//this.ai.gameCon=this;
    }

    this.callAi=function(){
        var result=this.ai.callSetChess(this.chessMap,(globalParams.playerColor==BLACK?WHITE:BLACK));
        if(!this.setChess(result.x,result.y,globalParams.playerColor==BLACK?WHITE:BLACK)&&stepNum<255){
        	this.callAi();
        }
    }

    //第一种判断胜利的方法
    this.isWin=function(x,y,chessMap,chess){//检查是否有赢棋
    	if(sumFunc({x:x,y:y,ax:0,ay:1},chessMap,0,chess)){
    		return true;
    	}
    	if(sumFunc({x:x,y:y,ax:1,ay:0},chessMap,0,chess)){
    		return true;
    	}
    	if(sumFunc({x:x,y:y,ax:1,ay:1},chessMap,0,chess)){
    		return true;
    	}
    	if(sumFunc({x:x,y:y,ax:-1,ay:1},chessMap,0,chess)){
    		return true;
    	}
    	return false;
    }

    var sumFunc=function(obj,chessMap,flag,thisColor){
    	if(flag>4||obj.x>14||obj.y>14||obj.x<0||obj.y<0||chessMap[obj.x][obj.y]!=thisColor){
           return false;
    	}
    	var sum=0;
        var x=obj.x;
        var y=obj.y;
    	sum+=chessMap[obj.x][obj.y];
    	obj.x+=obj.ax;
    	obj.y+=obj.ay;
    	var i=0;
    	while(obj.x<15&&obj.y<15&&obj.x>0&&obj.y>0&&i<4){
            sum+=chessMap[obj.x][obj.y];
            obj.x+=obj.ax;
    		obj.y+=obj.ay;
    		i++;
    	}
    	if(5*WHITE==sum||5*BLACK==sum){
            return true;
    	}
    	return sumFunc({x:x-obj.ax,y:y-obj.ay,ax:obj.ax,ay:obj.ay},chessMap,++flag,thisColor);
    }

    //第二种判断胜利的方法
    var iswin2=function(x,y,chessMap,chess){
        var arrs=pointChessMap2Line(x,y,chessMap);
        for (let i = 0; i < 4; i++) {
            if(checkLineWin(arrs[i])){
                return true;
           } 
        }
    }

    //判断一个数组中是否有5连子
    var checkLineWin=function(arr){
        var pre;
        var curr;
        var count=1;//连续数
        pre=arr[0];
        for(var i=1;i<=arr.length;i++){
            if(pre==arr[i]&&this.NO_COLOR!=arr[i]){
                count++;
                if(count>=5){
                    return true;
                }
            }else{
                count=1;
            }
            pre=arr[i];
        }
        return false;
    }

    //将一个点的四个方向棋盘状态存成一个数组
    var pointChessMap2Line=function(x,y,chessMap){
        var arr0=[];//x
        var arr1=[];//y
        var arr2=[];//x,y正
        var arr3=[];//x,y反
        var xStart;
        var yStart;
        var xEnd;
        var yEnd;
        if (x-4>=0) {
            xStart=(x-4);
        }else{
            xStart=0;
        }

        if (y-4>=0) {
            yStart=(y-4);
        }else{
            yStart=0;
        }

        if (x+4<15) {
            xEnd=x+5;
        }else{
            xEnd=15;
        }

        if (y+4<15) {
            yEnd=y+5;
        }else{
            yEnd=15;
        }

        var hasWin=false;
        var count=0;//连子数
        //x方向添加
        for (var i = xStart; i < xEnd; i++) {
            arr0.push(chessMap[i][y]);
        }
        //y方向添加
        for (var i = yStart; i < yEnd; i++) {
            arr1.push(chessMap[x][i]);
        }
        //x,y同向
       var subStart0=(x-xStart<y-yStart?x-xStart:y-yStart);
       var xxStart0=x-subStart0;
       var yyStart0=y-subStart0;
       var subEnd0=(xEnd-1-x<yEnd-1-y?xEnd-1-x:yEnd-1-y);
       //var xxEnd=x+subEnd0;
       //var yyEnd=y+subEnd0;
       var xieCount0=subStart0+subEnd0+1;
        for (var i = 0; i < xieCount0; i++) {
            arr2.push(chessMap[xxStart0+i][yyStart0+i]);
        }
        //x,y反向
        var subStart1=(x-xStart<yEnd-1-y?x-xStart:yEnd-1-y);
       var xxStart1=x-subStart1;
       var yyStart1=y+subStart1;
       var subEnd1=(xEnd-1-x<y-yStart?xEnd-1-x:y-yStart);
       //var xxEnd=x+subEnd0;
       //var yyEnd=y+subEnd0;
       var xieCount1=subStart1+subEnd1+1;
        for (var i = 0; i <xieCount1; i++) {
            arr3.push(chessMap[xxStart1+i][yyStart1-i]);
        }
        return [arr0,arr1,arr2,arr3];
        //return {arr0=arr0,arr1=arr1,arr2=arr2,arr3=arr3};
    }

    var that=this;
    this.afterSetChess=function(){
    	//如果有一个玩家，且当前该ai下子
    	if(1==globalParams.playerNum&&that.players[stepNum%2]!=globalParams.playerColor){
            that.callAi();
    	}
    }

    // 悔棋
    this.backChess = function(){
        var node = this.backHistory();
        if(null!=node){
            this.rePaintAll(node.x,node.y);
        }
    }
}