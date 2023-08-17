import { apiInstance } from '@/core/apiInstance';
import { CategoryType } from '@/types/index';

export const getCategories = async (): Promise<CategoryType[]> => {
  try {
    const response = await apiInstance.get<CategoryType[]>('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const addCategory = async (name: string): Promise<CategoryType | null> => {
  try {
    const response = await apiInstance.post<CategoryType>('/categories', { name });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    return null;
  }
};

export const updateCategory = async (
  id: number,
  newName: string | null,
  newVisible: boolean | null
): Promise<CategoryType | null> => {
  try {
    const response = await apiInstance.put<CategoryType>( '/categories',{ id, newName, newVisible });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
};

export const deleteCategory = async (categoryId: number): Promise<number | null> => {
  try {
    await apiInstance.delete(`/categories?categoryId=${categoryId}`);
    return categoryId;
  } catch (error) {
    console.error('Error deleting category:', error);
    return null;
  }
};