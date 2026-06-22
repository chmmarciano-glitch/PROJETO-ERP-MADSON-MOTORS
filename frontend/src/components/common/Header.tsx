import { Menu, X } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  title?: string;
}

export const Header = ({
  user,
  sidebarOpen,
  onToggleSidebar,
  title = 'Madson Motors ERP',
}: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Menu Toggle (mobile) */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X size={24} className="text-gray-600" />
          ) : (
            <Menu size={24} className="text-gray-600" />
          )}
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-black flex-1 text-center lg:text-left">
          {title}
        </h1>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-black">
              {user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role || 'N/A'}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-black font-bold text-lg">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
