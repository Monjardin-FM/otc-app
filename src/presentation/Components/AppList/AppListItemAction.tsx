import React from 'react';
import classNames from 'classnames';

export interface AppListItemActionProps
  extends React.ComponentPropsWithoutRef<'div'> {}

export const AppListItemAction = ({
  children,
  className,
  ...props
}: AppListItemActionProps) => (
  <div className={classNames('flex-none pl-4', className)} {...props}>
    {children}
  </div>
);
