import { AppGeofenceView } from "../maps/app-geofence-view";
import { AppAlarmExceptionSchedulesTable } from "../tables/app-alarm-exception";
import { EditAlarmForm } from "./edit-alarm-form";
type Shedules = {
  alarmExceptionType: number;
  dateInit: string;
  dateFinish: string;
  strDays: string;
};
export type EditGeofenceFormProps = {
  geofence?: any;
  items?: Shedules[];
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
  return (
    <div className="col-span-12 grid grid-cols-12 p-2 gap-5">
      <div className="col-span-6 gap-5 flex flex-col">
        <AppGeofenceView geofence={geofence} />
        <span className="font-semibold text-primaryColor-700">Schedules</span>
        <AppAlarmExceptionSchedulesTable items={items} />
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
