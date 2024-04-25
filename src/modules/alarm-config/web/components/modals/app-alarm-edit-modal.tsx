import { useEffect, useState } from "react";

import { Multiselect } from "multiselect-react-dropdown";
import { Formik } from "formik";

import { useGetAlarmById } from "../../hooks/use-get-alarm-by-id";
import { useUpdateAlarm } from "../../hooks/use-update-alarm";
import { useGetResponsiveDevices } from "../../../../catalog/hooks/use-get-responsive-devices";
import { useGetDeviceType } from "../../../../catalog/hooks/use-get-device-type";
import { ResponseDevice } from "../../../../catalog/domain/entities/response-device";
import { DeviceType } from "../../../../catalog/domain/entities/device-type";
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
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { AppToggleButton } from "../../../../../presentation/Components/AppToggleButton";
import { AppButton } from "../../../../../presentation/Components/AppButton";

export type AppEditAlarmModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onReload: () => void;
  idAlarm?: number | null;
};
type AlarmEditFormValues = {
  name: string;
  interval: number;
  geocordinateTimeout: number;
  restrainingDistance: number;
  cancellationTime: number;
  textSMS: string;
  textMail: string;
  callResponse: string;
};
export const AppEditAlarmModal = ({
  isVisible,
  onClose,
  onReload,
  idAlarm,
}: AppEditAlarmModalProps) => {
  const { updateAlarm } = useUpdateAlarm();
  const { responsiveDevices, getResponsiveDevices } = useGetResponsiveDevices();
  const { deviceType, getDeviceType } = useGetDeviceType();
  const { alarm, getAlarmById } = useGetAlarmById();
  const [selectedResponseDevicesValues, setSelectedResponseDevices] = useState<
    Omit<ResponseDevice, "responseDevice">[]
  >([]);
  const [selectedResponseDefault, setSelectedResponseDefault] =
    useState<ResponseDevice[]>();
  const [selectedDeviceTypeValues, setSelectedDeviceType] = useState<
    Omit<DeviceType, "deviceType">[]
  >([]);
  // Uncomment when the response have the list devices
  // const [selectedDeviceDefault, setSelectedDeviceDefault] =
  //   useState<DeviceType>();
  const [status, setStatus] = useState(false);

  const onSubmitHandler = async (data: AlarmEditFormValues) => {
    await updateAlarm({
      idAlarmType: alarm?.idAlarmType ? alarm.idAlarmType : 0,
      automatic: status,
      callText: data.callResponse,
      enableResponseCall: data.callResponse.length > 0,
      description: data.name,
      dynamicDistance: Number(data.restrainingDistance),
      geocordinateTimeout: Number(data.geocordinateTimeout),
      responseInterval: Number(data.interval),
      resolveTime: Number(data.cancellationTime),
      idStatus: 1,
      lAssignedDevice: selectedDeviceTypeValues,
      lResponseDevice: selectedResponseDevicesValues,
      mailText: data.textMail,
      smsText: data.textSMS,
    });
    onReload();
    onClose();
  };
  const onSelectResponseDevices = (selectedList: []) => {
    setSelectedResponseDevices(selectedList);
  };
  const onSelectDeviceType = (selectedList: []) => {
    setSelectedDeviceType(selectedList);
  };

  useEffect(() => {
    if (idAlarm) getAlarmById({ idAlarmType: idAlarm });
    getResponsiveDevices();
    getDeviceType();
  }, [idAlarm]);
  useEffect(() => {
    if (alarm) {
      setSelectedResponseDefault(alarm.lResponseDevice);
      // setSelectedDeviceDefault(alarm.);
      setStatus(alarm?.automatic);
    }
  }, [idAlarm, alarm]);
  return (
    <AppModal isVisible={isVisible} onClose={onClose} size="7xl">
      <AppModalOverlay>
        <AppModalContent>
          <Formik
            enableReinitialize
            initialValues={{
              name: alarm?.description ? alarm.description : "",
              automatic: status,
              interval: alarm?.responseInterval ? alarm.responseInterval : 0,
              geocordinateTimeout: alarm?.geocordinateTimeout
                ? alarm.geocordinateTimeout
                : 0,
              restrainingDistance: alarm?.dynamicDistance
                ? alarm.dynamicDistance
                : 0,
              cancellationTime: alarm?.resolveTime ? alarm.resolveTime : 0,
              textSMS: alarm?.smsText ? alarm.smsText : "",
              textMail: alarm?.mailText ? alarm.mailText : "",
              callResponse: alarm?.callText ? alarm.callText : "",
            }}
            onSubmit={onSubmitHandler}
          >
            {({ handleSubmit, handleChange, values }) => (
              <form onSubmit={handleSubmit}>
                <AppModalHeader>Edit Alarm</AppModalHeader>
                <AppModalBody>
                  <div className="grid grid-cols-12 gap-y-4 gap-x-3">
                    <div className="grid grid-cols-12 col-span-6 gap-x-3 gap-y-4">
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Name</AppFormLabel>
                        <AppTextField
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                        />
                      </AppFormField>

                      <AppFormField className="col-span-6">
                        <AppFormLabel>Automatic</AppFormLabel>
                        <div className="flex flex-row items-center justify-start gap-5">
                          <span>Inactive</span>
                          {status ? (
                            <AppToggleButton
                              name="automatic"
                              // value={status}
                              onChange={() => setStatus(!status)}
                              checked={status}
                            ></AppToggleButton>
                          ) : (
                            <AppToggleButton
                              name="automatic"
                              // value={values.status}
                              onChange={() => setStatus(!status)}
                              checked={status}
                            ></AppToggleButton>
                          )}

                          <span>Active</span>
                        </div>
                      </AppFormField>
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Response Devices</AppFormLabel>
                        <Multiselect
                          selectedValues={selectedResponseDefault}
                          displayValue="responseDevice"
                          showCheckbox={true}
                          options={responsiveDevices}
                          onSelect={onSelectResponseDevices}
                          avoidHighlightFirstOption
                        />
                      </AppFormField>
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Assigned Devices</AppFormLabel>
                        <Multiselect
                          // selectedValues={selectedDeviceDefault}
                          displayValue="deviceType"
                          showCheckbox={true}
                          options={deviceType}
                          onSelect={onSelectDeviceType}
                          avoidHighlightFirstOption
                        />
                      </AppFormField>
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Interval</AppFormLabel>
                        <AppTextField
                          name="interval"
                          value={values.interval}
                          onChange={handleChange}
                        />
                      </AppFormField>
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Geocordinate Timeout</AppFormLabel>
                        <AppTextField
                          name="geocordinateTimeout"
                          value={values.geocordinateTimeout}
                          onChange={handleChange}
                        />
                      </AppFormField>
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Restraining Distance</AppFormLabel>
                        <AppTextField
                          name="restrainingDistance"
                          value={values.restrainingDistance}
                          onChange={handleChange}
                        />
                      </AppFormField>
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Automatic Cancellation Time</AppFormLabel>
                        <AppTextField
                          name="cancellationTime"
                          value={values.cancellationTime}
                          onChange={handleChange}
                        />
                      </AppFormField>
                    </div>
                    <div className="grid grid-cols-12 col-span-6 gap-x-3 gap-y-5">
                      <AppFormField className="col-span-6 ">
                        <AppFormLabel>Text SMS</AppFormLabel>
                        <textarea
                          name="textSMS"
                          value={values.textSMS}
                          onChange={handleChange}
                          className="w-full h-40 border border-gray-300 rounded-lg p-5"
                        ></textarea>
                      </AppFormField>
                      <AppFormField className="col-span-6">
                        <AppFormLabel>Text Mail</AppFormLabel>
                        <textarea
                          name="textMail"
                          value={values.textMail}
                          onChange={handleChange}
                          className="w-full h-40 border border-gray-300 rounded-lg p-5"
                        ></textarea>
                      </AppFormField>
                      <AppFormField className="col-span-6 ">
                        <AppFormLabel>Call</AppFormLabel>
                        <textarea
                          name="callResponse"
                          value={values.callResponse}
                          onChange={handleChange}
                          className="w-full h-40 border border-gray-300 rounded-lg p-5"
                        ></textarea>
                      </AppFormField>
                    </div>
                  </div>
                </AppModalBody>
                <AppModalFooter>
                  <AppButton onClick={onClose}>Cancel</AppButton>
                  <AppButton colorScheme="primary" type="submit">
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
