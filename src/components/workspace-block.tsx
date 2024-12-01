import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GripVertical, X } from 'lucide-react';
import { Input } from './ui/input';
import type { CodeBlock as CodeBlockType } from '@/types';

interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

interface WorkspaceBlockProps {
  block: WorkspaceBlock;
  values: Record<string, any>;
  onInputChange: (inputName: string, value: string) => void;
  onDelete: () => void;
  canEdit?: boolean;
}

export default function WorkspaceBlock({ 
  block, 
  values, 
  onInputChange, 
  onDelete,
  canEdit = true 
}: WorkspaceBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: block.instanceId,
    disabled: !canEdit
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="bg-purple-950/30 border-purple-200/20 hover:border-purple-400/30 transition-colors"
    >
      <div className="flex items-center p-4 border-b border-purple-200/10">
        {canEdit && (
          <button
            className="p-1 hover:bg-purple-200/10 rounded-md transition-colors cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-purple-200/40" />
          </button>
        )}
        <div className="flex-1 mx-3">
          <h3 className="font-semibold">{block.name}</h3>
          <p className="text-sm text-purple-200/60">{block.description}</p>
        </div>
        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-purple-200/40 hover:text-purple-200"
            onClick={onDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {block.inputs && (
        <div className="p-4 space-y-2">
          {block.inputs.map((input) => (
            <div key={input.name} className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-purple-200/80">{input.name}:</label>
              <Input
                type={input.type === 'number' ? 'number' : 'text'}
                value={values[input.name] ?? input.default ?? ''}
                onChange={(e) => onInputChange(input.name, e.target.value)}
                className="col-span-2 h-8 text-sm"
                placeholder={`${input.default}`}
                disabled={!canEdit}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}