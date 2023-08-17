'use client'

import { getCategories } from '@/api';
import CategoriesList from '@/components/categoriesList';
import { Header } from '@/components/header';
import { CategoryType } from '@/types';
import {
  useEffect,
  useState
} from 'react';
import styles from './page.module.css'

export default function Home() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [originalCategories, setOriginalCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const allCategories = await getCategories();
      setCategories(allCategories);
      setOriginalCategories([...allCategories]);
    }
    fetchCategories();
  }, []);

  const onSearch = (query: string) => {
    const filteredCategories = originalCategories.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setCategories(filteredCategories);
  };

  return (
    <div>
      <Header onSearch={onSearch}/>
      <main className={styles.main}>
        <CategoriesList categories={categories} setCategories={setCategories}/>
      </main>
    </div>
  )
}
