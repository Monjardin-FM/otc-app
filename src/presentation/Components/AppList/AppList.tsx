import React from 'react';
import classNames from 'classnames';

export interface AppListProps extends React.ComponentPropsWithoutRef<'div'> {}

export const AppList = ({ children, className, ...props }: AppListProps) => (
  <div className={classNames('space-y-4', className)} {...props}>
    {children}
  </div>
);
