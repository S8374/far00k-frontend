'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value: number;
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        {...props}
        className={cn('relative h-3 w-full overflow-hidden rounded-full bg-zinc-200', className)}
      >
        {/* Filled Bar */}
        <ProgressPrimitive.Indicator
          className="h-full bg-green-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </ProgressPrimitive.Root>

      {/* Dot Indicator */}
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#006C35] border-2 border-white"
        style={{ left: `calc(${value}% - 8px)` }}
      />

      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-green-700">
        {value}%
      </div>
    </div>
  );
}
