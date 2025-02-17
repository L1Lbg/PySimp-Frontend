import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { File, GripVertical, MinusCircle, PlusCircle, X } from 'lucide-react';
import type { CodeBlock as CodeBlockType } from '@/types';
import React, { useEffect, useState } from 'react';
import { useToast } from './toast-provider';
import Tutorials from './tutorials';
import { Widget } from '@typeform/embed-react';
import getIndentPairs from '@/functions/getIndentPairs';

interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

interface WorkspaceBlockProps {
  block: WorkspaceBlock;
  blocks:Array<[]>;
  values: Record<string, any>;
  onInputChange: (inputName: string, value: string) => void;
  onDelete: () => void;
  canEdit?: boolean;
  setWorkspaceBlocks:(blocks)=>void;
}

function WorkspaceBlock  (
  { 
    block, 
    blocks,
    values, 
    onInputChange, 
    onDelete,
    canEdit = true,
    setWorkspaceBlocks,
  }: WorkspaceBlockProps){
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: block.instanceId,
    disabled: !canEdit
  });

  const {showError} = useToast();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // * array of variable suggestions for each input
  const [variableSuggestions, setVariableSuggestions] = useState([[]])

  //* handle focus on input for tutorials
  const handleFocus = (e) => {
    let block_index = e.target.list.id.split('-').reverse()[1]
    let input_index = e.target.list.id.split('-').reverse()[0]

    //* if last line tutorial has not been triggered
    if(localStorage.getItem('tut-last-line') != 'true'){
      //* if last line is in the variable suggestions
      let last_line = false
      let children = e.target.list.children
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        if(element.value == '{last_line}'){
          last_line = true
          break
        }
      }
      //* find tut and open it
      if(last_line){
        let element = document.getElementById('last-line-tut');
        if(element){
          element.style.display = 'block';
        }
      }
    }
    //* if path input tutorial has not been triggered
    else if(localStorage.getItem('tut-path-input') != 'true'){
      if(blocks[block_index]['inputs'][input_index]['type'] == 'path'){
        let element = document.getElementById('tut-path-input');
        if(element){
          element.style.display = 'block';
        }
      }
    }
  }


  //* handle list type inputs
  const handleListItemAdd = (index) => {
    setWorkspaceBlocks((prevBlocks) => {
      const newBlocks = prevBlocks.map(block =>{         
        return {
            ...block,
            values: Array.isArray(block.values) ? [...block.values] : Object.values(block.values)
          }
        }
      )
    
      
      let blockIndex = newBlocks.findIndex((b) => b.instanceId === block.instanceId);
      
      if (blockIndex !== -1) {
        if (!Array.isArray(newBlocks[blockIndex].values[index])) {
          newBlocks[blockIndex].values[index] = [];
        }
        newBlocks[blockIndex].values[index].push('');
      }
  
      return newBlocks; 
    });
  };

  const handleListItemRemove = (inputIndex, itemIndex) => {
    //*prevent user from deleting all items in list
    if(block.values[inputIndex].length == 1){
      showError('List items must be at least one.')
      return;
    }

    //* update state
    setWorkspaceBlocks((prevBlocks) => {
      // Crear una copia profunda de prevBlocks
      const newBlocks = prevBlocks.map(block => ({
        ...block,
      }));
  
      // Encuentra el bloque correcto
      const blockIndex = newBlocks.findIndex((b) => b.instanceId === block.instanceId);
  
      if (blockIndex !== -1) {
        const blockValues = newBlocks[blockIndex].values;
  
        if (Array.isArray(blockValues[inputIndex])) {
          // Eliminar el ítem con filter
          newBlocks[blockIndex].values[inputIndex] = blockValues[inputIndex].filter((_, i) => i !== itemIndex);
        }
      }
  
      return newBlocks;
    });
  };
  
  


  //* change variable suggestions when blocks are changed
  useEffect(() => {
    let newVariableSuggestions = new Array(block['inputs'].length);

    for (let index = 0; index < newVariableSuggestions.length; index++) {
      newVariableSuggestions[index] = getVariableSuggestions(index)
    }
    setVariableSuggestions(newVariableSuggestions);

  },[blocks, values, block])


  const getVariableSuggestions = (index:number) => {
    let results = ['']

    //* get index of current block, to ignore further var declarations
    let block_index = blocks.findIndex((n_block) => n_block.instanceId === block.instanceId);
    // early return for block at index 0
    if(block_index == 0){
      return []
    }

    //* determine if last line should be included in suggestions
    //* conditions: 
    // - last block has an 'assignable' attribute
    // - input type is not var

    let add = []

    if((block.inputs[index]['type'] != 'var') && (blocks[block_index-1]['assignable'] != '')){
      results.push('last_line')
    }

    //* block has a specific type of input
    if(block.inputs[index]['extra']){
      let query = block.inputs[index]['extra'].split('.')


      //* go through each block and check if blocks name is equal to the var input query
      add = blocks.slice(0, block_index+1).map(
        (block) => {
          if(block['name'].toLowerCase().includes(query[0].toLowerCase())){
            //* get index of input which is the var assigner
            let input_index = block['inputs'].findIndex((input) => (input.type == "raw_str") && (input.name.toLowerCase().includes(query[1])))
            let var_name:string = block['values'][input_index] 
            if(var_name != undefined && var_name != ''){
              return var_name
            }
          }
        }
      )
    } 
    //* add all "Set a variable" blocks
    else {
      add = blocks.slice(0, block_index+1).map(
        (block, index) => {
          if(['set a variable', 'create list', 'repeat through list'].includes(block['name'].toLowerCase())){
            //* get index of input which is the var assigner
            let input_index = block['inputs'].findIndex((input) => (input.type == "raw_str"))
            let var_name:string = block['values'][input_index] 

            //* if its a temporal variable, like from an iteration, check if block is inside to return it
            if(block['name'].toLowerCase() == 'repeat through list' || block['id'] == 63){
              
              const [indentPairs, flatIndentPairs] = getIndentPairs(blocks);
              console.log(flatIndentPairs)
              console.log(indentPairs)
              
              let blocksPair = flatIndentPairs.find((pair) => pair.start == index)
              if(blocksPair && blocksPair.end > block_index && blocksPair.start < block_index){
                return var_name
              } else {
                console.log('outside')
              }

            } else {
              if(var_name != undefined && var_name != ''){
                return var_name
              }
            }

          }
        }
      )
    }
    

    results = results.concat(add)

    results = results.filter(result => result != undefined);
    return results
  }

  return (
    <>
    <Tutorials 
      tutorials={[{text:'Set this input to the last block value!', img:'/lastline-tutorial.gif', description:'For example, if you read file contents, you can re-use them in the next block. Or if you multiply two numbers, you can re-use the result.'}]}
      hidden={true}
      id='last-line-tut'
      style={{width: '75%'}}
      onend={() => {
        localStorage.setItem('tut-last-line', 'true');
      }}
    />
    <Tutorials 
      tutorials={[{text:'This input must contain a file path.', description:`For example, the location where you want to save a file, or the location of a file you want to use for a block.<br/> <strong> It must have this pattern: ${window.navigator.userAgent.includes('Win') ? 'C:/path/to/file (the first letter can be any)' : '/path/to/file'}. </strong> <br/>To find it, you can right-click on the file and find it on 'Properties'.`}]}
      hidden={true}
      id='tut-path-input'
      style={{width: '75%'}}
      onend={() => {
        localStorage.setItem('tut-path-input', 'true');
      }}
    />

    <Card
      ref={setNodeRef}
      style={style}
      className="bg-purple-950/30 border-purple-200/20 hover:border-purple-400/30 transition-colors"
    >
      <div className="flex items-center p-4 border-b border-purple-200/10">
        {canEdit && (
          <button
            className="p-1 hover:bg-purple-200/10 rounded-md transition-colors cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-purple-200/40" />
          </button>
        )}
        <div className="flex-1 mx-3">
          <h3 className="font-semibold">{block.name}</h3>

          <p className="text-sm text-purple-200/60" dangerouslySetInnerHTML={{ __html: block.description }}></p>
          <span className='text-red-500 text-sm'>
            {
              ['', null, undefined].includes(block.incompatible_platforms) ? '' : (
                <>
                  Beware, this action is incompatible with the following platforms:
                  {
                    block.incompatible_platforms.split(' ').map((platform) => (
                    <span key={platform} className='text-white bg-gray-700 rounded-lg px-2 mx-1'>
                        {platform}
                      </span>
                    ))
                  }
                </>
              )
            }
          </span>
        </div>
        {canEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-purple-200/40 hover:text-purple-200"
            onClick={onDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {block.inputs && (
        <div className="p-4 space-y-2">
          {block.inputs.map((input, index) => (
            <div key={input.name} className="grid grid-cols-2 gap-2 items-center" id={`input-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`}>
              <label className="text-sm text-purple-200/80">{input.name.replaceAll('_',' ')}:</label>
              {
                input.type == 'str' && (
                  <input onFocus={handleFocus} disabled={!canEdit} onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} type='text' list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'all' && (
                  <input onFocus={handleFocus} disabled={!canEdit} onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} type='text' list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
              input.type == 'int' && (
                  <input onFocus={handleFocus} disabled={!canEdit} onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} step="1" type='text' pattern="[0-9]*" list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'float' && (
                  <input onFocus={handleFocus} disabled={!canEdit} onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} step="any" type='text' list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'list' && (
                  <>
                    {
                      blocks[block.instanceId.split('-')[0] - 1]?.assignable == 'list' ? (
                        <>
                          {
                            block.values[index] != '{last_line}' ? (
                              <button onClick={
                                ()=>{
                                  const newBlocks = [...blocks];
                                  const newBlock = newBlocks.find(
                                    a => a.instanceId === block.instanceId
                                  );
                                  if(newBlocks){
                                    newBlock.values[index] = '{last_line}'
                                    setWorkspaceBlocks(newBlocks);
                                  }
                                }
                              }>
                                Assign to last line
                              </button>
                            ) : (
                              <button onClick={()=>{
                                    const newBlocks = [...blocks];
                                    const newBlock = newBlocks.find(
                                      a => a.instanceId === block.instanceId
                                    );
                                    if(newBlocks){
                                      newBlock.values[index] = ['']
                                      setWorkspaceBlocks(newBlocks);
                                    }
                                  }}>
                                    Un-Assign to last line
                              </button>
                            )
                          }
                        </>
                      ) : (
                        <span></span>
                      )
                      
                    }     
                    {
                      block.values[index] != '{last_line}' ? (
                          <>
                            {
                            block.values[index].map((listItem, itemIndex) => (
                                  <>
                                    <input key={listItem} disabled={!canEdit} onChange={(e) => onInputChange(block.instanceId, e.target.value, index, itemIndex)} value={values[index][itemIndex] ?? ''} type='text' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                                    <button className='hover:bg-red-600 rounded-lg p-2 flex justify-center transition' key={`${listItem}-removeButton`} onClick={()=>handleListItemRemove(index, itemIndex)}>
                                      <MinusCircle/>
                                    </button>
                                  </>
                                ))
                              
                              }

                            <button className='hover:bg-green-400 rounded-lg p-2 flex justify-center transition' onClick={() => {
                                handleListItemAdd(index);
                              }}>
                              <PlusCircle/>
                            </button>
                          
                          
                          </>
                        
                          ) : (
                            <>
                              
                            </>
                          )
                      }
                </>

                )
              }

              {
                input.type == 'path' && (
                  <span className='flex items-center justify-center'>
                    <File className='mr-2 text-gray-400' />
                    <input onFocus={handleFocus} disabled={!canEdit} onChange={(e) => { 
                      //* sanitize
                      // if its not set as a variable
                      let value = e.target.value.replaceAll('\\', '/');
                      console.log(value[0])
                      console.log(value[value.length])
                      console.log(value.length)
                      if((value[0] != '{' ) && (value[value.length - 1] != '}')){
                        let is_windows = navigator.userAgent.includes('Win'); 
                        if(!value.includes('/')){
                          e.target.style.border = '1px solid red';
                        } else {
                          e.target.style.border = '1px solid #D1D5DB';
                        }
                        
                        if(is_windows){
                          if(value[1] != ':'){
                            e.target.style.border = '1px solid red';
                          } else {
                            e.target.style.border = '1px solid #D1D5DB';
                          }
                        } else {
                          if(value[0] != '/'){
                            e.target.style.border = '1px solid red';
                          } else {
                            e.target.style.border = '1px solid #D1D5DB';
                          }
                        }
                      } else {
                        e.target.style.border = '1px solid #D1D5DB';
                      }

                      // set
                      onInputChange(block.instanceId, value, index);
                    }
                    
                    } value={values[index] ?? ''} type='text' 
                    list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} 
                    className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                    </span>
                  )
              }

              {
                input.type == 'raw_str' && ( // raw_str inputs should show no variable suggestions
                  <input disabled={!canEdit} onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} type='text' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }
              {
                input.type == 'var' && ( 
                  <select disabled={!canEdit} onChange={(e) => {onInputChange(block.instanceId, e.target.value, index)}}  value={values[index] ?? ''} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'>
                    {
                      variableSuggestions[index]?.map(suggestion => (
                        <option value={`{${suggestion}}`} key={`{${suggestion}}`} className='text-black'>
                          {suggestion}
                        </option>
                      ))
                    }
                  </select>
                )
              }

              {
                input.type.includes('option') && (

                  <select disabled={!canEdit} onChange={(e) => onInputChange(block.instanceId, e.target.value, index)}  value={values[index] ?? ''} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'>
                    <option value={''} className='text-black rounded'>
                    </option>
                    {
                      input.type.split(':')[1].split(',').map((option) => (
                        <option key={option} value={option.split('.')[0]} className='text-black rounded'>
                          {option.split('.')[1]}
                        </option>
                      ))
                    }
                  </select>
                )
              }

              <datalist id={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`}>
                {
                  variableSuggestions[index]?.length > 0 &&
                  variableSuggestions[index].map(suggestion => 
                    suggestion !== '' && suggestion !== undefined && (
                      <option value={`{${suggestion}}`} key={suggestion}>
                        {suggestion}
                      </option>
                    )
                  )
                }
              </datalist>


            </div>
          ))}
        </div>
      )}
    </Card>
    </>

    );
  
};

export default WorkspaceBlock;