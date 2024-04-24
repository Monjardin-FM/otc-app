import React from 'react';
import classNames from 'classnames';
import {
  AppHeading,
  AppHeadingProps,
} from 'presentation/components/AppHeading';

export interface AppListItemTitleProps extends AppHeadingProps {}

export const AppListItemTitle = ({
  children,
  className,
  ...props
}: AppListItemTitleProps) => (
  <AppHeading
    as="h3"
    size="base"
    className={classNames('font-semibold text-gray-700', className)}
    {...props}
  >
    {children}
  </AppHeading>
);
