import { HeaderProps } from '@/components/header/index.js';
import {
  FC,
  useState
} from 'react';

export const Search: FC<HeaderProps> = ({onSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return <div>
    <input
      type="text"
      placeholder="Search categories..."
      value={searchQuery}
      onChange={(e) => handleInputChange(e)}
    />
    <button onClick={handleSearch}>Search</button>
  </div>
}