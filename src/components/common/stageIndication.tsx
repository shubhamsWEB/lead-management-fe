import React from 'react';
import { cn } from '@/lib/utils';
import { StageType } from '@/lib/types';

interface StageIndicatorProps {
  stage: StageType;
  className?: string;
}

export default function StageIndicator({ stage, className }: StageIndicatorProps) {
  // All possible stages in order
  const stages: StageType[] = ['I', 'II', 'III', 'IIII'];
  
  const currentStageIndex = stages.indexOf(stage);
  

  return (
    <div className={cn('flex items-center justify-center h-full gap-[2px]', className)}>
      {stages.map((_, index) => (
        <div 
          key={index} 
          className={cn(
            'w-1 h-5 rounded-full', 
            index <= currentStageIndex ? 'bg-purple-600' : 'bg-gray-300'
          )} 
        />
      ))}
    </div>
  );
}