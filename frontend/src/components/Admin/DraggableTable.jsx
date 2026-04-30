import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggableTable = ({ table, isSelected, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: table.id,
  });

  const style = {
    position: 'absolute',
    left: `${table.posX}px`,
    top: `${table.posY}px`,
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 1,
  };

  const shapeClasses = {
    square: 'w-16 h-16 rounded-md',
    round: 'w-16 h-16 rounded-full',
    rectangular: 'w-24 h-16 rounded-md',
  };

  const isJoined = table.joinedWith && table.joinedWith.length > 0;

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
        className={`${shapeClasses[table.shape] || shapeClasses.square} ${
          isSelected
            ? 'bg-blue-500 border-blue-700 ring-4 ring-blue-300'
            : isJoined
            ? 'bg-purple-400 border-purple-600'
            : 'bg-orange-400 border-orange-600'
        } border-2 flex flex-col items-center justify-center text-white font-bold shadow-lg select-none relative`}
        style={{
          transform: `rotate(${table.rotation || 0}deg)`,
          opacity: isDragging ? 0.8 : 1,
        }}
      >
        {isJoined && (
          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-[8px]">
            🔗
          </div>
        )}
        <div className="text-lg">{table.number}</div>
        {table.name && (
          <div className="text-[8px] mt-0.5 opacity-80 truncate max-w-full px-1">
            {table.name}
          </div>
        )}
        {isJoined && (
          <div className="text-[8px] opacity-70">
            {table.capacity}p
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableTable;
