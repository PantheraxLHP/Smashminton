import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-black px-6 py-2 text-white">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex space-x-8 text-sm font-medium">
        <Link href="#" className="hover:text-gray-300">
          Đặc sản
        </Link>

        {/* Dropdown: Sản phẩm */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center hover:text-gray-300 focus:outline-none">
            Sản phẩm <ChevronDown size={16} className="ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="rounded-md bg-white text-black shadow-md">
            <DropdownMenuItem>
              <Link href="#">Ống cầu lông</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#">Đồ ăn thức uống</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown: Dịch vụ */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center hover:text-gray-300 focus:outline-none">
            Dịch vụ <ChevronDown size={16} className="ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="rounded-md bg-white text-black shadow-md">
            <DropdownMenuItem>
              <Link href="#">Đặt sân</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#">Thuê giày, vợt</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* User Icon */}
      <div className="rounded-full bg-white p-2">
        <User className="text-green-500" size={20} />
      </div>
    </header>
  );
};

export default Header;
