import React from 'react';
import clsx from 'clsx';
import { UIColorScheme } from 'presentation/types/ui-color-schema';

export interface AppBadgeProps extends React.ComponentPropsWithoutRef<'span'> {
  colorScheme?: UIColorScheme;
}

export const AppBadge = ({
  children,
  className,
  colorScheme = 'gray',
  ...props
}: AppBadgeProps) => (
  <span
    className={clsx(
      'inline-block px-2 py-1 text-sm font-semibold rounded-full whitespace-nowrap cursor-default',
      {
        'bg-gray-100 text-gray-700': colorScheme === 'gray',
        'bg-primary-100 text-primary-700': colorScheme === 'primary',
        'bg-success-100 text-success-700': colorScheme === 'success',
        'bg-info-100 text-info-700': colorScheme === 'info',
        'bg-warn-100 text-warn-800': colorScheme === 'warn',
        'bg-danger-100 text-danger-700': colorScheme === 'danger',
      },
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
