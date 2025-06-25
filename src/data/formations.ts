
import { Formation } from '@/types/soccer';

export const formations: Formation[] = [
  // 5-a-side formations (vertical: bottom to top)
  {
    id: '2-1-1',
    name: '2-1-1 (5 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Right Flank', x: 30, y: 30 },
      { position: 'Left Flank', x: 70, y: 30 },
      { position: 'Universal', x: 50, y: 60 },
      { position: 'Pivot', x: 50, y: 85 },
    ],
  },
  {
    id: '1-2-1',
    name: '1-2-1 (5 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Defender', x: 50, y: 30 },
      { position: 'Right Flank', x: 35, y: 60 },
      { position: 'Left Flank', x: 65, y: 60 },
      { position: 'Pivot', x: 50, y: 85 },
    ],
  },
  {
    id: '1-1-2',
    name: '1-1-2 (5 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Defender', x: 50, y: 35 },
      { position: 'Universal', x: 50, y: 60 },
      { position: 'Right Flank', x: 40, y: 85 },
      { position: 'Left Flank', x: 60, y: 85 },
    ],
  },
  // 7-a-side formations (vertical: bottom to top)
  {
    id: '3-2-1',
    name: '3-2-1 (7 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Right Flank', x: 25, y: 30 },
      { position: 'Defender', x: 50, y: 30 },
      { position: 'Left Flank', x: 75, y: 30 },
      { position: 'Right Flank', x: 40, y: 60 },
      { position: 'Left Flank', x: 60, y: 60 },
      { position: 'Pivot', x: 50, y: 85 },
    ],
  },
  {
    id: '2-3-1',
    name: '2-3-1 (7 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Right Flank', x: 35, y: 30 },
      { position: 'Left Flank', x: 65, y: 30 },
      { position: 'Right Flank', x: 30, y: 55 },
      { position: 'Universal', x: 50, y: 55 },
      { position: 'Left Flank', x: 70, y: 55 },
      { position: 'Pivot', x: 50, y: 85 },
    ],
  },
  {
    id: '2-2-2',
    name: '2-2-2 (7 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Right Flank', x: 35, y: 30 },
      { position: 'Left Flank', x: 65, y: 30 },
      { position: 'Right Flank', x: 40, y: 55 },
      { position: 'Left Flank', x: 60, y: 55 },
      { position: 'Right Flank', x: 40, y: 85 },
      { position: 'Left Flank', x: 60, y: 85 },
    ],
  },
  // 8-a-side formations (vertical: bottom to top)
  {
    id: '3-3-1',
    name: '3-3-1 (8 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Right Flank', x: 25, y: 30 },
      { position: 'Defender', x: 50, y: 30 },
      { position: 'Left Flank', x: 75, y: 30 },
      { position: 'Right Flank', x: 30, y: 55 },
      { position: 'Universal', x: 50, y: 55 },
      { position: 'Left Flank', x: 70, y: 55 },
      { position: 'Pivot', x: 50, y: 85 },
    ],
  },
  {
    id: '3-2-2',
    name: '3-2-2 (8 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Right Flank', x: 25, y: 30 },
      { position: 'Defender', x: 50, y: 30 },
      { position: 'Left Flank', x: 75, y: 30 },
      { position: 'Right Flank', x: 40, y: 55 },
      { position: 'Left Flank', x: 60, y: 55 },
      { position: 'Right Flank', x: 40, y: 85 },
      { position: 'Left Flank', x: 60, y: 85 },
    ],
  },
  {
    id: '2-4-1',
    name: '2-4-1 (8 players)',
    positions: [
      { position: 'Goalkeeper', x: 50, y: 10 },
      { position: 'Right Flank', x: 35, y: 30 },
      { position: 'Left Flank', x: 65, y: 30 },
      { position: 'Right Flank', x: 25, y: 55 },
      { position: 'Universal', x: 42, y: 55 },
      { position: 'Universal', x: 58, y: 55 },
      { position: 'Left Flank', x: 75, y: 55 },
      { position: 'Pivot', x: 50, y: 85 },
    ],
  },
];
