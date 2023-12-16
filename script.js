console.log(gameLevels);
let level = 1;
let state = "gMain";
let gameData = gameLevels.levels[level - 1];
let levelMap = gameData.tileMap;
let cellSize = 0;
let mapWidth = levelMap[0].length;
let mapHeight = levelMap.length;
let tileSize = 32; // 32px x 32px
let bStart,
	bSettings,
	bCredits,
	bGameplayBack,
	bRestart,
	bExit,
	bReplay,
	bNextLevel;
let p; // player
let coinsCollected = 0;
let maxCoins = 0;
let score = 0;
let totalSpotted = 0;
let levelSpotted = 0;
let enemies = [];
let coins = [];
let cells = [];
let completeSquare;
let canvasWidth = 1536;
let canvasHeight = 864;
/* level select menu */
let canEnter = false;
let selectLevelText = "";
let selectLevelImg = new p5.Image(1, 1);
/* Timer */
let maxTime = 120;
let timer = maxTime;

function preload() {
	terexmalFont = loadFont("fonts/terexmalSunday.otf");
	karashaFont = loadFont("fonts/karasha.otf");
	shuriken = loadImage("images/shuriken.png");
	selectLevelUI = loadImage("images/UI/selectLevelUI.png");
	screenBackground = loadImage("images/background.png");
	launchScreen = loadImage("images/UI/launchScreen.png");
	lvl1Img = loadImage("images/levelImages/lvl1Img.png");
	lvl2Img = loadImage("images/levelImages/lvl2Img.png");
	lvl3Img = loadImage("images/levelImages/lvl3Img.png");
	lvl4Img = loadImage("images/levelImages/lvl4Img.png");
	playerImg = loadImage("images/character.png");
	gameMap = loadImage("images/gameMap1.png");
	gameMap2 = loadImage("images/gameMap2.png");
	gameMap3 = loadImage("images/gameMap3.png");
	gameMap4 = loadImage("images/gameMap4.png");
	slimeEnemy = loadImage("images/enemies/slime.png");
	goldCoin = loadImage("images/goldCoin.png");
}

// ellipsemode(corner) which messing everything up
function setup() {
	createCanvas(canvasWidth, canvasHeight);
	//console.log(canvasWidth);
	//console.log(canvasHeight);
	background(150);
	// ellipseMode(CORNER);
	noStroke();
	cellSize = floor(min(width / mapWidth, height / mapHeight));
	console.log(
		`width: ${mapWidth}, height: ${mapHeight} cellSize: ${cellSize}px`
	);
	p = new Player(
		gameData.playerPosition.x * cellSize,
		gameData.playerPosition.y * cellSize
	);
	initEnemies(level);
	completeSquare = new CompleteSquare(
		gameData.completeSquare.x * cellSize,
		gameData.completeSquare.y * cellSize,
		cellSize,
		cellSize
	);
	bStart = new Button(
		546,
		289,
		434,
		69,
		"Start",
		[100, 255, 100, 0],
		true,
		true,
		0,
		karashaFont
	);
	bSettings = new Button(
		546,
		459,
		434,
		69,
		"Settings",
		[100, 255, 100, 0],
		true,
		true,
		0,
		karashaFont
	);
	bCredits = new Button(
		546,
		629,
		434,
		69,
		"Credits",
		[100, 255, 100, 0],
		true,
		true,
		0,
		karashaFont
	);
	bGameplayBack = new Button(23, 19, 200, 100, "Back", [255, 100, 100]);
	bRestart = new Button(
		width / 2 - 100,
		height / 2 - 100,
		200,
		100,
		"Restart",
		[255, 100, 100],
		true
	);
	bExit = new Button(23, 19, 200, 100, "Exit", [255, 100, 100]);
	bSelectExit = new Button(1330, 779, 182, 67, "Exit", [255, 100, 100]);
	bReplay = new Button(
		23,
		canvasHeight - 119,
		200,
		100,
		"Replay",
		[255, 100, 100],
		true
	);
	bNextLevel = new Button(
		canvasWidth - 223,
		canvasHeight - 119,
		200,
		100,
		"Next Level",
		[255, 100, 100],
		true
	);
	bLvl1 = new Button(
		91,
		122,
		162,
		121,
		"1",
		[31, 164, 204, 0],
		false,
		true,
		15,
		terexmalFont
	); // change the opacity of the colour to see the button hitbox
	bLvl2 = new Button(
		91,
		289,
		162,
		121,
		"2",
		[31, 164, 204, 0],
		false,
		true,
		15,
		terexmalFont
	);
	bLvl3 = new Button(
		91,
		456,
		162,
		121,
		"3",
		[31, 164, 204, 0],
		false,
		false,
		15,
		terexmalFont
	);
	bLvl4 = new Button(
		92,
		623,
		162,
		121,
		"4",
		[31, 164, 204, 0],
		false,
		false,
		15,
		terexmalFont
	);
	bPlay = new Button(675, 767, 435, 69, "", [31, 164, 204, 0], true, true);
}

function draw() {
	background(150);
	switch (state) {
		case "gMain":
			image(launchScreen, 0, 0);
			textAlign(CENTER, CENTER);
			bStart.draw();
			bSettings.draw();
			bCredits.draw();
			bStart.update();
			bSettings.update();
			bCredits.update();
			if (bStart.pressed) {
				state = "gSelect";
			} else if (bSettings.pressed) {
				state = "gSettings";
			} else if (bCredits.pressed) {
				state = "gCredits";
			}
			break;
		case "gGameplay":
			if (keyIsDown(27)) state = "gMain";
			runGame();
			break;
		case "gSettings":
			image(screenBackground, 0, 0);
			textFont(karashaFont);
			textSize(64);
			textAlign(CENTER, CENTER);
			text("Settings", width / 2, height / 2 - 200);
			bGameplayBack.draw();
			bGameplayBack.update();
			if (bGameplayBack.pressed) {
				state = "gMain";
			}
			break;
		case "gCredits":
			image(screenBackground, 0, 0);
			textFont(karashaFont);
			textSize(64);
			textAlign(CENTER, CENTER);
			text("Credits", width / 2, height / 2 - 200);
			credits.showModal();
			bGameplayBack.draw();
			bGameplayBack.update();
			if (bGameplayBack.pressed) {
				credits.close();
				state = "gMain";
			}
			break;
		case "gOver":
			image(screenBackground, 0, 0);
			textAlign(CENTER, CENTER);
			textFont(karashaFont);
			textSize(64);
			text("Gameover", width / 2, height / 2 - 250);
			bRestart.draw();
			bRestart.update();
			bExit.draw();
			bExit.update();
			if (bRestart.pressed) {
				totalSpotted++;
				levelSpotted++;
				startLevel(level);
				state = "gGameplay";
			} else if (bExit.pressed) {
				// wierd occurence where the gameover screen triggers once when going to the game from gameover > exit > main menu > start > gameplay
				// prob a player position thing but should fix later but hasn't caused any major problems right now
				startLevel(level);
				state = "gMain";
			}
			if (timer == 0) {
				text("YOU DIDN'T ESCAPE IN TIME", width / 2, height * 0.65);
			} else {
				textSize(48);
				text(
					"Usually assassins are not supposed to be seen",
					width / 2,
					height * 0.65
				);
			}
			break;
		case "gComplete":
			image(screenBackground, 0, 0);
			textAlign(CENTER, CENTER);
			textFont(karashaFont);
			textSize(64);
			if (level == 4) {
				text("Congratulations, you beat the game", width / 2, height / 2 - 150);
				textFont("Impact");
				textSize(32);
				totalSpotted != 0
					? text(
							`You was spotted a total of ${totalSpotted} times, a true assassin could do better`,
							width / 2,
							height / 2 + 200
					  )
					: text(
							`Great Job not getting spotted once`,
							width / 2,
							height / 2 + 200
					  );
			} else {
				text("Level complete", width / 2, height / 2 - 150);
			}
			textSize(48);
			textFont("Impact");
			score = coinsCollected * 3000 + timer * 200 - levelSpotted * 1500;
			text(`Score: ${score}`, width / 2, height / 2 + 100); // score is calculated by coins collected * 200 + timer * 3000 - levelSpotted * 150
			text(
				`${coinsCollected} / ${coins.length} coins collected`,
				width / 2,
				height / 2 - 20
			);
			if (level != 4)
				text(`spotted: ${levelSpotted} times`, width / 2, height / 2 + 200);
			if (level != 4) gameLevels.levels[level].unlocked = true; // unlocked the next level
			bReplay.draw();
			bReplay.update();
			bNextLevel.draw();
			bNextLevel.update();
			bExit.draw();
			bExit.update();
			if (bReplay.pressed) {
				startLevel(level);
				levelSpotted = 0;
				state = "gGameplay";
			} else if (bExit.pressed) {
				startLevel(level);
				state = "gMain";
			} else if (bNextLevel.pressed) {
				if (level != 4) level++;
				initNextLevel(level);
				state = "gGameplay";
			}
			break;
		case "gSelect":
			fill("black");
			textAlign(CENTER, CENTER);
			background(96, 50, 30);
			image(selectLevelUI, 0, 0);
			//textAlign(CENTER, CENTER);
			//text("Level Select", width / 2, height / 2 - 200);
			bSelectExit.draw();
			bSelectExit.update();
			bLvl1.draw();
			bLvl2.draw();
			bLvl3.draw();
			bLvl4.draw();
			bLvl1.update();
			bLvl2.update();
			bLvl3.update();
			bLvl4.update();
			bPlay.draw();
			bPlay.update();
			if (bSelectExit.pressed) {
				state = "gMain";
			} else if (bLvl1.pressed) {
				level = 1;
				canEnter = true;
				selectLevelText = "THE SILENT MANOR";
				selectLevelImg = lvl1Img;
			} else if (bLvl2.pressed) {
				selectLevelText = "THE DILAPIDATED WOODS";
				selectLevelImg = lvl2Img;
				if (gameLevels.levels[1].unlocked) {
					level = 2;
					canEnter = true;
				}
			} else if (bLvl3.pressed) {
				// there is no working lvl3 in the levels data structure
				selectLevelText = "THE CATACOMBS"; //add the image for this lvl
				selectLevelImg = lvl3Img;
				if (gameLevels.levels[2].unlocked) {
					level = 3;
					canEnter = true;
				}
			} else if (bLvl4.pressed) {
				// there is no working lvl4 in the levels data structure
				selectLevelText = "SHRINE OF THE FOX";
				selectLevelImg = lvl4Img;
				if (gameLevels.levels[3].unlocked) {
					level = 4;
					canEnter = true;
				}
			} else if (bPlay.pressed && canEnter) {
				initNextLevel(level);
				state = "gGameplay";
			} //endif
			textFont(karashaFont);
			textSize(48);
			text(selectLevelText, 915, 705);
			image(selectLevelImg, 415, 94); // image sized should all be 1002x561
	}
} //endDraw

function drawMap(levelMap) {
	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			//cells.push(new cell(x))
			noStroke();
			if (levelMap[y][x] == 1) {
				fill(255, 0, 0, 50);
				rect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}
} //endfunc

function runGame() {
	//noStroke(); // removes stroke around the enemy vision cones
	switch (level) {
		case 1:
			image(gameMap, 0, 0);
			break;
		case 2:
			image(gameMap2, 0, 0);
			break;
		case 3:
			image(gameMap3, 0, 0);
			break;
		case 4:
			image(gameMap4, 0, 0);
			break;
	}
	//drawMap(levelMap);
	runEnemies(enemies);
	showCoins(coins);
	textSize(24);
	textFont("Impact");
	text(
		`${coinsCollected} / ${coins.length} coins collected`,
		width / 2 + 250,
		25
	);
	text(`Time: ${maxTime - timer}`, width / 2 + 500, 25); // subtracted the time left from the max time to create a counting up timer (stopwatch)
	completeSquare.draw();
	p.draw();
	p.move();
	completeSquare.ifLevelComplete(p);
	runTimer();
} //endfuc

function startLevel(level) {
	// search up "javascript looping over an object" to find a more efficient way to do this
	// https://stackoverflow.com/questions/1512315/javascript-looping-over-an-object
	// https://stackoverflow.com/questions/2228203/how-to-loop-through-an-object-in-javascript
	p.x = p.default.x;
	p.y = p.default.y;
	enemies.forEach((e) => {
		e.x = e.default.x;
		e.y = e.default.y;
	});
	coinsCollected = 0;
	coins = [];
	timer = maxTime;
	score = 0;
	initCoins(level);
} //endfunc

function initNextLevel(level) {
	gameData = gameLevels.levels[level - 1];
	levelMap = gameData.tileMap; // changed to being used as the collision map
	mapWidth = levelMap[0].length;
	mapHeight = levelMap.length;
	cellSize = floor(min(width / mapWidth, height / mapHeight));
	p = new Player(
		gameData.playerPosition.x * cellSize,
		gameData.playerPosition.y * cellSize
	);
	completeSquare = new CompleteSquare(
		gameData.completeSquare.x * cellSize,
		gameData.completeSquare.y * cellSize,
		cellSize,
		cellSize
	);
	enemies = [];
	coinsCollected = 0;
	coins = [];
	timer = maxTime;
	score = 0;
	levelSpotted = 0;
	initEnemies(level);
	initCoins(level);
	runGame();
	return;
} //endfunc

function initEnemies(level) {
	for (const key in gameData.enemies) {
		let enemy = gameData.enemies[key];
		enemies.push(
			new Enemy({
				x: enemy.position.x * cellSize,
				y: enemy.position.y * cellSize,
				facing: enemy.facing,
				route: enemy.route,
				visionRadius: enemy.visionRadius,
				fov: enemy.fov,
				visionType: enemy.visionType,
				blink: enemy.blink,
			})
		);
	} //endfor
} //endfunc

function runEnemies(enemies) {
	enemies.forEach((e) => {
		e.draw();
		e.cameraVision(p);
		e.areaVision(p);
		e.patrol();
	});
} //endfunc

function initCoins(level) {
	for (let y = 0; y < mapHeight; y++) {
		for (let x = 0; x < mapWidth; x++) {
			if (gameData.coins[y][x] == 2) {
				coins.push(new Coin((x + 0.5) * cellSize, (y + 0.5) * cellSize));
			} //endif
		} //endfor
	} //endfor
} //endfunc

function showCoins(coins) {
	coins.forEach((c) => {
		c.draw();
		c.ifCollected(p);
	});
} //endfunc

function pad(val) {
	return val > 9 ? val : "0" + val;
}
function runTimer() {
	if (frameCount % 60 == 0 && timer > 0) {
		// if the frameCount is divisible by 60, then a second has passed. it will stop at 0
		timer--;
	}
	if (timer == 0) {
		text("GAME OVER", width / 2, height * 0.7);
		state = "gOver";
	}
}
