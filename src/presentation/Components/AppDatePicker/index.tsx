import React, { useContext } from 'react';
import clsx from 'clsx';
import es from 'date-fns/locale/es';
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { AppFormContext } from 'presentation/components/AppForm';
import { AppInputProps, AppInput } from 'presentation/components/AppInput';

registerLocale('es', es);

export type AppDatePickerProps = ReactDatePickerProps & AppInputProps;

const AppDatePicker = ({
  leftIcon,
  rightIcon,
  className,
  required,
  colorSchema = 'gray',
  wrapperClassName,
  ...props
}: AppDatePickerProps) => {
  const { isRequired } = useContext(AppFormContext);
  return (
    <DatePicker
      locale="es"
      dateFormat="dd/MM/yyyy"
      className={clsx('form-input', className)}
      required={isRequired || required}
      wrapperClassName={clsx('w-full', wrapperClassName)}
      {...props}
    />
  );
};

export default AppInput(AppDatePicker);
