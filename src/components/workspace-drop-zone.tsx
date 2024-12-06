import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './ui/card';
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
  canEdit?: boolean;
}

export default function WorkspaceDropZone({ 
  blocks, 
  onInputChange, 
  onDeleteBlock, 
  canEdit = true 
}: WorkspaceDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace',
  });

  const getBlockIndentation = (index: number) => {
    let indentLevel = 0;
    const blockStack: { id: string; level: number }[] = [];

    const endBlockIndents = new Map<string, number>();
    blocks.forEach((block, i) => {
      if (block.hasEndBlock) {
        blockStack.push({ id: block.id, level: indentLevel });
        indentLevel++;
      } else if (block.isEndBlock) {
        const parentBlock = blockStack.pop();
        if (parentBlock) {
          endBlockIndents.set(block.instanceId, parentBlock.level);
          indentLevel = parentBlock.level;
        }
      }
    });

    indentLevel = 0;
    blockStack.length = 0;

    for (let i = 0; i < index; i++) {
      const block = blocks[i];
      
      if (block.hasEndBlock) {
        blockStack.push({ id: block.id, level: indentLevel });
        indentLevel++;
      } else if (block.isEndBlock) {
        const parentBlock = blockStack.pop();
        if (parentBlock) {
          indentLevel = parentBlock.level;
        }
      }
    }

    const currentBlock = blocks[index];
    if (currentBlock.isEndBlock) {
      return endBlockIndents.get(currentBlock.instanceId) ?? indentLevel;
    }

    return indentLevel * 24;
  };

  return (
    <Card 
      ref={setNodeRef}
      className={`p-4 min-h-[600px] transition-colors ${
        isOver ? 'border-purple-400/50 bg-purple-950/20' : ''
      }`}
      style={{ position: 'relative' }}
    >
      <SortableContext items={blocks.map(b => b.instanceId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const indentation = getBlockIndentation(index);
            return (
              <div 
                key={block.instanceId} 
                style={{ marginLeft: `${indentation}px` }}
                className="transition-all duration-200"
              >
                <WorkspaceBlock
                  block={block}
                  values={block.values}
                  onInputChange={onInputChange}
                  onDelete={() => onDeleteBlock(block.instanceId)}
                  canEdit={canEdit}
                />
              </div>
            );
          })}
          {blocks.length === 0 && canEdit && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-purple-200/20 rounded-lg">
              <p className="text-purple-200/40">Drag blocks here to start building</p>
            </div>
          )}
          {blocks.length === 0 && !canEdit && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-purple-200/20 rounded-lg">
              <p className="text-purple-200/40">This project is empty</p>
            </div>
          )}
        </div>
      </SortableContext>
      {isOver && canEdit && (
        <div 
          className="absolute inset-0 pointer-events-none border-2 border-purple-400/50 rounded-lg"
          style={{ zIndex: 1000 }}
        />
      )}
    </Card>
  );
}