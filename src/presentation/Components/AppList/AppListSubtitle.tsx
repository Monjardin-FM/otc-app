import React from 'react';
import classNames from 'classnames';
import { AppText, AppTextProps } from 'presentation/components/AppText';

export interface AppListSubtitleProps extends AppTextProps {}

export const AppListItemSubtitle = ({
  children,
  className,
  ...props
}: AppListSubtitleProps) => (
  <AppText
    size="sm"
    className={classNames('font-semibold text-gray-600 text-sm', className)}
    {...props}
  >
    {children}
  </AppText>
);
