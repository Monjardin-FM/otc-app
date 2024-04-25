export type Person = {
  idDefendant: number;
  idPerson: number;
  idOfficer: number;
  name: string;
  lastName: string;
  idCounty: number;
  birthDate: string;
  idGender: number;
  idPersonType: number;
  idStatus: number;
  createdAt: string;
  idRole: number;
  deviceId: number;
  idDeviceType: number;
  imei: string;
  personPosition: {
    dateInit: string;
    dateFin: string;
    positionDate: string;
    battery: number;
    lat: number;
    lon: number;
    type: number;
    cardioFrequency: number;
    bloodOxygen: number;
    positionType: string;
    delta: number;
  };
};

export type PersonAlert = {
  timestamp: string;
  alarmName: string;
  device1Latitude: number;
  device1Longitude: number;
  seqMachineState: boolean;
  personId: number;
};

export type TrackingDetail = {
  person: Person[];
  personAlert: PersonAlert[];
};
