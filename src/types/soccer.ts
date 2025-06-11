
export interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber: number;
  x: number; // percentage position on field
  y: number; // percentage position on field
}

export interface Formation {
  id: string;
  name: string;
  positions: {
    position: string;
    x: number;
    y: number;
  }[];
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  formation: string;
}
