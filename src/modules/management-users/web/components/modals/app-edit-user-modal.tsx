import { useEffect, useState } from "react";
import { useGetCounties } from "../../hooks/use-get-county";
import { useGetGenders } from "../../hooks/use-get-genders";
import { useGetRoles } from "../../hooks/use-get-roles";
import { useGetUserById } from "../../hooks/use-get-user-by-id";
import { Formik } from "formik";
import { useUpdateUser } from "../../hooks/use-update-user";
import * as Yup from "yup";
import * as Icon from "react-feather";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import {
  AppFormField,
  AppFormLabel,
  AppFormHelperText,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import { Switch } from "@headlessui/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

export type AppEditUserModalProps = {
  isVisible: boolean;
  // onClose: () => void;
  onReload: () => void;
  onOpenChangeUser: () => void;
  idUser?: number | null;
};
type UserUpdateFormValues = {
  name: string;
  lastName: string;
  eMail: string;
  role: number;
  county: number;
  gender: number;
  password: string;
  phone: string;
};
export const AppEditUserModal = ({
  isVisible,
  // onClose,
  onOpenChangeUser,
  onReload,
  idUser,
}: AppEditUserModalProps) => {
  const { counties, getCounties } = useGetCounties();
  const { genders, getGenders } = useGetGenders();
  const { roles, getRoles } = useGetRoles();
  const { getUserById, user } = useGetUserById();
  const {
    updateUser,
    loading,
    error: errorUpdate,
    value: responseUpdateUser,
  } = useUpdateUser();
  const [status, setStatus] = useState(false);
  const validationSchemaUpdateUser = Yup.object().shape({
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
    phone: Yup.string()
      .required("Required cell phone number")
      .matches(/^[0-9]+$/, "Must be only digits")
      .max(15, "15 digits"),
    password: Yup.string().min(10, "Minimum length 10 characters"),
  });
  const onSubmitHandler = async (data: UserUpdateFormValues) => {
    if (user) {
      await updateUser({
        idPerson: user?.idPerson,
        completeName: `${data.name} ${data.lastName}`,
        name: data.name,
        lastName: data.lastName,
        idCounty: Number(data.county),
        idGender: Number(data.gender),
        idRole: Number(data.role),
        idStatus: status ? 1 : 0,
        password: data.password,
        phone: data.phone,
      });
    }
  };
  useEffect(() => {
    if (idUser) {
      getUserById({ completeName: "", idUser: idUser });
    }
    getRoles();
    getCounties();
    getGenders();
  }, [idUser]);
  useEffect(() => {
    if (user) {
      setStatus(user.idStatus === 1);
    }
  }, [idUser]);
  useEffect(() => {
    if (responseUpdateUser && responseUpdateUser.statusCode !== 200) {
      AppToast().fire({
        title: "Error",
        text: `${responseUpdateUser.error?.message}`,
        icon: "error",
      });
    }
    if (responseUpdateUser && responseUpdateUser.statusCode === 200) {
      AppToast().fire({
        title: "Success",
        text: "Information saved successfully",
        icon: "success",
      });
      onOpenChangeUser();
      onReload();
    }
  }, [errorUpdate]);
  useEffect(() => {
    if (loading) {
      AppToast().fire({
        title: "Updating information user",
        text: "User information is being updated.Please wait",
        icon: "info",
      });
    }
  }, [loading]);
  return (
    <Modal
      isOpen={isVisible}
      onOpenChange={onOpenChangeUser}
      scrollBehavior="outside"
      backdrop="blur"
      size="4xl"
    >
      {/* <AppModalOverlay> */}
      <ModalContent>
        {(onClose) => (
          <Formik
            enableReinitialize
            initialValues={{
              name: user?.name ? user.name : "",
              lastName: user?.lastName ? user.lastName : "",
              eMail: user?.eMail ? user.eMail : "",
              role: user?.idRole ? user.idRole : 0,
              county: user?.idCounty ? user.idCounty : 0,
              gender: user?.idGender ? user.idGender : 0,
              password: "",
              phone: user?.phone ? user.phone : "",
            }}
            validationSchema={validationSchemaUpdateUser}
            onSubmit={onSubmitHandler}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <ModalHeader>Edit User</ModalHeader>
                <ModalBody>
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
                        type="email"
                        onChange={handleChange}
                        disabled
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
                        id="phone"
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
                      />
                      {errors.password && (
                        <AppFormHelperText colorSchema="red">
                          {errors.password}
                        </AppFormHelperText>
                      )}
                      <div className="border border-warn-700 w-full bg-warn-200 text-xs p-2 rounded-lg text-warn-900">
                        If the password is empty it will not be updated,
                        otherwise it will be updated
                      </div>
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
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="ghost" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    endContent={<Icon.Save size={18} />}
                    color="primary"
                    type="submit"
                    isLoading={loading}
                    isDisabled={loading}
                    variant="shadow"
                  >
                    Update
                  </Button>
                </ModalFooter>
              </form>
            )}
          </Formik>
        )}
      </ModalContent>
      {/* </AppModalOverlay> */}
    </Modal>
  );
};
