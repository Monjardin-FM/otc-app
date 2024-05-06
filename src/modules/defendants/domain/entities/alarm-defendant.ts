export type AlarmDefendant = {
  idPerson: number;
  idSpecificAlarmType: number;
  specificAlarmType: string;
  idStatus: number;
  idPersonSpecificAlarm: number;
};

type LGeofence = {
  idGeofence: number;
  geofence: string;
  days: string;
};

export type AlarmDefendantById = {
  idPerson: number;
  idspecificAlarmType: number;
  specificAlarmType: string;
  idStatus: number;
  idPersonSpecificAlarm: number;
  lGeofence: LGeofence[];
};
