import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, Crop } from 'lucide-react';
import { Player } from '@/types/soccer';
import ImageCropper from './ImageCropper';

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
    profilePhoto: player?.profilePhoto || '',
  });
  
  const [tempImage, setTempImage] = useState<string>('');
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempImage(result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setFormData({ ...formData, profilePhoto: croppedImage });
    setTempImage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: '', position: '', jerseyNumber: 1, x: 50, y: 50, profilePhoto: '' });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{player ? 'Edit Player' : 'Add New Player'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Label>Profile Photo</Label>
              <div className="relative">
                <Avatar className="w-20 h-20">
                  {formData.profilePhoto ? (
                    <AvatarImage src={formData.profilePhoto} alt={formData.name} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {formData.name ? formData.name[0].toUpperCase() : '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload & Crop Photo
              </Button>
            </div>
            
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

      <ImageCropper
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onCrop={handleCropComplete}
        imageSrc={tempImage}
      />
    </>
  );
};

export default PlayerForm;
