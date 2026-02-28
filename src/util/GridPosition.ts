export interface GridPos {
  row: number; // 0 = top of board, 7 = bottom
  col: number; // 0 = left, 7 = right
}

export function posKey(pos: GridPos): string {
  return `${pos.row},${pos.col}`;
}

export function posEqual(a: GridPos, b: GridPos): boolean {
  return a.row === b.row && a.col === b.col;
}

export function areAdjacent(a: GridPos, b: GridPos): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}
