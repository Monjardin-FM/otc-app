import { useEffect, useState } from "react";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { CaseNumber } from "../../../domain/entities/case-number";
import { useUpdateCaseNumber } from "../../hooks/use-update-case-number";
import {
  AppFormField,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { AppButton } from "../../../../../presentation/Components/AppButton";

export type EditCaseNumberFormProps = {
  onClose: () => void;
  idDefendant?: number | null;
  onReload: () => void;
  caseNumberSelected?: CaseNumber | null;
};

export const EditCaseNumberForm = ({
  onClose,
  onReload,
  caseNumberSelected,
}: EditCaseNumberFormProps) => {
  const { updateCaseNumber, error, loading } = useUpdateCaseNumber();
  const [caseNumber, setCaseNumber] = useState<string>("");
  const handleSubmit = async () => {
    if (caseNumberSelected) {
      await updateCaseNumber({
        idCaseNumber: caseNumberSelected?.idCaseNumber,
        caseNumber: caseNumber,
      });
    }
    if (!error) {
      AppToast().fire({
        title: "Success",
        text: "The case number was updated successfully",
        icon: "success",
      });
    }
    onReload();
    onClose();
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
    if (caseNumberSelected) setCaseNumber(caseNumberSelected?.caseNumber);
    return () => {
      setCaseNumber("");
    };
  }, [caseNumberSelected]);
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
