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
import { Save, Trash2, Copy, Lock, Unlock, Download, Heart, HeartOff } from 'lucide-react';
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
import type { CodeBlock as CodeBlockType, Project } from '@/types';
import BlockCategory from '@/components/block-category';
import { blockCategoriesMock } from '@/data/blockCategories';
import CodeBlock from '@/components/code-block';
import WorkspaceDropZone from '@/components/workspace-drop-zone';
import BlockSearch from '@/components/block-search';
import { useToast } from '@/components/toast-provider';
import DownloadWarning from '@/components/download-warning';

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
  const [projectTitle, setProjectTitle] = useState('Loading...');
  const [isPublic, setIsPublic] = useState(true);
  const [blockSearchQuery, setBlockSearchQuery] = useState('');
  const [blockCategories, setBlockCategories] = useState(blockCategoriesMock)
  const [filteredCategories, setFilteredCategories] = useState(blockCategoriesMock);
  const [isVerified, setIsVerified] = useState(false);
  const [saving, setSaving] = useState(false); // loading state
  const [liked, setLiked] = useState(false); // if user has the project in his favorites list
  const [liking, setLiking] = useState(false); 
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [forking, setForking] = useState(false);
  const [showDownloadWarning, setShowDownloadWarning] = useState(false);


  const handleFork = () => {
    setForking(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/project/${id}/fork`, {headers:{'Authorization':`Bearer ${localStorage.getItem('access')}`}, method: 'POST'})
    .then(
      res => {
        setForking(false);
        if(!res.ok){
          throw new Error('Failed to copy this project');
        }
        return res.json()
      }
    )
    .then(
      data => {
        window.location.href = `/create/${data.id}`
      }
    )
  }

  useEffect(()=>{
      try {
        // Attempt to fetch data from the API
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/`, {headers:{'Authorization':`Bearer ${localStorage.getItem('access')}`}})
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

  const handleLike = (value:boolean) => {
    setLiking(true)
      fetch(`${import.meta.env.VITE_API_URL}/api/project/${id}/favorite`, {
        method:'POST',
        headers:{'Authorization':`Bearer ${localStorage.getItem('access')}`, 'Content-Type':'application/json'},
        body:JSON.stringify({
          value:value,
        })  
      }
      )
      .then(
        response => {
          setLiking(false)
          if(!response.ok){
            if(response.status == 401){
              throw new Error('You are not authenticated, please login first.')
            } else {
              throw new Error('An unexpected error occurred')
            }
          } else {
            setLiked(value)
          }
        }
      )
      .catch((error)=> {
        console.error(`${error}`)
        showError(`${error}`);
      })
  } 


  useEffect(()=>{
    setFilteredCategories(blockCategories)
  }, [blockCategories])

  //* Load project data when editing an existing project, after the workspace blocks are loaded
  useEffect(() => {
    //* if block categories is in its initial state, don't do anything
    if(blockCategories[0].name === 'Loading'){
      return;
    }
    const loadProject = async () => {
      if (id && id !== '0') {
        try {
          // Attempt to fetch project from API
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/project/${id}`, 
            {headers: {'Authorization': `Bearer ${localStorage.getItem('access')}`}}
          );
          if(response.status === 404) {
            throw 'Project not found'
          } else if (response.status === 429){
            throw 'You are making too many requests, please slow down.'
          }
          
          
          const data = await response.json();
          // * enable or disable editing mode depending on user ownership
          if(data.is_users == true){
            searchParams.set('editor','1')
          } else {
            searchParams.set('editor','0')
          }
          setProjectTitle(data.title);
          setIsPublic(data.public == true);
          setLiked(data.user_favorited);
          setIsVerified(data.approved == true);


          if (data.json) {
            const workspaceBlocks = data.json.map((block: CodeBlockType, index:number) => {
              //*find the block from block categories data
              let cat_block = blockCategories.flatMap(category => category.blocks).find(cat_block => cat_block.id === block.id);

              
              if(cat_block) {
                //* make the block fit the workspace block requirements
                const time = new Date()
                let inputs = cat_block.inputs?.map((input) => ({
                  'type':input.type,
                  'name':String(input.name).charAt(0).toUpperCase() + String(input.name.replace('_',' ')).slice(1),
                }))

                const converted_block = {
                  id:cat_block.id,
                  name:cat_block.name,
                  category:cat_block.category,
                  description:cat_block.description,
                  inputs:inputs,
                  values:new Array(inputs.length),
                  instanceId: `${index}-${cat_block.id}-${time.getTime()}`,
                }
                return converted_block
              } else {
                throw "Error while loading the project"
              }

              
              
            });
            setWorkspaceBlocks(workspaceBlocks);
          }
        } catch (error) {
          console.error(error)
          showError(`${error}`);
          navigate('/create/0');
        }
      } else {
        setProjectTitle('Untitled project')
      }
    };

    loadProject();
  }, [blockCategories]);

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
    setUnsavedChanges(true);

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
    setUnsavedChanges(true);
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
    setUnsavedChanges(true);
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
    setUnsavedChanges(true);
    setWorkspaceBlocks((blocks) => {
      const oldIndex = blocks.findIndex((b) => b.instanceId === activeId);
      const newIndex = blocks.findIndex((b) => b.instanceId === overId);

      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      return newBlocks;
    });
  };


  //todo
  type ProjectData = {
    isPublic:boolean,
    json:Array<[{}]>,
    title:string,
  }

  const updateProject = async (project_id:string, projectData:ProjectData) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/project/${project_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('access')}`
      },
      body: JSON.stringify(projectData),
      }
    )
    .then(
        response => {
        setSaving(false);
        if (!response.ok) {
          throw new Error('Failed to save project');
        } else {
          setUnsavedChanges(false);
          if (id === '0') {
            navigate(`/create/${project_id}`);
          }
        }
        
      }
    )
    .catch (
      error => {
        console.error(error);
        showError(`${error}`);
      }
    )   
  }

  // Handle project saving
  const handleSave = async () => {
      let json = [];
      
      for (let index = 0; index < workspaceBlocks.length; index++) {
        const element = workspaceBlocks[index];


        json.push({
          'id':element.id,
          'params':Object.values(element.values),
        })
      }

      const projectData = {
        title: projectTitle,
        json: json,
        isPublic,
      };

      let project_id = id as string;
      
      // if project is not created, create one and then update it
      if (id === '0'){
        fetch(
          `${import.meta.env.VITE_API_URL}/api/project/create`,{
            method:'POST',
            headers: {
              'Authorization': `Bearer ${window.localStorage.getItem('access')}`,
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({
              'title':projectTitle,
            })
          }
        )
        .then(
          res => {
            if (!res.ok) {
              throw new Error('Failed to save project');
            } else {
              return res.json();
            }
          }
        )
        .then(
          data => {
            project_id = data.id as string;
            updateProject(project_id, projectData);
          }
        )
      } else {
        updateProject(project_id, projectData);
      }
      
    }  

  const handleDownload = async () => {
    try {

      
      
      const platform = window.navigator.userAgent;
      console.log('Downloading project')
      let os = "Unknown OS";

      if (platform.includes("Win")) { 
          os = "Windows";
      } else if (platform.includes("Mac")) { 
          os = "MacOS";
      } else if (platform.includes("X11") || platform.includes("Linux")) { 
          os = "Linux";
      }


      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/project/${id}/download?os=${os.toLowerCase()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${window.localStorage.getItem('access')}`
        }
      });

      const data = await response.json()
      if (!response.ok) {
        
        throw new Error(`Failed to download the project. Error: ${data.error}`);
      } else {

        //*handle different OS bat and bash


        // Create a Blob from the content
        const blob = new Blob([data.script], { type: 'text/plain' });

        // Create a temporary anchor element
        const a = document.createElement('a');

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Set the download attribute with the desired file name
        a.href = url;
        a.download = `${projectTitle}.bat`;

        // Append the anchor to the document, trigger a click, and then remove the anchor
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke the object URL after the download to free up memory
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      showError(`${error}`);
    }
  } 

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
            className="text-2xl font-bold bg-transparent border-none focus:outline-none text-purple-50 w-1/2 placeholder:text-purple-200/40"
          />
        ) : (
          <h1 className="text-2xl w-1/2 font-bold text-purple-50">{projectTitle}</h1>
        )}
        <br />
        <div className="flex items-center space-x-4 mb-5 mt-5">
          {canEdit && id != '0' && (
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
          {
            id != '0' && (
              <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if(!isVerified) {
                        setShowDownloadWarning(true);
                      } else {
                        handleDownload()
                      }
                    }}
                  >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                  </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleFork}
                disabled={forking}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              </>
            )
          }
          {
            !canEdit && id != '0' && (
              <>
                {
                liked == true ? (
                  <Button
                    disabled={liking}
                    variant="outline"
                    size="sm"
                    onClick={()=>handleLike(false)} // set like to false
                  >
                      <HeartOff className="h-4 w-4 mr-2" />
                      Remove from liked
                  </Button>
                ) : (
                  <Button
                  disabled={liking}
                    variant="outline"
                    size="sm"
                    onClick={()=>handleLike(true)} // set liked to true
                  >
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                  </Button>
                )
              }
              </>
            )
          }


          {canEdit && (
            <>
              <Button size="sm" disabled={saving} onClick={() => {handleSave(); setSaving(true)}}>
                <Save className="h-4 w-4 mr-2" />
                {
                  saving ? (
                    <>Saving...</>
                  ) : (
                    <>Save</>
                  )
                }
              </Button>
            </>
          )}
          {
            unsavedChanges ? (
              <span className='text-slate-500'>* Unsaved changes</span>
            ) : (
              <></>
            )
          }
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

      <DownloadWarning
        isOpen={showDownloadWarning}
        onClose={() => setShowDownloadWarning(false)}
        onConfirm={handleDownload}
      />
    </div>
  );
}