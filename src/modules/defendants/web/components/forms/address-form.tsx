import { useEffect, useState } from "react";

import { Formik } from "formik";
import * as Yup from "yup";
import { useAssignAddress } from "../../hooks/use-assign-address";

import Select from "react-select";
import { useGetCity } from "../../../../catalog/hooks/use-get-city";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import {
  AppFormField,
  AppFormHelperText,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import { Switch } from "@headlessui/react";

export type AddressFormProps = {
  onClose?: () => void;
  idDefendant?: number | null;
  onReload: () => void;
};
type createAddressDefendantFormValue = {
  idAddressType: number;
  zipCode: string;
  streetAvenue: string;
};
export const AddressForm = ({
  onClose,
  idDefendant,
  onReload,
}: AddressFormProps) => {
  const { cities, getCities } = useGetCity();
  const [citiesOptions, setCitiesOptions] =
    useState<{ value: number; label: string }[]>();
  const {
    assignAddress,
    loading: loadingAddress,
    error: errorAddress,
  } = useAssignAddress();
  const [idCity, setIdCity] = useState<number>();
  const [idStatus, setIdStatus] = useState(true);

  const validationSchemaDefendant = Yup.object().shape({
    idAddressType: Yup.number()
      .moreThan(0, "Select an Address Type")
      .required("Select an Address Type"),
    zipCode: Yup.string().required("Required zip code"),
    streetAvenue: Yup.string().required("Required Street/Avenue"),
  });
  const onSubmitHandler = async (data: createAddressDefendantFormValue) => {
    await assignAddress({
      idPerson: Number(idDefendant),
      idAddressType: Number(data.idAddressType),
      idCity: Number(idCity),
      idStatus: idStatus ? 1 : 0,
      streetAvenue: data.streetAvenue,
      zipCode: data.zipCode,
    });
    if (!errorAddress) {
      AppToast().fire({
        title: "Success",
        text: "The address was created successfully",
        icon: "success",
      });
    }
    onReload();
  };
  useEffect(() => {
    if (errorAddress) {
      AppToast().fire({
        title: "Error",
        text: "An error occurred while saving information",
        icon: "error",
      });
    }
    if (loadingAddress) {
      AppToast().fire({
        title: "Saving Address",
        text: "The address is being saved. Please wait",
        icon: "info",
      });
    }
  }, [errorAddress, loadingAddress]);
  useEffect(() => {
    getCities();
  }, []);
  useEffect(() => {
    if (cities) {
      setCitiesOptions(
        cities.map((city) => ({
          value: city.idCity,
          label: city.city,
        }))
      );
    }
  }, [cities]);
  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 border border-gray-300 rounded-lg p-6 bg-gray-200">
      <Formik
        initialValues={{
          idAddressType: 0,
          zipCode: "",
          streetAvenue: "",
        }}
        enableReinitialize
        validationSchema={validationSchemaDefendant}
        onSubmit={onSubmitHandler}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="col-span-12 grid grid-cols-12 gap-4"
          >
            <AppFormField className="col-span-3">
              <AppFormLabel>Type Address</AppFormLabel>
              <AppSelect
                name="idAddressType"
                value={values.idAddressType}
                onChange={handleChange}
              >
                <option value={0} key={0}>
                  Select Type Address
                </option>
                <option value={1} key={1}>
                  Home
                </option>
                <option value={2} key={2}>
                  Work
                </option>
              </AppSelect>
              {errors.idAddressType && (
                <AppFormHelperText colorSchema="red">
                  {errors.idAddressType}
                </AppFormHelperText>
              )}
            </AppFormField>
            <AppFormField className="col-span-3 ">
              <AppFormLabel>Street/Avenue</AppFormLabel>
              <AppTextField
                name="streetAvenue"
                value={values.streetAvenue}
                onChange={handleChange}
              />
              {errors.streetAvenue && (
                <AppFormHelperText colorSchema="red">
                  {errors.streetAvenue}
                </AppFormHelperText>
              )}
            </AppFormField>
            <AppFormField className="col-span-3">
              <AppFormLabel>Zip Code</AppFormLabel>
              <AppTextField
                name="zipCode"
                value={values.zipCode}
                onChange={handleChange}
              />
            </AppFormField>
            <AppFormField className="col-span-3">
              <AppFormLabel>City</AppFormLabel>
              <Select
                options={citiesOptions}
                isSearchable
                onChange={(e) => setIdCity(e?.value)}
              />
            </AppFormField>
            <AppFormField className="col-span-3">
              <AppFormLabel>Status</AppFormLabel>
              <div className="flex flex-row items-center justify-start gap-3">
                <span>Inactive</span>

                <Switch
                  checked={idStatus}
                  onChange={setIdStatus}
                  className={`${
                    idStatus ? "bg-primaryColor-600" : "bg-primaryColor-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    className={`${
                      idStatus ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
                <span>Active</span>
              </div>
            </AppFormField>
            <div className="col-span-12 flex flex-row items-center justify-end gap-4">
              <AppButton onClick={onClose}>Cancel</AppButton>
              <AppButton
                colorScheme="primary"
                type="submit"
                isLoading={loadingAddress}
                isDisabled={loadingAddress}
              >
                Save
              </AppButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
