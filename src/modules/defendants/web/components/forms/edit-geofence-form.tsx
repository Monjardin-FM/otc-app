import { useEffect, useState } from "react";
import {
  AlarmExceptionSchedule,
  Intervals,
  StrDays,
} from "../../../domain/entities/alarm-defendant";
import { AppGeofenceView } from "../maps/app-geofence-view";
import { AppAlarmExceptionSchedulesTable } from "../tables/app-alarm-exception";
import { EditAlarmForm } from "./edit-alarm-form";
export type EditGeofenceFormProps = {
  geofence?: any;
  items?: AlarmExceptionSchedule[];
  idDefendant?: number | null;
  onReload: () => void;
  onClose: () => void;
};

export const EditGeofenceForm = ({
  geofence,
  items,
  idDefendant,
  onReload,
  onClose,
}: EditGeofenceFormProps) => {
  const [intervals, setIntervals] = useState<Intervals[]>();

  useEffect(() => {
    if (items) {
      const itemsFilter: AlarmExceptionSchedule[] = items?.filter(
        (item) => item.strDays !== "null"
      );
      const itemsSchedule: StrDays =
        itemsFilter && JSON.parse(itemsFilter[0]?.strDays);
      const itemsInterval = itemsSchedule && itemsSchedule.intervals;
      setIntervals(itemsInterval);
    }
  }, [items]);
  return (
    <div className="col-span-12 grid grid-cols-12 p-2 gap-5">
      <div className="col-span-6">
        <AppGeofenceView geofence={geofence} />
        <span className="font-semibold text-primaryColor-700">Schedules</span>
        <AppAlarmExceptionSchedulesTable items={intervals} />
      </div>
      <div className="col-span-6">
        <EditAlarmForm
          idDefendant={idDefendant}
          onReload={() => {
            onReload();
          }}
          onClose={() => {
            onClose();
          }}
        />
      </div>
    </div>
  );
};
