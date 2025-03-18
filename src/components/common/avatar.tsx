import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Avatar component that displays initials
 * 
 * Exactly matches the "EB", "AF", etc. avatars in the UI mockup
 */
export default function Avatar({ initials, className, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-purple-100 font-medium text-purple-700',
        sizeClasses[size],
        className
      )}
    >
      {initials?.substring(0, 2)}
    </div>
  );
}