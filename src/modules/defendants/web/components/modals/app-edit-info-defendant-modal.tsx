import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  //   ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import * as Icon from "react-feather";
import { useGetDefendantsById } from "../../hooks/use-get-defendants-by-id";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  AppFormField,
  AppFormHelperText,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import Select from "react-select";
import { useToggle } from "react-use";
import { useGetGenders } from "../../../../management-users/web/hooks/use-get-genders";
import { useGetCounties } from "../../../../management-users/web/hooks/use-get-county";
import { useGetDefendantDevice } from "../../hooks/use-get-defendant-device";
import { useGetAddressPerson } from "../../hooks/use-get-address-person";
import { Disclosure, Switch } from "@headlessui/react";
import AppDatePicker from "../../../../../presentation/Components/AppDatePicker";
import { DeviceForm } from "../forms/app-device-form";
import { AddressForm } from "../forms/address-form";
import { PhoneForm } from "../forms/phone-form";
import { AppDefendantDevicesTable } from "../tables/app-devices-defendant-table";
import { AppAddressPersonsTable } from "../tables/app-address-person";
import { useGetUsers } from "../../../../management-users/web/hooks/use-get-users";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import { useUpdateDefendant } from "../../hooks/use-update-defendant";
import dayjs from "dayjs";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { useDeleteDefendantDevice } from "../../hooks/use-delete-device-defendant";
import { useDeleteAddressPerson } from "../../hooks/use-delete-address-person";
import { AddressUpdateForm } from "../forms/edit-addres-form";
import { AppPhoneTable } from "../tables/app-phone-person-table";
import { useGetPhonePerson } from "../../hooks/use-get-phone";
import { useDeletePhonePerson } from "../../hooks/use-delete-phone";
import { DefendantDevice } from "../../../domain/entities/defendant-device";
import { EditDeviceForm } from "../forms/edit-device-form";
import { useGetCaseNumber } from "../../hooks/use-get-case-number";
import { CaseNumberForm } from "../forms/create-case-number-form";
import { AppCaseNumberTable } from "../tables/app-case-number-table";
import { useDeleteCaseNumber } from "../../hooks/use-delete-case-number";
import { CaseNumber } from "../../../domain/entities/case-number";
import { EditCaseNumberForm } from "../forms/edit-case-number-form";
export type AppEditInfoDefendantModalProps = {
  isVisible: boolean;
  onClose: () => void;
  idDefendant?: number | null;
};
type updateDefendantFormValue = {
  name?: string;
  lastName?: string;
  //   email: string;
  // caseNumber?: string;
  gender?: number;
  sid?: string;
  offense?: string;
  password?: string;
  notes?: string;
};
export const AppEditInfoDefendantModal = ({
  isVisible,
  onClose,
  idDefendant,
}: AppEditInfoDefendantModalProps) => {
  const { defendant, getDefendantById } = useGetDefendantsById();
  const [visibleDeviceForm, setVisibleDeviceForm] = useToggle(false);
  const [visibleAddressForm, setVisibleAddressForm] = useToggle(false);
  const [visiblePhoneForm, setVisiblePhoneForm] = useToggle(false);
  const [visibleCaseNumberForm, setVisibleCaseNumberForm] = useToggle(false);
  const [visibleAddressEditForm, setVisibleAddressEditForm] = useToggle(false);
  const [visibleEditCaseNumberForm, setVisibleEditCaseNumberForm] =
    useToggle(false);
  const { getUsers, users } = useGetUsers();
  const { genders, getGenders } = useGetGenders();
  const { counties, getCounties } = useGetCounties();
  const { defendantDevice, getDefendantDevice } = useGetDefendantDevice();
  const { addressPerson, getAddressPerson } = useGetAddressPerson();
  const { getCaseNumber, caseNumber } = useGetCaseNumber();
  const [idAddress, setIdAddress] = useState<number | null>();
  const [chiefs, setChiefs] = useState<{ value: number; label: string }[]>();
  const [countiesFilter, setCountiesFilter] =
    useState<{ value: number; label: string }[]>();
  const [idOfficer, setIdOfficer] = useState<number | null>();
  const [idCounty, setIdCounty] = useState<number | null>();
  const [statusOfficer, setStatusOfficer] = useState(false);
  const [caseNumberSelected, setCaseNumberSelected] =
    useState<CaseNumber | null>(null);

  const [birthDate, setBirthDate] = useState<Date | null>(new Date());
  const [toggleReload, setToggleReload] = useToggle(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);
  const [visibleEditDeviceForm, setVisibleEditDeviceForm] = useState(false);
  const [selectedDevice, setSelectedDevice] =
    useState<DefendantDevice | null>();
  const {
    deleteDefendantDevice,
    error: errorDeleteDevice,
    loading: loadingDeleteDefendantDevice,
  } = useDeleteDefendantDevice();
  const {
    deleteCaseNumber,
    error: errorDeleteCaseNumber,
    loading: loadingDeleteCaseNumber,
  } = useDeleteCaseNumber();
  const {
    error: errorDeleteAddress,
    deleteAddressPerson,
    loading: loadingDeleteAddress,
  } = useDeleteAddressPerson();
  const [parent] = useAutoAnimate();
  const {
    value: responseUpdateDefendant,
    updateDefendant,
    loading: loadingDefendant,
    // error: errorDefendant,
  } = useUpdateDefendant();
  const { getPhonePerson, phonePerson } = useGetPhonePerson();
  const {
    deletePhonePerson,
    error: errorDeletePhone,
    loading: loadingDeletePhone,
  } = useDeletePhonePerson();
  const onSubmitHandler = async (data: updateDefendantFormValue) => {
    if (idDefendant) {
      await updateDefendant({
        name: data.name ?? "",
        lastName: data.lastName ?? "",
        completeName: `${data.name} ${data.lastName}`,
        //   eMail: data.email,
        caseNumber: "",
        idCounty: Number(idCounty),
        idGender: Number(data.gender),
        idOfficer: Number(idOfficer),
        idStatus: statusOfficer ? 1 : 0,
        offense: data.offense ?? "",
        password: data.password ?? "",
        sid: data.sid ?? "",
        birthDate: dayjs(birthDate).format("YYYY-MM-DD"),
        idPerson: idDefendant,
        notes: data.notes ?? "",
      });
    }
  };

  useEffect(() => {
    if (responseUpdateDefendant && responseUpdateDefendant.statusCode !== 200) {
      AppToast().fire({
        title: "Error",
        text: `${responseUpdateDefendant.error?.message}`,
        icon: "error",
      });
      // setToggleReload(!toggleReload);
      // onClose();
    }
    if (responseUpdateDefendant && responseUpdateDefendant.statusCode === 200) {
      AppToast().fire({
        title: "Success",
        text: "The defendant was updated successfully",
        icon: "success",
      });
      setToggleReload(!toggleReload);
      onClose();
    }
  }, [responseUpdateDefendant]);

  useEffect(() => {
    if (loadingDefendant) {
      AppToast().fire({
        title: "Updating defendant information",
        text: "The defendant is being updated. Please wait",
        icon: "info",
      });
    }
  }, [loadingDefendant]);
  const validationSchemaDefendant = Yup.object().shape({
    name: Yup.string().required("Required name"),
    lastName: Yup.string().required("Required last name"),
    // email: Yup.string().required("Required email"),
    gender: Yup.number()
      .moreThan(0, "Select a gender")
      .required("Select a gender"),
    // caseNumber: Yup.string().required("Required case number"),
    sid: Yup.string().required("Required sid"),
    offense: Yup.string().required("Required offense"),
    password: Yup.string().min(10, "Minimum length 10 characters"),
  });
  useEffect(() => {
    getUsers({ completeName: "" });
    getGenders();
    getCounties();
    if (idDefendant) {
      getDefendantById({ idPerson: idDefendant });
      getDefendantDevice({ idDefendant: idDefendant });
      getAddressPerson({ idPerson: idDefendant });
      getPhonePerson({ idPerson: idDefendant });
      getCaseNumber({ idPerson: idDefendant });
    }
  }, [idDefendant, toggleReload]);

  useEffect(() => {
    if (idDefendant) {
      setStatusOfficer(defendant?.idStatus === 1);
      setIdCounty(defendant?.idCounty);
      setIdOfficer(defendant?.idOfficer);
      setBirthDate(dayjs(defendant?.birthDate).toDate());
    }
  }, [defendant, isVisible]);
  // useEffect to filter chieff officer
  useEffect(() => {
    if (users) {
      const chiefFilter = users.filter((item) => item.idRole === 2);
      setChiefs(
        chiefFilter.map((item) => ({
          value: item.idPerson,
          label: `${item.name} ${item.lastName}`,
        }))
      );
    }
    if (counties) {
      setCountiesFilter(
        counties.map((item) => ({
          value: item.idCounty,
          label: item.county,
        }))
      );
    }
  }, [users, counties]);
  const onDelete = () => {
    AppToast().fire({
      title: "Device deleted",
      icon: "success",
      text: "The device was deleted succesfully",
    });
  };

  const onDeletePhone = () => {
    AppToast().fire({
      title: "Phone deleted",
      icon: "success",
      text: "The phone was deleted succesfully",
    });
  };
  const onDeleteCaseNumber = () => {
    AppToast().fire({
      title: "Case Number deleted",
      icon: "success",
      text: "The case number was deleted succesfully",
    });
  };
  useEffect(() => {
    if (errorDeleteDevice) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the device. Try again",
      });
    }
    if (loadingDeleteAddress) {
      AppToast().fire({
        title: "Deleting address",
        icon: "info",
        text: "The address is being deleted. Please Wait",
      });
    }
  }, [errorDeleteDevice, loadingDeleteAddress]);
  useEffect(() => {
    if (errorDeleteCaseNumber) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the case number. Try again",
      });
    }
    if (loadingDeleteCaseNumber) {
      AppToast().fire({
        title: "Deleting case number",
        icon: "info",
        text: "The case number is being deleted. Please Wait",
      });
    }
  }, [errorDeleteCaseNumber, loadingDeleteCaseNumber]);
  const onDeleteAddress = () => {
    AppToast().fire({
      title: "Address deleted",
      icon: "success",
      text: "The address was deleted succesfully",
    });
  };
  useEffect(() => {
    if (errorDeleteAddress) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the address. Try again",
      });
    }
    if (loadingDeleteDefendantDevice) {
      AppToast().fire({
        title: "Deleting device",
        icon: "info",
        text: "The device is being deleted. Please Wait",
      });
    }
  }, [errorDeleteDevice, loadingDeleteDefendantDevice]);
  useEffect(() => {
    if (errorDeletePhone) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the phone. Try again",
      });
    }
    if (loadingDeletePhone) {
      AppToast().fire({
        title: "Deleting phone",
        icon: "info",
        text: "The phone is being deleted. Please Wait",
      });
    }
  }, [errorDeletePhone, loadingDeletePhone]);
  return (
    <Modal
      size="4xl"
      isOpen={isVisible}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 items-center">
            <Chip color="primary" variant="bordered">
              <div className="flex flex-row items-center jusitfy-center gap-3">
                <Icon.User size={15} />
                <span>
                  {`Defendant: ${defendant?.name} ${defendant?.lastName}`}
                </span>
              </div>
            </Chip>
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full p-5 gap-5">
            <>
              <Formik
                initialValues={{
                  name: defendant?.name,
                  lastName: defendant?.lastName,
                  gender: defendant?.idGender,
                  county: defendant?.idCounty,
                  // caseNumber: defendant?.caseNumber,
                  sid: defendant?.sid,
                  offense: defendant?.offense,
                  password: "",
                  notes: defendant?.notes ?? "",
                }}
                enableReinitialize
                validationSchema={validationSchemaDefendant}
                onSubmit={onSubmitHandler}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  setFieldValue,
                }) => (
                  <form autoComplete="off" onSubmit={handleSubmit}>
                    <div
                      ref={parent}
                      className="grid grid-cols-12 gap-4 border rounded-lg p-3 bg-primary-100"
                    >
                      <div className="col-span-12 grid grid-cols-3 items-center justify-center mb-3 gap-4">
                        <AppFormField className="col-span-1">
                          <AppFormLabel>Officer</AppFormLabel>
                          <Select
                            name="chiefs"
                            isSearchable={true}
                            defaultValue={
                              chiefs &&
                              chiefs.find((item) => item.value === idOfficer)
                            }
                            onChange={(e) => setIdOfficer(Number(e?.value))}
                            options={chiefs}
                          />
                        </AppFormField>
                        <AppFormField className="col-span-1 z-50">
                          <AppFormLabel>Status</AppFormLabel>
                          <div className="flex flex-row items-center justify-start gap-3">
                            <span>Inactive</span>

                            <Switch
                              checked={statusOfficer}
                              onChange={setStatusOfficer}
                              className={`${
                                statusOfficer
                                  ? "bg-primaryColor-600"
                                  : "bg-primaryColor-200"
                              } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                              <span className="sr-only">
                                Enable notifications
                              </span>
                              <span
                                className={`${
                                  statusOfficer
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                              />
                            </Switch>
                            <span>Active</span>
                          </div>
                        </AppFormField>
                      </div>
                      <div className="col-span-12 grid grid-cols-12 gap-3">
                        <AppFormField className="col-span-4 z-0">
                          <Input
                            name="name"
                            label="name"
                            labelPlacement="outside"
                            value={values.name}
                            onChange={handleChange}
                            type="string"
                            isClearable
                            placeholder="Defendant name"
                            defaultValue={values.name}
                            radius="sm"
                            variant="faded"
                            size="md"
                            onClear={() => setFieldValue("name", "")}
                          />
                          {errors.name && (
                            <AppFormHelperText colorSchema="red">
                              {errors.name}
                            </AppFormHelperText>
                          )}
                        </AppFormField>
                        <AppFormField className="col-span-4 z-0">
                          <Input
                            name="lastName"
                            label="Last Name"
                            labelPlacement="outside"
                            value={values.lastName}
                            onChange={handleChange}
                            type="string"
                            isClearable
                            placeholder="Defendant last name"
                            defaultValue={values.lastName}
                            radius="sm"
                            variant="faded"
                            size="md"
                            onClear={() => setFieldValue("lastName", "")}
                          />
                          {errors.lastName && (
                            <AppFormHelperText colorSchema="red">
                              {errors.lastName}
                            </AppFormHelperText>
                          )}
                        </AppFormField>
                        {/* <AppFormField className="col-span-3 z-0">
                          <Input
                            name="caseNumber"
                            label="Case number"
                            labelPlacement="outside"
                            value={values.caseNumber}
                            onChange={handleChange}
                            type="string"
                            isClearable
                            placeholder="Case Number"
                            defaultValue={values.caseNumber}
                            radius="sm"
                            variant="faded"
                            size="md"
                            onClear={() => setFieldValue("caseNumber", "")}
                          />
                          {errors.caseNumber && (
                            <AppFormHelperText colorSchema="red">
                              {errors.caseNumber}
                            </AppFormHelperText>
                          )}
                        </AppFormField> */}
                        <AppFormField className="col-span-3">
                          <AppFormLabel>County</AppFormLabel>
                          <Select
                            name="county"
                            options={countiesFilter}
                            defaultValue={
                              countiesFilter &&
                              countiesFilter.find(
                                (item) => item.value === idCounty
                              )
                            }
                            isSearchable={true}
                            onChange={(e) => setIdCounty(Number(e?.value))}
                          />
                        </AppFormField>
                        <AppFormField className="col-span-3 ">
                          <AppFormLabel>Date of Birth</AppFormLabel>
                          <AppDatePicker
                            selected={birthDate}
                            onChange={(date: Date) => {
                              if (date instanceof Date) setBirthDate(date);
                            }}
                            dateFormat={"MM/dd/yyyy"}
                          />
                        </AppFormField>
                        <AppFormField className="col-span-2">
                          <AppFormLabel>Gender</AppFormLabel>
                          <AppSelect
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select Gender</option>
                            {genders?.map((gender) => (
                              <option
                                key={gender.idGender}
                                value={gender.idGender}
                              >
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
                        <AppFormField className="col-span-3 z-0">
                          <Input
                            name="sid"
                            label="SID"
                            labelPlacement="outside"
                            value={values.sid}
                            onChange={handleChange}
                            type="string"
                            isClearable
                            placeholder="SID"
                            defaultValue={values.sid}
                            radius="sm"
                            variant="faded"
                            size="md"
                            onClear={() => setFieldValue("sid", "")}
                          />
                          {errors.sid && (
                            <AppFormHelperText colorSchema="red">
                              {errors.sid}
                            </AppFormHelperText>
                          )}
                        </AppFormField>
                        <AppFormField className="col-span-3 z-0 ">
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
                            If the password is empty it will not be updated,
                            otherwise it will be updated
                          </div>
                        </AppFormField>
                        <AppFormField className="col-span-6 z-0">
                          <Textarea
                            name="notes"
                            label="Notes"
                            labelPlacement="outside"
                            value={values.notes}
                            onChange={handleChange}
                            type="string"
                            placeholder="Add notes"
                            defaultValue={values.notes}
                            radius="sm"
                            variant="faded"
                            size="md"
                          />
                        </AppFormField>
                        <AppFormField className="col-span-6 z-0">
                          <Textarea
                            name="offense"
                            label="Offense"
                            labelPlacement="outside"
                            value={values.offense}
                            onChange={handleChange}
                            type="string"
                            placeholder="Offense"
                            defaultValue={values.offense}
                            radius="sm"
                            variant="faded"
                            size="md"
                            // onClear={() => setFieldValue("offense", "")}
                          />
                          {errors.offense && (
                            <AppFormHelperText colorSchema="red">
                              {errors.offense}
                            </AppFormHelperText>
                          )}
                        </AppFormField>
                      </div>
                      <div className="col-span-12 flex flex-row items-center justify-end gap-3 ">
                        <Button
                          onClick={() => {
                            onClose();
                            setIdCounty(null);
                            setIdOfficer(null);
                            setStatusOfficer(false);
                            setBirthDate(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          type="submit"
                          isLoading={loadingDefendant}
                          isDisabled={loadingDefendant}
                        >
                          Update Defendant
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
              {idDefendant && (
                <div className="col-span-12 flex flex-row items-center justify-start gap-3 w-full">
                  <Button
                    color="warning"
                    startContent={<Icon.PlusCircle size={18} />}
                    onClick={() => {
                      setVisibleDeviceForm(true);
                      setVisibleAddressForm(false);
                      setVisiblePhoneForm(false);
                      setVisibleCaseNumberForm(false);
                    }}
                  >
                    New Device
                  </Button>
                  <Button
                    color="warning"
                    startContent={<Icon.PlusCircle size={18} />}
                    onClick={() => {
                      setVisibleAddressForm(true);
                      setVisibleDeviceForm(false);
                      setVisiblePhoneForm(false);
                      setVisibleCaseNumberForm(false);
                    }}
                  >
                    New Address
                  </Button>
                  <Button
                    color="warning"
                    startContent={<Icon.PlusCircle size={18} />}
                    onClick={() => {
                      setVisiblePhoneForm(true);
                      setVisibleDeviceForm(false);
                      setVisibleAddressForm(false);
                      setVisibleCaseNumberForm(false);
                    }}
                  >
                    New Phone Number
                  </Button>
                  <Button
                    color="warning"
                    startContent={<Icon.PlusCircle size={18} />}
                    onClick={() => {
                      setVisibleCaseNumberForm(true);
                      setVisiblePhoneForm(false);
                      setVisibleDeviceForm(false);
                      setVisibleAddressForm(false);
                    }}
                  >
                    New Case Number
                  </Button>
                </div>
              )}
              <div className="col-span-12 w-full" ref={parent}>
                {visibleDeviceForm && (
                  <DeviceForm
                    onClose={() => setVisibleDeviceForm(false)}
                    idDefendant={idDefendant}
                    onReload={() => {
                      setToggleReload(!toggleReload);
                      //   onReload();
                    }}
                  />
                )}
              </div>
              <div className="col-span-12 w-full" ref={parent}>
                {visibleAddressForm && (
                  <AddressForm
                    onClose={() => setVisibleAddressForm(false)}
                    idDefendant={idDefendant}
                    onReload={() => {
                      setToggleReload(!toggleReload);
                      setVisibleAddressForm(false);
                      //   onReload();
                    }}
                  />
                )}
              </div>
              <div className="col-span-12" ref={parent}>
                {visiblePhoneForm && (
                  <PhoneForm
                    onClose={() => setVisiblePhoneForm(false)}
                    onReload={() => {
                      setToggleReload(!toggleReload);
                      setVisiblePhoneForm(false);
                    }}
                    idDefendant={idDefendant}
                  />
                )}
              </div>
              <div className="col-span-12" ref={parent}>
                {visibleCaseNumberForm && (
                  <CaseNumberForm
                    onClose={() => setVisibleCaseNumberForm(false)}
                    onReload={() => {
                      setToggleReload(!toggleReload);
                      setVisibleCaseNumberForm(false);
                    }}
                    idDefendant={idDefendant}
                  />
                )}
              </div>
              <div className="col-span-12 border flex w-full">
                <div className="w-full">
                  <div className="flex flex-col w-full rounded-2xl bg-white p-2 gap-3">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-info-100 px-4 py-2 text-left text-sm font-medium text-info-900 hover:bg-info-200 focus:outline-none focus-visible:ring focus-visible:primary">
                            Devices
                            <Icon.ChevronRight
                              className={open ? "rotate-90 transform" : ""}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="text-gray-500">
                            <AppDefendantDevicesTable
                              isCreate={false}
                              onDelete={async ({ record }) => {
                                await deleteDefendantDevice({
                                  idDevice: record.idPersonDevice,
                                });
                                if (!errorDeleteDevice) onDelete();
                                setToggleReload(!toggleReload);
                              }}
                              onEdit={({ record }) => {
                                setSelectedDevice(record);
                                setVisibleEditDeviceForm(true);
                              }}
                              items={defendantDevice}
                              loadingDeleteDefendantDevice={
                                loadingDeleteDefendantDevice
                              }
                            />
                            <div ref={parent} className="w-full">
                              {visibleEditDeviceForm && (
                                <EditDeviceForm
                                  onClose={() =>
                                    setVisibleEditDeviceForm(false)
                                  }
                                  onReload={() =>
                                    setToggleReload(!toggleReload)
                                  }
                                  idDefendant={idDefendant}
                                  selectedDevice={selectedDevice}
                                />
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-info-100 px-4 py-2 text-left text-sm font-medium text-info-900 hover:bg-info-200 focus:outline-none focus-visible:ring focus-visible:primary">
                            Addresses
                            <Icon.ChevronRight
                              className={open ? "rotate-90 transform" : ""}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="text-gray-500">
                            <AppAddressPersonsTable
                              onEdit={({ record }) => {
                                setVisibleAddressForm(false);
                                setVisibleDeviceForm(false);
                                setIdAddress(record.idAddress);
                                setVisibleAddressEditForm(true);
                              }}
                              onDelete={async ({ record }) => {
                                await deleteAddressPerson({
                                  idAddress: record.idAddress,
                                });
                                if (!errorDeleteAddress) onDeleteAddress();
                                setToggleReload(!toggleReload);
                              }}
                              items={addressPerson}
                              loadingDeleteAddress={loadingDeleteAddress}
                              isCreate={false}
                            />
                            <div ref={parent} className="w-full">
                              {visibleAddressEditForm && (
                                <AddressUpdateForm
                                  idAddress={idAddress}
                                  onClose={() => {
                                    setVisibleAddressEditForm(false);
                                    setIdAddress(null);
                                  }}
                                  isVisible={visibleAddressEditForm}
                                  onReload={() =>
                                    setToggleReload(!toggleReload)
                                  }
                                />
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-info-100 px-4 py-2 text-left text-sm font-medium text-info-900 hover:bg-info-200 focus:outline-none focus-visible:ring focus-visible:primary">
                            Phone Number
                            <Icon.ChevronRight
                              className={open ? "rotate-90 transform" : ""}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="text-gray-500">
                            <AppPhoneTable
                              isCreate={false}
                              loadingDeletePhone={loadingDeletePhone}
                              onDelete={async ({ record }) => {
                                await deletePhonePerson({
                                  idPhone: record.idPhonePerson,
                                });
                                if (!errorDeletePhone) onDeletePhone();
                                setToggleReload(!toggleReload);
                              }}
                              items={phonePerson}
                              onEdit={() => {}}
                            />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-info-100 px-4 py-2 text-left text-sm font-medium text-info-900 hover:bg-info-200 focus:outline-none focus-visible:ring focus-visible:primary">
                            Case Number
                            <Icon.ChevronRight
                              className={open ? "rotate-90 transform" : ""}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="text-gray-500">
                            <AppCaseNumberTable
                              isCreate={false}
                              loadingDeleteCaseNumber={loadingDeleteCaseNumber}
                              onDelete={async ({ record }) => {
                                await deleteCaseNumber({
                                  idCaseNumber: record.idCaseNumber,
                                });
                                if (!errorDeleteCaseNumber)
                                  onDeleteCaseNumber();
                                setToggleReload(!toggleReload);
                              }}
                              items={caseNumber}
                              onEdit={(record) => {
                                setVisibleAddressForm(false);
                                setVisibleDeviceForm(false);
                                setVisibleAddressEditForm(false);
                                setVisiblePhoneForm(false);
                                setCaseNumberSelected(record.record);
                                setVisibleEditCaseNumberForm(true);
                              }}
                            />
                            <div ref={parent} className="w-full">
                              {visibleEditCaseNumberForm && (
                                <EditCaseNumberForm
                                  onClose={() => {
                                    setCaseNumberSelected(null);
                                    setVisibleEditCaseNumberForm(false);
                                  }}
                                  onReload={() =>
                                    setToggleReload(!toggleReload)
                                  }
                                  idDefendant={idDefendant}
                                  caseNumberSelected={caseNumberSelected}
                                />
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>
              </div>
            </>
          </ModalBody>
          {/* <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary">Save</Button>
          </ModalFooter> */}
        </>
      </ModalContent>
    </Modal>
  );
};
