import { BlockCategory } from '@/types';

export const blockCategories: BlockCategory[] = [
  {
    id: 'math',
    name: 'Math',
    blocks: [
      {
        id: 'add',
        category: 'math',
        name: 'Add Numbers',
        description: 'Add two numbers together',
        inputs: [
          { name: 'a', type: 'number'},
          { name: 'b', type: 'number'},
        ]
      },
      {
        id: 'multiply',
        category: 'math',
        name: 'Multiply Numbers',
        description: 'Multiply two numbers',
        inputs: [
          { name: 'a', type: 'number'},
          { name: 'b', type: 'number'}
        ]
      }
    ]
  },
  {
    id: 'functional',
    name: 'Functional',
    blocks: [
      {
        id: 'for-loop',
        category: 'functional',
        name: 'For Loop',
        description: 'Loop through a range of numbers',
        hasEndBlock: true,
        inputs: [
          { name: 'start', type: 'number'},
          { name: 'end', type: 'number'}
        ]
      },
      {
        id: 'end-for-loop',
        category: 'functional',
        name: 'End For Loop',
        description: 'Ends a for loop block',
        isEndBlock: true,
        parentBlockId: 'for-loop'
      },
      {
        id: 'if-condition',
        category: 'functional',
        name: 'If Condition',
        description: 'Conditional statement',
        hasEndBlock: true,
        inputs: [
          { name: 'condition', type: 'string'}
        ]
      },
      {
        id: 'end-if-condition',
        category: 'functional',
        name: 'End If',
        description: 'Ends an if condition block',
        isEndBlock: true,
        parentBlockId: 'if-condition'
      }
    ]
  },
  {
    id: 'automation',
    name: 'Automation',
    blocks: [
      {
        id: 'mouse-click',
        category: 'automation',
        name: 'Mouse Click',
        description: 'Simulate mouse click at position',
        inputs: [
          { name: 'x', type: 'number'},
          { name: 'y', type: 'number'}
        ]
      },
      {
        id: 'keyboard-type',
        category: 'automation',
        name: 'Keyboard Type',
        description: 'Type text using keyboard',
        inputs: [
          { name: 'text', type: 'string'}
        ]
      }
    ]
  }
];