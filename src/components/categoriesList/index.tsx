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
  useState
} from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import './styles.scss';

export interface CategoriesListProps {
  categories: CategoryType[],
  setCategories: Dispatch<SetStateAction<CategoryType[]>>,
  originalCategories: CategoryType[]
  setOriginalCategories: Dispatch<SetStateAction<CategoryType[]>>,
}

const CategoriesList: FC<CategoriesListProps> = (
  {
      categories,
      setCategories,
      originalCategories,
      setOriginalCategories
  }) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<boolean>(false)
  const [newCategoryName, setNewCategoryName] = useState<string>('')
  const [editCategoryId, setEditCategoryId] = useState<number>()

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

  const handleSaveChanges = async (
    id: number | null
  ): Promise<void> => {
    try {
      if (id === null && newCategoryName !== '') {
        const newCategory = await addCategory(newCategoryName);
        newCategory && setCategories(prevState => [...prevState, newCategory])
      } else {
        const editCategory = categories.find(category => category.id === id)
        editCategory && await updateCategory(editCategory.id, editCategory.name, editCategory.visible);
      }

      setNewCategoryName('')
      setNewCategory(false)
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancelChanges = (): void => {
    setNewCategory(false);
    setNewCategoryName('')
    setCategories([...originalCategories]);
    setIsDirty(false);
  };

  const handleNewCategory = () => {
     setNewCategory(true)
    // setCategories(prevState => [...prevState, {name: '', visible: false}])


    setIsDirty(true)
  }

  return (
    <div>
      <button onClick={handleNewCategory}>Create a Category</button>
      {newCategory &&
        <Category
          name={newCategoryName}
          onDelete={handleDeleteCategory}
          visible={false}
          setNewCategoryName={setNewCategoryName}
          categories={categories}
          id={null}
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
                        setCategories={setCategories}
                        setIsDirty={setIsDirty}
                        setEditCategoryId={setEditCategoryId}
                        categories={categories}
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
        <div className="buttons">
          <button onClick={() =>
            handleSaveChanges(editCategoryId || null)}
            className="saveButton"
          >
            Save Changes
          </button>
          <button onClick={handleCancelChanges} className="cancelButton">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;