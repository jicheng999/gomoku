function GomokuAi(BLACK, WHITE) {
	this.BLACK = BLACK;
	this.WHITE = WHITE;
    this.maxMockDeep = 2;
    this.mockStepArr = [];
	this.FREE = 0;
	this.socreRecord=[];
	this.scoreRule = [0, 1, 10, 100, 1000, 900000, 900000, 900000, 900000, 900000, 900000, 900000, 900000, 900000, 900000];
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

		// var a = 0;
		// var date = new Date();
		// for (let index3 = 0; index3 < 99; index3++) {
		// 	for (let index = 0; index < 9999; index++) {
		// 		for (let index2 = 0; index2 < 9999; index2++) {
		// 			a = index2;
		// 		}
		// 	}
		// }
		// console.log((new Date()).getTime() - date.getTime());

		// return { x: x, y: y };


		let newChessmap;
		let maxScore = -99999999;
		let maxPoint = [];
		newChessmap = this.copyChessmap(chessMap);

		let freePointArr = this.picGoodPotin(chessMap);
		for (let k = 0; k < freePointArr.length; k++) {
			let i = freePointArr[k].x;
			let j = freePointArr[k].y;
			if (this.FREE != newChessmap[i][j]) {
				continue;
			}
            newChessmap[i][j] = color;
            this.mockStepArr.push(i + "," + j);
            let score = this.mockDownChess(newChessmap, 1).sub;
            this.mockStepArr.pop();
            console.log('color:'+ color + ' ['+i+','+j+'] score:'+score);
			if (score == maxScore) {
				maxPoint.push(i + "," + j);
			} else if (score > maxScore) {
				maxScore = score;
				maxPoint = [];
				maxPoint.push(i + "," + j);
			}
			newChessmap[i][j] = this.FREE;
		}

		// for (let i = 0; i < chessMap.length; i++) {
		// 	for (let j = 0; j < chessMap[i].length; j++) {
		// 		if(this.FREE!=newChessmap[i][j]){
		// 			continue;
		// 		}
		// 		newChessmap[i][j] = color;
		// 		let score = this.mockDownChess(newChessmap,1);
		// 		if(score==maxScore){
		// 			maxPoint.push(i+","+j);
		// 		}else if(score>maxScore){
		// 			maxScore = score;
		// 			maxPoint = [];
		// 			maxPoint.push(i+","+j);
		// 		}
		// 		newChessmap[i][j]=this.FREE;
		// 	}
		// }

		return this.whereIsTheCenterOfMap(maxPoint);
	}

	// 挑选出可能的落子点，抛弃已有点太远的，减少计算
	this.picGoodPotin = function (chessmap) {
		var date = new Date();
		var downPointArr = [];
		var hashObj = {};//利用对象名做hash
		// 找出已经落子的点
		for (let i = 0; i < chessmap.length; i++) {
			for (let j = 0; j < chessmap[i].length; j++) {
				if (this.FREE != chessmap[i][j]) {
					downPointArr.push({ x: i, y: j });
				}
			}
		}

		var freePointArr = [];
		//找出所有落子周围的有效点
		for (let i = 0; i < downPointArr.length; i++) {
			let x = downPointArr[i].x;
			let y = downPointArr[i].y;
			let mockPoints = [];

				// let minx = x - 3 < 0 ? 0 : x - 3;
				// let miny = y - 3 < 0 ? 0 : y - 3;
				// let maxx = x + 3 > 14 ? 14 : x + 3;
				// let maxy = y + 3 > 14 ? 14 : y + 3;

				// for (let j = minx; j < maxx; j++) {
				// 	for (let k = miny; k < maxy; k++) {
				// 		if (this.FREE == chessmap[j][k] && !(hashObj[j + "," + k])) {
				// 			freePointArr.push({ x: j, y: k });
				// 			hashObj[j + "," + k] = 1;
				// 		}
				// 	}
				// }


			mockPoints = this.getWillConPoints(chessmap, x, y);
			for (let k = 0; k < mockPoints.length; k++) {
				let item = mockPoints[k];
				if (this.FREE == chessmap[item.x][item.y] && !(hashObj[item.x + "," + item.y])) {
					freePointArr.push({ x: item.x, y: item.y });
					hashObj[item.x + "," + item.y] = 1;
				}
			}


		}

		// console.log((new Date()).getTime()-date.getTime());
		return freePointArr;
	}

	// 获取一个点周围可能会被链接的点
	this.getWillConPoints = function (chessBoard, x, y) {
		let range = 2;
		let points = [];
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, 0, 1, range));
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, 0, -1, range));
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, 1, 0, range));
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, -1, 0, range));
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, 1, 1, range));
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, -1, -1, range));
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, -1, 1, range));
		points = points.concat(this.pickLineFromChessMap2(chessBoard, x, y, 1, -1, range));
		return points;
	}


	this.pickLineFromChessMap2 = function (chessBoard, startX, startY, xa, ya, range) {
		var i = startX;
		var j = startY;
		var line = [];
		do {
			if (this.FREE == chessBoard[i][j]) {
				line.push({ x: i, y: j });
			}
			i += xa;
			j += ya;
			range--;
		} while (i >= 0 && j >= 0 &&i <= 14 && j <=14 && range >= 0 && range >= 0);
		return line;
	}



	this.mockDownChess = function (newChessmap, deep) {
		let thisScore = this.analysis(newChessmap)
		if (deep >= this.maxMockDeep||Math.abs(thisScore.sub)>50000||thisScore.whoWin!=this.FREE) {
			return thisScore;
		} else {
			let isMyColor = (0 == deep % 2);
            let maxScore = 999999 * (isMyColor ? -1 : 1);
            let maxScoreObj = {};
			let needMax = isMyColor;
			let color = (isMyColor ? this.myColor : (this.myColor == this.BLACK ? this.WHITE : this.BLACK));
			deep++;

			let freePointArr = this.picGoodPotin(newChessmap);
			for (let k = 0; k < freePointArr.length; k++) {
				let i = freePointArr[k].x;
				let j = freePointArr[k].y;
				if (this.FREE != newChessmap[i][j]) {
					continue;
				}
                newChessmap[i][j] = color;
                this.mockStepArr.push(i + "," + j);
                let scoreObj = this.mockDownChess(newChessmap, deep);
                let score = scoreObj.sub;
                this.mockStepArr.pop();
				if (needMax ? score > maxScore : score < maxScore) {
                    maxScore = score;
                    maxScoreObj = scoreObj;
				}
				newChessmap[i][j] = this.FREE;
			}

			// for (let i = 0; i < newChessmap.length; i++) {
			// 	for (let j = 0; j < newChessmap[i].length; j++) {
			// 		if (this.FREE != newChessmap[i][j]) {
			// 			continue;
			// 		}
			// 		newChessmap[i][j] = color;
			// 		let score = this.mockDownChess(newChessmap, deep);
			// 		if (needMax ? score > maxScore : score < maxScore) {
			// 			maxScore = score;
			// 		}
			// 		newChessmap[i][j] = this.FREE;
			// 	}
			// }

			return maxScoreObj;
		}
	}

	// 找出离棋盘中心更近的点
	this.whereIsTheCenterOfMap = function (pointArr) {
		let result;
		let min = 9999;
		for (let i = 0; i < pointArr.length; i++) {
			let point = pointArr[i];
			let pointXY = point.split(",");
			let dis = Math.abs(pointXY[0] - 7) + Math.abs(pointXY[1] - 7);
			if (dis < min) {
				min = dis;
				result = { x: parseInt(pointXY[0]), y: parseInt(pointXY[1]) };
			}
		}
		return result;
	}

	this.copyChessmap = function (chessMap) {
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

	this.fiveInLine = function (line) {
		var blackLinelength = 0;
		var whiteLinelength = 0;
		var blackScoreTotal = 0;
		var whiteScoreTotal = 0;
		//是否产生五连子的赢棋局面 FREE - 无  WHITE - 白赢 BLACK - 黑赢
		var whoWin = this.FREE;
		for(var j=0; j<line.length-5;j++){
			blackLinelength = 0;
            whiteLinelength = 0;
            //积分规则  五子内 只有一种棋，则这种棋积分，有几子，积对应分数， 出现任意敌对子，此五子格不计分
            //先算白子
            for (var i = j; i < j+5; i++) {
                if (this.WHITE == line[i]) {
                    whiteLinelength++;
                } else if (this.BLACK == line[i]) {
                    break;
                }
            }

            //算黑子
            for (var i = j; i < j+5; i++) {
                if (this.BLACK == line[i]) {
                    blackLinelength++;
                } else if (this.WHITE == line[i]) {
                    break;
                }
            }
            
            blackScoreTotal += this.scoreRule[blackLinelength];
            whiteScoreTotal += this.scoreRule[whiteLinelength];
            if(whiteLinelength>=5){
                whoWin = this.WHITE;
            }
            if(blackLinelength>=5){
                whoWin = this.BLACK;
            }
            // 算黑子
		// 	for (var i = j; i < j+5; i++) {
		// 	if (this.FREE == line[i]) {
		// 		blackLinelength = 0;
		// 		whiteLinelength = 0;
		// 		blackScoreTotal += this.scoreRule[blackLinelength];
		// 		whiteScoreTotal += this.scoreRule[whiteLinelength];
		// 	} else if (this.WHITE == line[i]) {
		// 		whiteLinelength++;
		// 		blackLinelength = 0;
		// 		whiteScoreTotal += this.scoreRule[whiteLinelength];
		// 		if(whiteLinelength>=5){
		// 			whoWin = this.WHITE;
		// 		}
		// 	} else if (this.BLACK == line[i]) {
		// 		blackLinelength++;
		// 		whiteLinelength = 0;
		// 		blackScoreTotal += this.scoreRule[blackLinelength];
		// 		if(blackLinelength>=5){
		// 			whoWin = this.BLACK;
		// 		}
		// 	}
		// }
		}
		

		var sub = blackScoreTotal - whiteScoreTotal;
		// return this.BLACK == this.myColor ? sub : -sub;
		return {blackScore:blackScoreTotal,whiteScore:whiteScoreTotal,whoWin:whoWin};
	}

	this.pickLineFromChessMap = function (chessBoard, startX, startY, xa, ya) {
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

	this.analysis = function (chessBoard) {
		this.socreRecord = [];
		var subTotal = 0;
		var whiteTotal = 0;
		var blackTotal = 0;
		var whoWin = this.FREE;
		// 横排积分
		for (let i = 0; i < 15; i++) {
			let line = this.pickLineFromChessMap(chessBoard, 0, i, 1, 0);
			let thisScore = this.fiveInLine(this.pickLineFromChessMap(chessBoard, 0, i, 1, 0));
			whoWin=thisScore.whoWin;
			let whiteScore = thisScore.whiteScore;
			let blackScore = thisScore.blackScore;
			whiteTotal+=whiteScore;
			blackTotal+=blackScore;
			this.socreRecord.push({'pos':'横向',score:whiteScore,arr:line});
			subTotal += (thisScore - blackScore);
		}

		//竖排积分
		for (let i = 0; i < 15; i++) {
			let line = this.pickLineFromChessMap(chessBoard, i, 0, 0, 1);
			// console.log(line);
			let thisScore = this.fiveInLine(line);
			whoWin=thisScore.whoWin;
			let whiteScore = thisScore.whiteScore;
			let blackScore = thisScore.blackScore;
			whiteTotal+=whiteScore;
			blackTotal+=blackScore;
			this.socreRecord.push({'pos':'纵向',score:whiteScore,arr:line});
			subTotal += (thisScore - blackScore);
		}


		for (let i = 14; i >= 0; i--) {
			let line = this.pickLineFromChessMap(chessBoard, 0, i, 1, 1);
			let thisScore = this.fiveInLine(line);
			whoWin=thisScore.whoWin;
			let whiteScore = thisScore.whiteScore;
			let blackScore = thisScore.blackScore;
			whiteTotal+=whiteScore;
			blackTotal+=blackScore;
			this.socreRecord.push({'pos':'1/1斜',score:whiteScore,arr:line});
			subTotal += (thisScore - blackScore);
		}

		for (let i = 1; i < 15; i++) {
			let line = this.pickLineFromChessMap(chessBoard, i, 0, 1, 1);
			let thisScore = this.fiveInLine(line);
			whoWin=thisScore.whoWin;
			let whiteScore = thisScore.whiteScore;
			let blackScore = thisScore.blackScore;
			whiteTotal+=whiteScore;
			blackTotal+=blackScore;
			this.socreRecord.push({'pos':'1/1斜',score:whiteScore,arr:line});
			subTotal += (thisScore - blackScore);
		}

		for (let i = 14; i >= 0; i--) {
			let line = this.pickLineFromChessMap(chessBoard, 0, i, 1, -1);
			let thisScore = this.fiveInLine(line);
			whoWin=thisScore.whoWin;
			let whiteScore = thisScore.whiteScore;
			let blackScore = thisScore.blackScore;
			whiteTotal+=whiteScore;
			blackTotal+=blackScore;
			this.socreRecord.push({'pos':'1/-1斜',score:whiteScore,arr:line});
			subTotal += (thisScore - blackScore);
		}

		for (let i = 1; i < 15; i++) {
			let line = this.pickLineFromChessMap(chessBoard, i, 15 - 1, 1, -1);
			let thisScore = this.fiveInLine(line);
			whoWin=thisScore.whoWin;
			let whiteScore = thisScore.whiteScore;
			let blackScore = thisScore.blackScore;
			whiteTotal+=whiteScore;
			blackTotal+=blackScore;
			this.socreRecord.push({'pos':'1/-1斜',score:whiteScore,arr:line});
			subTotal += (thisScore - blackScore);
		}

		//如果已经有赢家 ，败者分数清零
		if(this.WHITE == whoWin){
			blackTotal =0;
		}else if (this.BLACK == whoWin){
			whiteTotal = 0;
		}

		return {sub:(whiteTotal - blackTotal),whoWin:whoWin};
	}




}