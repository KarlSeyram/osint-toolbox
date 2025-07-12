import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'; // make sure this path is correct
import Logo from './Logo';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to login after logout
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <Logo />
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/upgrade">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Upgrade
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
