import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GripVertical, X } from 'lucide-react';
import { Input } from './ui/input';
import type { CodeBlock as CodeBlockType } from '@/types';
import { useState } from 'react';

interface WorkspaceBlock extends CodeBlockType {
  instanceId: string;
  values: Record<string, any>;
}

interface WorkspaceBlockProps {
  block: WorkspaceBlock;
  values: Record<string, any>;
  onInputChange: (inputName: string, value: string) => void;
  onDelete: () => void;
  canEdit?: boolean;
}

export default function WorkspaceBlock({ 
  block, 
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

  const [variableSuggestions, setVariableSuggestions] = useState(['var1','var2']) // this should be updated from script, to have a context of what blocks come before




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
          <p className="text-sm text-purple-200/60">{block.description}</p>
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
              <label className="text-sm text-purple-200/80">{input.name.replace('_',' ')}:</label>
              {/* 
              <Input
                inputMode={input.type === 'int' ? 'numeric' : 'none'}
                type={input.type === 'int' ? 'number' : 'text'} // if its int, set type as number else set as text
                defaultValue={values[index] ?? ''}
                onChange={(e) => onInputChange(block.instanceId, e.target.value, index)}
                className="col-span-2 h-8 text-sm"
                placeholder={`${input.name}`}
                disabled={!canEdit}
              /> */}
              {
                input.type == 'str' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} defaultValue={values[index] ?? ''} type='text' list='variable_suggestions' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
              input.type == 'int' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} defaultValue={values[index] ?? ''} type='text' list='variable_suggestions' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'float' && (
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} defaultValue={values[index] ?? ''} type='text' list='variable_suggestions' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }

              {
                input.type == 'raw_str' && ( // var inputs should show no variable suggestions
                  <input onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} defaultValue={values[index] ?? ''} type='text' className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'/>
                )
              }
              {
                input.type == 'var' && ( // var inputs should show no variable suggestions
                  <select onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} defaultValue={values[index] ?? ''} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'>
                    {
                      variableSuggestions.map(suggestion => (
                        <option value={`{${suggestion}}`}>
                          {suggestion}
                        </option>
                      ))
                    }
                  </select>
                )
              }

              {
                input.type.includes('option') && (

                  <select onChange={(e) => onInputChange(block.instanceId, e.target.value, index)} defaultValue={values[index] ?? ''} className='flex h-9 w-full rounded-md border border-purple-200/20 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-purple-200/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50'>
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