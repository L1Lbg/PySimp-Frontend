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


  const [variableSuggestions, setVariableSuggestions] = useState([[]]) // this should be updated from script, to have a context of what blocks come before


  

  //* change variable suggestions when blocks are changed
  useEffect(() => {
    let newVariableSuggestions = new Array(block['inputs'].length);

    for (let index = 0; index < newVariableSuggestions.length; index++) {
      newVariableSuggestions[index] = getVariableSuggestions(index)
    }
    setVariableSuggestions(newVariableSuggestions); 
    
  },[blocks])


  const getVariableSuggestions = (index:number) => {
    let results = ['']

    if(block.inputs[index]['extra']){
      let queries = block.inputs[index]['extra'].split('.')


      for (let index = 0; index < queries.length; index++) {
        // get index of current block, to ignore further var declarations
        let block_index = blocks.findIndex((n_block) => n_block.instanceId === block.instanceId);
        // if blocks name is equal to the var input query
        let add = blocks.slice(0, block_index+1).map(
          (block) => {
            if(block['name'].toLowerCase().includes(queries[index].toLowerCase())){
              // get index of input which is the var assigner
              let input_index = block['inputs'].findIndex((input) => input.name == block['var_assigner'])
              
              let var_name:string = block['values'][input_index] 
              if(var_name != undefined && var_name != ''){
                return var_name
              }
            }
          }
        )
        
        results = results.concat(add)
        
        
      }
    }
    results = results.filter(result => result != undefined);
    console.log(results);
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
            <div key={input.name} className="grid grid-cols-2 gap-2 items-center">
              <label className="text-sm text-purple-200/80">{input.name.replaceAll('_',' ')}:</label>
              {
                input.type == 'str' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} type='text' list='variable_suggestions' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
              input.type == 'int' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} step="1" type='number' pattern="[0-9]*" list='variable_suggestions' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'float' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} step="any" type='number' list='variable_suggestions' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'raw_str' && ( // var inputs should show no variable suggestions
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} value={values[index] ?? ''} type='text' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }
              {
                input.type == 'var' && ( // var inputs should show no variable suggestions
                  //todo: detect when var assigner has changed, to set value to its name/empty string
                  <select onChange={(e) => {onInputChange(block.instanceId, e.target.value, index)}}  value={values[index] ?? ''} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'>
                    {
                      variableSuggestions[index]?.map(suggestion => (
                        <option value={`{${suggestion}}`} className='text-black'>
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

              <datalist id='variable_suggestions'>
                {
                  variableSuggestions.map(suggestion => (
                    <option value={`{${suggestion}}`}>
                      {suggestion}
                    </option>
                  ))
                }

              </datalist>

            </div>
          ))}
        </div>
      )}
    </Card>
  );
}