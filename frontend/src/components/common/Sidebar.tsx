import { LayoutDashboard, Users, Building2, LogOut, Bot } from 'lucide-react';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const Sidebar = ({ isOpen, onNavigate, onLogout }: SidebarProps) => {
  const menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },
    {
      label: 'Inteligência Artificial',
      icon: <Bot size={20} />,
      path: '/ai',
    },
    {
      label: 'Conselho',
      icon: <Users size={20} />,
      path: '/conselho',
    },
    {
      label: 'Departamentos',
      icon: <Building2 size={20} />,
      path: '/departamentos',
    },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => onNavigate('')}
          aria-label="Close sidebar"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-black to-gray-900 text-white shadow-xl transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-yellow-500 border-opacity-30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">MM</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Madson Motors</h1>
              <p className="text-xs text-gray-400">ERP System</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-yellow-500 hover:bg-opacity-10 hover:text-yellow-500 transition-colors group"
              aria-label={`Navigate to ${item.label}`}
            >
              <span className="group-hover:text-yellow-500">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
