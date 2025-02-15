import CodeBlock from '@/components/code-block';
import type { BlockCategory as BlockCategoryType } from '@/types';

interface BlockCategoryProps {
  category: BlockCategoryType;
  activeId: string | null;
  globalSearchQuery: string;
}

export default function BlockCategory({ category, activeId }: BlockCategoryProps) {
  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">{category.name}</h2>
      <div className="space-y-3  overflow-x-hidden overflow-y-auto pr-2">
        {category.blocks.map((block) => (
          <>
            {
              !block.name.toLowerCase().startsWith('end ') ? (
                <CodeBlock
                  key={block.id}
                  block={block}
                  isTemplate
                />
              ) : (
                <></>
              )
            }
          </>
        ))}
      </div>
    </div>
  );
}