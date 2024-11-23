import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';
import { Save, Trash2, GitFork } from 'lucide-react';
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

interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

export default function Editor() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<WorkspaceBlock[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectNameConfirm, setProjectNameConfirm] = useState('');
  const [projectTitle, setProjectTitle] = useState('Untitled Project');

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle reordering within workspace
    if (over.id !== 'workspace') {
      const activeBlock = workspaceBlocks.find(
        (b) => b.instanceId === active.id
      );
      const overBlock = workspaceBlocks.find((b) => b.instanceId === over.id);

      if (activeBlock && overBlock) {
        const oldIndex = workspaceBlocks.indexOf(activeBlock);
        const newIndex = workspaceBlocks.indexOf(overBlock);

        const newBlocks = [...workspaceBlocks];
        newBlocks.splice(oldIndex, 1);
        newBlocks.splice(newIndex, 0, activeBlock);

        setWorkspaceBlocks(newBlocks);
        return;
      }
    }

    // Handle new block drops
    if (over.id === 'workspace') {
      const blockLimit = 1;
      if (workspaceBlocks.length >= blockLimit) {
        console.error(
          `Blocks are limited to ${blockLimit}. You cannot add more`
        );
        return;
      }
      // find the block from categories
      const sourceBlock = blockCategories
        .flatMap((category) => category.blocks)
        .find((block) => block.id === active.id);
      // if found, setup their initial values
      // and add to workspace
      if (sourceBlock) {
        const instanceId = `${sourceBlock.id}-${Date.now()}`;
        const initialValues =
          sourceBlock.inputs?.reduce(
            (acc, input) => ({
              ...acc,
              [input.name]: input.default,
            }),
            {}
          ) ?? {};

        const newBlock: WorkspaceBlock = {
          ...sourceBlock,
          instanceId,
          values: initialValues,
        };
        // set in workspace
        console.log(workspaceBlocks);
        console.log(newBlock);
        setWorkspaceBlocks((blocks) => [...blocks, newBlock]);
      }
    }
  };

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

  const handleDeleteBlock = (instanceId: string) => {
    setWorkspaceBlocks((blocks) =>
      blocks.filter((block) => block.instanceId !== instanceId)
    );
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

  const activeBlock = activeId
    ? blockCategories.flatMap((c) => c.blocks).find((b) => b.id === activeId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="text-2xl font-bold bg-transparent border-none focus:outline-none text-purple-50 placeholder:text-purple-200/40"
        />
        <div className="flex items-center space-x-4">
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

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <DragOverlay>
          {activeBlock && <CodeBlock block={activeBlock} isTemplate />}
        </DragOverlay>
      </DndContext>

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
