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
}

export default function WorkspaceDropZone({ blocks, onInputChange, onDeleteBlock, onReorder }: WorkspaceDropZoneProps) {
  // Set up droppable area for blocks
  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace',
  });

  // Calculate indentation level for each block
  const getBlockIndentation = (index: number) => {
    let indentLevel = 0;
    const blockStack: { id: string; level: number }[] = [];

    // First pass: find the parent block's indentation level for end blocks
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

    // Reset for actual indentation calculation
    indentLevel = 0;
    blockStack.length = 0;

    // Calculate indentation for the current block
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

    // If current block is an end block, use its stored indentation
    const currentBlock = blocks[index];
    if (currentBlock.isEndBlock) {
      return endBlockIndents.get(currentBlock.instanceId) ?? indentLevel;
    }

    // Return indentation in pixels (24px per level)
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
      <div className="text-sm text-purple-200/60 mb-4">Workspace</div>
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
                  onInputChange={(inputName, value) => onInputChange(block.instanceId, inputName, value)}
                  onDelete={() => onDeleteBlock(block.instanceId)}
                />
              </div>
            );
          })}
          {blocks.length === 0 && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-purple-200/20 rounded-lg">
              <p className="text-purple-200/40">Drag blocks here to start building</p>
            </div>
          )}
        </div>
      </SortableContext>
      {isOver && (
        <div 
          className="absolute inset-0 pointer-events-none border-2 border-purple-400/50 rounded-lg"
          style={{ zIndex: 1000 }}
        />
      )}
    </Card>
  );
}