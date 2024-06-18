'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath = usePathname();

  return (
    <div className="flex flex-row w-full min-h-full">
        <div className="w-72 bg-[#0B1318] h-screen flex-col text-white hidden lg:flex">
            <Link href={'/dashboard/search-products'} className={"w-full p-3 text-xl rounded-xl hover:bg-[#0F638E] " + (currentPath.includes("/dashboard/search-products") ? "bg-[#0F638E]" : "bg-[#0B1318]")}>
                Search Products
            </Link>
            <Link href={'/dashboard/tracked-products'} className={"w-full p-3 text-xl rounded-xl hover:bg-[#0F638E] " + (currentPath.includes("/dashboard/tracked-products") ? "bg-[#0F638E]" : "bg-[#0B1318]")}>
                Tracked Products
            </Link>
        </div>
        <div className="w-full">
            {children}
        </div>
    </div>
  );
}
