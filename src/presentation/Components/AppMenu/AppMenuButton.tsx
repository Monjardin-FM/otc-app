import React, { useContext } from 'react';
import { AppButton, AppButtonProps } from 'presentation/components/AppButton';
import { AppMenuContext } from './AppMenuContext';

export interface AppMenuButtonProps extends AppButtonProps {}

export const AppMenuButton = ({ children, ...props }: AppMenuButtonProps) => {
  const { toggle } = useContext(AppMenuContext);
  return (
    <AppButton onClick={toggle} {...props}>
      {children}
    </AppButton>
  );
};
