import { BlockCategory } from '@/types';



// The mock data
export const blockCategoriesMock: BlockCategory[] = [
  {
    id: '0',
    name: 'Loading',
    blocks: [
      {
        id: '0',
        category: 'Loading',
        name: 'Please wait...',
        description: '',
        inputs: [
          { name: 'Loading...', type: 'text' },
        ],
      },
      {
        id: '1',
        category: 'Loading',
        name: 'Blocks are loading...',
        description: '',
        inputs: [
          { name: 'Loading...', type: 'text' },
        ],
      },
    ],
  }
];