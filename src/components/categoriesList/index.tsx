'use client'

import {
  deleteCategory,
  getCategories,
  updateCategory
} from '@/api';
import { Category } from '@/components/category';
import { CategoryType } from '@/types';
import {
  useEffect,
  useState
} from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const reorderCategories = (list: CategoryType[], startIndex: number, endIndex: number): CategoryType[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [originalCategories, setOriginalCategories] = useState<CategoryType[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<boolean>(false)

  useEffect(() => {
    async function fetchCategories() {
      const allCategories = await getCategories();
      setCategories(allCategories);
      setOriginalCategories([...allCategories]);
    }
    fetchCategories();
  }, []);

  const handleToggleVisibility = async (categoryId: number, newVisible: boolean): Promise<void> => {
    const updatedCategory = await updateCategory(categoryId, null, newVisible);
    if (updatedCategory) {
      setCategories(prevCategories =>
        prevCategories.map(cat => (cat.id === categoryId ? updatedCategory : cat))
      );
      setIsDirty(true);
    }
  };

  const handleDeleteCategory = async (categoryId: number): Promise<void> => {
    const deletedId = await deleteCategory(categoryId);
    if (deletedId !== null) {
      setCategories(prevCategories =>
        prevCategories.filter(cat => cat.id !== deletedId)
      );
      setIsDirty(true);
    }
  };

  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    const reorderedCategories = reorderCategories(
      categories,
      result.source.index,
      result.destination.index
    );

    setCategories(reorderedCategories);
    setIsDirty(true);
  };

  const handleSaveChanges = async (): Promise<void> => {
    setIsDirty(false);
  };

  const handleCancelChanges = (): void => {
    setCategories([...originalCategories]);
    setIsDirty(false);
  };

  const handleNewCategory = () => {
    setNewCategory(true)
    setIsDirty(true)
  }

  return (
    <div>
      <button onClick={handleNewCategory}>Create a Category</button>
      {newCategory && <Category name="" onDelete={handleDeleteCategory} visible={false}/>}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {categories.map((category, index) => (
                  <Draggable key={category.id} draggableId={category.id.toString()} index={index}>
                    {(provided) => (
                      <Category
                        id={category.id}
                        name={category.name}
                        visible={category.visible}
                        onDelete={handleDeleteCategory}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      {isDirty && (
        <>
          <button onClick={handleSaveChanges}>Сохранить изменения</button>
          <button onClick={handleCancelChanges}>Отмена</button>
        </>
      )}
    </div>
  );
};

export default CategoriesList;