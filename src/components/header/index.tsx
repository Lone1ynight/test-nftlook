import { Search } from '@/components/search';

export interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header>
      <h1>Categories App</h1>
      <Search onSearch={onSearch} />
  </header>
);
};