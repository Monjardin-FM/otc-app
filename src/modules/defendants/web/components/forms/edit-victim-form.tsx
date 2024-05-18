import { useEffect, useState } from "react";
import { useGetGenders } from "../../../../management-users/web/hooks/use-get-genders";
import * as Yup from "yup";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { Formik } from "formik";
import {
  AppFormField,
  AppFormHelperText,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { Switch } from "@headlessui/react";
import AppDatePicker from "../../../../../presentation/Components/AppDatePicker";
import * as Icon from "react-feather";
import dayjs from "dayjs";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import { VicimById } from "../../../../victim/domain/entities/victim-by-id";
import { useUpdateVictim } from "../../../../victim/web/hooks/use-update-victim";
import { DefendantById } from "../../../domain/entities/defendant-by-id";
import { Input } from "@nextui-org/react";
export type EditVictimFormProps = {
  idVictim?: number | null;
  idDefendant?: number | null;
  onReload: () => void;
  victimInfo?: VicimById;
  defendantInfo?: DefendantById;
  onClose: () => void;
};
type editVictimFormValue = {
  name: string;
  lastName: string;
  // eMail: string;
  caseNumber: string;
  idGender: number;
  password: string;
};
export const EditVictimForm = ({
  idDefendant,
  onReload,
  idVictim,
  victimInfo,
  defendantInfo,
  onClose,
}: EditVictimFormProps) => {
  // const [visibleEditressForm, setVisibleEditressForm] = useToggle(false);
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const { genders, getGenders } = useGetGenders();
  const [statusVictim, setStatusVictim] = useState(true);
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);
  const {
    value: responseUpdateVictim,
    updateVictim,
    loading: loadingVictim,
    // error: errorVictim,
  } = useUpdateVictim();
  const validationSchemaVictim = Yup.object().shape({
    name: Yup.string().required("Required name"),
    lastName: Yup.string().required("Required last name"),
    caseNumber: Yup.string().required("Required case number"),
    // eMail: Yup.string().required("Required email"),
    idGender: Yup.number()
      .moreThan(0, "Select a gender")
      .required("Select gender"),
    password: Yup.string()
      // .required("Required password")
      .min(10, "Minimum length 10 characters"),
  });
  const onSubmitHandler = async (data: editVictimFormValue) => {
    if (idVictim) {
      await updateVictim({
        completeName: `${data.name} ${data.lastName}`,
        name: data.name,
        lastName: data.lastName,
        idDefendant: Number(idDefendant),
        // eMail: data.eMail,
        caseNumber: data.caseNumber,
        birthDate: dayjs(birthDate).format("YYYY-MM-DD"),
        idGender: Number(data.idGender),
        idStatus: statusVictim ? 1 : 0,
        password: data.password,
        idPerson: idVictim,
      });
      onReload();
    }
  };
  useEffect(() => {
    if (responseUpdateVictim && responseUpdateVictim.statusCode === 200) {
      AppToast().fire({
        title: "Success",
        text: "The victim was updated successfully",
        icon: "success",
      });
      onReload();
    }
    if (responseUpdateVictim && responseUpdateVictim.statusCode !== 200) {
      AppToast().fire({
        title: "Error",
        text: `${responseUpdateVictim.error?.message}`,
        icon: "error",
      });
    }
  }, [responseUpdateVictim]);
  useEffect(() => {
    getGenders();
  }, []);
  useEffect(() => {
    if (victimInfo && idVictim) {
      setStatusVictim(victimInfo.idStatus === 1);
      setBirthDate(dayjs(victimInfo.birthDate).toDate());
    }
  }, [victimInfo]);
  return (
    <Formik
      initialValues={{
        name: victimInfo?.name ?? "",
        lastName: victimInfo?.lastName ?? "",
        caseNumber: defendantInfo?.caseNumber ?? "",
        // eMail: "",
        idGender: victimInfo?.idGender ?? 0,
        password: "",
      }}
      enableReinitialize
      validationSchema={validationSchemaVictim}
      onSubmit={onSubmitHandler}
    >
      {({ handleSubmit, handleChange, values, errors }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-y-4 gap-x-3 col-span-12 border border-gray-300 rounded-lg p-6 bg-gray-200">
            <AppFormField className="col-span-4">
              <AppFormLabel>Name</AppFormLabel>
              <AppTextField
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              {errors.name && (
                <AppFormHelperText colorSchema="red">
                  {errors.name}
                </AppFormHelperText>
              )}
            </AppFormField>
            <AppFormField className="col-span-4">
              <AppFormLabel>Last Name</AppFormLabel>
              <AppTextField
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <AppFormHelperText colorSchema="red">
                  {errors.lastName}
                </AppFormHelperText>
              )}
            </AppFormField>
            <AppFormField className="col-span-3">
              <AppFormLabel>Status</AppFormLabel>
              <div className="flex flex-row items-center justify-start gap-3">
                <span>Inactive</span>

                <Switch
                  checked={statusVictim}
                  onChange={setStatusVictim}
                  className={`${
                    statusVictim ? "bg-primaryColor-600" : "bg-primaryColor-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      statusVictim ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
                <span>Active</span>
              </div>
            </AppFormField>
            {/* <AppFormField className="col-span-4">
              <AppFormLabel>Email</AppFormLabel>
              <AppTextField
                name="eMail"
                value={values.eMail}
                onChange={handleChange}
              />
              {errors.eMail && (
                <AppFormHelperText colorSchema="red">
                  {errors.eMail}
                </AppFormHelperText>
              )}
            </AppFormField> */}
            <AppFormField className="col-span-4">
              <AppFormLabel>Case Number</AppFormLabel>
              <AppTextField
                name="caseNumber"
                value={values.caseNumber}
                onChange={handleChange}
              />
              {errors.caseNumber && (
                <AppFormHelperText colorSchema="red">
                  {errors.caseNumber}
                </AppFormHelperText>
              )}
            </AppFormField>
            <AppFormField className="col-span-4">
              <AppFormLabel>Date of Birth</AppFormLabel>

              <AppDatePicker
                selected={birthDate}
                leftIcon={<Icon.Calendar size={18} />}
                onChange={(date: Date) => {
                  if (date instanceof Date) setBirthDate(date);
                }}
                dateFormat={"MM/dd/yyyy"}
              />
            </AppFormField>
            <AppFormField className="col-span-4">
              <AppFormLabel>Gender</AppFormLabel>
              <AppSelect
                name="idGender"
                value={values.idGender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                {genders?.map((gender) => (
                  <option key={gender.idGender} value={gender.idGender}>
                    {gender.gender}
                  </option>
                ))}
              </AppSelect>
              {errors.idGender && (
                <AppFormHelperText colorSchema="red">
                  {errors.idGender}
                </AppFormHelperText>
              )}
            </AppFormField>
            <AppFormField className="col-span-4">
              <Input
                name="password"
                label="Password"
                labelPlacement="outside"
                value={values.password}
                onChange={handleChange}
                // type="password"
                // isClearable
                // placeholder="Password"
                defaultValue={values.password}
                radius="sm"
                variant="faded"
                size="md"
                // onClear={() => setFieldValue("password", "")}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisiblePassword ? (
                      <Icon.EyeOff size={15} />
                    ) : (
                      <Icon.Eye size={15} />
                    )}
                  </button>
                }
                type={isVisiblePassword ? "text" : "password"}
              />
              {errors.password && (
                <AppFormHelperText colorSchema="red">
                  {errors.password}
                </AppFormHelperText>
              )}
              <div className="border border-warn-700 w-full bg-warn-200 text-xs p-2 rounded-lg text-warn-900">
                If the password is empty it will not be updated, otherwise it
                will be updated
              </div>
            </AppFormField>
            {/* <div className="col-span-12">
                <AppButton
                  onClick={() => setVisibleEditressForm(true)}
                  colorScheme="primary"
                >
                  New Editress
                </AppButton>
              </div> */}
            {/* <div className="grid grid-cols-12 gap-4 col-span-12">
                {visibleEditressForm && (
                  <EditressForm
                    onClose={() => setVisibleEditressForm(false)}
                    onReload={() => {}}
                    // idDefendant={}
                  />
                )}
              </div> */}
            <div className="col-span-12 flex flex-row items-center justify-end gap-4">
              <AppButton onClick={onClose}>Cancel</AppButton>
              <AppButton
                colorScheme="primary"
                type="submit"
                isLoading={loadingVictim}
                isDisabled={loadingVictim}
              >
                Save
              </AppButton>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
