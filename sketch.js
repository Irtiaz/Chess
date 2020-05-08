let troopNames = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn'];
let images = [];

let w;

let whites = [],
	blacks = [];

let selected = null;
let turn = 'white';

const notChecked = -1;
const checked = 0;
const checkMated = 1;

let wCheckState = notChecked,
	bCheckState = notChecked;

let selector, blu, rd;


function preload() {
	images.push(loadImage("PNG/board.png"));
	for (let name of troopNames) images.push(loadImage("PNG/w_" + name + ".png"));
	for (let name of troopNames) images.push(loadImage("PNG/b_" + name + ".png"));
	selector = loadImage("PNG/selector.png");
	blu = loadImage("PNG/blue.png");
	rd = loadImage("PNG/red.png");
}

function setup() {
	let smaller = min(windowWidth, windowHeight);
	createCanvas(smaller, smaller);

	w = width / 8;

	setupWhite();
	setupBlack();
}

function draw() {
	background(images[0]);

	if (wCheckState == checked || wCheckState == checkMated) {
		let king = getKing('white');
		image(rd, king.x, king.y, w, w);
	}
	if (bCheckState == checked || bCheckState == checkMated) {
		let king = getKing('black');
		image(rd, king.x, king.y, w, w);
	}

	if (selected != null) {
		image(selector, selected.x, selected.y, w, w);
		for (let move of selected.possibleMoves) {
			let x = move[1] * w;
			let y = move[0] * w;

			if (getPiece(move[0], move[1]) == null) image(blu, x, y, w, w);
			else image(rd, x, y, w, w);
		}
	}

	for (let whiteTroop of whites) {
		whiteTroop.display();
	}
	for (let blackTroop of blacks) {
		blackTroop.display();
	}

	if (wCheckState == 1 || bCheckState == 1) {
		const winner = wCheckState == 1 ? 'Black' : 'White';
		textSize(width / 10);
		textAlign(CENTER, CENTER);
		if (winner == 'Black') fill(0);
		else fill(255);
		text(winner + ' won!', width / 2, height / 2);
	}
}


function mousePressed() {
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
		if (selected == null) {
			selected = pieceWithMouseOn(turn);
			if (selected != null) selected.findPossibleMoves(true);
		} else {
			let i = floor(mouseY / w);
			let j = floor(mouseX / w);
			if (selected.i != i || selected.j != j) {
				if (selected.move(i, j)) {
					turn = turn == 'white' ? 'black' : 'white';

					updateCheckState('white');
					updateCheckState('black');
				}
				selected = null;
			}
		}
	}
}