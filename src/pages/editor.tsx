// Import necessary dependencies and components
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
import { mockProjects } from '@/data/mockData';
import type { CodeBlock as CodeBlockType, Project } from '@/types';
import BlockCategory from '@/components/block-category';
import BlockCategoryType from '@/components/block-category';
import { blockCategoriesMock } from '@/data/blockCategories';
import CodeBlock from '@/components/code-block';
import WorkspaceDropZone from '@/components/workspace-drop-zone';
import BlockSearch from '@/components/block-search';
import { useToast } from '@/components/toast-provider';

// Define the structure for workspace blocks that includes instance-specific data
interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canEdit = searchParams.get('editor') !== '0';
  const { showError } = useToast();

  // State management for the editor
  const [activeId, setActiveId] = useState<string | null>(null);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<WorkspaceBlock[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectNameConfirm, setProjectNameConfirm] = useState('');
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [isPublic, setIsPublic] = useState(true);
  const [blockSearchQuery, setBlockSearchQuery] = useState('');
  const [blockCategories, setBlockCategories] = useState(blockCategoriesMock)
  const [filteredCategories, setFilteredCategories] = useState(blockCategoriesMock);

  useEffect(()=>{
      try {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMzMTY5NDcwLCJpYXQiOjE3MzMxNjU4NzAsImp0aSI6ImYzZWJhMzVjZWViYTQ0ZTM5MzFiYzQwMGY0NmUyOTFkIiwidXNlcl9pZCI6Imx1Y2EuYmFleWVuc0BpY2xvdWQuY29tIn0.d4I0gCrGBprVaYm-5k458kep85VdIGIW0KyPD504oHA';
        // Attempt to fetch data from the API
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/`, {headers:{'Authorization':`Bearer ${token}`}})
        .then(
          res => {
            if(!res.ok){
              throw new Error('Failed to fetch categories');
            }
            return res.json()
          }
        )
        .then(
          data => {
            setBlockCategories(data)
          }
        )
      } catch (error) {
        console.error('API fetch failed, falling back to mock data:', error);
      }
  },[])

  useEffect(()=>{
    console.log('changing block categories')
    setFilteredCategories(blockCategories)
  }, [blockCategories])

  // Load project data when editing an existing project
  useEffect(() => {
    const loadProject = async () => {
      if (id && id !== '0') {
        try {
          // Attempt to fetch project from API
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
          const data = await response.json();
          setProjectTitle(data.title);
          setIsPublic(data.isPublic ?? true);
          // Convert project blocks to workspace blocks
          if (data.blocks) {
            const workspaceBlocks = data.blocks.map((block: CodeBlockType) => ({
              ...block,
              instanceId: `${block.id}-${Date.now()}`,
              values: block.inputs?.reduce((acc, input) => ({
                ...acc,
                [input.name]: '',
              }), {}) ?? {},
            }));
            setWorkspaceBlocks(workspaceBlocks);
          }
        } catch (error) {
          // Fall back to mock data if API fails
          const mockProject = mockProjects.find(p => p.id === id);
          if (mockProject) {
            setProjectTitle(mockProject.title);
            setIsPublic(true);
          } else {
            showError('Project not found');
            navigate('/create/0');
          }
        }
      }
    };

    loadProject();
  }, [id, navigate, showError]);

  // Filter block categories based on search query
  useEffect(() => {
    if (blockSearchQuery) {
      const filtered = blockCategories.map(category => ({
        ...category,
        blocks: category.blocks.filter(block =>
          block.name.toLowerCase().includes(blockSearchQuery.toLowerCase()) ||
          block.description.toLowerCase().includes(blockSearchQuery.toLowerCase())
        )
      })).filter(category => category.blocks.length > 0);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(blockCategories);
    }
  }, [blockSearchQuery]);

  // Get the currently dragged block for overlay
  const activeBlock = activeId
    ? blockCategories.flatMap((c) => c.blocks).find((b) => b.id === activeId)
    : null;

  // Handle the start of a drag operation
  const handleDragStart = (event: DragStartEvent) => {
    if (!canEdit) return;
    setActiveId(event.active.id as string);
  };

  // Handle the end of a drag operation
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

      // get id from block categories
      const sourceBlock = blockCategories
        .flatMap((category) => category.blocks)
        .find((block) => block.id === active.id);

      if (sourceBlock) {
        const instanceId = `${sourceBlock.id}-${Date.now()}`;
        const initialValues = sourceBlock.inputs?.reduce(
          (acc, input) => ({
            ...acc,
            [input.name]: '',
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

        // If the block requires an end block, add it automatically
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

  // Handle changes to block input values
  const handleInputChange = (instanceId: string, inputName: string, value: any) => {
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
      // Delete single block
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

  // Handle project saving
  const handleSave = async () => {
    try {
      const projectData = {
        id: id === '0' ? undefined : id,
        title: projectTitle,
        blocks: workspaceBlocks,
        isPublic,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects${id === '0' ? '' : `/${id}`}`, {
        method: id === '0' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const savedProject = await response.json();
      if (id === '0') {
        navigate(`/create/${savedProject.id}`);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      showError('Failed to save project. Please try again.');
    }
  };

  // Handle project deletion
  const handleDelete = async () => {
    if (id === '0') return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      navigate('/create/0');
    } catch (error) {
      console.error('Failed to delete project:', error);
      showError('Failed to delete project. Please try again.');
    }

    setDeleteDialogOpen(false);
    setProjectNameConfirm('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project header */}
      <div className="">
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
        <br />
        <div className="flex items-center space-x-4 mb-5 mt-5">
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/create/0`)}
          >
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
        <div className="lg:flex block gap-8">
          {/* Block palette */}
          {canEdit && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 h-[calc(100vh-12rem)] lg:w-1/2 w-full flex flex-col mb-8"
            >
              <Card className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-purple-200/20">
                  <BlockSearch onSearch={setBlockSearchQuery} />
                </div>
                <Tabs defaultValue={filteredCategories[0]?.id} className="flex-1 flex flex-col">
                  <TabsList className="w-full justify-start border-b border-purple-200/20 rounded-none bg-purple-950/20">
                    {filteredCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-purple-200/10"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="flex-1 overflow-hidden">
                    {filteredCategories.map((category) => (
                      <TabsContent 
                        key={category.id} 
                        value={category.id}
                        className="h-full m-0"
                      >
                        <BlockCategory 
                          category={category} 
                          activeId={activeId}
                          globalSearchQuery=""
                        />
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </Card>
            </motion.div>
          )}

          {/* Workspace */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 lg:w-1/2 w-full"
            style={{ 
              gridColumn: canEdit ? 'span 8 / span 8' : '1 / -1',
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