import { CategoryType } from '@/types/index.js';
import React, {
  Dispatch,
  SetStateAction
} from 'react';
import {
  DraggableProvided
} from 'react-beautiful-dnd';

interface CategoryProps {
  id?: number;
  name: string;
  visible: boolean;
  onDelete: (categoryId: number) => void;
  provided?: DraggableProvided;
  newCategory?: boolean,
  setNewCategoryName?: Dispatch<SetStateAction<string>>,
  editCategory?: CategoryType
  setEditCategory?: Dispatch<SetStateAction<CategoryType>>,
  setCategories?: Dispatch<SetStateAction<CategoryType[]>>,
  setIsDirty?: Dispatch<SetStateAction<boolean>>
}

export const Category: React.FC<CategoryProps> = (
  { id,
    name,
    visible,
    onDelete,
    provided,
    newCategory,
    setNewCategoryName,
    editCategory,
    setEditCategory,
    setCategories,
    setIsDirty
  }) => {
  const handleDelete = () => {
    id && onDelete(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
      setIsDirty && setIsDirty(true)
    if (newCategory && setNewCategoryName) {
      setNewCategoryName(newValue);
    } else if (editCategory && setEditCategory) {
      const updatedCategory = {
        ...editCategory,
        id: id || -1,
        name: newValue
      };
      setEditCategory(updatedCategory);
      setCategories && setCategories(prevCategories =>
        prevCategories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
      );
    }
  };

  return (
    <div ref={provided?.innerRef}
         {...provided?.draggableProps}
    >
      <input value={name} onChange={e => handleInputChange(e)} />
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
