import React from 'react';
import classNames from 'classnames';
import { AppScheet, AppScheetProps } from 'presentation/components/AppSheet';

export interface AppListItemProps extends AppScheetProps {}

export const AppListItem = ({
  children,
  className,
  ...props
}: AppListItemProps) => (
  <AppScheet className={classNames('flex items-center', className)} {...props}>
    {children}
  </AppScheet>
);
