function GomokuAi(BLACK,WHITE){
	this.BLACK=BLACK;
	this.WHITE=WHITE;
	this.FREE = 0;
	this.scoreRule=[0,1,10,100,1000,10000,10000,10000,10000,10000,10000,10000,10000,10000,10000];
	this.callSetChess=function(chessMap){
        var result=this.think(chessMap,this.WHITE);
        return result;
	}
	//分析棋局得出落子坐标
	this.think=function(chessMap,color){
		this.myColor = color;
		// var x=Math.floor(Math.random()*15);
		// var y=Math.floor(Math.random()*15);
		let newChessmap;
		let maxScore = -99999999;
		let maxPoint = [];
		for (let i = 0; i < chessMap.length; i++) {
			for (let j = 0; j < chessMap[i].length; j++) {
				newChessmap = this.copyChessmap(chessMap);
				if(this.FREE!=newChessmap[i][j]){
					continue;
				}
				newChessmap[i][j] = color;
				let score = this.analysis(newChessmap);
				if(score==maxScore){
					maxPoint.push(i+","+j);
				}else if(score>maxScore){
					maxScore = score;
					maxPoint = [];
					maxPoint.push(i+","+j);
				}
			}
		}

        return this.whereIsTheCenterOfMap(maxPoint);
	}

	// 找出离棋盘中心更近的点
	this.whereIsTheCenterOfMap=function(pointArr){
		let result;
		let min=9999;
		for (let i = 0; i < pointArr.length; i++) {
			let point = pointArr[i];
			let pointXY = point.split(",");
			let dis = ((pointXY[0]-7)&128)+((pointXY[1]-7)&128);
			if(dis<min){
				min= dis;
				result = {x:parseInt(pointXY[0]),y:parseInt(pointXY[1])};
			}
		}
		return result;
	}

	this.copyChessmap=function(chessMap){
		let newChessmap = []
		for (let i = 0; i < chessMap.length; i++) {
			let newCol = [];
			for (let j = 0; j < chessMap[i].length; j++) {
				newCol.push(chessMap[i][j]);
			}
			newChessmap.push(newCol);
		}
		return newChessmap;
	}

	this.fiveInLine=function(line){
        var blackLinelength = 0;
		var whiteLinelength = 0;
		var blackScoreTotal = 0;
		var whiteScoreTotal = 0;

        for (var i = 0; i < line.length; i++) {
            if (this.FREE == line[i]) {
                blackLinelength = 0;
				whiteLinelength = 0;
				blackScoreTotal+=this.scoreRule[blackLinelength];
				whiteScoreTotal+=this.scoreRule[whiteLinelength];
            } else if (this.WHITE == line[i]) {
                whiteLinelength++;
				blackLinelength = 0;
				whiteScoreTotal+=this.scoreRule[whiteLinelength];
            } else if (this.BLACK == line[i]) {
                blackLinelength++;
				whiteLinelength = 0;
				blackScoreTotal+=this.scoreRule[blackLinelength];
            }
        }

		var sub = blackScoreTotal-whiteScoreTotal;
        return this.BLACK==this.myColor?sub:-sub;
	}
	
	this.pickLineFromChessMap=function(chessBoard,startX,startY,xa,ya) {
        var i = startX;
        var j = startY;
        var index = 0;
        var line = [15];
        do {
            line[index] = chessBoard[i][j];
            i += xa;
            j += ya;
            index++;
        } while (i >= 0 && j >= 0 && i < 15 && j < 15);
        return line;
	}
	
	this.analysis=function(chessBoard){
		var subTotal=0;
		// 横排积分
        for (let i = 0; i < 15; i++) {
			let thisScore = this.fiveInLine(this.pickLineFromChessMap(chessBoard, 0, i, 1, 0));
            subTotal += thisScore;
        }

		//竖排积分
        for (let i = 0; i < 15; i++) {
			let thisScore = this.fiveInLine(this.pickLineFromChessMap(chessBoard, i, 0, 0, 1));
            subTotal += thisScore;
        }


        for (let i = 14; i >=0 ; i--) {
			let thisScore = this.fiveInLine(this.pickLineFromChessMap(chessBoard, 0, i, 1, 1));
            subTotal += thisScore;
        }

        for (let i = 0; i < 15; i++) {
			let thisScore = this.fiveInLine(this.pickLineFromChessMap(chessBoard, i, 0, 1, 1));
            subTotal += thisScore;
        }

        for (let i = 14; i >=0 ; i--) {
			let thisScore = this.fiveInLine(this.pickLineFromChessMap(chessBoard, 0, i, 1, -1));
            subTotal += thisScore;
        }

        for (let i = 0; i < 15; i++) {
			let thisScore = this.fiveInLine(this.pickLineFromChessMap(chessBoard, i, 15 - 1, 1, -1));
            subTotal += thisScore;
        }

        return subTotal;
    }


	

}