// components/ResizableContainer.tsx
import React from 'react';
import { useResizable } from '@/hooks/useResizable';

interface ResizableContainerProps {
  children: React.ReactNode;
  className?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onResize?: (newSize: number) => void;
  direction?: 'horizontal' | 'vertical';
}

const ResizableContainer: React.FC<ResizableContainerProps> = ({
  children,
  className = '',
  defaultSize = 1,
  minSize = 0.5,
  maxSize = 5,
  onResize,
  direction = 'horizontal'
}) => {
  const { size, isResizing, startResizing } = useResizable({
    defaultSize,
    minSize,
    maxSize,
    onResize,
    direction
  });

  const handleClass = direction === 'horizontal' 
    ? 'absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue/20 active:bg-blue/40'
    : 'absolute bottom-0 left-0 right-0 h-2 cursor-row-resize hover:bg-blue/20 active:bg-blue/40';

  return (
    <div
      className={`
        relative
        ${isResizing ? (direction === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize') : ''}
        ${className}
      `}
      style={{ 
        flex: `${size} ${size} 0%`
      }}
    >
      {children}
      <div
        className={handleClass}
        onMouseDown={startResizing}
      />
    </div>
  );
};

export default ResizableContainer;