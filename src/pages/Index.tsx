
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Zap, Save, Download } from 'lucide-react';
import SoccerField from '@/components/SoccerField';
import PlayerCard from '@/components/PlayerCard';
import PlayerForm from '@/components/PlayerForm';
import FormationSelector from '@/components/FormationSelector';
import { Player, Team } from '@/types/soccer';
import { formations } from '@/data/formations';
import { toast } from 'sonner';

const Index = () => {
  const [team, setTeam] = useState<Team>({
    id: '1',
    name: 'My Team',
    players: [],
    formation: '4-3-3',
  });
  
  const [isPlayerFormOpen, setIsPlayerFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>();

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

  const handleFormationChange = (formationId: string) => {
    const formation = formations.find(f => f.id === formationId);
    if (!formation) return;

    // Update player positions based on formation
    const updatedPlayers = team.players.map((player, index) => {
      const formationPosition = formation.positions[index];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚽ Soccer Lineup Manager
          </h1>
          <p className="text-gray-600">
            Create and manage your dream team with custom players and formations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Field Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    value={team.name}
                    onChange={(e) => handleTeamNameChange(e.target.value)}
                    className="text-lg font-semibold border-none bg-transparent p-0 h-auto"
                    placeholder="Team Name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportTeam} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button
                    onClick={() => setIsPlayerFormOpen(true)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Player
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SoccerField
                  players={team.players}
                  onPlayerMove={handlePlayerMove}
                  className="mb-4"
                />
                <div className="text-center text-sm text-muted-foreground">
                  Drag players to position them on the field
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Tabs defaultValue="players" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="players">
                  <Users className="h-4 w-4 mr-1" />
                  Players
                </TabsTrigger>
                <TabsTrigger value="formations">
                  <Zap className="h-4 w-4 mr-1" />
                  Formations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="players" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
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
                  <CardContent className="space-y-3">
                    {team.players.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No players added yet</p>
                        <p className="text-sm">Add your first player to get started</p>
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
              
              <TabsContent value="formations">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Formation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormationSelector
                      formations={formations}
                      selectedFormation={team.formation}
                      onSelectFormation={handleFormationChange}
                    />
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
      </div>
    </div>
  );
};

export default Index;
