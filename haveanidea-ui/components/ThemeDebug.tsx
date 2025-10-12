import React, { useEffect, useState } from 'react';

const ThemeDebug: React.FC = () => {
  const [systemTheme, setSystemTheme] = useState<string>('未检测');
  const [currentTheme, setCurrentTheme] = useState<string>('未检测');
  const [htmlClass, setHtmlClass] = useState<string>('未检测');
  
  useEffect(() => {
    // 检测系统主题
    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(darkModeMedia.matches ? '深色' : '浅色');
    
    // 获取当前主题设置
    const savedTheme = localStorage.getItem('theme') || '未设置';
    setCurrentTheme(savedTheme);
    
    // 检测HTML类
    setHtmlClass(document.documentElement.classList.contains('dark') ? '已设置dark类' : '无dark类');
    
    // 监听HTML类变化
    const observer = new MutationObserver(() => {
      setHtmlClass(document.documentElement.classList.contains('dark') ? '已设置dark类' : '无dark类');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // 监听系统主题变化
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? '深色' : '浅色');
    };
    
    if (darkModeMedia.addEventListener) {
      darkModeMedia.addEventListener('change', handleSystemThemeChange);
    } else {
      darkModeMedia.addListener(handleSystemThemeChange);
    }
    
    // 监听localStorage变化
    const handleStorageChange = () => {
      setCurrentTheme(localStorage.getItem('theme') || '未设置');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      if (darkModeMedia.removeEventListener) {
        darkModeMedia.removeEventListener('change', handleSystemThemeChange);
      } else {
        darkModeMedia.removeListener(handleSystemThemeChange);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const toggleDarkClass = () => {
    document.documentElement.classList.toggle('dark');
    setHtmlClass(document.documentElement.classList.contains('dark') ? '已设置dark类' : '无dark类');
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 text-xs">
      <h4 className="font-bold mb-1 text-gray-900 dark:text-white">主题调试器</h4>
      <div className="space-y-1">
        <div className="flex gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">系统主题:</span>
          <span className="text-blue-600 dark:text-blue-400">{systemTheme}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">存储主题:</span>
          <span className="text-blue-600 dark:text-blue-400">{currentTheme}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">HTML类状态:</span>
          <span className="text-blue-600 dark:text-blue-400">{htmlClass}</span>
        </div>
      </div>
      <button 
        onClick={toggleDarkClass}
        className="mt-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
      >
        手动切换dark类
      </button>
    </div>
  );
};

export default ThemeDebug;
