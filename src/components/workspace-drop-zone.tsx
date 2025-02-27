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
  onReorder,
  canEdit, 
  setWorkspaceBlocks,
}: WorkspaceDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace',
  });

  const getBlockIndentationLevel = (instanceId:string) => {
    let indentLevel = 0
    
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index];
      //* if current block reached, break out
      if(block.instanceId == instanceId){
        // and if its an end block, 
        if(block.name.toLowerCase().startsWith('end ')){
          indentLevel -= 1
        }
        break;
      }

      if(block.name.toLowerCase().startsWith('repeat ') || block.name.toLowerCase().startsWith('conditional ')){
        indentLevel += 1
      } else if(block.name.toLowerCase().startsWith('end ')){
        indentLevel -= 1
      }
    }


      return indentLevel;
    }

  return (
    <Card 
      ref={setNodeRef}
      className={`p-4 min-h-[600px] transition-colors ${
        isOver ? 'border-purple-400/50 bg-purple-950/20' : ''
      }`}
    >
      <SortableContext 
        items={blocks.map(b => b.instanceId)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {blocks.map((block) => (
            <div 
              key={`${block.instanceId}`} 
              style={{
                marginLeft:`${getBlockIndentationLevel(block.instanceId) * 20}px`
              }}
              className={`transition-all duration-200 `}
            >
              <WorkspaceBlock
                block={block}
                blocks={blocks}
                values={block.values}
                onInputChange={onInputChange}
                onDelete={() => onDeleteBlock(block.instanceId)}
                canEdit={canEdit}
                setWorkspaceBlocks={setWorkspaceBlocks}
              />
            </div>
          ))}
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