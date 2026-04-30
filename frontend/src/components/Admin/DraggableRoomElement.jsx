import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggableRoomElement = ({ element, isSelected, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
  });

  const style = {
    position: 'absolute',
    left: `${element.posX}px`,
    top: `${element.posY}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 1,
  };

  const getElementStyle = () => {
    switch (element.type) {
      case 'wall':
        return 'bg-gray-600';
      case 'window':
        return 'bg-blue-400 bg-opacity-50 border-2 border-blue-600';
      case 'door':
        return 'bg-amber-500 border-2 border-amber-700';
      default:
        return 'bg-gray-400';
    }
  };

  const getIcon = () => {
    switch (element.type) {
      case 'wall':
        return '🧱';
      case 'window':
        return '🪟';
      case 'door':
        return '🚪';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) {
          onSelect?.();
        }
      }}
      {...listeners}
      {...attributes}
    >
      <div
        className={`${getElementStyle()} ${
          isSelected ? 'ring-4 ring-blue-300' : ''
        } w-full h-full flex items-center justify-center shadow-md select-none`}
        style={{
          transform: `rotate(${element.rotation || 0}deg)`,
          opacity: isDragging ? 0.8 : 1,
          backgroundColor: element.color,
        }}
      >
        <span className="text-xs opacity-70">{getIcon()}</span>
      </div>
    </div>
  );
};

export default DraggableRoomElement;
