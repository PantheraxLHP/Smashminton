import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { handleSignout } from '@/services/auth.service';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileIcon = () => {
    const { user, setUser, setIsAuthenticated } = useAuth();
    const router = useRouter();

    const handleSignoutButtonClick = async () => {
        const res = await handleSignout();
        if (!res.ok) {
            console.error('Signout failed');
        }
        setUser(null);
        setIsAuthenticated(false);
        window.location.reload();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center rounded-full bg-white p-2">
                    <User className="text-primary-500" size={20} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user?.accounttype}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                    Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleSignoutButtonClick}>
                    Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileIcon;
