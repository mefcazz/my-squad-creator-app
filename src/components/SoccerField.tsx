import React from 'react';
import { cn } from '@/lib/utils';
import { Player } from '@/types/soccer';
interface SoccerFieldProps {
  players: Player[];
  onPlayerMove: (playerId: string, x: number, y: number) => void;
  className?: string;
}
const SoccerField: React.FC<SoccerFieldProps> = ({
  players,
  onPlayerMove,
  className
}) => {
  const handleDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/plain', playerId);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('text/plain');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    onPlayerMove(playerId, Math.max(5, Math.min(95, x)), Math.max(5, Math.min(95, y)));
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  return <div className={cn("relative w-full h-96 bg-gradient-to-b from-green-400 to-green-600 rounded-lg overflow-hidden border-2 border-white shadow-lg", className)} onDrop={handleDrop} onDragOver={handleDragOver}>
      {/* Field markings */}
      <div className="absolute inset-0 bg-gray-950">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
        
        {/* Center line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white opacity-70"></div>
        
        {/* Goals */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4 h-20 border-2 border-r-0 border-white opacity-70"></div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-20 border-2 border-l-0 border-white opacity-70"></div>
        
        {/* Penalty areas */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-16 h-32 border-2 border-l-0 border-white opacity-70"></div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-32 border-2 border-r-0 border-white opacity-70"></div>
      </div>

      {/* Players */}
      {players.map(player => <div key={player.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move" style={{
      left: `${player.x}%`,
      top: `${player.y}%`
    }} draggable onDragStart={e => handleDragStart(e, player.id)}>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-110 transition-transform">
              {player.jerseyNumber}
            </div>
            <span className="text-xs text-white font-medium mt-1 bg-black bg-opacity-50 px-1 rounded">
              {player.name}
            </span>
          </div>
        </div>)}
    </div>;
};
export default SoccerField;