import CodeBlock from '@/components/code-block';
import type { BlockCategory as BlockCategoryType } from '@/types';

interface BlockCategoryProps {
  category: BlockCategoryType;
  activeId: string | null;
}

export default function BlockCategory({ category }: BlockCategoryProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{category.name}</h2>
      <div className="space-y-3">
        {category.blocks.map((block) => (
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