import { useRouter } from 'next/router';
import Logo from './Logo';

import Link from "next/link";

<Link href="/upgrade">
  <button style={{ padding: "10px 20px", backgroundColor: "#0752071f", color: "white", border: "none", borderRadius: "5px" }}>
    Upgrade
  </button>
</Link>


const Header = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default Header;