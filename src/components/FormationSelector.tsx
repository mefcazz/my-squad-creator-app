
import React from 'react';
import { Card } from '@/components/ui/card';
import { Formation } from '@/types/soccer';

interface FormationSelectorProps {
  formations: Formation[];
  selectedFormation: string;
  onSelectFormation: (formationId: string) => void;
}

const FormationSelector: React.FC<FormationSelectorProps> = ({
  formations,
  selectedFormation,
  onSelectFormation
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Formation Presets</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {formations.map((formation) => (
          <Card
            key={formation.id}
            className={`p-3 cursor-pointer transition-colors ${
              selectedFormation === formation.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
            onClick={() => onSelectFormation(formation.id)}
          >
            <div className="text-center">
              <h4 className="font-medium">{formation.name}</h4>
              <div className="text-sm opacity-75 mt-1">
                {formation.positions.length} players
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormationSelector;
