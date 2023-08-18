import { Search } from '@/components/search';
import './styles.scss';
import Image from 'next/image';

export interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="header">
      <div className="logoBlock">
        <Image src="/logo.svg" alt='Logo' width={78} height={30} />
        <span>Memes</span>
      </div>
      <Search onSearch={onSearch} />
    </header>
  );
};