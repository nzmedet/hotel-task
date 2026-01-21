'use client';

import Link from 'next/link';
import { LayoutDashboard, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            H
          </div>
          <span className="text-lg font-bold tracking-tight">Hotel task</span>
        </Link>
      </div>
    </nav>
  );
};
