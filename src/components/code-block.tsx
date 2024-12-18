import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/card';
import { Input } from './ui/input';
import type { CodeBlock as CodeBlockType } from '@/types';
import { useEffect, useState } from 'react';

interface CodeBlockProps {
  block: CodeBlockType;
  isTemplate?: boolean;
  onInputChange?: (inputName: string, value: string) => void;
  values?: Record<string, any>;
}

export default function CodeBlock({ block, isTemplate = false, onInputChange, values = {} }: CodeBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: block.id,
    data: {
      type: 'block',
      block,
      isTemplate
    }
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 select-none ${isTemplate ? 'cursor-move touch-none' : ''} bg-purple-950/30 border-purple-200/20 hover:border-purple-400/30 transition-colors`}
      {...(isTemplate ? { ...attributes, ...listeners } : {})}
    >
      <h3 className="font-semibold mb-2">{block.name}</h3>
      <p className="text-sm text-purple-200/60 mb-3">{block.description}</p>
    </Card>
  );
}