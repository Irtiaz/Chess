function setupWhite() {
  for (let j = 0; j < 8; j++) {
    whites.push(new Piece(6, j, 'pawn', 'white'));
  }

  for (let j = 0; j < 5; j++) {
    whites.push(new Piece(7, j, troopNames[j], 'white'));
    if (j < 3) {
      whites.push(new Piece(7, 7 - j, troopNames[j], 'white'));
    }
  }
}

function setupBlack() {
  for (let j = 0; j < 8; j++) {
    blacks.push(new Piece(1, j, 'pawn', 'black'));
  }

  for (let j = 0; j < 5; j++) {
    blacks.push(new Piece(0, j, troopNames[j], 'black'));
    if (j < 3) {
      blacks.push(new Piece(0, 7 - j, troopNames[j], 'black'));
    }
  }
}


function pieceWithMouseOn(teamName) {
  let resultPiece = null;

  let team = teamName == 'white' ? whites : blacks;

  for (let troop of team) {
    if (troop.mouseOn()) {
      resultPiece = troop;
      break;
    }
  }
  return resultPiece;
}

function getPiece(i, j) {
  let result = null;
  for (let whiteTroop of whites) {
    if (whiteTroop.i == i && whiteTroop.j == j) {
      result = whiteTroop;
      break;
    }
  }
  for (let blackTroop of blacks) {
    if (blackTroop.i == i && blackTroop.j == j) {
      result = blackTroop;
      break;
    }
  }

  return result;
}

function outOfBound(i, j) {
  return i < 0 || i > 7 || j < 0 || j > 7;
}

function has(arr2d, arr) {
  for (let a of arr2d) {
    if (a[0] == arr[0] && a[1] == arr[1]) return true;
  }
  return false;
}

function getKing(team) {
  let troops = team == 'white' ? whites : blacks;
  for (let troop of troops) {
    if (troop.type == 'king') return troop;
  }
}

function removeTroop(troop) {
  let team = troop.team == 'white' ? whites : blacks;
  let index = team.indexOf(troop);
  team.splice(index, 1);
}


function willBeCheckedIf(troop, i, j) {
  let pi = troop.i;
  let pj = troop.j;
  let replacedTroop = (pi == i && pj == j) ? null : getPiece(i, j);
  if (replacedTroop != null && replacedTroop.team != troop.team) removeTroop(replacedTroop);
  troop.place(i, j);

  let opponent = troop.team == 'white' ? blacks : whites;
  let king = getKing(troop.team);
  for (let opp of opponent) {
    if (opp.canCapture(king.i, king.j)) {
      troop.place(pi, pj);
      if (replacedTroop != null) opponent.push(replacedTroop);
      return true;
    }
  }

  troop.place(pi, pj);
  if (replacedTroop != null) opponent.push(replacedTroop);

  return false;
}


function updateCheckState(team) {
  let king = getKing(team);
  let flag = willBeCheckedIf(king, king.i, king.j);

  if (flag) {
    if (team == 'white') wCheckState = checked;
    else bCheckState = checked;

    let troops = team == 'white' ? whites : blacks;
    let moves = 0;
    for (let troop of troops) {
      troop.findPossibleMoves(true);
      moves += troop.possibleMoves.length;
    }

    if (moves == 0) {
      if (team == 'white') wCheckState = checkMated;
      else bCheckState = checkMated;
    }
  } else {
    if (team == 'white') wCheckState = notChecked;
    else bCheckState = notChecked;
  }

  // console.log(team, whites.length);
}

function printMove(troop, i, j, di, dj) {
  let type = troop.type;
  let team = troop.team;

  let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  console.log(team + ' ' + type + ' moves from ' + letters[j] + '' + (8 - i) + ' to ' + letters[dj] + '' + (8 - di));
}


function play(str) {
  let pos = str.split(' ');
  let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  let i = 8 - int(pos[0][1]);
  let j = letters.indexOf(pos[0][0]);
  let troop = getPiece(i, j);

  let di = 8 - int(pos[1][1]);
  let dj = letters.indexOf(pos[1][0]);

  if (troop != null && troop.team == turn) {
    troop.findPossibleMoves(true);
    if (troop.move(di, dj)) {
      turn = turn == 'white' ? 'black' : 'white';

      updateCheckState('white');
      updateCheckState('black');
    }
  } else {
    if (troop == null) console.log("No troop there");
    else console.log("It's not " + troop.team + "'s turn");
  }
}