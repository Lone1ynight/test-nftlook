import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '@/api';
import { Category } from '@/components/category';
import { reorderCategories } from '@/helpers/categories';
import { CategoryType } from '@/types';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export interface CategoriesListProps {
  categories: CategoryType[],
  setCategories: Dispatch<SetStateAction<CategoryType[]>>,
}

const CategoriesList: FC<CategoriesListProps> = ({categories, setCategories}) => {
  const [originalCategories, setOriginalCategories] = useState<CategoryType[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [newCategory, setNewCategory] = useState<boolean>(false)
  const [newCategoryName, setNewCategoryName] = useState<string>('')

  const [editCategory, setEditCategory] = useState<CategoryType>({
    id: -1,
    name: '',
    visible: false,
  })

  useEffect(() => {
      setOriginalCategories([...categories]);
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
    console.log(reorderedCategories)
    setCategories(reorderedCategories);
    setIsDirty(true);
  };

  const handleSaveChanges = async (
    id: number | null,
    name: string,
    newVisible: boolean | null
  ): Promise<void> => {
    try {
      if (id === null && id !== -1 && newCategoryName !== '') {
        console.log(id)
        //--------------------
        //TODO: пофиксить перетягивание / otpravku na back/ delete/ edit visible/styles
        await addCategory(newCategoryName);

      } else {
        await updateCategory(editCategory.id, editCategory.name, editCategory.visible || editCategory.visible);
      }

      setIsDirty(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancelChanges = (): void => {
    setCategories([...originalCategories]);
    setIsDirty(false);
  };

  const handleNewCategory = () => {
    setNewCategory(true)
    setIsDirty(true)
  }
  console.log(categories)

  return (
    <div>
      <button onClick={handleNewCategory}>Create a Category</button>
      {newCategory &&
        <Category
          name={newCategoryName}
          onDelete={handleDeleteCategory}
          visible={false}
          newCategory={newCategory}
          setNewCategoryName={setNewCategoryName}
        />}
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
                        newCategory={newCategory}
                        editCategory={editCategory}
                        setEditCategory={setEditCategory}
                        setCategories={setCategories}
                        setIsDirty={setIsDirty}
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
          <button onClick={() => handleSaveChanges(editCategory?.id || null, newCategoryName || `${editCategory?.name}`, editCategory?.visible || false)}>Сохранить изменения</button>
          <button onClick={handleCancelChanges}>Отмена</button>
        </>
      )}
    </div>
  );
};

export default CategoriesList;