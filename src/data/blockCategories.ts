import { BlockCategory } from '@/types';

export const blockCategories: BlockCategory[] = [
  {
    id: 'math',
    name: 'Math',
    blocks: [
      {
        id: 'add',
        type: 'math',
        category: 'math',
        name: 'Add Numbers',
        description: 'Add two numbers together',
        template: 'result = {a} + {b}',
        inputs: [
          { name: 'a', type: 'number', default: 0 },
          { name: 'b', type: 'number', default: 0 }
        ]
      },
      {
        id: 'multiply',
        type: 'math',
        category: 'math',
        name: 'Multiply Numbers',
        description: 'Multiply two numbers',
        template: 'result = {a} * {b}',
        inputs: [
          { name: 'a', type: 'number', default: 1 },
          { name: 'b', type: 'number', default: 1 }
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
        type: 'functional',
        category: 'functional',
        name: 'For Loop',
        description: 'Loop through a range of numbers',
        template: 'for i in range({start}, {end}):\n    {content}',
        inputs: [
          { name: 'start', type: 'number', default: 0 },
          { name: 'end', type: 'number', default: 10 },
          { name: 'content', type: 'code', default: 'pass' }
        ]
      },
      {
        id: 'if-condition',
        type: 'functional',
        category: 'functional',
        name: 'If Condition',
        description: 'Conditional statement',
        template: 'if {condition}:\n    {content}',
        inputs: [
          { name: 'condition', type: 'string', default: 'True' },
          { name: 'content', type: 'code', default: 'pass' }
        ]
      }
    ]
  },
  {
    id: 'automation',
    name: 'Automation',
    blocks: [
      {
        id: 'mouse-click',
        type: 'automation',
        category: 'automation',
        name: 'Mouse Click',
        description: 'Simulate mouse click at position',
        template: 'pyautogui.click(x={x}, y={y})',
        inputs: [
          { name: 'x', type: 'number', default: 0 },
          { name: 'y', type: 'number', default: 0 }
        ]
      },
      {
        id: 'keyboard-type',
        type: 'automation',
        category: 'automation',
        name: 'Keyboard Type',
        description: 'Type text using keyboard',
        template: 'pyautogui.write("{text}")',
        inputs: [
          { name: 'text', type: 'string', default: '' }
        ]
      }
    ]
  }
];