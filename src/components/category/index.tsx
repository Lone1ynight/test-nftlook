import { CategoryType } from '@/types/index.js';
import React, {
  Dispatch,
  SetStateAction
} from 'react';
import {
  DraggableProvided
} from 'react-beautiful-dnd';

interface CategoryProps {
  id: number | null;
  name: string;
  visible: boolean;
  onDelete: (categoryId: number) => void;
  provided?: DraggableProvided;
  setNewCategoryName?: Dispatch<SetStateAction<string>>,
  categories: CategoryType[],
  setCategories?: Dispatch<SetStateAction<CategoryType[]>>,
  setIsDirty?: Dispatch<SetStateAction<boolean>>
  setEditCategoryId?: Dispatch<SetStateAction<number | undefined>>
}

export const Category: React.FC<CategoryProps> = (
  { id,
    name,
    visible,
    onDelete,
    provided,
    setNewCategoryName,
    categories,
    setCategories,
    setIsDirty,
    setEditCategoryId,
  }) => {
  const handleDelete = () => {
    id && onDelete(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setIsDirty && setIsDirty(true)

    setNewCategoryName && setNewCategoryName(newValue);

    const category: CategoryType | undefined = categories.find(category => category.id === id)

    if(category) {
      setEditCategoryId && id && setEditCategoryId(id)

      const updatedCategory = {
        ...category,
        name: newValue
      }

      setCategories && setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === id ? updatedCategory : cat
        )
      );
    }
  };

  const handleCheckboxChange = () => {
    if (id !== null) {
      const category: CategoryType | undefined = categories.find(category => category.id === id)

      if(category) {
        setEditCategoryId && id && setEditCategoryId(id)

        const updatedCategory = {
          ...category,
          visible: !category?.visible
        }

        setCategories && setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === id ? updatedCategory : cat
          )
        );
      }
    }
    setIsDirty && setIsDirty(true);
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
          onChange={handleCheckboxChange}
        />
      </label>
      <button onClick={handleDelete}>Delete</button>
      <div {...provided?.dragHandleProps}>
          Drag
      </div>
    </div>
  );
};
