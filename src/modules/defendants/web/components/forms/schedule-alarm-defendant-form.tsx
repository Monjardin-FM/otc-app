import {
  AppFormField,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import AppSelect from "../../../../../presentation/Components/AppSelect";
import AppDatePicker from "../../../../../presentation/Components/AppDatePicker";
import { AppAlarmExceptionTable } from "../tables/app-exceptions-table";
import { AlarmException } from "../../../domain/entities/alarm-defendant-params";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, Card, Select, Selection, SelectItem } from "@nextui-org/react";
import { useCreatetScheduleAlarmDefendant } from "../../hooks/use-create-schedule-alarm-defendant";
import { AutomaticAlarmsDefendant } from "../../../domain/entities/automatic-alarm-defendant";
import { AppToast } from "../../../../../presentation/Components/AppToast";

type ScheduleAlarDefendantFormProps = {
  idDefendant?: number | null;
  idAlarmType?: number;
  onClose: () => void;
  item?: AutomaticAlarmsDefendant;
};

export const ScheduleAlarDefendantForm = ({
  idAlarmType,
  idDefendant,
  onClose,
  item,
}: ScheduleAlarDefendantFormProps) => {
  const [exceptionItems, setExceptionItems] = useState<AlarmException[]>([]);
  const [alarmType, setAlarmType] = useState<number>(1);
  const [dateInit, setDateInit] = useState<Date>(new Date());
  const [dateFinish, setDateFinish] = useState<Date>(new Date());
  const [days, setDays] = useState<Selection>(new Set([]));
  const [nameException, setNameException] = useState("");
  const [nameSchedule, setNameSchedule] = useState("");

  const { createScheduleAlarmDefendant, error, loading } =
    useCreatetScheduleAlarmDefendant();

  const daysOptions = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  const handleCreateSchedule = async () => {
    if (idDefendant && idAlarmType)
      await createScheduleAlarmDefendant({
        alarmException: exceptionItems,
        description: nameSchedule,
        idAlarmType: idAlarmType,
        idDefendant: idDefendant,
      });
    if (!error) {
      AppToast().fire({
        title: "Success",
        icon: "success",
        text: "The information was saved successfully",
      });
      onClose();
    }
  };
  useEffect(() => {
    if (error) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while saving the information. Try again",
      });
    }
    if (loading) {
      AppToast().fire({
        title: "Saving Information",
        icon: "info",
        text: "The schedule is being saved. Please wait",
      });
    }
  }, [error, loading]);
  const handleAddException = () => {
    {
      alarmType === 1 ? (
        <div>{dayjs.utc(dateInit).format().toString()}</div>
      ) : (
        <div>{dayjs.utc(dateInit).format("HH:mm").toString()}</div>
      );
    }
    if (alarmType === 1) {
      setExceptionItems((prev) => [
        ...prev,
        {
          description: nameException,
          alarmExceptionType: alarmType,
          dateInit: dayjs.utc(dateInit).format().toString(),
          dateFinish: dayjs.utc(dateFinish).format().toString(),
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
          hourInit: dayjs.utc(dateInit).format("HH:mm").toString(),
          hourEnd: dayjs.utc(dateFinish).format("HH:mm").toString(),
          description: nameException,
        },
      ]);
    }
  };
  return (
    <div className="col-span-12 grid grid-cols-12 border bg-white gap-5 rounded-lg mt-5 p-5">
      <span className="col-span-12 text-center font-bold text-primary-700 ">
        {`Add Schedule ${item?.description}`}
      </span>
      <div className="col-span-12 bg-info-50 grid grid-cols-12 p-3 rounded-lg justify-center">
        <AppFormField className="col-span-4 flex flex-row gap-2 items-center justify-center">
          <AppFormLabel>Name</AppFormLabel>
          <AppTextField
            className="w-72"
            value={nameSchedule}
            onChange={(e) => {
              setNameSchedule(e.target.value);
            }}
          />
        </AppFormField>
      </div>
      <div className="col-span-12  grid grid-cols-12  gap-5">
        <Card
          className="col-span-6 w-full flex flex-col  text-center gap-5 items-center justify-center h-auto p-5 "
          isBlurred
        >
          <div className="flex flex-row items-center justify-center gap-16">
            <AppFormField className="w-1/2 flex flex-row gap-2">
              <AppFormLabel>Schedule Name</AppFormLabel>
              <AppTextField
                className="w-72"
                value={nameException}
                onChange={(e) => {
                  setNameException(e.target.value);
                }}
              />
            </AppFormField>
            <AppFormField className="w-1/2 flex flex-row gap-3 items-center ">
              <AppFormLabel className="w-full">Schedule type</AppFormLabel>
              <AppSelect
                value={alarmType}
                onChange={(e) => setAlarmType(Number(e.target.value))}
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
                  alarmType === 1 ? "MMMM d, yyyy h:mm aa" : "h:mm aa"
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
                  alarmType === 1 ? "MMMM d, yyyy h:mm aa" : "h:mm aa"
                }
                inline
                className="w-full"
              />
            </div>
            {alarmType === 2 ? (
              <div className="w-1/3 flex flex-col items-start justify-start ">
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
              Add Schedule
            </Button>
          </div>
        </Card>
        <div className="col-span-6">
          <AppAlarmExceptionTable
            items={exceptionItems}
            onDelete={(record) => {
              setExceptionItems((l) =>
                l.filter(
                  (item) => item.description !== record.record.description
                )
              );
            }}
          />
        </div>
      </div>
      <div className="col-span-12 flex flex-row items-end justify-end gap-2">
        <Button onPress={onClose}>Cancel</Button>
        <Button
          color="primary"
          onPress={handleCreateSchedule}
          isDisabled={loading}
          isLoading={loading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
