import { Button, Divider, Input, Textarea } from "@nextui-org/react";
import {
  AppFormField,
  AppFormHelperText,
} from "../../../../../presentation/Components/AppForm";
import * as Yup from "yup";
import { Formik } from "formik";
import { ReferenceContact } from "../../../domain/entities/reference-contact";
import { useCreateReferenceContact } from "../../hooks/reference-contact/use-post-reference-contact";
import { useEditReferenceContact } from "../../hooks/reference-contact/use-edit-reference-contact";
import { AppToast } from "../../../../../presentation/Components/AppToast";

type ReferenceContactFormValue = {
  name: string;
  phoneNumber: string;
  address: string;
  relationship: string;
};
type ReferenceFormProps = {
  referenceContact?: ReferenceContact | null;
  idDefendant?: number | null;
  idReferencePerson?: number | null;
  isCreating: boolean;
  onClose: () => void;
  onReload: () => void;
};
export const ReferenceForm = ({
  referenceContact,
  idDefendant,
  isCreating,
  idReferencePerson,
  onClose,
  onReload,
}: ReferenceFormProps) => {
  const {
    createReferenceContact,
    error: errorCreateReference,
    loading: loadingCreateReferenceContact,
  } = useCreateReferenceContact();
  const {
    editReferenceContact,
    error: errorEditReference,
    loading: loadingEditReferenceContact,
  } = useEditReferenceContact();
  const validationSchemaReferenceContact = Yup.object().shape({
    name: Yup.string().required("Required name"),
    phoneNumber: Yup.string().required("Required phone number"),
  });
  const onSubmitHandler = async (data: ReferenceContactFormValue) => {
    if (idDefendant) {
      if (isCreating) {
        await createReferenceContact({
          address: data.address,
          name: data.name,
          idPerson: idDefendant,
          phoneNumber: data.phoneNumber,
          relationship: data.relationship,
        });
        if (!errorCreateReference) {
          AppToast().fire({
            title: "Success",
            icon: "success",
            text: "The information was saved successfully",
          });
          onClose();
          onReload();
        }
      } else {
        if (idReferencePerson) {
          await editReferenceContact({
            idPerson: idDefendant,
            idReferencePerson: idReferencePerson,
            address: data.address,
            name: data.name,
            phoneNumber: data.phoneNumber,
            relationship: data.relationship,
          });
          if (!errorEditReference) {
            AppToast().fire({
              title: "Success",
              icon: "success",
              text: "The information was saved successfully",
            });
            onClose();
            onReload();
          }
        }
      }
    }
  };
  return (
    <>
      <Formik
        initialValues={{
          name: referenceContact?.name ?? "",
          phoneNumber: referenceContact?.phoneNumber ?? "",
          relationship: referenceContact?.relationship ?? "",
          address: referenceContact?.address ?? "",
        }}
        enableReinitialize
        validationSchema={validationSchemaReferenceContact}
        onSubmit={onSubmitHandler}
      >
        {({ handleSubmit, handleChange, values, errors, setFieldValue }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-x-2 gap-y-3">
              <AppFormField className="col-span-4 ">
                <Input
                  name="name"
                  label="Name"
                  labelPlacement="outside"
                  value={values.name}
                  onChange={handleChange}
                  type="string"
                  isClearable
                  placeholder="Name"
                  defaultValue={values.name}
                  radius="sm"
                  variant="faded"
                  size="lg"
                  onClear={() => setFieldValue("name", "")}
                />
                {errors.name && (
                  <AppFormHelperText colorSchema="red">
                    {errors.name}
                  </AppFormHelperText>
                )}
              </AppFormField>
              <AppFormField className="col-span-4 ">
                <Input
                  name="relationship"
                  label="Relationship"
                  labelPlacement="outside"
                  value={values.relationship}
                  onChange={handleChange}
                  placeholder="Relationship"
                  type="string"
                  isClearable
                  defaultValue={values.relationship}
                  radius="sm"
                  variant="faded"
                  size="lg"
                  onClear={() => setFieldValue("relationship", "")}
                />
              </AppFormField>

              <AppFormField className="col-span-4 ">
                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  labelPlacement="outside"
                  placeholder="Phone Number"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  type="string"
                  isClearable
                  defaultValue={values.phoneNumber}
                  radius="sm"
                  variant="faded"
                  size="lg"
                  onClear={() => setFieldValue("phoneNumber", "")}
                />
                {errors.phoneNumber && (
                  <AppFormHelperText colorSchema="red">
                    {errors.phoneNumber}
                  </AppFormHelperText>
                )}
              </AppFormField>
              <AppFormField className="col-span-6 ">
                <Textarea
                  name="address"
                  label="Address"
                  labelPlacement="outside"
                  placeholder="Address"
                  value={values.address}
                  onChange={handleChange}
                  type="string"
                  defaultValue={values.address}
                  radius="sm"
                  variant="faded"
                  size="lg"
                />
              </AppFormField>
              <Divider className="my-2 w-full col-span-12" />
              <div className="col-span-12 flex items-end justify-end  gap-2">
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={
                    loadingCreateReferenceContact || loadingEditReferenceContact
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};
