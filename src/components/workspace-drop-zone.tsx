import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import WorkspaceBlock from './workspace-block';
import type { CodeBlock as CodeBlockType } from '@/types';

interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

interface WorkspaceDropZoneProps {
  blocks: WorkspaceBlock[];
  onInputChange: (instanceId: string, inputName: string, value: any) => void;
  onDeleteBlock: (instanceId: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export default function WorkspaceDropZone({ blocks, onInputChange, onDeleteBlock, onReorder }: WorkspaceDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace',
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`p-4 min-h-[600px] transition-colors ${
        isOver ? 'border-purple-400/50 bg-purple-950/20' : ''
      }`}
    >
      <div className="text-sm text-purple-200/60 mb-4">Workspace</div>
      <SortableContext items={blocks.map(b => b.instanceId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {blocks.map((block) => (
            <WorkspaceBlock
              key={block.instanceId}
              block={block}
              values={block.values}
              onInputChange={(inputName, value) => onInputChange(block.instanceId, inputName, value)}
              onDelete={() => onDeleteBlock(block.instanceId)}
            />
          ))}
          {blocks.length === 0 && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-purple-200/20 rounded-lg">
              <p className="text-purple-200/40">Drag blocks here to start building</p>
            </div>
          )}
        </div>
      </SortableContext>
    </Card>
  );
}