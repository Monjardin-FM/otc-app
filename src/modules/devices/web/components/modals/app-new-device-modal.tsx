import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useSaveDevice } from "../../hooks/use-create-device";
import * as Yup from "yup";
import { useGetDeviceType } from "../../../../catalog/hooks/use-get-device-type";
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
import AppSelect from "../../../../../presentation/Components/AppSelect";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { AppToggleButton } from "../../../../../presentation/Components/AppToggleButton";
import { AppButton } from "../../../../../presentation/Components/AppButton";
export type AppNewDeviceModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onReload: () => void;
};
type DeviceCreateFormValues = {
  idDeviceType: number;
  description: string;
  status: string;
};
export const AppNewDeviceModal = ({
  isVisible,
  onClose,
  onReload,
}: AppNewDeviceModalProps) => {
  const { createDevice, error: errorSave, loading } = useSaveDevice();
  const { deviceType, getDeviceType } = useGetDeviceType();
  const [status, setStatus] = useState(false);
  const validationSchemaSaveDevice = Yup.object().shape({
    description: Yup.string().required("Required Phone Number/EMAI"),
    idDeviceType: Yup.number()
      .moreThan(0, "Select device type")
      .required("Select device type"),
  });
  const onSubmitHandler = async (data: DeviceCreateFormValues) => {
    await createDevice({
      idDeviceType: Number(data.idDeviceType),
      idStatus: status ? 1 : 0,
      description: data.description,
      status: status ? "Active" : "Inactive",
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
    getDeviceType();
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
              description: "",
              idDeviceType: 0,
              idStatus: 0,
              status: "",
            }}
            onSubmit={onSubmitHandler}
            validationSchema={validationSchemaSaveDevice}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <form onSubmit={handleSubmit}>
                <AppModalHeader>New Device</AppModalHeader>
                <AppModalBody>
                  <div className="grid grid-cols-12 gap-y-4 gap-x-3">
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Device Type</AppFormLabel>
                      <AppSelect
                        name="idDeviceType"
                        value={values.idDeviceType}
                        onChange={handleChange}
                      >
                        <option>Select device</option>
                        {deviceType?.map((device) => (
                          <option
                            key={device.idDeviceType}
                            value={device.idDeviceType}
                          >
                            {device.deviceType}
                          </option>
                        ))}
                      </AppSelect>
                      {errors.idDeviceType && (
                        <AppFormHelperText colorSchema="red">
                          {errors.idDeviceType}
                        </AppFormHelperText>
                      )}
                    </AppFormField>
                    <AppFormField className="col-span-6">
                      <AppFormLabel>Phone Number / IMEI</AppFormLabel>
                      <AppTextField
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <AppFormHelperText colorSchema="red">
                          {errors.description}
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
