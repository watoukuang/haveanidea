import React from 'react';
import Link from 'next/link';

interface NavItem {
  icon: string;
  name: string;
  href: string;
}

export default function MobileNav(): React.ReactElement {
  const navItems: NavItem[] = [
    { icon: '💡', name: '首页', href: '/' },
    { icon: '🔍', name: '发现', href: '/discover' },
    { icon: '📊', name: '排行', href: '/ranking' },
    { icon: '👤', name: '我的', href: '/my-account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <Link href={item.href} key={index} className="flex flex-col items-center justify-center flex-1 h-full">
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
