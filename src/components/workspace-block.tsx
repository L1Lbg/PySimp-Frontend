import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GripVertical, X } from 'lucide-react';
import type { CodeBlock as CodeBlockType } from '@/types';
import { useEffect, useState } from 'react';

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
}

export default function WorkspaceBlock({ 
  block, 
  blocks,
  values, 
  onInputChange, 
  onDelete,
  canEdit = true 
}: WorkspaceBlockProps) {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // * array of variable suggestions for each input
  const [variableSuggestions, setVariableSuggestions] = useState([[]])


  

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
    } else {
      //* add all "Set a variable" blocks
      add = blocks.slice(0, block_index+1).map(
        (block) => {
          if(block['name'].toLowerCase() == 'set a variable'){
            //* get index of input which is the var assigner
            let input_index = block['inputs'].findIndex((input) => (input.type == "raw_str"))
            let var_name:string = block['values'][input_index] 
            if(var_name != undefined && var_name != ''){
              return var_name
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
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} type='text' list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
              input.type == 'int' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} step="1" type='text' pattern="[0-9]*" list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'float' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} step="any" type='text' list={`variable-suggestions-${blocks.findIndex((n_block) => n_block.instanceId === block.instanceId)}-${index}`} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'raw_str' && ( // raw_str inputs should show no variable suggestions
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} type='text' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }
              {
                input.type == 'var' && ( 
                  <select onChange={(e) => {onInputChange(block.instanceId, e.target.value, index)}}  value={values[index] ?? ''} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'>
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

                  <select onChange={(e) => onInputChange(block.instanceId, e.target.value, index)}  value={values[index] ?? ''} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'>
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
  );
}