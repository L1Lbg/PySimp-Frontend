import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { Save, Trash2, GitFork, Lock, Unlock } from 'lucide-react';
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
import { useToast } from '@/components/toast-provider';

interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

export default function Editor() {
  // State management
  const { showError } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<WorkspaceBlock[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectNameConfirm, setProjectNameConfirm] = useState('');
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [isPublic, setIsPublic] = useState(true);

  // Track active drag operation
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end and block placement
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // Always treat as workspace drop if we're over any valid target
    if (over) {
      const blockLimit = 200;
      if (workspaceBlocks.length >= blockLimit) {
        showError(`Block limit of ${blockLimit} reached. You cannot add more blocks.`);
        return;
      }

      // Find the source block from our block categories
      const sourceBlock = blockCategories
        .flatMap((category) => category.blocks)
        .find((block) => block.id === active.id);

      if (sourceBlock) {
        const instanceId = `${sourceBlock.id}-${Date.now()}`;
        // Initialize block values with defaults
        const initialValues =
          sourceBlock.inputs?.reduce(
            (acc, input) => ({
              ...acc,
              [input.name]: input.default,
            }),
            {}
          ) ?? {};

        const newBlocks: WorkspaceBlock[] = [];
        
        // Add the main block
        const newBlock: WorkspaceBlock = {
          ...sourceBlock,
          instanceId,
          values: initialValues,
        };
        newBlocks.push(newBlock);

        // If it has an end block, add it immediately after
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

        // Add new blocks to workspace
        setWorkspaceBlocks((blocks) => [...blocks, ...newBlocks]);
        return;
      }

      // Handle reordering if we're moving existing blocks
      if (over.id !== 'workspace') {
        const activeBlock = workspaceBlocks.find((b) => b.instanceId === active.id);
        const overBlock = workspaceBlocks.find((b) => b.instanceId === over.id);

        if (activeBlock && overBlock) {
          const oldIndex = workspaceBlocks.indexOf(activeBlock);
          const newIndex = workspaceBlocks.indexOf(overBlock);

          const newBlocks = [...workspaceBlocks];
          newBlocks.splice(oldIndex, 1);
          newBlocks.splice(newIndex, 0, activeBlock);

          // Move end block along with its parent
          if (activeBlock.hasEndBlock) {
            const endBlockIndex = newBlocks.findIndex(
              (block) => block.isEndBlock && block.parentBlockId === activeBlock.id
            );
            if (endBlockIndex !== -1) {
              const [endBlock] = newBlocks.splice(endBlockIndex, 1);
              newBlocks.splice(newIndex + 1, 0, endBlock);
            }
          }

          setWorkspaceBlocks(newBlocks);
        }
      }
    }
  };

  // Handle input changes in blocks
  const handleInputChange = (
    instanceId: string,
    inputName: string,
    value: any
  ) => {
    setWorkspaceBlocks((blocks) =>
      blocks.map((block) =>
        block.instanceId === instanceId
          ? { ...block, values: { ...block.values, [inputName]: value } }
          : block
      )
    );
  };

  // Handle block deletion
  const handleDeleteBlock = (instanceId: string) => {
    const blockToDelete = workspaceBlocks.find(block => block.instanceId === instanceId);
    if (!blockToDelete) return;

    if (blockToDelete.hasEndBlock) {
      // Delete both the block and its end block
      setWorkspaceBlocks(blocks => blocks.filter(block => 
        block.instanceId !== instanceId && 
        !(block.isEndBlock && block.parentBlockId === blockToDelete.id)
      ));
    } else if (blockToDelete.isEndBlock) {
      // Delete both the end block and its parent
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

  // Handle block reordering
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

  // Project management functions
  const handleSave = () => {
    console.log('Saving project:', {
      title: projectTitle,
      blocks: workspaceBlocks,
      isPublic,
    });
  };

  const handleFork = () => {
    console.log('Forking project');
  };

  const handleDelete = () => {
    console.log('Deleting project');
    setDeleteDialogOpen(false);
    setProjectNameConfirm('');
  };

  const toggleVisibility = () => {
    setIsPublic(!isPublic);
  };

  // Get the currently dragged block for overlay
  const activeBlock = activeId
    ? blockCategories.flatMap((c) => c.blocks).find((b) => b.id === activeId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project header */}
      <div className="flex items-center justify-between mb-8">
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="text-2xl font-bold bg-transparent border-none focus:outline-none text-purple-50 placeholder:text-purple-200/40"
        />
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVisibility}
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
          <Button variant="outline" size="sm" onClick={handleFork}>
            <GitFork className="h-4 w-4 mr-2" />
            Fork
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Block palette */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="overflow-hidden">
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
                    <BlockCategory category={category} activeId={activeId} />
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </motion.div>

          {/* Workspace */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <WorkspaceDropZone
              blocks={workspaceBlocks}
              onInputChange={handleInputChange}
              onDeleteBlock={handleDeleteBlock}
              onReorder={handleReorderBlocks}
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