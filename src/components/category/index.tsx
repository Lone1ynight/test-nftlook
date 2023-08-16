import React from 'react';
import {
  DraggableProvided
} from 'react-beautiful-dnd';

interface CategoryProps {
  id?: number;
  name: string;
  visible: boolean;
  onDelete: (categoryId: number) => void;
  provided?: DraggableProvided;
}

export const Category: React.FC<CategoryProps> = ({ id, name, visible, onDelete, provided }) => {

  const handleDelete = () => {
    id && onDelete(id);
  };

  return (
    <div ref={provided?.innerRef}
         {...provided?.draggableProps}
    >
      <input value={name} />
      <label>
        <input
          type="checkbox"
          checked={visible}
        />
      </label>
      <button onClick={handleDelete}>Delete</button>
      <div {...provided?.dragHandleProps}>
          Drag
      </div>
    </div>
  );
};
