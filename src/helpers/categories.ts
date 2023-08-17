import { CategoryType } from '@/types';

export const reorderCategories = (list: CategoryType[], startIndex: number, endIndex: number): CategoryType[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};