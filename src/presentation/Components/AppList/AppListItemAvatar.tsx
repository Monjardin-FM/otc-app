import React from 'react';
import classNames from 'classnames';

export interface AppListItemAvatarProps
  extends React.ComponentPropsWithoutRef<'div'> {}

export const AppListItemAvatar = ({
  children,
  className,
  ...props
}: AppListItemAvatarProps) => (
  <div className={classNames('pr-4', className)} {...props}>
    {children}
  </div>
);
