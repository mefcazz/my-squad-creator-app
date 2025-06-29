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
  showJerseyNumbers?: boolean;
  rotateField?: boolean;
}

const SoccerField: React.FC<SoccerFieldProps> = ({
  players,
  onPlayerMove,
  fieldColor = 'from-red-900 via-red-950 to-red-900',
  className,
  playerSize = 48,
  showJerseyNumbers = true,
  rotateField = false
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

  // Transform player positions when field is rotated
  const getTransformedPlayers = () => {
    if (!rotateField) return players;
    
    return players.map(player => ({
      ...player,
      y: 100 - player.y // Flip vertically (top becomes bottom, bottom becomes top)
    }));
  };

  const transformedPlayers = getTransformedPlayers();

  return (
    <div 
      className={cn(`relative w-full aspect-[2/3] bg-gradient-to-b ${fieldColor} rounded-lg overflow-hidden border-2 border-white shadow-lg transition-all duration-300`, className)} 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
      data-field="true"
    >
      {/* Field markings */}
      <div className="absolute inset-0">
        {/* Outer field boundary */}
        <div className="absolute inset-0 border-2 border-white rounded-lg"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
        
        {/* Center line (horizontal) */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-0.5 bg-white"></div>
        
        {/* Goals */}
        {/* Top goal */}
        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-20 h-4 border-2 border-t-0 border-white"></div>
        {/* Bottom goal */}
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-20 h-4 border-2 border-b-0 border-white"></div>
        
        {/* Penalty areas */}
        {/* Top penalty area */}
        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-40 h-16 border-2 border-t-0 border-white"></div>
        {/* Bottom penalty area */}
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-40 h-16 border-2 border-b-0 border-white"></div>
        
        {/* Six-yard boxes */}
        {/* Top six-yard box */}
        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-20 h-8 border-2 border-t-0 border-white"></div>
        {/* Bottom six-yard box */}
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-20 h-8 border-2 border-b-0 border-white"></div>
        
        {/* Penalty spots */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
        
        {/* Penalty arc lines - connected to penalty area */}
        {/* Top penalty arc */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 border-b-2 border-white rounded-b-full"></div>
        {/* Bottom penalty arc */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 border-t-2 border-white rounded-t-full"></div>
        
        {/* Corner arcs - made bigger */}
        <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-full"></div>
        <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-full"></div>
        <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-full"></div>
        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-full"></div>
      </div>

      {/* Players */}
      {transformedPlayers.map(player => (
        <div 
          key={player.id} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none transition-all duration-300 hover:scale-105 animate-fade-in" 
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
                  className="border-2 border-white shadow-lg hover:scale-110 transition-transform pointer-events-none"
                  style={{ width: `${playerSize}px`, height: `${playerSize}px` }}
                >
                  <AvatarImage src={player.profilePhoto} alt={player.name} className="pointer-events-none" />
                  <AvatarFallback className="bg-red-600 text-white font-bold pointer-events-none">
                    {player.name[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div 
                  className="rounded-full bg-white border-2 border-red-600 flex items-center justify-center text-red-600 font-bold shadow-lg hover:scale-110 transition-transform pointer-events-none"
                  style={{ 
                    width: `${playerSize}px`, 
                    height: `${playerSize}px`,
                    fontSize: `${Math.max(10, playerSize * 0.25)}px`
                  }}
                >
                  {player.jerseyNumber}
                </div>
              )}
              {showJerseyNumbers && (
                <div 
                  className="absolute -bottom-1 -right-1 rounded-full bg-red-600 text-white flex items-center justify-center font-bold border-2 border-white pointer-events-none transition-all duration-200"
                  style={{ 
                    width: `${Math.max(16, playerSize * 0.35)}px`, 
                    height: `${Math.max(16, playerSize * 0.35)}px`,
                    fontSize: `${Math.max(8, playerSize * 0.2)}px`
                  }}
                >
                  {player.jerseyNumber}
                </div>
              )}
            </div>
            <div 
              className="mt-2 px-2 py-0.5 font-bold text-white whitespace-nowrap pointer-events-none transition-all duration-200"
              style={{ 
                fontSize: `${Math.max(10, playerSize * 0.22)}px`,
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontWeight: '900',
                letterSpacing: '0.025em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                textAlign: 'center',
                display: 'block',
                width: '100%'
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
