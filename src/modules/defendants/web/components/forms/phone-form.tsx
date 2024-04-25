import { AppButton } from "../../../../../presentation/Components/AppButton";
import {
  AppFormField,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";

export type PhoneFormProps = {
  onClose: () => void;
};
export const PhoneForm = ({ onClose }: PhoneFormProps) => {
  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 border border-gray-300 rounded-lg p-6 bg-gray-200">
      <AppFormField className="col-span-3">
        <AppFormLabel>Phone Number</AppFormLabel>
        <AppTextField type="Phone" />
      </AppFormField>
      <div className="col-span-12 flex flex-row items-center justify-end gap-4">
        <AppButton onClick={onClose}>Cancel</AppButton>
        <AppButton colorScheme="primary">Save</AppButton>
      </div>
    </div>
  );
};
