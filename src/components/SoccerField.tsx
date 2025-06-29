
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Player } from '@/types/soccer';

interface SoccerFieldProps {
  players: Player[];
  onPlayerMove: (playerId: string, x: number, y: number) => void;
  fieldColor?: string;
  className?: string;
  playerSize?: number;
}

const SoccerField: React.FC<SoccerFieldProps> = ({
  players,
  onPlayerMove,
  fieldColor = 'from-red-900 via-red-950 to-red-900',
  className,
  playerSize = 48
}) => {
  const handleDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/plain', playerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTouchStart = (e: React.TouchEvent, playerId: string) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    
    element.dataset.touchStartX = touch.clientX.toString();
    element.dataset.touchStartY = touch.clientY.toString();
    element.dataset.playerId = playerId;
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const fieldElement = document.querySelector('[data-field="true"]') as HTMLElement;
    if (!fieldElement) return;

    const rect = fieldElement.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    const draggingElement = document.querySelector('[data-dragging="true"]') as HTMLElement;
    if (draggingElement) {
      draggingElement.style.left = `${Math.max(5, Math.min(95, x))}%`;
      draggingElement.style.top = `${Math.max(5, Math.min(95, y))}%`;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const draggingElement = document.querySelector('[data-dragging="true"]') as HTMLElement;
    if (draggingElement) {
      const playerId = draggingElement.dataset.playerId;
      const fieldElement = document.querySelector('[data-field="true"]') as HTMLElement;
      if (playerId && fieldElement) {
        const rect = fieldElement.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        onPlayerMove(playerId, Math.max(5, Math.min(95, x)), Math.max(5, Math.min(95, y)));
      }
      draggingElement.removeAttribute('data-dragging');
      draggingElement.removeAttribute('data-player-id');
    }
    
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
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
      className={cn(`relative w-full aspect-[2/3] bg-gradient-to-b ${fieldColor} rounded-lg overflow-hidden border-2 border-white shadow-lg`, className)} 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
      data-field="true"
    >
      {/* Field markings */}
      <div className="absolute inset-0">
        {/* Outer field boundary */}
        <div className="absolute inset-2 border border-white rounded-sm"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
        
        {/* Center line (horizontal) */}
        <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2 h-0.5 bg-white"></div>
        
        {/* Goals */}
        {/* Top goal */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 border border-b-0 border-white rounded-t-sm"></div>
        {/* Bottom goal */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 border border-t-0 border-white rounded-b-sm"></div>
        
        {/* Penalty areas */}
        {/* Top penalty area */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-40 h-16 border border-t-0 border-white"></div>
        {/* Bottom penalty area */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-16 border border-b-0 border-white"></div>
        
        {/* Six-yard boxes */}
        {/* Top six-yard box */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-8 border border-t-0 border-white"></div>
        {/* Bottom six-yard box */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-8 border border-b-0 border-white"></div>
        
        {/* Penalty spots */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
        
        {/* Corner arcs */}
        <div className="absolute top-2 left-2 w-4 h-4 border-b border-r border-white rounded-br-full"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-b border-l border-white rounded-bl-full"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-t border-r border-white rounded-tr-full"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-t border-l border-white rounded-tl-full"></div>
      </div>

      {/* Players */}
      {players.map(player => (
        <div 
          key={player.id} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none" 
          style={{
            left: `${player.x}%`,
            top: `${player.y}%`
          }} 
          draggable 
          onDragStart={e => handleDragStart(e, player.id)}
          onTouchStart={e => {
            handleTouchStart(e, player.id);
            e.currentTarget.setAttribute('data-dragging', 'true');
            e.currentTarget.setAttribute('data-player-id', player.id);
          }}
          data-player="true"
        >
          <div className="flex flex-col items-center pointer-events-none">
            <div className="relative">
              {player.profilePhoto ? (
                <Avatar 
                  className="border border-white shadow-lg hover:scale-110 transition-transform pointer-events-none"
                  style={{ width: `${playerSize}px`, height: `${playerSize}px` }}
                >
                  <AvatarImage src={player.profilePhoto} alt={player.name} className="pointer-events-none" />
                  <AvatarFallback className="bg-red-600 text-white font-bold pointer-events-none">
                    {player.name[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div 
                  className="rounded-full bg-white border border-red-600 flex items-center justify-center text-red-600 font-bold shadow-lg hover:scale-110 transition-transform pointer-events-none"
                  style={{ 
                    width: `${playerSize}px`, 
                    height: `${playerSize}px`,
                    fontSize: `${Math.max(10, playerSize * 0.25)}px`
                  }}
                >
                  {player.jerseyNumber}
                </div>
              )}
              <div 
                className="absolute -bottom-1 -right-1 rounded-full bg-red-600 text-white flex items-center justify-center font-bold border border-white pointer-events-none"
                style={{ 
                  width: `${Math.max(16, playerSize * 0.35)}px`, 
                  height: `${Math.max(16, playerSize * 0.35)}px`,
                  fontSize: `${Math.max(8, playerSize * 0.2)}px`
                }}
              >
                {player.jerseyNumber}
              </div>
            </div>
            <div 
              className="mt-1 px-2 py-0.5 font-bold text-white whitespace-nowrap pointer-events-none drop-shadow-lg"
              style={{ 
                fontSize: `${Math.max(10, playerSize * 0.22)}px`,
                fontFamily: 'Arial, sans-serif',
                fontWeight: '700',
                letterSpacing: '0.025em'
              }}
            >
              {player.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoccerField;
