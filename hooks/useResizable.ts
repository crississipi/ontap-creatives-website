// hooks/useResizable.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface ResizableProps {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onResize?: (newSize: number) => void;
  direction?: 'horizontal' | 'vertical';
}

export const useResizable = ({
  defaultSize = 1,
  minSize = 1,
  maxSize = 10,
  onResize,
  direction = 'horizontal'
}: ResizableProps = {}) => {
  const [size, setSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
    startPos.current = direction === 'horizontal' ? mouseDownEvent.clientX : mouseDownEvent.clientY;
    startSize.current = size;
  }, [size, direction]);

  useEffect(() => {
    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      if (!isResizing) return;
      
      const currentPos = direction === 'horizontal' ? mouseMoveEvent.clientX : mouseMoveEvent.clientY;
      const delta = currentPos - startPos.current;
      const newSize = Math.max(minSize, Math.min(maxSize, startSize.current + delta / (direction === 'horizontal' ? 50 : 20)));
      
      setSize(newSize);
      onResize?.(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minSize, maxSize, onResize, direction]);

  return {
    size,
    isResizing,
    startResizing,
  };
};