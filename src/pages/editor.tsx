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
import type { CodeBlock as CodeBlockType } from '@/types';
import BlockCategory from '@/components/block-category';
import { blockCategoriesMock } from '@/data/blockCategories';
import CodeBlock from '@/components/code-block';
import WorkspaceDropZone from '@/components/workspace-drop-zone';
import BlockSearch from '@/components/block-search';
import { useToast } from '@/components/toast-provider';
import DownloadWarning from '@/components/download-warning';
import { EditorButtons } from '@/components/editor/editor-buttons';
import { FeedbackDialog } from '@/components/editor/feedback-dialog';
import Tour from 'reactour'
import { X } from 'lucide-react';
import Tutorials from '@/components/tutorials';
import getIndentPairs from '@/functions/getIndentPairs';

// Define the structure for workspace blocks that includes instance-specific data
interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [canEdit, setCanEdit] = useState(false);
  const { showError } = useToast();

  // State management for the editor
  const [activeId, setActiveId] = useState<string | null>(null);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<WorkspaceBlock[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectNameConfirm, setProjectNameConfirm] = useState('');
  const [projectTitle, setProjectTitle] = useState('Untitled project');
  const [isPublic, setIsPublic] = useState(false);
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
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleFork = () => {
    setForking(true);
    fetch(`${localStorage.getItem('api_url')}/api/project/${id}/fork`, {headers:{'Authorization':`Bearer ${localStorage.getItem('access')}`}, method: 'POST'})
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
        navigate(`/create/${data.id}`)
      }
    )
  }


  //* get blocks
  useEffect(()=>{
        // if(localStorage.getItem('subscription') == null){
        //   navigate('/subscribe')
        //   showError('You need to be subscribed to access this page.')
        //   return;
        // }
        // Attempt to fetch data from the API

        fetch(`${localStorage.getItem('api_url')}/api/categories/`, {headers:{'Authorization':`Bearer ${localStorage.getItem('access')}`}})
        .then(
          res => {
            if(!res.ok){
              if(res.status == 403){
                navigate('/subscribe')
                localStorage.removeItem('subscription')
                throw new Error('You need to be subscribed to access this page.')
              } else if(res.status == 401){
                navigate('/auth')
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                localStorage.removeItem('expiry')
                localStorage.removeItem('username')
                throw new Error('You are not authenticated, please login first.')
              }
              throw new Error('Failed to fetch code blocks');
            }
            return res.json()
          }
        )
        .then(
          data => {
            setBlockCategories(data)
          }
        )
        .catch(
          error => {
            showError(`${error}`);
          }
        )
  },[canEdit])

  const handleLike = (value:boolean) => {
    setLiking(true)
      fetch(`${localStorage.getItem('api_url')}/api/project/${id}/favorite`, {
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
          const response = await fetch(`${localStorage.getItem('api_url')}/api/project/${id}`, 
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
          setApprovalRequested(data.approval_requested == true);
          setApproved(data.approved == true);
          setCanEdit(data.is_users == true);

          if (data.json) {
            const workspaceBlocks = data.json.map((block: CodeBlockType, index:number) => {
              //*find the block from block categories data
              let cat_block = blockCategories.flatMap(category => category.blocks).find(cat_block => cat_block.id === block.id);


              
              if(cat_block) {
                //* make the block fit the workspace block requirements
                const time = new Date()
                let inputs = cat_block.inputs?.map((input) => ({
                  'type':input.type,
                  'name':input.name,
                  'extra':input?.extra,
                }))


                const converted_block = {
                  id:cat_block.id,
                  name:cat_block.name,
                  category:cat_block.category,
                  description:cat_block.description,
                  assignable:cat_block.assignable,
                  inputs:inputs,
                  values:block.params,
                  instanceId: `${index}-${cat_block.id}-${time.getTime()}`,
                  var_assigner:cat_block.var_assigner,
                  incompatible_platforms:cat_block.incompatible_platforms,
                }
                return converted_block
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
        setCanEdit(true)
        setWorkspaceBlocks([])
        // if not logged in user, show as demo
        if(localStorage.getItem('username') == undefined){
          showError('This is just a demo, if you want to save or download your project, please login or create an account.')
        }
        
      }
    };

    loadProject();
  }, [blockCategories, id]);

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

    if (!over) return;

    // If the dragged item is from the workspace (reordering)
    if (active.data.current?.type !== 'block') {
      handleReorderBlocks(active.id as string, over.id as string);
      return;
    }

    // Rest of the existing block creation logic...
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
      const initialValues = new Array(sourceBlock.inputs?.length || 0).fill('');

      //* if its a list type block, set value to an empty list
      let listTypeInputs = sourceBlock.inputs?.filter((input) => input.type == 'list')
      for (let index = 0; index < listTypeInputs.length; index++) {
        const element = listTypeInputs[index];
        let input_index = sourceBlock.inputs?.findIndex((input_) => input_ == element)
        initialValues[input_index] = ['',]
      }
      
      const newBlocks: WorkspaceBlock[] = [];
      
      const newBlock: WorkspaceBlock = {
        ...sourceBlock,
        instanceId,
        values: initialValues,
      };
      newBlocks.push(newBlock);
      if (sourceBlock.name.toLowerCase().startsWith('repeat ') || sourceBlock.name.toLowerCase().startsWith('conditional ')) {
        //* trigger tutorial



        //* add additional block
        let firstWord = sourceBlock.name.toLowerCase().split(' ')[0]
        const endBlock = blockCategories
          .flatMap((category) => category.blocks)
          .find((block) => block.name.toLowerCase().startsWith(`end ${firstWord}`));

        if (endBlock) {
          const endBlockInstance: WorkspaceBlock = {
            ...endBlock,
            instanceId: `${sourceBlock.id}-${Date.now()+1}`, //* same as root block + -end
            values: {},
          };
          newBlocks.push(endBlockInstance);
        } else {
          console.debug('No end block found.')
        }
      } 
      setWorkspaceBlocks((blocks) => [...blocks, ...newBlocks]);
    }
  };

  // Handle changes to block input values
  const handleInputChange = (instanceId:string, value: string, index:number, itemIndex?:number) => {
    setUnsavedChanges(true);
    if(itemIndex != undefined){
      let newBlocks = workspaceBlocks.map(block => ({
        ...block,
        values: block.values // Copia profunda de 'values'
      }));
      
      // Buscar el bloque y actualizar el valor en la copia
      let blockToUpdate = newBlocks.find(block => block.instanceId === instanceId);
      if (blockToUpdate) {
        blockToUpdate.values[index][itemIndex] = value;
      }
      
      // Actualizar el estado con el nuevo array
      setWorkspaceBlocks(newBlocks);

    } else {
            //* get type of input and sanitize values from here
          let type = workspaceBlocks.find(block => block.instanceId === instanceId)['inputs'][index]['type']
          let input_types_to_sanitize = ['int','float']
          if(input_types_to_sanitize.includes(type)){
            if(
              (value[0] !== '{')
              &&
              (value.charAt(value.length-1) !== '}')
              &&
              value !== ''
            ) {
              if(type == 'int'){
                if(isNaN(parseInt(value))){
                  return;
                }
              }
              if(type == 'float'){
                if(isNaN(parseFloat(value))){
                  return;
                }
              }
            }
          }

          //* set new blocks
          setWorkspaceBlocks((blocks) =>
            blocks.map((block) =>
              block.instanceId === instanceId
                ? { ...block, values: { ...block.values, [index]: value } }
                : block
            )
          );
    }


    
  };

  // Handle block deletion
  const handleDeleteBlock = (instanceId: string) => {
    const blockToDelete = workspaceBlocks.find(block => block.instanceId === instanceId);
    const blockToDeleteIndex = workspaceBlocks.findIndex(block => block.instanceId === instanceId);
    if (!blockToDelete) return;

    
    //* check if sibling block
    const blockName = blockToDelete.name.toLowerCase()
    if (blockName.startsWith('end ') || blockName.startsWith('repeat ') || blockName.startsWith('conditional ')) {
      let siblingBlock;
      const [indentPairs, flatIndentPairs] = getIndentPairs(workspaceBlocks)
      console.log(flatIndentPairs)
      if(blockName.startsWith('end ')){
        // get a sibling start block
        siblingBlock = workspaceBlocks[flatIndentPairs.find((b)=>b.end == blockToDeleteIndex)['start']]
      } else {
        // get a sibling end block
        siblingBlock = workspaceBlocks[flatIndentPairs.find((b)=>b.start == blockToDeleteIndex)['end']]
      }

      // delete sibling if found
      if(siblingBlock){
        setWorkspaceBlocks(blocks => blocks.filter(block => block.instanceId !== instanceId && block.instanceId !== siblingBlock.instanceId));
      } else {
        setWorkspaceBlocks(blocks => blocks.filter(block => block.instanceId !== instanceId));
      }
    } else {
      // Delete single block
      setWorkspaceBlocks(blocks => blocks.filter(block => block.instanceId !== instanceId));
    }
    setUnsavedChanges(true);
  };

  // Handle block reordering
  const handleReorderBlocks = (activeId: string, overId: string) => {
    setWorkspaceBlocks((blocks) => {

      const oldIndex = blocks.findIndex((b) => b.instanceId === activeId);
      const newIndex = blocks.findIndex((b) => b.instanceId === overId);

      //* check if block is allowed to be moved
      // check if end block

      const block = blocks.find((b) => b.instanceId === activeId);
      if(block){
        const isStartBlock = block.name.toLowerCase().startsWith('repeat ') || block.name.toLowerCase().startsWith('conditional ')
        const isEndBlock = block.name.toLowerCase().startsWith('end ')
        if(isEndBlock){
          //* get first possible startblock
          const startBlock = blocks.find((b) => b.name.toLowerCase().startsWith(block.name.toLowerCase().replace('end ', '')))

          // as long as start block index is lower than the first one
          // it shouldn't matter wether the start block was originally paired with the end block


          if(startBlock){
            let startBlockIndex = blocks.findIndex((b) => b.instanceId === startBlock.instanceId);
            if(startBlockIndex + 1 > newIndex){
              return blocks; // return original blocks and prevent re-render
            } 
          }
        } else if(isStartBlock){
          //* get first possible endblock
          const endBlock = blocks.find((b) => b.name.toLowerCase().startsWith('end ' + block.name.toLowerCase().split(' ')[0]))
          if(endBlock){
            let endBlockIndex = blocks.findIndex((b) => b.instanceId === endBlock.instanceId);
            if(endBlockIndex + 1 > newIndex){
              return blocks;
            }
          }
        }
      }



      //* normal reordering

      if (oldIndex === -1 || newIndex === -1) return blocks;

      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      setUnsavedChanges(true);
      return newBlocks;
    });
  };


  type ProjectData = {
    isPublic:boolean,
    json:Array<[{}]>,
    title:string,
    approvalRequested:boolean,
  }

  const updateProject = async (project_id:string, projectData:ProjectData, download:boolean) => {
    fetch(`${localStorage.getItem('api_url')}/api/project/${project_id}`, {
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
          return response.json().then(json => { throw new Error(json.error) })
        } else {
          setUnsavedChanges(false);
          if (id === '0') {
            navigate(`/create/${project_id}`);
          }
          if(download === true){
            handleDownload()
          }
        }
        
      }
    )
    .catch (
      error => {
        showError(`${error}`);
      }
    )   
  }

  // Handle project saving
  const handleSave = async (download?:boolean) => {

        setSaving(true);
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
          'public':isPublic,
          'approval_requested':approvalRequested,
        };
  
        let project_id = id as string;
        
        // if project is not created, create one and then update it
        if (id === '0'){
          const response = await fetch(
            `${localStorage.getItem('api_url')}/api/project/create`,{
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

          const data = await response.json()
          if(response.ok){
            project_id = data.id as string;
            updateProject(project_id, projectData, download)
          } else {
            if(response.status == 401){
              localStorage.removeItem('access')
              localStorage.removeItem('refresh')
              localStorage.removeItem('expiry')
              localStorage.removeItem('username')
              navigate('/auth')
            }
            showError(data.error)
          }
          setSaving(false);
        } else {
          updateProject(project_id, projectData, download);
        }     
      
    }  

  const handleDownload = async () => {
    try {
      // show download tut
      let element = document.getElementById('tut-download')
      if(element){
        element.style.display = 'block'
      }
      //* get platform
      const platform = window.navigator.userAgent;
      let os = "Unknown OS";
      let ext;

      if (platform.includes("Win")) { 
          os = "Windows";
          ext = 'bat'
      } else if (platform.includes("Mac")) { 
          os = "MacOS";
          ext = 'sh'

      } else if (platform.includes("X11") || platform.includes("Linux")) { 
          os = "Linux";
          ext = 'sh'
      }


      //* check if script is compatible with machine
      for (let index = 0; index < workspaceBlocks.length; index++) {
        const element = workspaceBlocks[index];
        if([null, undefined].includes(element.incompatible_platforms)){
          continue;
        }
        if(element.incompatible_platforms.split(' ').includes(os.toLowerCase())){
          showError(`We are sorry! The block ${element.name} is not compatible with your machine.`)
          return;
        }
      }


      const response = await fetch(`${localStorage.getItem('api_url')}/api/project/${id}/download?os=${os.toLowerCase()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${window.localStorage.getItem('access')}`
        }
      });

      const data = await response.json()
      if (!response.ok) {
        if(data.error){
          throw new Error(`Failed to download the project. Error: ${data.error}`);
        } else {
          throw new Error(`Failed to download the project. Error: ${data.detail}`);
        }
      } else {

        //*handle different OS bat and bash


        // Create a Blob from the content
        const blob = new Blob([data.script], { type: 'text/plain' });

        // Create a temporary anchor element
        const a = document.createElement('a');

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // get date for random file name generation
        const date = new Date();

        // Set the download attribute with the desired file name
        a.href = url;
        a.download = `${projectTitle}-${date.getMilliseconds()}.${ext}`;

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
      const response = await fetch(`${localStorage.getItem('api_url')}/api/project/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      navigate('/profile/me');
    } catch (error) {
      console.error('Failed to delete project:', error);
      showError('Failed to delete project. Please try again.');
    }

    setDeleteDialogOpen(false);
    setProjectNameConfirm('');
  };

  const editor_tutorials = [
    {
      'text':'Add blocks to your project!',
      'img':'/addblocks-tutorial.gif',
    },
    {
      'text':'Edit the content of the blocks!',
      'img':'/editblocks-tutorial.gif',
    },
    {
      'text':'Save your project and download it, after, execute it!',
      'img':'/savedownload-tutorial.gif',
    }
  ]

  const demo_editor_tutorials = [
    {
      'text':'Add blocks to your project!',
      'img':'/addblocks-tutorial.gif',
    },
    {
      'text':'Edit the content of the blocks!',
      'img':'/editblocks-tutorial.gif',
    },
  ]

  const download_tutorial = [
    {
      'text':'What to do after downloading a project',
      'description':'Open the file. If this is your first time using Autonomia, the file will do the following: \n 1. Install Python on your machine \n  2. Install the required packages \n 3. Run the script. \n \n Once this process is done only for the first time, Autonomia files will run lightning fast!',
    }
  ]

  const copy_tutorial = [
    {
      'text':'Copying a project',
      'description':"Like a project but still want to modify some of it's contents? Copy the project and make it your own to modify it as you want!",
      'img':'/copy-tutorial.gif',
    }
  ]

  const repeat_n_times_tutorial = [
    {
      'text':'Repeating blocks',
      'description':"When you add this block, fill in the amount of times you want the following actions to occur. This block adds a new block at the end called 'End Repeat', which marks the end of the actions that are going to be repeated."
    }

  ]
  const repeat_tutorial = [
    {
      'text':'Repeating through lists',
      'description':"When you repeat through a list, you will realize the same action for each item inside that list. First set an item name, which sets the name of the current item on the list. Secondly, use that item inside one of your actions."
    }

  ]

  const conditionals_tutorial = [
    {
      'text':'Conditional blocks',
      'description':"These blocks check if a condition is true, if it's true, it will run the blocks inside it."
    }
  ]


  return (
    <>

    {
      localStorage.getItem('tut-editor') != 'true' && canEdit && (
        <>
          {
            localStorage.getItem('username') == undefined ? (
              <Tutorials 
                tutorials={demo_editor_tutorials}
                onend={()=>{localStorage.setItem('tut-editor', 'true')}}
              />
            ) : (
              <Tutorials 
                  tutorials={editor_tutorials}
                  onend={()=>{localStorage.setItem('tut-editor', 'true')}}
                />
            )
          }
        </>
      )
    }

    {
      localStorage.getItem('tut-download') != 'true' && canEdit && localStorage.getItem('username') != undefined &&(
        <Tutorials 
          tutorials={download_tutorial}
          id={'tut-download'}
          onend={()=>{localStorage.setItem('tut-download', 'true')}}
          style={{'display':'none'}}
        />
      )
    }

{
      localStorage.getItem('tut-repeat-n') != 'true' && canEdit &&(
        <Tutorials 
          tutorials={repeat_n_times_tutorial}
          id={'tut-repeat-n'}
          onend={()=>{localStorage.setItem('tut-repeat-n', 'true')}}
          style={{'display':'none'}}
        />
      )
    }
    {
      localStorage.getItem('tut-repeat') != 'true' && canEdit && (
        <Tutorials 
          tutorials={repeat_tutorial}
          id={'tut-repeat'}
          onend={()=>{localStorage.setItem('tut-repeat', 'true')}}
          style={{'display':'none'}}
        />
      )
    }
    {
      localStorage.getItem('tut-conditionals') != 'true' && canEdit &&(
        <Tutorials 
          tutorials={conditionals_tutorial}
          id={'tut-conditionals'}
          onend={()=>{localStorage.setItem('tut-conditionals', 'true')}}
          style={{'display':'none'}}
        />
      )
    }

    {
      localStorage.getItem('tut-copy') != 'true' && !canEdit && localStorage.getItem('username') != undefined && (
        <Tutorials 
          tutorials={copy_tutorial}
          id={'tut-download'}
          onend={()=>{localStorage.setItem('tut-copy', 'true')}}
        />
      )
    }

    <div className="container mx-auto px-4 py-8">
      {/* Project header */}

      {
        localStorage.getItem('username') != undefined && (
            <EditorButtons
                  canEdit={canEdit}
                  id={id}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  setDeleteDialogOpen={setDeleteDialogOpen}
                  isVerified={isVerified}
                  setShowDownloadWarning={setShowDownloadWarning}
                  unsavedChanges={unsavedChanges}
                  handleSave={handleSave}
                  handleDownload={handleDownload}
                  handleFork={handleFork}
                  forking={forking}
                  setFeedbackOpen={setFeedbackOpen}
                  liked={liked}
                  liking={liking}
                  handleLike={handleLike}
                  saving={saving}
                  projectTitle={projectTitle}
                  setProjectTitle={setProjectTitle}
                  approvalRequested={approvalRequested}
                  setApprovalRequested={setApprovalRequested}
                  approved={approved}
            />
        )
      }

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
              className="lg:col-span-4  lg:w-1/2 w-full flex flex-col mb-8"
            >
              <Card className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-purple-200/20">
                  <BlockSearch onSearch={setBlockSearchQuery} />
                </div>
                <Tabs defaultValue={filteredCategories[0]?.id} className="flex-1 flex flex-col">
                  <TabsList className="overflow-x w-full justify-start border-b border-purple-200/20 rounded-none bg-purple-950/20">
                        {
                        filteredCategories.map((category) => (
                          <>
                            {
                              category.blocks.length > 0 && (
                                <TabsTrigger
                                  key={category.id}
                                  value={category.id}
                                  className="data-[state=active]:bg-purple-200/10"
                                >
                                  {category.name}
                                </TabsTrigger> 
                              ) 
                            }
                          </>
                        ))
                        }
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
              setWorkspaceBlocks={setWorkspaceBlocks}
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
            <DialogDescription style={{'userSelect':'none'}} >
              This action cannot be undone. Please type "{projectTitle}" to
              confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            id='example'
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
        onConfirm={()=>{
          if(unsavedChanges == true){
            handleSave(true) // if unsaved changes, execute handle save with download = true
          } else {
            handleDownload();
          }
        }}
      />

      <FeedbackDialog
          open={feedbackOpen}
          onOpenChange={setFeedbackOpen}
        />
    </div>
    </>

  );
}