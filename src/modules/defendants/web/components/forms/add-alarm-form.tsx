import { useEffect, useState } from "react";
import { useToggle } from "react-use";
import {
  AppFormField,
  AppFormHelperText,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import AppDatePicker from "../../../../../presentation/Components/AppDatePicker";
import { AppGeofence } from "../maps/app-geofence";
import { Switch } from "@headlessui/react";
import { useGetSpecificAlarm } from "../../../../catalog/hooks/use-get-specific-alarm";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button, Card, Select, Selection, SelectItem } from "@nextui-org/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useAssignAlarmDefendant } from "../../hooks/use-assign-alarm-defendant";
import * as Yup from "yup";
import { Formik } from "formik";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { AlarmException } from "../../../domain/entities/alarm-defendant-params";
import { GeoJSONO } from "../../../domain/entities/geoJSON";
import { AppAlarmExceptionTable } from "../tables/app-exceptions-table";

export type AddAlarmFormProps = {
  idDefendant?: number | null;
  onReload: () => void;
  onClose: () => void;
};
type AssignAlarmDefendantFormValues = {
  name: string;
  idSpecificAlarmType: number;
};
dayjs.extend(utc);
export const AddAlarmForm = ({
  idDefendant,
  onReload,
  onClose,
}: AddAlarmFormProps) => {
  const { specificAlarm, getSpecificAlarm } = useGetSpecificAlarm();
  const {
    assignAlarmDefendant,
    error: errorAssignAlarm,
    loading: loadingAssignAlarm,
  } = useAssignAlarmDefendant();
  const [parent] = useAutoAnimate();
  const [exceptionItems, setExceptionItems] = useState<AlarmException[]>([]);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [visibleExceptionForm, setVisibleExceptionForm] = useToggle(false);
  // const [fechasException, setFechasException] = useState();
  const [alarmType, setAlarmType] = useState<number>(1);
  const [dateInit, setDateInit] = useState<Date>(new Date());
  const [dateFinish, setDateFinish] = useState<Date>(new Date());
  const [days, setDays] = useState<Selection>(new Set([]));
  const [nameException, setNameException] = useState("");
  useEffect(() => {
    console.log(exceptionItems);
    console.log(days);
  }, [exceptionItems, days]);
  // console.log(setDateUTC);
  const [status, setStatus] = useState(true);
  const [geoJSON, setGeoJSON] = useState<GeoJSONO | null>();
  // const [cantidad, setCantidad] = useState<number>(0);
  // console.log(setCantidad);
  const daysOptions = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Mednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  const validationSchemaDefendantAlarm = Yup.object().shape({
    idSpecificAlarmType: Yup.number()
      .moreThan(0, "Select an alarm type")
      .required("Select an alarm type"),
    name: Yup.string().required("Required name alarm"),
  });
  const handleAddException = () => {
    {
      alarmType === 1 ? (
        <div>{dayjs(dateInit).utc(true).format().toString()}</div>
      ) : (
        <div>{dayjs(dateInit).format("HH:mm").toString()}</div>
      );
    }
    if (alarmType === 1) {
      setExceptionItems((prev) => [
        ...prev,
        {
          description: nameException,
          alarmExceptionType: alarmType,
          dateInit: dayjs(dateInit).utc(true).format().toString(),
          dateFinish: dayjs(dateFinish).utc(true).format().toString(),
        },
      ]);
    } else if (alarmType === 2) {
      const daysObject: any = Array.from(days).map((item) => ({
        name: item.toString(),
      }));
      setExceptionItems((prev) => [
        ...prev,
        {
          alarmExceptionType: alarmType,
          days: daysObject,
          hourInit: dayjs(dateInit).format("HH:mm").toString(),
          hourEnd: dayjs(dateFinish).format("HH:mm").toString(),
          description: nameException,
        },
      ]);
    }
  };
  const onSubmitHandler = async (data: AssignAlarmDefendantFormValues) => {
    // if (geoJSON && idDefendant) {
    if (exceptionItems.length > 0) {
      await assignAlarmDefendant({
        name: data.name,
        idPerson: Number(idDefendant),
        idspecificAlarmType: Number(data.idSpecificAlarmType),
        idStatus: status ? 1 : 0,
        idPersonSpecificAlarm: 0,
        lGeofence: [{ geofence: JSON.stringify(geoJSON) }],
        alarmException: exceptionItems,
      });
    } else if (exceptionItems.length === 0) {
      await assignAlarmDefendant({
        name: data.name,
        idPerson: Number(idDefendant),
        idspecificAlarmType: Number(data.idSpecificAlarmType),
        idStatus: status ? 1 : 0,
        idPersonSpecificAlarm: 0,
        lGeofence: [{ geofence: JSON.stringify(geoJSON) }],
        // alarmException: dateUTC,
      });
    }
    // }
    if (!errorAssignAlarm) {
      AppToast().fire({
        title: "Success",
        text: "The alarm was created successfully",
        icon: "success",
      });
      onReload();
      onClose();
    }
  };
  useEffect(() => {
    if (errorAssignAlarm) {
      AppToast().fire({
        title: "Error",
        text: "There was an error while saving information. Try again",
        icon: "error",
      });
    }
  }, [errorAssignAlarm]);
  useEffect(() => {
    getSpecificAlarm();
  }, []);

  useEffect(() => {
    setGeoJSON({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [points],
          },
        },
      ],
    });
  }, [points]);
  return (
    <div
      ref={parent}
      className="col-span-12 grid grid-cols-12 gap-x-3 gap-y-4 bg-gray-200 rounded-lg p-5"
    >
      <Formik
        initialValues={{
          idSpecificAlarmType: 0,
          name: "",
        }}
        enableReinitialize
        validationSchema={validationSchemaDefendantAlarm}
        onSubmit={onSubmitHandler}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="col-span-12 grid grid-cols-12 gap-4"
          >
            {/* Device selection */}
            <div className="col-span-12 grid grid-cols-12 gap-4">
              <AppFormField className="col-span-4">
                <AppFormLabel>Alarm Type</AppFormLabel>
                <AppSelect
                  name="idSpecificAlarmType"
                  value={values.idSpecificAlarmType}
                  onChange={handleChange}
                >
                  <option>Select Alarm Type</option>
                  {specificAlarm?.map((sAlarm) => (
                    <option
                      key={sAlarm.idSpecificAlarmType}
                      value={sAlarm.idSpecificAlarmType}
                    >
                      {sAlarm.specificAlarmType}
                    </option>
                  ))}
                </AppSelect>
                {errors.idSpecificAlarmType && (
                  <AppFormHelperText colorSchema="red">
                    {errors.idSpecificAlarmType}
                  </AppFormHelperText>
                )}
              </AppFormField>
            </div>
            {/* Geofence */}
            <div
              ref={parent}
              className="col-span-12 grid grid-cols-12 gap-10 rounded-lg p-5 border border-gray-600 border-opacity-20 bg-primaryColor-100"
            >
              <span className="col-span-12 text-center text-primaryColor-700 font-semibold">
                Geofence Information
              </span>
              <AppFormField className="col-span-6">
                <AppFormLabel>Name</AppFormLabel>
                <AppTextField name="name" onChange={handleChange} />
              </AppFormField>
              <AppFormField className="col-span-6">
                <AppFormLabel>Status</AppFormLabel>
                <div className="flex flex-row items-center justify-start gap-3">
                  <span>Inactive</span>
                  <Switch
                    checked={status}
                    onChange={setStatus}
                    className={`${
                      status ? "bg-primaryColor-600" : "bg-primaryColor-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        status ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                  <span>Active</span>
                </div>
              </AppFormField>
              <div className="rounded-lg bg-gray-200 col-span-12">
                <AppGeofence
                  handleVisibleException={(param: boolean) =>
                    setVisibleExceptionForm(param)
                  }
                  setPoints={(params) => {
                    setPoints(params);
                  }}
                />
              </div>
              {visibleExceptionForm && (
                <div className="col-span-12 grid grid-cols-12 border bg-white p-5 gap-5 rounded-lg">
                  <span className="col-span-12 text-center font-bold text-primary-700 ">
                    Exceptions
                  </span>

                  <div
                    ref={parent}
                    className="col-span-12  grid grid-cols-12  gap-5"
                  >
                    <Card
                      className="col-span-6 w-full flex flex-col  text-center gap-5 items-center justify-center h-auto p-5 "
                      isBlurred
                    >
                      <div className="flex flex-row items-center justify-center gap-16">
                        <AppFormField className="w-1/2 flex flex-row gap-2">
                          <AppFormLabel>Name Exception</AppFormLabel>
                          <AppTextField
                            className="w-72"
                            value={nameException}
                            onChange={(e) => {
                              setNameException(e.target.value);
                            }}
                          />
                        </AppFormField>
                        <AppFormField className="w-1/2 flex flex-row gap-3 items-center ">
                          <AppFormLabel className="w-full">
                            Type exception
                          </AppFormLabel>
                          <AppSelect
                            value={alarmType}
                            onChange={(e) =>
                              setAlarmType(Number(e.target.value))
                            }
                          >
                            <option value={1} key={1}>
                              Date
                            </option>
                            <option value={2} key={2}>
                              Days
                            </option>
                          </AppSelect>
                        </AppFormField>
                      </div>
                      <div className="flex flex-row items-start justify-center gap-10 w-full mt-10">
                        <div className="flex flex-col items-center">
                          <AppFormLabel>Start Date / Hour</AppFormLabel>
                          <AppDatePicker
                            selected={dateInit}
                            onChange={(date: Date) => {
                              if (date instanceof Date) {
                                setDateInit(date);
                              }
                            }}
                            showTimeInput={alarmType === 1}
                            showTimeSelect={alarmType === 2}
                            showTimeSelectOnly={alarmType === 2}
                            dateFormat={
                              alarmType === 1
                                ? "MMMM d, yyyy h:mm aa"
                                : "h:mm aa"
                            }
                            timeCaption="Time"
                            inline
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <AppFormLabel>End Date / Hour</AppFormLabel>
                          <AppDatePicker
                            selected={dateFinish}
                            onChange={(date: Date) => {
                              if (date instanceof Date) {
                                setDateFinish(date);
                              }
                            }}
                            showTimeInput={alarmType === 1}
                            showTimeSelect={alarmType === 2}
                            showTimeSelectOnly={alarmType === 2}
                            dateFormat={
                              alarmType === 1
                                ? "MMMM d, yyyy h:mm aa"
                                : "h:mm aa"
                            }
                            // timeCaption="Time"
                            inline
                            className="w-full"
                          />
                        </div>
                        {alarmType === 2 ? (
                          <div className="w-1/3 flex flex-col items-start justify-start ">
                            {/* <AppFormLabel>Days</AppFormLabel> */}
                            <Select
                              label="Days Exception"
                              selectedKeys={days}
                              onSelectionChange={setDays}
                              placeholder="Select days"
                              selectionMode="multiple"
                              color="primary"
                              variant="faded"
                              labelPlacement="outside"
                              disableAnimation
                            >
                              {daysOptions.map((day) => (
                                <SelectItem key={day.value} value={day.label}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="w-full">
                        <Button color="warning" onPress={handleAddException}>
                          Add Exception
                        </Button>
                      </div>
                    </Card>
                    <div className="col-span-6">
                      <AppAlarmExceptionTable
                        items={exceptionItems}
                        onDelete={(record) => {
                          setExceptionItems((l) =>
                            l.filter(
                              (item) =>
                                item.description !== record.record.description
                            )
                          );
                        }}
                        // onEdit={() => {}}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-12 flex flex-row items-center justify-end gap-4">
              <AppButton onClick={onClose}>Cancel</AppButton>
              <AppButton
                colorScheme="primary"
                type="submit"
                isLoading={loadingAssignAlarm}
                isDisabled={loadingAssignAlarm}
              >
                Save Alarm
              </AppButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
