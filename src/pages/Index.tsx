import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Zap, Save, Download, Camera, Palette, MapPin } from 'lucide-react';
import SoccerField from '@/components/SoccerField';
import PlayerCard from '@/components/PlayerCard';
import PlayerForm from '@/components/PlayerForm';
import FormationSelector from '@/components/FormationSelector';
import PositionAssignment from '@/components/PositionAssignment';
import { Player, Team } from '@/types/soccer';
import { formations } from '@/data/formations';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

const fieldColors = [
  { id: 'classic', name: 'Classic Green', color: 'from-green-700 via-green-800 to-green-700' },
  { id: 'dark', name: 'Dark Red', color: 'from-red-900 via-red-950 to-red-900' },
  { id: 'blue', name: 'Ocean Blue', color: 'from-blue-700 via-blue-800 to-blue-700' },
  { id: 'purple', name: 'Royal Purple', color: 'from-purple-700 via-purple-800 to-purple-700' },
  { id: 'emerald', name: 'Emerald', color: 'from-emerald-700 via-emerald-800 to-emerald-700' },
  { id: 'orange', name: 'Sunset Orange', color: 'from-orange-700 via-orange-800 to-orange-700' },
];

const Index = () => {
  const [team, setTeam] = useState<Team>({
    id: '1',
    name: 'My Team',
    players: [],
    formation: '4-3-3',
  });
  
  const [isPlayerFormOpen, setIsPlayerFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>();
  const [fieldColor, setFieldColor] = useState('dark');
  const [playerSize, setPlayerSize] = useState(48);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Load team from localStorage on component mount
  useEffect(() => {
    const savedTeam = localStorage.getItem('soccerTeam');
    if (savedTeam) {
      setTeam(JSON.parse(savedTeam));
    }
  }, []);

  // Save team to localStorage whenever team changes
  useEffect(() => {
    localStorage.setItem('soccerTeam', JSON.stringify(team));
  }, [team]);

  const handleAddPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: Date.now().toString(),
    };
    
    setTeam(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
    
    toast.success(`${playerData.name} added to the team!`);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsPlayerFormOpen(true);
  };

  const handleUpdatePlayer = (playerData: Omit<Player, 'id'>) => {
    if (!editingPlayer) return;
    
    setTeam(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === editingPlayer.id 
          ? { ...playerData, id: editingPlayer.id }
          : p
      )
    }));
    
    setEditingPlayer(undefined);
    toast.success('Player updated successfully!');
  };

  const handleDeletePlayer = (playerId: string) => {
    setTeam(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }));
    
    toast.success('Player removed from team');
  };

  const handlePlayerMove = (playerId: string, x: number, y: number) => {
    setTeam(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, x, y } : p
      )
    }));
  };

  const handleUpdatePlayerPosition = (playerId: string, position: string) => {
    setTeam(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, position } : p
      )
    }));
    
    toast.success('Player position updated!');
  };

  const handleFormationChange = (formationId: string) => {
    const formation = formations.find(f => f.id === formationId);
    if (!formation) return;

    const positionPriority: { [key: string]: number } = {
      'Goalkeeper': 1,
      'Defender': 2,
      'Right Flank': 3, 'Left Flank': 3,
      'Universal': 4,
      'Winger': 5,
      'Pivot': 6
    };

    const sortedPlayers = [...team.players].sort((a, b) => {
      const aPriority = positionPriority[a.position] || 999;
      const bPriority = positionPriority[b.position] || 999;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.jerseyNumber - b.jerseyNumber;
    });

    const updatedPlayers = team.players.map((player) => {
      const matchingFormationPos = formation.positions.find(fp => 
        fp.position === player.position && 
        !sortedPlayers.slice(0, sortedPlayers.indexOf(player)).some(sp => sp.position === fp.position)
      );
      
      if (matchingFormationPos) {
        return { ...player, x: matchingFormationPos.x, y: matchingFormationPos.y };
      }
      
      const playerIndex = sortedPlayers.indexOf(player);
      const formationPosition = formation.positions[playerIndex];
      return formationPosition 
        ? { ...player, x: formationPosition.x, y: formationPosition.y }
        : player;
    });

    setTeam(prev => ({
      ...prev,
      formation: formationId,
      players: updatedPlayers
    }));

    toast.success(`Formation changed to ${formation.name}`);
  };

  const handleTeamNameChange = (name: string) => {
    setTeam(prev => ({ ...prev, name }));
  };

  const exportTeam = () => {
    const dataStr = JSON.stringify(team, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${team.name}_lineup.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Team lineup exported!');
  };

  const downloadFieldAsImage = async () => {
    if (!fieldRef.current) return;
    
    try {
      // Phone dimensions (9:16 aspect ratio) - proper phone size
      const phoneWidth = 360;
      const phoneHeight = 640;
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = `${phoneWidth}px`;
      tempContainer.style.height = `${phoneHeight}px`;
      
      // Use the same background color as the field
      const currentFieldColor = fieldColors.find(f => f.id === fieldColor)?.color || fieldColors[1].color;
      tempContainer.style.background = `linear-gradient(to bottom, ${currentFieldColor.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').map(color => {
        // Convert Tailwind color classes to actual colors
        if (color.includes('red-900')) return '#7f1d1d';
        if (color.includes('red-950')) return '#450a0a';
        if (color.includes('green-700')) return '#15803d';
        if (color.includes('green-800')) return '#166534';
        if (color.includes('blue-700')) return '#1d4ed8';
        if (color.includes('blue-800')) return '#1e40af';
        if (color.includes('purple-700')) return '#7c3aed';
        if (color.includes('purple-800')) return '#6b21a8';
        if (color.includes('emerald-700')) return '#047857';
        if (color.includes('emerald-800')) return '#065f46';
        if (color.includes('orange-700')) return '#c2410c';
        if (color.includes('orange-800')) return '#9a3412';
        return '#7f1d1d'; // fallback
      }).join(', ')})`;
      
      tempContainer.style.padding = '20px';
      tempContainer.style.boxSizing = 'border-box';
      tempContainer.style.display = 'flex';
      tempContainer.style.flexDirection = 'column';
      document.body.appendChild(tempContainer);
      
      // Add team name header with elegant font
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '15px';
      header.style.flexShrink = '0';
      header.innerHTML = `
        <h1 style="font-size: 28px; font-weight: 700; color: white; margin: 0; font-family: 'Playfair Display', serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
          ${team.name}
        </h1>
        <p style="font-size: 16px; color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-family: Arial, sans-serif; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
          teamLineup by ataya
        </p>
      `;
      tempContainer.appendChild(header);
      
      const fieldContainer = document.createElement('div');
      fieldContainer.style.flex = '1';
      fieldContainer.style.display = 'flex';
      fieldContainer.style.alignItems = 'center';
      fieldContainer.style.justifyContent = 'center';
      fieldContainer.style.marginBottom = '15px';
      
      const fieldClone = fieldRef.current.cloneNode(true) as HTMLElement;
      fieldClone.style.position = 'relative';
      fieldClone.style.width = '100%';
      fieldClone.style.maxWidth = `${phoneWidth - 40}px`;
      fieldClone.style.height = 'auto';
      fieldClone.style.aspectRatio = '2/3';
      
      // Fix all player positions and text positioning
      const playerElements = fieldClone.querySelectorAll('[data-player="true"]');
      playerElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.position = 'absolute';
        htmlElement.style.transform = 'translate(-50%, -50%)';
        htmlElement.style.zIndex = '10';
        
        // Fix text positioning - ensure names are properly positioned
        const nameElement = htmlElement.querySelector('div:last-child') as HTMLElement;
        if (nameElement) {
          nameElement.style.marginTop = '4px';
          nameElement.style.textAlign = 'center';
          nameElement.style.lineHeight = '1.2';
        }
      });
      
      fieldContainer.appendChild(fieldClone);
      tempContainer.appendChild(fieldContainer);
      
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: phoneWidth,
        height: phoneHeight,
      });
      
      document.body.removeChild(tempContainer);
      
      const link = document.createElement('a');
      link.download = `${team.name}_lineup.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Lineup image downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-background bg-vintage-pattern font-radikal">
      {/* Subtle decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-900/5 to-orange-800/3 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-bl from-stone-700/4 to-amber-900/2 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-amber-800/3 to-stone-600/2 blur-2xl"></div>
      </div>

      <div className="relative z-10 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 font-radikal">
              ⚽ Team Lineup
            </h1>
            <p className="text-muted-foreground font-radikal">
              Made by ataya
            </p>
          </div>

          {/* Team Name and Controls */}
          <div className="mb-4 sm:mb-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                    <Label htmlFor="team-name" className="font-radikal font-semibold whitespace-nowrap">Team Name:</Label>
                    <Input
                      id="team-name"
                      value={team.name}
                      onChange={(e) => handleTeamNameChange(e.target.value)}
                      className="text-lg font-semibold font-radikal sm:max-w-xs"
                      placeholder="Enter team name"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={exportTeam} variant="outline" size="sm" className="font-radikal text-xs sm:text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export JSON
                    </Button>
                    <Button onClick={downloadFieldAsImage} variant="outline" size="sm" className="font-radikal text-xs sm:text-sm">
                      <Camera className="h-4 w-4 mr-1" />
                      Download Image
                    </Button>
                    <Button
                      onClick={() => setIsPlayerFormOpen(true)}
                      size="sm"
                      className="font-radikal text-xs sm:text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Player
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Field Area */}
            <div className="order-1 lg:order-none lg:col-span-2">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-3 sm:p-6">
                  <div ref={fieldRef}>
                    <SoccerField
                      players={team.players}
                      onPlayerMove={handlePlayerMove}
                      fieldColor={fieldColors.find(f => f.id === fieldColor)?.color || fieldColors[1].color}
                      className="mb-4"
                      playerSize={playerSize}
                    />
                  </div>
                  <div className="text-center text-xs sm:text-sm text-muted-foreground font-radikal">
                    Drag players to position them on the field
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="order-2 lg:order-none space-y-4 sm:space-y-6">
              <Tabs defaultValue="players" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-muted/50 h-auto">
                  <TabsTrigger value="players" className="font-radikal text-xs sm:text-sm p-2">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Players</span>
                  </TabsTrigger>
                  <TabsTrigger value="positions" className="font-radikal text-xs sm:text-sm p-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Positions</span>
                  </TabsTrigger>
                  <TabsTrigger value="formations" className="font-radikal text-xs sm:text-sm p-2">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Formations</span>
                  </TabsTrigger>
                  <TabsTrigger value="customize" className="font-radikal text-xs sm:text-sm p-2">
                    <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Field</span>
                  </TabsTrigger>
                  <TabsTrigger value="players-size" className="font-radikal text-xs sm:text-sm p-2">
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Size</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="players" className="space-y-4 mt-4">
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="p-4">
                      <CardTitle className="flex items-center justify-between font-radikal text-sm sm:text-base">
                        Squad ({team.players.length}/11)
                        <Button
                          onClick={() => setIsPlayerFormOpen(true)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0 max-h-96 overflow-y-auto">
                      {team.players.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="font-radikal">No players added yet</p>
                          <p className="text-sm font-radikal">Add your first player to get started</p>
                        </div>
                      ) : (
                        team.players.map((player) => (
                          <PlayerCard
                            key={player.id}
                            player={player}
                            onEdit={handleEditPlayer}
                            onDelete={handleDeletePlayer}
                          />
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="positions" className="mt-4">
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="p-4">
                      <CardTitle className="font-radikal text-sm sm:text-base">Assign Positions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 max-h-96 overflow-y-auto">
                      <PositionAssignment
                        players={team.players}
                        onUpdatePlayerPosition={handleUpdatePlayerPosition}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="formations" className="mt-4">
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="p-4">
                      <CardTitle className="font-radikal text-sm sm:text-base">Choose Formation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 max-h-96 overflow-y-auto">
                      <FormationSelector
                        formations={formations}
                        selectedFormation={team.formation}
                        onSelectFormation={handleFormationChange}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="customize" className="mt-4">
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="p-4">
                      <CardTitle className="font-radikal text-sm sm:text-base">Field Color</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 pt-0">
                      <div className="space-y-2">
                        <Label htmlFor="field-color" className="font-radikal">Choose Field Color</Label>
                        <Select value={fieldColor} onValueChange={setFieldColor}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field color" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldColors.map((color) => (
                              <SelectItem key={color.id} value={color.id} className="font-radikal">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${color.color}`}></div>
                                  {color.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-radikal">Preview</Label>
                        <div className={`w-full h-16 rounded bg-gradient-to-r ${fieldColors.find(f => f.id === fieldColor)?.color || fieldColors[1].color} border-2 border-white/20`}></div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="players-size" className="mt-4">
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="p-4">
                      <CardTitle className="font-radikal text-sm sm:text-base">Player Size</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 pt-0">
                      <div className="space-y-2">
                        <Label htmlFor="player-size" className="font-radikal">Adjust Player Size</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground font-radikal">Small</span>
                            <input
                              type="range"
                              id="player-size"
                              min="24"
                              max="72"
                              step="4"
                              value={playerSize}
                              onChange={(e) => setPlayerSize(Number(e.target.value))}
                              className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground font-radikal">Large</span>
                          </div>
                          <div className="text-center text-sm text-muted-foreground font-radikal">
                            Current size: {playerSize}px
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-radikal">Preview</Label>
                        <div className="flex justify-center p-4 bg-muted/20 rounded">
                          <div className="relative">
                            <div 
                              className="rounded-full bg-white border border-red-600 flex items-center justify-center text-red-600 font-bold shadow-lg"
                              style={{ 
                                width: `${playerSize}px`, 
                                height: `${playerSize}px`,
                                fontSize: `${Math.max(10, playerSize * 0.25)}px`
                              }}
                            >
                              10
                            </div>
                            <div 
                              className="absolute -bottom-1 -right-1 rounded-full bg-red-600 text-white flex items-center justify-center font-bold border border-white"
                              style={{ 
                                width: `${Math.max(16, playerSize * 0.35)}px`, 
                                height: `${Math.max(16, playerSize * 0.35)}px`,
                                fontSize: `${Math.max(8, playerSize * 0.2)}px`
                              }}
                            >
                              10
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <PlayerForm
            isOpen={isPlayerFormOpen}
            onClose={() => {
              setIsPlayerFormOpen(false);
              setEditingPlayer(undefined);
            }}
            onSave={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
            player={editingPlayer}
          />

          {/* Credit Footer */}
          <div className="text-center mt-6 sm:mt-8 pb-4">
            <p className="text-sm text-muted-foreground font-radikal">
              Made with ❤️ by <span className="font-semibold text-foreground">ataya гзл</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
