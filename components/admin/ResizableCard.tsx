// components/ResizableCard.tsx
import React from 'react';
import { useResizable } from '@/hooks/useResizable';

interface ResizableCardProps {
  children: React.ReactNode;
  className?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onResize?: (newSize: number) => void;
  resizable?: boolean;
  direction?: 'horizontal' | 'vertical';
  resizeEdges?: ('left' | 'right' | 'top' | 'bottom')[];
}

const ResizableCard: React.FC<ResizableCardProps> = ({
  children,
  className = '',
  defaultSize = 1,
  minSize = 1,
  maxSize = 10,
  onResize,
  resizable = true,
  direction = 'horizontal',
  resizeEdges = ['right']
}) => {
  const { size, isResizing, startResizing } = useResizable({
    defaultSize,
    minSize,
    maxSize,
    onResize,
    direction
  });

  const getResizeHandle = (edge: string) => {
    const baseClasses = "absolute hover:bg-blue/30 active:bg-blue/50 transition-colors duration-200 z-10";
    
    switch (edge) {
      case 'right':
        return `right-0 top-0 bottom-0 w-2 cursor-col-resize ${baseClasses}`;
      case 'left':
        return `left-0 top-0 bottom-0 w-2 cursor-col-resize ${baseClasses}`;
      case 'bottom':
        return `bottom-0 left-0 right-0 h-2 cursor-row-resize ${baseClasses}`;
      case 'top':
        return `top-0 left-0 right-0 h-2 cursor-row-resize ${baseClasses}`;
      default:
        return '';
    }
  };

  return (
    <div
      className={`p-3 
        relative rounded-md shadow-md shadow-neutral-200 bg-white
        transition-all duration-200 ease-out
        ${isResizing ? (direction === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize') : ''}
        ${className}
      `}
      style={{ 
        ...(direction === 'horizontal' 
          ? { flex: `${size} ${size} 0%`, minWidth: '150px' }
          : { flex: `${size} ${size} 0%`, minHeight: '100px' }
        )
      }}
    >
      {children}
      {resizable && resizeEdges.map(edge => (
        <div
          key={edge}
          className={getResizeHandle(edge)}
          onMouseDown={startResizing}
        />
      ))}
    </div>
  );
};

export default ResizableCard;