import { HeaderProps } from '@/components/header/index.js';
import Image from 'next/image';
import {
  FC,
  useState
} from 'react';
import './search.scss';

export const Search: FC<HeaderProps> = ({onSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return <div className="search">
    <input
      type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => handleInputChange(e)}
    />
    <Image src="./search.svg" alt="Search Icon" width={20} height={20}/>
  </div>
}