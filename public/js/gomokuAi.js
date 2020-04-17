function GomokuAi(BLACK, WHITE) {
	this.BLACK = BLACK;
	this.WHITE = WHITE;
	this.maxMockDeep = 3;
	this.FREE = 0;
	this.scoreRule = [0, 1, 10, 333, 1000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000];
	this.wins = [];
	this.winsPointMap = [];
	this.activeWins={};
	
	this.callSetChess = function (chessMap) {
		var date = new Date();
		var result = this.think(chessMap, this.WHITE);
		console.log((new Date()).getTime() - date.getTime());
		return result;
	}
	//分析棋局得出落子坐标
	this.think = function (chessMap, color) {
		this.myColor = color;
		// var x = Math.floor(Math.random() * 15);
		// var y = Math.floor(Math.random() * 15);

		// return {x:x,y:y};
		return this.getPoint(chessMap,color);
	}

	this.getPoint = function(chessMap,color){
		let myPoint = {score:0};
		let oppPoint = {score:0};
		for (let i = 0; i < 15; i++) {
			for (let j = 0; j < 15; j++) {
				if(this.FREE==chessMap[i][j]){
					let myScore = this.pointScore(chessMap,this.myColor,i,j);
					let oppScore = this.pointScore(chessMap,this.myColor==this.WHITE?this.BLACK:this.WHITE,i,j);
					if(myPoint.score<myScore){
						myPoint.score = myScore;
						myPoint.x = i;
						myPoint.y = j;
					}
					if(oppPoint.score<oppScore){
						oppPoint.score = oppScore;
						oppPoint.x = i;
						oppPoint.y = j;
					}
				}
			}	
		}

		return myPoint.score > oppPoint.score ? {x:myPoint.x,y:myPoint.y}:{x:oppPoint.x,y:oppPoint.y}
	}

	this.pointScore=function(chessMap,color,x,y){
		let totalValue=0;
		//遍历左右赢法
		for (let i = 0; i < this.wins[x][y].length; i++) {
			// 赢法里面已经存在的子数
			let howMany = 0;
			let totalWinScore=0;
			// 遍历赢法对应的点
			for (let j = 0; j < this.winsPointMap[this.wins[x][y][i]].length; j++){
				let px = this.winsPointMap[this.wins[x][y][i]][j][0];
				let py = this.winsPointMap[this.wins[x][y][i]][j][1];
				if(color==chessMap[px][py]||(px==x&&py==y)){
					totalWinScore +=this.scoreRule[++howMany];
				}else if(chessMap[px][py]!=this.FREE&&color!=chessMap[px][py]){
					// 如果这种赢法里面，已经有了敌对的子，则放弃这种赢法的积分
					totalWinScore = 1;
					j = this.winsPointMap[this.wins[x][y][i]].length;
				}
			}
			totalValue += totalWinScore;
		} 
		return totalValue;
	}

	this.ini=function(){
		//赢法数组,记录五子棋所有的赢法，三维数组
		for (var i = 0; i < 15; i++) {
			this.wins[i] = [];
			for (var j = 0; j < 15; j++) {
				this.wins[i][j] = [];
			}
		}
		var count = 0; //赢法总数（穷举）
		//竖线赢法
		//(i,j)代表坐标，count表示第几种赢法
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 11; j++) {
				this.winsPointMap[count]=[];
				for (var k = 0; k < 5; k++) {
					this.wins[i][j + k][this.wins[i][j + k].length] = count;
					this.winsPointMap[count][k]=[];
					this.winsPointMap[count][k][0]=i;
					this.winsPointMap[count][k][1]=j + k;
				}
				count++;
			}
		}
		//横线赢法
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 11; j++) {
				this.winsPointMap[count]=[];
				for (var k = 0; k < 5; k++) {
					this.wins[j + k][i][this.wins[j + k][i].length] = count;
					this.winsPointMap[count][k]=[];
					this.winsPointMap[count][k][0]=j + k;
					this.winsPointMap[count][k][1]=i;
				}
				count++;
			}
		}
		//正斜线赢法
		for (var i = 0; i < 11; i++) {
			for (var j = 0; j < 11; j++) {
				this.winsPointMap[count]=[];
				for (var k = 0; k < 5; k++) {
					this.wins[i + k][j + k][this.wins[i + k][j + k].length] = count;
					this.winsPointMap[count][k]=[];
					this.winsPointMap[count][k][0]=i + k;
					this.winsPointMap[count][k][1]=j + k;
				}
				count++;
			}
		}
		//反斜线赢法
		for (var i = 0; i < 11; i++) {
			for (var j = 14; j > 3; j--) {
				this.winsPointMap[count]=[];
				for (var k = 0; k < 5; k++) {
					this.wins[i + k][j - k][this.wins[i + k][j - k].length] = count;
					this.winsPointMap[count][k]=[];
					this.winsPointMap[count][k][0]=i + k;
					this.winsPointMap[count][k][1]=j - k;
				}
				count++;
			}
		}

		
	};

	this.ini();
}