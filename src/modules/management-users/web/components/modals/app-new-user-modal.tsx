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
import { AppToggleButton } from "../../../../../presentation/Components/AppToggleButton";
import { AppButton } from "../../../../../presentation/Components/AppButton";

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
  const [status, setStatus] = useState(false);
  const { createUser, loading, error: errorSave } = useSaveUser();

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
    password: Yup.string().required("Required password"),
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
    if (!errorSave) {
      AppToast().fire({
        title: "Success",
        text: "Information saved successfully",
        icon: "success",
      });
    }
    onClose();
    onReload();
  };
  useEffect(() => {
    getCounties();
    getGenders();
    getRoles();
  }, []);
  useEffect(() => {
    if (errorSave) {
      AppToast().fire({
        title: "Error",
        text: "An error occurred while saving information",
        icon: "error",
      });
    }
  }, [errorSave]);
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
                        value={values.eMail}
                        onChange={handleChange}
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
                        onChange={handleChange}
                        value={values.phone}
                      />
                      {/* {errors.password && (
                        <AppFormHelperText colorSchema="red">
                          {errors.password}
                        </AppFormHelperText>
                      )} */}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Password</AppFormLabel>
                      <AppTextField
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                        type="password"
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
                        {status ? (
                          <AppToggleButton
                            name="status"
                            // value={status}
                            onChange={() => setStatus(!status)}
                            checked={status}
                          ></AppToggleButton>
                        ) : (
                          <AppToggleButton
                            name="status"
                            // value={values.status}
                            onChange={() => setStatus(!status)}
                            checked={status}
                          ></AppToggleButton>
                        )}

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
