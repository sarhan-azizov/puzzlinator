let findNextPuzzle = (puzzles, currentPuzzle, foundPuzzles) => {
  let nextPuzzleEdgeId = null;
  let nextPuzzleId = currentPuzzle.id;

  const size = Math.sqrt(puzzles.length);
  const isEdgedPuzzle = foundPuzzles.length % size === 0

  if (isEdgedPuzzle) {
    nextPuzzleEdgeId = foundPuzzles[foundPuzzles.length - size].edges.bottom.edgeTypeId;
    nextPuzzleId = foundPuzzles[foundPuzzles.length - size].id;
  } else {
    nextPuzzleEdgeId = currentPuzzle.edges.right.edgeTypeId;
  }

  return puzzles.find((puzzle) => {
    if (puzzle.id !== nextPuzzleId) {
      return Object.entries(puzzle.edges)
          .find((edge) => edge[1] && (edge[1].edgeTypeId === nextPuzzleEdgeId));
    }
  });
}

const getTurnedPuzzle = (currentPuzzle, nextPuzzle) => {
  const puzzleForTurning = nextPuzzle ? nextPuzzle : currentPuzzle;
  const isFirstPuzzle = nextPuzzle === undefined;

  if (isFirstPuzzle) {
    if (currentPuzzle.edges.left === null && currentPuzzle.edges.top === null) {
      return currentPuzzle;
    }
  } else {
    if (nextPuzzle.edges.left && currentPuzzle.edges.right && currentPuzzle.edges.right.edgeTypeId === nextPuzzle.edges.left.edgeTypeId) {
      return nextPuzzle;
    }

    if (nextPuzzle.edges.top && currentPuzzle.edges.bottom && currentPuzzle.edges.bottom.edgeTypeId === nextPuzzle.edges.top.edgeTypeId) {
      return nextPuzzle;
    }
  }

  puzzleForTurning.edges = Object.keys(puzzleForTurning.edges).reduce((result, key, idx, keys) => {
    const nextKey = keys[idx+1] ? keys[idx+1] : keys[0];
    return {...result, [key]: puzzleForTurning.edges[nextKey] };
  }, {})

  if(isFirstPuzzle) {
    return getTurnedPuzzle(puzzleForTurning);
  }

  return getTurnedPuzzle(currentPuzzle, puzzleForTurning);
}

function findPuzzles(puzzles, puzzle, solvedPuzzles = []) {
  if (puzzles.length === solvedPuzzles.length) {
    return solvedPuzzles;
  }

  let currentPuzzle = solvedPuzzles[solvedPuzzles.length - 1] || puzzles[0];
  const isFirstPuzzle = solvedPuzzles.length === 0;
  const size = Math.sqrt(puzzles.length);

  if (isFirstPuzzle) {
    const turnedFirstPuzzle = getTurnedPuzzle(currentPuzzle)
    solvedPuzzles.push(turnedFirstPuzzle);

    const nextPuzzle = findNextPuzzle(puzzles, turnedFirstPuzzle, solvedPuzzles);

    return  findPuzzles(puzzles, nextPuzzle, solvedPuzzles);
  } else {
    const nextPuzzle = findNextPuzzle(puzzles, currentPuzzle, solvedPuzzles);
    let tcurrentPuzzle = currentPuzzle;

    if (solvedPuzzles.length % size === 0) {
      tcurrentPuzzle = solvedPuzzles[solvedPuzzles.length - size];
    }

    const turnedPuzzle = getTurnedPuzzle(tcurrentPuzzle, nextPuzzle);

    solvedPuzzles.push(turnedPuzzle);

    return findPuzzles(puzzles, nextPuzzle, solvedPuzzles);
  }
}

function solvePuzzle(pieces) {
  return findPuzzles(pieces).map(item => item.id);
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

