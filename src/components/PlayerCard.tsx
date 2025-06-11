
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/soccer';
import { Edit, Trash2 } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete }) => {
  return (
    <Card className="p-3 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {player.jerseyNumber}
        </div>
        <div>
          <h4 className="font-medium">{player.name}</h4>
          <p className="text-sm text-muted-foreground">{player.position}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(player)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(player.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default PlayerCard;
