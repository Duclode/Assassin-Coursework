function drawMap(level) {
	let tileMap = gameLevels.levels[0].tileMap;
	let cellColour = ["white", "red"];
	let cellSize = 0;
	let mapWidth = tileMap[0].length;
	let mapHeight = tileMap.length;
	let tileSize = 32; // 32px x 32px
	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			//cells.push(new cell(x))
			noStroke();
			fill(cellColour[tileMap[y][x]]);
			rect(x * cellSize, y * cellSize, cellSize, cellSize);
		}
	}
} //endfunc
