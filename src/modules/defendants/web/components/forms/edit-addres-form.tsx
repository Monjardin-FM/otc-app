import { useEffect, useState } from "react";
import { useGetCity } from "../../../../catalog/hooks/use-get-city";
import { useGetAddressById } from "../../hooks/use-get-addres-by-id";
import * as Yup from "yup";
import { useUpdateAddress } from "../../hooks/use-update-address";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { Formik } from "formik";
import {
  AppFormField,
  AppFormHelperText,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { Button } from "@nextui-org/react";
import { useToggle } from "react-use";

export type AddressFormProps = {
  onClose: () => void;
  idAddress?: number | null;
  onReload: () => void;
  isVisible: boolean;
};
type EditAddressPersonFormValue = {
  idAddressType: number;
  zipCode: string;
  streetAvenue: string;
  // idCity: number;
};
export const AddressUpdateForm = ({
  onClose,
  idAddress,
  onReload,
}: // isVisible,
AddressFormProps) => {
  const { cities, getCities } = useGetCity();
  const [citiesOptions, setCitiesOptions] =
    useState<{ value: number; label: string }[]>();
  const { address, getAddressById } = useGetAddressById();
  const [idCity, setIdCity] = useState<number | null>();
  const [idStatus, setIdStatus] = useState(false);
  const [toggleReload, setToggleReload] = useToggle(false);
  const {
    updateAddress,
    error: errorUpdateAddress,
    loading: loadingUpdateAddress,
  } = useUpdateAddress();
  const validationSchemaDefendant = Yup.object().shape({
    idAddressType: Yup.number()
      .moreThan(0, "Select an Address Type")
      .required("Select an Address Type"),
    zipCode: Yup.string().required("Required zip code"),
    streetAvenue: Yup.string().required("Required Street/Avenue"),
  });
  const onSubmitHandler = async (data: EditAddressPersonFormValue) => {
    if (idAddress) {
      await updateAddress({
        idAddress: idAddress,
        idAddressType: data.idAddressType,
        idCity: Number(idCity),
        idStatus: idStatus ? 1 : 0,
        streetAvenue: data.streetAvenue,
        zipCode: data.zipCode,
      });
      if (!errorUpdateAddress) {
        AppToast().fire({
          title: "Success",
          text: "The address was updated successfully",
          icon: "success",
        });
        onReload();
        setToggleReload(!toggleReload);
        onClose();
      }
    }
  };
  useEffect(() => {
    if (errorUpdateAddress) {
      AppToast().fire({
        title: "Error",
        text: "An error occurred while saving information",
        icon: "error",
      });
    }
  }, [errorUpdateAddress]);
  useEffect(() => {
    getCities();
    if (idAddress) {
      getAddressById({ idAddress: idAddress });
    }
  }, [idAddress, toggleReload]);

  useEffect(() => {
    if (idAddress) {
      setIdStatus(address?.idStatus === 1);
      setIdCity(address?.idCity);
    }
  }, [address, idAddress]);
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
          idAddressType: address?.idAddressType ?? 0,
          zipCode: address?.zipCode ?? "",
          streetAvenue: address?.streetAvenue ?? "",
          idCity: address?.idCity ?? 0,
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
                name="idCity"
                options={citiesOptions}
                defaultValue={
                  citiesOptions &&
                  citiesOptions.find((item) => item.value === idCity)
                }
                isSearchable
                onChange={(e) => setIdCity(Number(e?.value))}
              />
              {errors.idCity && (
                <AppFormHelperText colorSchema="red">
                  {errors.idCity}
                </AppFormHelperText>
              )}
              {idCity}
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
              <Button
                onClick={() => {
                  onClose();
                  setIdCity(null);
                  setIdStatus(false);
                  onReload();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={loadingUpdateAddress}
                isDisabled={loadingUpdateAddress}
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
