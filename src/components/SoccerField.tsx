
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

  return (
    <div 
      className={cn("relative w-full aspect-[2/3] bg-gradient-to-b from-red-900 via-red-950 to-red-900 rounded-lg overflow-hidden border-2 border-white shadow-lg", className)} 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
    >
      {/* Field markings */}
      <div className="absolute inset-0">
        {/* Outer field boundary */}
        <div className="absolute inset-2 border-2 border-white rounded-sm"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
        
        {/* Center line (horizontal) */}
        <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2 h-0.5 bg-white"></div>
        
        {/* Goals */}
        {/* Top goal */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 border-2 border-b-0 border-white rounded-t-sm"></div>
        {/* Bottom goal */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 border-2 border-t-0 border-white rounded-b-sm"></div>
        
        {/* Penalty areas */}
        {/* Top penalty area */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-40 h-16 border-2 border-t-0 border-white"></div>
        {/* Bottom penalty area */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-16 border-2 border-b-0 border-white"></div>
        
        {/* Six-yard boxes */}
        {/* Top six-yard box */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-8 border-2 border-t-0 border-white"></div>
        {/* Bottom six-yard box */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-8 border-2 border-b-0 border-white"></div>
        
        {/* Penalty spots */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
        
        {/* Corner arcs */}
        <div className="absolute top-2 left-2 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-full"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-full"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-full"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-full"></div>
      </div>

      {/* Players */}
      {players.map(player => (
        <div 
          key={player.id} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move" 
          style={{
            left: `${player.x}%`,
            top: `${player.y}%`
          }} 
          draggable 
          onDragStart={e => handleDragStart(e, player.id)}
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white border-4 border-red-600 flex items-center justify-center text-red-600 font-bold text-sm shadow-lg hover:scale-110 transition-transform overflow-hidden">
              {player.jerseyNumber}
            </div>
            <span className="text-xs text-white font-bold mt-1 bg-black bg-opacity-60 px-2 py-0.5 rounded uppercase tracking-wide">
              {player.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoccerField;
