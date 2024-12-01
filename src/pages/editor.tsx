import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { Save, Trash2, Copy, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { blockCategories } from '@/data/blockCategories';
import type { CodeBlock as CodeBlockType } from '@/types';
import BlockCategory from '@/components/block-category';
import CodeBlock from '@/components/code-block';
import WorkspaceDropZone from '@/components/workspace-drop-zone';
import BlockSearch from '@/components/block-search';
import { useToast } from '@/components/toast-provider';

interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

export default function Editor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const canEdit = searchParams.get('editor') !== '0';
  const { showError } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<WorkspaceBlock[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectNameConfirm, setProjectNameConfirm] = useState('');
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [isPublic, setIsPublic] = useState(true);
  const [blockSearchQuery, setBlockSearchQuery] = useState('');

  useEffect(() => {
    if (id) {
      // Fetch project data when editing existing project
      // This would normally be an API call
      setProjectTitle(`Project ${id}`);
    }
  }, [id]);

  // Get the currently dragged block for overlay
  const activeBlock = activeId
    ? blockCategories.flatMap((c) => c.blocks).find((b) => b.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    if (!canEdit) return;
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!canEdit) return;
    const { active, over } = event;
    setActiveId(null);

    if (over) {
      const blockLimit = 200;
      if (workspaceBlocks.length >= blockLimit) {
        showError(`Block limit of ${blockLimit} reached. You cannot add more blocks.`);
        return;
      }

      const sourceBlock = blockCategories
        .flatMap((category) => category.blocks)
        .find((block) => block.id === active.id);

      if (sourceBlock) {
        const instanceId = `${sourceBlock.id}-${Date.now()}`;
        const initialValues = sourceBlock.inputs?.reduce(
          (acc, input) => ({
            ...acc,
            [input.name]: input.default,
          }),
          {}
        ) ?? {};

        const newBlocks: WorkspaceBlock[] = [];
        
        const newBlock: WorkspaceBlock = {
          ...sourceBlock,
          instanceId,
          values: initialValues,
        };
        newBlocks.push(newBlock);

        if (sourceBlock.hasEndBlock) {
          const endBlock = blockCategories
            .flatMap((category) => category.blocks)
            .find((block) => block.isEndBlock && block.parentBlockId === sourceBlock.id);

          if (endBlock) {
            const endBlockInstance: WorkspaceBlock = {
              ...endBlock,
              instanceId: `${endBlock.id}-${Date.now()}`,
              values: {},
            };
            newBlocks.push(endBlockInstance);
          }
        }

        setWorkspaceBlocks((blocks) => [...blocks, ...newBlocks]);
      }
    }
  };

  const handleInputChange = (instanceId: string, inputName: string, value: any) => {
    setWorkspaceBlocks((blocks) =>
      blocks.map((block) =>
        block.instanceId === instanceId
          ? { ...block, values: { ...block.values, [inputName]: value } }
          : block
      )
    );
  };

  const handleDeleteBlock = (instanceId: string) => {
    const blockToDelete = workspaceBlocks.find(block => block.instanceId === instanceId);
    if (!blockToDelete) return;

    if (blockToDelete.hasEndBlock) {
      setWorkspaceBlocks(blocks => blocks.filter(block => 
        block.instanceId !== instanceId && 
        !(block.isEndBlock && block.parentBlockId === blockToDelete.id)
      ));
    } else if (blockToDelete.isEndBlock) {
      const parentBlock = workspaceBlocks.find(block => 
        blockToDelete.parentBlockId === block.id
      );
      if (parentBlock) {
        setWorkspaceBlocks(blocks => blocks.filter(block => 
          block.instanceId !== instanceId && 
          block.instanceId !== parentBlock.instanceId
        ));
      }
    } else {
      setWorkspaceBlocks(blocks => blocks.filter(block => block.instanceId !== instanceId));
    }
  };

  const handleReorderBlocks = (activeId: string, overId: string) => {
    setWorkspaceBlocks((blocks) => {
      const oldIndex = blocks.findIndex((b) => b.instanceId === activeId);
      const newIndex = blocks.findIndex((b) => b.instanceId === overId);

      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      return newBlocks;
    });
  };

  const handleSave = () => {
    console.log('Saving project:', {
      title: projectTitle,
      blocks: workspaceBlocks,
      isPublic,
    });
  };

  const handleDelete = () => {
    console.log('Deleting project');
    setDeleteDialogOpen(false);
    setProjectNameConfirm('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project header */}
      <div className="flex items-center justify-between mb-8">
        {canEdit ? (
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none text-purple-50 placeholder:text-purple-200/40"
          />
        ) : (
          <h1 className="text-2xl font-bold text-purple-50">{projectTitle}</h1>
        )}
        
        <div className="flex items-center space-x-4">
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPublic(!isPublic)}
                className={isPublic ? 'text-green-400' : 'text-yellow-400'}
              >
                {isPublic ? (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Private
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Fork
          </Button>
          {canEdit && (
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Main editor area */}
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Block palette */}
          {canEdit && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 lg:col-span-4"
            >
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-purple-200/20">
                  <BlockSearch onSearch={setBlockSearchQuery} />
                </div>
                <Tabs defaultValue="math">
                  <TabsList className="w-full justify-start border-b border-purple-200/20 rounded-none bg-purple-950/20">
                    {blockCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-purple-200/10"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {blockCategories.map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                      <BlockCategory 
                        category={category} 
                        activeId={activeId}
                        globalSearchQuery={blockSearchQuery}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            </motion.div>
          )}

          {/* Workspace */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
            style={{ 
              gridColumn: canEdit ? 'span 8 / span 8' : '1 / -1',
              width: '100%'
            }}
          >
            <WorkspaceDropZone
              blocks={workspaceBlocks}
              onInputChange={handleInputChange}
              onDeleteBlock={handleDeleteBlock}
              onReorder={handleReorderBlocks}
              canEdit={canEdit}
            />
          </motion.div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeBlock && <CodeBlock block={activeBlock} isTemplate />}
        </DragOverlay>
      </DndContext>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type "{projectTitle}" to
              confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={projectNameConfirm}
            onChange={(e) => setProjectNameConfirm(e.target.value)}
            placeholder="Enter project name"
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={projectNameConfirm !== projectTitle}
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}