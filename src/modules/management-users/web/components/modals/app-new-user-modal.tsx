import { useEffect, useState } from "react";
import { useGetCounties } from "../../hooks/use-get-county";
import { useGetGenders } from "../../hooks/use-get-genders";
import { useGetRoles } from "../../hooks/use-get-roles";
import { useSaveUser } from "../../hooks/use-save-user";
import { Formik } from "formik";
import * as Yup from "yup";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import {
  AppModal,
  AppModalBody,
  AppModalContent,
  AppModalFooter,
  AppModalHeader,
  AppModalOverlay,
} from "../../../../../presentation/Components/AppModal";
import {
  AppFormField,
  AppFormHelperText,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import { Switch } from "@headlessui/react";

export type AppNewUserModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onReload: () => void;
};
type UserCreateFormValues = {
  name: string;
  lastName: string;
  eMail: string;
  role: number;
  county: number;
  gender: number;
  password: string;
  phone: string;
};
export const AppNewUserModal = ({
  isVisible,
  onClose,
  onReload,
}: AppNewUserModalProps) => {
  const { counties, getCounties } = useGetCounties();
  const { genders, getGenders } = useGetGenders();
  const { roles, getRoles } = useGetRoles();
  const [status, setStatus] = useState(true);
  const {
    createUser,
    loading,
    // error: errorSave,
    value: responseCreateUser,
  } = useSaveUser();

  const validationSchemaSaveUser = Yup.object().shape({
    name: Yup.string().required("Required name"),
    lastName: Yup.string().required("Required last name"),
    eMail: Yup.string().required("Required email"),
    role: Yup.number().moreThan(0, "Select a role").required("Select a role"),
    county: Yup.number()
      .moreThan(0, "Select a county")
      .required("Select a County"),
    gender: Yup.number()
      .moreThan(0, "Select a gender")
      .required("Select a gender"),
    password: Yup.string()
      .required("Required password")
      .min(10, "Minimum length 10 characters"),
    phone: Yup.string()
      .required("Required cell phone number")
      .matches(/^[0-9]+$/, "Must be only digits")
      .max(15, "15 digits"),
  });
  const onSubmitHandler = async (data: UserCreateFormValues) => {
    await createUser({
      name: data.name,
      lastName: data.lastName,
      completeName: `${data.name} ${data.lastName}`,
      eMail: data.eMail,
      idCounty: Number(data.county),
      idGender: Number(data.gender),
      idRole: Number(data.role),
      idStatus: status ? 1 : 0,
      password: data.password,
      phone: data.phone,
    });
  };
  useEffect(() => {
    getCounties();
    getGenders();
    getRoles();
  }, []);
  useEffect(() => {
    if (responseCreateUser && responseCreateUser.statusCode !== 200) {
      AppToast().fire({
        title: "Error",
        text: `${responseCreateUser.error?.message}`,
        icon: "error",
      });
    }
    if (responseCreateUser && responseCreateUser.statusCode === 200) {
      AppToast().fire({
        title: "Success",
        text: "User created successfully",
        icon: "success",
      });
      onClose();
      onReload();
    }
  }, [responseCreateUser]);
  return (
    <AppModal isVisible={isVisible} onClose={onClose} size="3xl">
      <AppModalOverlay>
        <AppModalContent>
          <Formik
            enableReinitialize
            initialValues={{
              name: "",
              lastName: "",
              eMail: "",
              role: 0,
              county: 0,
              gender: 0,
              password: "",
              phone: "",
            }}
            onSubmit={onSubmitHandler}
            validationSchema={validationSchemaSaveUser}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <AppModalHeader>New User</AppModalHeader>
                <AppModalBody>
                  <div className="grid grid-cols-12 gap-y-4 gap-x-3">
                    <AppFormField className="col-span-6">
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
                    <AppFormField className="col-span-6">
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
                    <AppFormField className="col-span-12">
                      <AppFormLabel>Email</AppFormLabel>
                      <AppTextField
                        name="eMail"
                        type="email"
                        value={values.eMail}
                        onChange={handleChange}
                        autoComplete="new-mail"
                      />
                      {errors.eMail && (
                        <AppFormHelperText colorSchema="red">
                          {errors.eMail}
                        </AppFormHelperText>
                      )}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Role</AppFormLabel>
                      <AppSelect
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                      >
                        <option value="">Select Role</option>
                        {roles?.map((role) => (
                          <option key={role.idRole} value={role.idRole}>
                            {role.role}
                          </option>
                        ))}
                      </AppSelect>
                      {errors.role && (
                        <AppFormHelperText colorSchema="red">
                          {errors.role}
                        </AppFormHelperText>
                      )}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>County</AppFormLabel>
                      <AppSelect
                        name="county"
                        value={values.county}
                        onChange={handleChange}
                      >
                        <option value="">Select County</option>
                        {counties?.map((county) => (
                          <option key={county.idCounty} value={county.idCounty}>
                            {county.county}
                          </option>
                        ))}
                      </AppSelect>
                      {errors.county && (
                        <AppFormHelperText colorSchema="red">
                          {errors.county}
                        </AppFormHelperText>
                      )}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Gender</AppFormLabel>
                      <AppSelect
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        {genders?.map((gender) => (
                          <option key={gender.idGender} value={gender.idGender}>
                            {gender.gender}
                          </option>
                        ))}
                      </AppSelect>
                      {errors.gender && (
                        <AppFormHelperText colorSchema="red">
                          {errors.gender}
                        </AppFormHelperText>
                      )}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Phone Number</AppFormLabel>
                      <AppTextField
                        name="phone"
                        type="string"
                        onChange={handleChange}
                        value={values.phone}
                      />
                      {errors.phone && (
                        <AppFormHelperText colorSchema="red">
                          {errors.phone}
                        </AppFormHelperText>
                      )}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Password</AppFormLabel>
                      <AppTextField
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                        type="password"
                        autoComplete="new-password"
                      />
                      {errors.password && (
                        <AppFormHelperText colorSchema="red">
                          {errors.password}
                        </AppFormHelperText>
                      )}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Status</AppFormLabel>
                      <div className="flex flex-row items-center justify-start gap-5">
                        <span>Inactive</span>
                        <Switch
                          checked={status}
                          onChange={setStatus}
                          className={`${
                            status
                              ? "bg-primaryColor-600"
                              : "bg-primaryColor-200"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              status ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>

                        <span>Active</span>
                      </div>
                    </AppFormField>
                  </div>
                </AppModalBody>
                <AppModalFooter>
                  <AppButton onClick={onClose}>Cancel</AppButton>
                  <AppButton
                    colorScheme="primary"
                    type="submit"
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    Save
                  </AppButton>
                </AppModalFooter>
              </form>
            )}
          </Formik>
        </AppModalContent>
      </AppModalOverlay>
    </AppModal>
  );
};
