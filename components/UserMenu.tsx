"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "lucide-react";
import { useNav } from "@/lib/NavContext";

export default function UserMenu() {
  const { data: session } = useSession();
  const { setOpen } = useNav();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user;

  return (
    <div className="user-wrapper" ref={menuRef}>
      {/* Trigger */}
      <button
        className="icon-btn"
        aria-label="User Menu"
        onClick={() => {
          setOpen(false);
          setUserMenuOpen((v) => !v);
        }}
      >
        {user ? (
          <span className="user-avatar">{user.name?.[0].toUpperCase()}</span>
        ) : (
          <User size={18} />
        )}
      </button>

      {/* Dropdown */}
      {userMenuOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-arrow" />
          <ul className="user-list">
            {!user ? (
              <>
                <li>
                  <Link
                    href="/login"
                    className="user-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="user-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/account"
                    className="user-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="logout"
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
