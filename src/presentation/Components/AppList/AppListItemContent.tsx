import React from 'react';
import classNames from 'classnames';

export interface AppListItemContentProps
  extends React.ComponentPropsWithoutRef<'div'> {}

export const AppListItemContent = ({
  children,
  className,
  ...props
}: AppListItemContentProps) => (
  <div className={classNames('flex-grow', className)} {...props}>
    {children}
  </div>
);
