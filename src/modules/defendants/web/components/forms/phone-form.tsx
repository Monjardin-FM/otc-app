import { useEffect, useState } from "react";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import {
  AppFormField,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { useAssignPhonePerson } from "../../hooks/use-assign-phone";
import { AppToast } from "../../../../../presentation/Components/AppToast";

export type PhoneFormProps = {
  onClose: () => void;
  idDefendant?: number | null;
  onReload: () => void;
};

export const PhoneForm = ({
  onClose,
  onReload,
  idDefendant,
}: PhoneFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { assignPhonePerson, error, loading } = useAssignPhonePerson();

  const handleSubmit = async () => {
    if (idDefendant) {
      await assignPhonePerson({ idPerson: idDefendant, phone: phoneNumber });
    }
    if (!error) {
      AppToast().fire({
        title: "Success",
        text: "The phone number was assigned successfully",
        icon: "success",
      });
    }
    onReload();
  };
  useEffect(() => {
    if (error) {
      AppToast().fire({
        title: "Error",
        text: "There was an error while saving information. Try again",
        icon: "error",
      });
    }
    if (loading) {
      AppToast().fire({
        title: "Saving information",
        text: "The phone number is being saved. Please wait",
        icon: "info",
      });
    }
  }, [loading, error]);
  useEffect(() => {
    return () => {
      setPhoneNumber("");
    };
  }, []);
  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 border border-gray-300 rounded-lg p-6 bg-gray-200">
      <AppFormField className="col-span-3">
        <AppFormLabel>Phone Number</AppFormLabel>
        <AppTextField
          type="Phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </AppFormField>
      <div className="col-span-12 flex flex-row items-center justify-end gap-4">
        <AppButton onClick={onClose}>Cancel</AppButton>
        <AppButton
          colorScheme="primary"
          onClick={handleSubmit}
          isDisabled={phoneNumber.length === 0}
        >
          Save
        </AppButton>
      </div>
    </div>
  );
};
