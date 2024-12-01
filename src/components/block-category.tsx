import CodeBlock from '@/components/code-block';
import type { BlockCategory as BlockCategoryType } from '@/types';

interface BlockCategoryProps {
  category: BlockCategoryType;
  activeId: string | null;
  globalSearchQuery: string;
}

export default function BlockCategory({ category, activeId, globalSearchQuery }: BlockCategoryProps) {
  const filteredBlocks = category.blocks.filter(block => 
    !globalSearchQuery || 
    block.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    block.description.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{category.name}</h2>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {filteredBlocks.map((block) => (
          <CodeBlock
            key={block.id}
            block={block}
            isTemplate
          />
        ))}
      </div>
    </div>
  );
}