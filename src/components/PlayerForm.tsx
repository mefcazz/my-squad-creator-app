
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player } from '@/types/soccer';

interface PlayerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, 'id'>) => void;
  player?: Player;
}

const positions = [
  'Goalkeeper', 'Right Back', 'Center Back', 'Left Back',
  'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder',
  'Right Winger', 'Left Winger', 'Striker', 'Center Forward'
];

const PlayerForm: React.FC<PlayerFormProps> = ({ isOpen, onClose, onSave, player }) => {
  const [formData, setFormData] = useState({
    name: player?.name || '',
    position: player?.position || '',
    jerseyNumber: player?.jerseyNumber || 1,
    x: player?.x || 50,
    y: player?.y || 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: '', position: '', jerseyNumber: 1, x: 50, y: 50 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{player ? 'Edit Player' : 'Add New Player'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter player name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="position">Position</Label>
            <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="jersey">Jersey Number</Label>
            <Input
              id="jersey"
              type="number"
              min="1"
              max="99"
              value={formData.jerseyNumber}
              onChange={(e) => setFormData({ ...formData, jerseyNumber: parseInt(e.target.value) })}
              required
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {player ? 'Update' : 'Add'} Player
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerForm;
