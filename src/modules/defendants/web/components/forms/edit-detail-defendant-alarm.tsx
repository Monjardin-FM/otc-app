import { useEffect, useState } from "react";
import {
  AppFormField,
  AppFormLabel,
} from "../../../../../presentation/Components/AppForm";
import AppTextField from "../../../../../presentation/Components/AppTextField";
import { AlarmDefendantDetail } from "../../../domain/entities/alarm-defendant-detail";
import { AutomaticAlarmsDefendant } from "../../../domain/entities/automatic-alarm-defendant";
import { Button } from "@nextui-org/react";
import { useUpdateAlarmDetailDefendant } from "../../hooks/use-update-alarm-detail-defendant";
import { AppToast } from "../../../../../presentation/Components/AppToast";
export type EditDetailDefendantAlarmFormProps = {
  defendantAlarmDetail?: AlarmDefendantDetail;
  idPerson?: number | null;
  selectedAlarm?: AutomaticAlarmsDefendant;
  onClose: () => void;
  onReload: () => void;
};
export const EditDetailDefendantAlarmForm = ({
  defendantAlarmDetail,
  idPerson,
  selectedAlarm,
  onClose,
  onReload,
}: EditDetailDefendantAlarmFormProps) => {
  const [interval, setIntervalAlarm] = useState<number>();
  const [timeout, setTimeoutAlarm] = useState<number>();
  const [distance, setDistanceAlarm] = useState<number>();
  const { updateAlarmDetail, loading, error } = useUpdateAlarmDetailDefendant();
  const handleSubmit = async () => {
    if (selectedAlarm) {
      await updateAlarmDetail({
        idAlarmType: selectedAlarm?.idAlarmType,
        idPerson: Number(idPerson),
        responseInterval: Number(interval),
        geocordinateTimeout: Number(timeout),
        dynamicDistance: Number(distance),
        enableResponseCall: false,
        resolveTime: 1,
        callText: "",
        smsText: "",
        mailText: "",
      });
    }
    if (!error) {
      AppToast().fire({
        title: "Information Updated",
        icon: "success",
        text: "The information was saved successfully",
      });
      onReload();
      onClose();
    }
  };
  useEffect(() => {
    if (error) {
      AppToast().fire({
        title: "Error",
        text: "An error occurred while trying to update the information",
        icon: "error",
      });
    }
    if (loading) {
      AppToast().fire({
        title: "Saving",
        icon: "info",
        text: "The information alarm is being saved. Please wait",
      });
    }
  }, [error, loading]);
  useEffect(() => {
    if (defendantAlarmDetail) {
      setIntervalAlarm(defendantAlarmDetail.responseInterval);
      setTimeoutAlarm(defendantAlarmDetail.geocordinateTimeout);
      setDistanceAlarm(defendantAlarmDetail.dynamicDistance);
    }
    return () => {
      setIntervalAlarm(0);
      setTimeoutAlarm(0);
      setDistanceAlarm(0);
    };
  }, [selectedAlarm, defendantAlarmDetail]);
  return (
    <div className="w-full grid grid-cols-12 gap-3">
      <AppFormField className="col-span-6 ">
        <AppFormLabel>Interval</AppFormLabel>
        <AppTextField
          type="number"
          value={interval}
          onChange={(e) => setIntervalAlarm(Number(e.target.value))}
        />
      </AppFormField>
      <AppFormField className="col-span-6 ">
        <AppFormLabel>Geocoordinate Timeout</AppFormLabel>
        <AppTextField
          type="number"
          value={timeout}
          onChange={(e) => setTimeoutAlarm(Number(e.target.value))}
        />
      </AppFormField>
      <AppFormField className="col-span-6 ">
        <AppFormLabel>Restraining Distance</AppFormLabel>
        <AppTextField
          type="number"
          value={distance}
          onChange={(e) => setDistanceAlarm(Number(e.target.value))}
        />
      </AppFormField>
      <div className="col-span-12 flex flex-row items-center justify-end gap-4">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          isDisabled={loading}
          isLoading={loading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
