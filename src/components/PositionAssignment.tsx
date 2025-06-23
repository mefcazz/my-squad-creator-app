
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player } from '@/types/soccer';

interface PositionAssignmentProps {
  players: Player[];
  onUpdatePlayerPosition: (playerId: string, position: string) => void;
}

const positions = [
  'Goalkeeper',
  'Right Back',
  'Center Back', 
  'Left Back',
  'Defensive Midfielder',
  'Central Midfielder',
  'Attacking Midfielder',
  'Right Midfielder',
  'Left Midfielder',
  'Right Winger',
  'Left Winger',
  'Striker',
  'Center Forward',
  'Right Striker',
  'Left Striker'
];

const PositionAssignment: React.FC<PositionAssignmentProps> = ({
  players,
  onUpdatePlayerPosition
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Position Assignment</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {players.map((player) => (
          <Card key={player.id} className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {player.jerseyNumber}
                </div>
                <span className="font-medium text-sm truncate">{player.name}</span>
              </div>
              <Select
                value={player.position}
                onValueChange={(value) => onUpdatePlayerPosition(player.id, value)}
              >
                <SelectTrigger className="w-40 text-xs">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos} className="text-xs">
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
        {players.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-radikal">No players to assign positions</p>
            <p className="text-sm font-radikal">Add players first</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionAssignment;
