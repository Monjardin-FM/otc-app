import classNames from 'classnames';
import React from 'react';

type AvailableText = 'p' | 'span' | 'div';

export interface AppTextProps
  extends React.ComponentPropsWithoutRef<AvailableText> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  as?: AvailableText;
}

export const AppText = ({
  as: tag = 'p',
  size = 'base',
  children,
  className,
}: AppTextProps) => {
  const Tag = tag as AvailableText;
  return (
    <Tag
      className={classNames(
        {
          'text-xs': size === 'xs',
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
          'text-2xl': size === '2xl',
          'text-3xl': size === '3xl',
          'text-4xl': size === '4xl',
        },
        className,
      )}
    >
      {children}
    </Tag>
  );
};
