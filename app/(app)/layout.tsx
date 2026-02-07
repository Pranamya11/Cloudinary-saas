"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  MenuIcon,
  LogOutIcon,
  HomeIcon,
  ImageIcon,
  Share2Icon,
  VideoIcon,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      label: "Home",
      href: "/home",
      icon: HomeIcon,
    },
    {
      label: "Social Share",
      href: "/social-share",
      icon: Share2Icon,
    },
    {
      label: "Video Upload",
      href: "/video-upload",
      icon: VideoIcon,
    },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      <input
        id="app-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={() => setOpen(!open)}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div className="drawer-content flex flex-col">
        {/* Top Navbar */}
        <div className="navbar bg-base-200 border-b px-4">
          <div className="flex-none lg:hidden">
            <label htmlFor="app-drawer" className="btn btn-square btn-ghost">
              <MenuIcon className="h-5 w-5" />
            </label>
          </div>

          <div className="flex-1">
            <span className="text-xl font-bold">SAAS PROJECT</span>
          </div>

          {isLoaded && user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">
                  {user.username ||
                    user.firstName ||
                    user.primaryEmailAddress?.emailAddress}
                </div>
                <div className="text-xs opacity-60">Logged in</div>
              </div>

              <button
                onClick={() => signOut(() => router.push("/sign-in"))}
                className="btn btn-sm btn-error btn-outline"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="drawer-side">
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <aside className="w-72 bg-base-200 p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </div>

          <ul className="menu gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 ${
                      active ? "active font-semibold" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-6 text-xs opacity-60">
            © {new Date().getFullYear()} SAAS Project
          </div>
        </aside>
      </div>
    </div>
  );
}