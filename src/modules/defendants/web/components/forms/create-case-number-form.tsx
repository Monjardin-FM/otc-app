import { useEffect, useState } from "react";
import { useCreateCaseNumber } from "../../hooks/use-create-case-number";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import {
  AppFormField,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { AppButton } from "../../../../../presentation/Components/AppButton";

export type CaseNumberFormProps = {
  onClose: () => void;
  idDefendant?: number | null;
  onReload: () => void;
};

export const CaseNumberForm = ({
  onClose,
  onReload,
  idDefendant,
}: CaseNumberFormProps) => {
  const [caseNumber, setCaseNumber] = useState("");
  const { createCaseNumber, error, loading } = useCreateCaseNumber();

  const handleSubmit = async () => {
    if (idDefendant) {
      await createCaseNumber({ idPerson: idDefendant, caseNumber: caseNumber });
    }
    if (!error) {
      AppToast().fire({
        title: "Success",
        text: "The case number was assigned successfully",
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
        text: "The case number is being saved. Please wait",
        icon: "info",
      });
    }
  }, [loading, error]);
  useEffect(() => {
    return () => {
      setCaseNumber("");
    };
  }, []);
  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 border border-gray-300 rounded-lg p-6 bg-gray-200">
      <AppFormField className="col-span-3">
        <AppFormLabel>Case Number</AppFormLabel>
        <AppTextField
          type="text"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
        />
      </AppFormField>
      <div className="col-span-12 flex flex-row items-center justify-end gap-4">
        <AppButton onClick={onClose}>Cancel</AppButton>
        <AppButton
          colorScheme="primary"
          onClick={handleSubmit}
          isDisabled={caseNumber.length === 0}
        >
          Save
        </AppButton>
      </div>
    </div>
  );
};
