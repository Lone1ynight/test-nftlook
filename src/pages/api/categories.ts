import {
  CategoryType
} from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

const initialCategories: CategoryType[] = [
  { id: 0, name: 'Other', visible: true, readonly: true },
  { id: 1, name: '123', visible: true },
  { id: 2, name: '1233254', visible: true }
];

//використовуєм як мокову БД
let categories: CategoryType[] = [...initialCategories];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(categories.reverse());
      break;
    case 'POST':
      const { name } = req.body;
      const newCategory: CategoryType = { id: Date.now(), name, visible: false };
      categories.push(newCategory);
      res.status(201).json(newCategory);
      break;
    case 'PUT':
      const { id, newName, newVisible } = req.body;

      if (id === 0) {
        res.status(403).json({ message: 'Cannot update "Other" category' });
        return;
      }

      const categoryToUpdate = categories.find(cat => cat.id === id);
      if (categoryToUpdate) {
        categoryToUpdate.name = newName;
        categoryToUpdate.visible = newVisible;
        res.status(200).json(categoryToUpdate);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
      break;
    case 'DELETE':
      const { categoryId } = req.query;

      if (Number(categoryId) === 0) {
        res.status(403).json({ message: 'Cannot delete "Other" category' });
        return;
      }

      categories = categories.filter(cat => cat.id !== Number(categoryId));
      res.status(200).json({ message: 'Category deleted successfully' });
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}