import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { blockCategories } from '@/data/blockCategories';
import type { CodeBlock as CodeBlockType } from '@/types';

interface BlockSearchProps {
  onSearch: (query: string) => void;
}

export default function BlockSearch({ onSearch }: BlockSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-200/40" />
      <Input
        type="search"
        placeholder="Search all blocks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10"
      />
    </div>
  );
}