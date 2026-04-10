type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiOptions = {
  headers?: Record<string, string>;
  json?: any;
  searchParams?: Record<string, any> | URLSearchParams;
  body?: BodyInit | null;
};

type DemoApiClient = {
  get: (url: string, options?: ApiOptions) => Promise<Response>;
  post: (url: string, options?: ApiOptions) => Promise<Response>;
  put: (url: string, options?: ApiOptions) => Promise<Response>;
  delete: (url: string, options?: ApiOptions) => Promise<Response>;
};

type RawPerson = {
  idDefendant: number;
  idPerson: number;
  idOfficer: number;
  name: string;
  lastName: string;
  idCounty: number;
  eMail: string;
  birthDate: string;
  idGender: number;
  sid: string;
  idPersonType: number;
  idStatus: number;
  created_at: string;
  idRole: number;
  role: string;
  deviceId: number;
  idDeviceType: number;
  caseNumber: string;
  userName: string;
  notes?: string;
  offense?: string;
  officer?: string;
  phone?: string;
  showalerts?: boolean;
};

type RawAlarm = {
  idAlarmType: number;
  description: string;
  automatic: boolean;
  responseInterval: number;
  geocordinateTimeout: number;
  dynamicDistance: number;
  enableResponseCall: boolean;
  resolveTime: number;
  callText: string;
  smsText: string;
  mailText: string;
  idStatus: number;
};

type RawDevice = {
  idDevice: number;
  description: string;
  idDeviceType: number;
  deviceType: string;
  idPerson: number;
  idStatus: number;
  available: boolean;
};

type RawVictim = RawPerson & {
  idDefendant?: number;
};

type RawPhone = {
  idPhone: number;
  idPerson: number;
  phone: string;
  description: string;
};

type RawAddress = {
  idAddress: number;
  idPerson: number;
  idCounty: number;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
};

type RawSpecificAlarm = {
  idSpecificAlarm: number;
  idPerson: number;
  idSpecificAlarmType: number;
  specificAlarmType: string;
  idAlarmType: number;
  alarmName: string;
  idStatus: number;
};

type RawScheduleAlarm = {
  idSpecificAlarmException: number;
  idSpecificAlarm: number;
  idPerson: number;
  days: string;
  dateInit: string;
  dateFin: string;
  idStatus: number;
};

type RawReference = {
  idReferencePerson: number;
  idDefendant: number;
  fullName: string;
  phone: string;
  relationship: string;
};

type RawComment = {
  idComment: number;
  idPerson: number;
  message: string;
  fecAlta: string;
};

type RawNotification = {
  idNotification: number;
  idDefendant: number;
  idOfficer: number;
  message: string;
  officer: string;
  defendant: string;
  idStatus: number;
  fecAlta: string;
};

type RawCommunication = {
  idPerson: number;
  idTypeCommunication: number;
  typeCommunication: string;
  message: string;
  fecAlta: string;
};

type RawPosition = {
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
  idPerson: number;
  position_type: number;
  iddeviceType: number;
};

type RawAlert = {
  timestamp: string;
  alarmName: string;
  device1Latitude: number;
  device1Longitude: number;
  seqMachineState: boolean;
  personId: number;
};

type DemoStore = {
  users: RawPerson[];
  defendants: RawPerson[];
  inactiveDefendants: RawPerson[];
  victims: RawVictim[];
  devices: RawDevice[];
  alarms: RawAlarm[];
  notifications: RawNotification[];
  communications: RawCommunication[];
  comments: RawComment[];
  phones: RawPhone[];
  addresses: RawAddress[];
  specificAlarms: RawSpecificAlarm[];
  scheduleAlarms: RawScheduleAlarm[];
  references: RawReference[];
  positionsByPerson: Record<number, RawPosition[]>;
  devicePositionsByKey: Record<string, RawPosition[]>;
  caseNumbersByPerson: Record<number, { idCaseNumber: number; caseNumber: string }[]>;
  victimAssignments: Record<number, number[]>;
  deviceAssignments: Record<number, number[]>;
};

const nowIso = () => new Date().toISOString();

const earthRadiusMeters = 6378137;

const toRadians = (value: number) => (value * Math.PI) / 180;
const toDegrees = (value: number) => (value * 180) / Math.PI;

const moveCoordinate = (
  centerLat: number,
  centerLon: number,
  distanceMeters: number,
  bearingDegrees: number
) => {
  const angularDistance = distanceMeters / earthRadiusMeters;
  const bearing = toRadians(bearingDegrees);
  const latitude = toRadians(centerLat);
  const longitude = toRadians(centerLon);

  const movedLat = Math.asin(
    Math.sin(latitude) * Math.cos(angularDistance) +
      Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const movedLon =
    longitude +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude),
      Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(movedLat)
    );

  return [toDegrees(movedLon), toDegrees(movedLat)] as [number, number];
};

const buildCircularPolygon = (
  centerLat: number,
  centerLon: number,
  radiusMeters: number,
  points = 48
) => {
  const coordinates = Array.from({ length: points }, (_, index) =>
    moveCoordinate(centerLat, centerLon, radiusMeters, (360 / points) * index)
  );
  coordinates.push(coordinates[0]);
  return coordinates;
};

const exclusionCenterOffset = {
  lat: 0.0048,
  lon: 0.0056,
};

const encodeGeoFence = (
  centerLat: number,
  centerLon: number,
  options?: {
    name?: string;
    radius?: number;
    category?: "inclusion" | "exclusion";
  }
) =>
  JSON.stringify({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: options?.name || "Zona de seguridad demo",
          radius: options?.radius ?? 180,
          category: options?.category || "inclusion",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            buildCircularPolygon(
              centerLat,
              centerLon,
              options?.radius ?? 180
            ),
          ],
        },
      },
    ],
  });

const makePosition = (
  idPerson: number,
  lat: number,
  lon: number,
  iddeviceType = 1,
  minutesAgo = 0
): RawPosition => {
  const timestamp = new Date(Date.now() - minutesAgo * 60000).toISOString();
  return {
    dateInit: timestamp,
    dateFin: timestamp,
    positionDate: timestamp,
    battery: Math.max(24, 96 - minutesAgo * 2),
    lat,
    lon,
    type: 1,
    cardioFrequency: 72,
    bloodOxygen: 98,
    positionType: "GPS",
    delta: minutesAgo,
    idPerson,
    position_type: 1,
    iddeviceType,
  };
};

const makeWaveRoute = (params: {
  idPerson: number;
  startLat: number;
  startLon: number;
  steps: number;
  amplitudeLat: number;
  amplitudeLon: number;
  driftLat?: number;
  driftLon?: number;
  iddeviceType?: number;
  startMinutesAgo?: number;
  minuteStep?: number;
  cardioBase?: number;
  bloodOxygenBase?: number;
  batteryStart?: number;
}) => {
  const {
    idPerson,
    startLat,
    startLon,
    steps,
    amplitudeLat,
    amplitudeLon,
    driftLat = 0,
    driftLon = 0,
    iddeviceType = 1,
    startMinutesAgo = 300,
    minuteStep = 3,
    cardioBase = 74,
    bloodOxygenBase = 98,
    batteryStart = 97,
  } = params;

  return Array.from({ length: steps }, (_, index) => {
    const progress = index / Math.max(steps - 1, 1);
    const minutesAgo = Math.max(0, startMinutesAgo - minuteStep * index);
    const lat =
      startLat +
      driftLat * progress +
      Math.sin(index / 6) * amplitudeLat +
      Math.cos(index / 13) * amplitudeLat * 0.35;
    const lon =
      startLon +
      driftLon * progress +
      Math.cos(index / 7) * amplitudeLon +
      Math.sin(index / 11) * amplitudeLon * 0.4;
    const position = makePosition(idPerson, lat, lon, iddeviceType, minutesAgo);

    return {
      ...position,
      cardioFrequency: Math.round(cardioBase + Math.sin(index / 5) * 8),
      bloodOxygen: Math.max(
        92,
        Math.min(100, Math.round(bloodOxygenBase + Math.cos(index / 9) * 2))
      ),
      battery: Math.max(18, Math.round(batteryStart - index * 0.45)),
    };
  });
};

const baseUsers: RawPerson[] = [
  {
    idDefendant: 0,
    idPerson: 1,
    idOfficer: 0,
    name: "Roberto",
    lastName: "Monjardin",
    idCounty: 1,
    eMail: "demo@farmaleal.com",
    birthDate: "1988-06-15T00:00:00",
    idGender: 1,
    sid: "USR-001",
    idPersonType: 1,
    idStatus: 1,
    created_at: "2026-03-01T10:00:00",
    idRole: 1,
    role: "OTC Administrator",
    deviceId: 0,
    idDeviceType: 0,
    caseNumber: "",
    userName: "demo.admin",
    officer: "N/A",
    phone: "555-0100",
  },
  {
    idDefendant: 0,
    idPerson: 2,
    idOfficer: 0,
    name: "Laura",
    lastName: "Sanchez",
    idCounty: 2,
    eMail: "monitor@farmaleal.com",
    birthDate: "1990-09-11T00:00:00",
    idGender: 2,
    sid: "USR-002",
    idPersonType: 1,
    idStatus: 1,
    created_at: "2026-03-03T09:00:00",
    idRole: 5,
    role: "Monitoring Center Supervisor",
    deviceId: 0,
    idDeviceType: 0,
    caseNumber: "",
    userName: "monitor.supervisor",
    officer: "N/A",
    phone: "555-0101",
  },
];

const baseDefendants: RawPerson[] = [
  {
    idDefendant: 101,
    idPerson: 101,
    idOfficer: 2,
    name: "Carlos",
    lastName: "Mendoza",
    idCounty: 1,
    eMail: "carlos.mendoza@example.com",
    birthDate: "1986-02-12T00:00:00",
    idGender: 1,
    sid: "DEF-101",
    idPersonType: 2,
    idStatus: 1,
    created_at: "2026-03-10T08:00:00",
    idRole: 3,
    role: "Defendant",
    deviceId: 301,
    idDeviceType: 1,
    caseNumber: "CASE-2026-001",
    userName: "cmendoza",
    notes: "Seguimiento normal para demo.",
    offense: "Restriccion perimetral",
    officer: "Laura Sanchez",
    phone: "555-2001",
    showalerts: true,
  },
  {
    idDefendant: 102,
    idPerson: 102,
    idOfficer: 2,
    name: "Andrea",
    lastName: "Lopez",
    idCounty: 2,
    eMail: "andrea.lopez@example.com",
    birthDate: "1992-07-20T00:00:00",
    idGender: 2,
    sid: "DEF-102",
    idPersonType: 2,
    idStatus: 1,
    created_at: "2026-03-12T08:30:00",
    idRole: 3,
    role: "Defendant",
    deviceId: 302,
    idDeviceType: 3,
    caseNumber: "CASE-2026-002",
    userName: "alopez",
    notes: "Caso con alerta de proximidad para demo.",
    offense: "Orden de restriccion",
    officer: "Laura Sanchez",
    phone: "555-2002",
    showalerts: true,
  },
  {
    idDefendant: 103,
    idPerson: 103,
    idOfficer: 2,
    name: "Miguel",
    lastName: "Torres",
    idCounty: 1,
    eMail: "miguel.torres@example.com",
    birthDate: "1984-01-05T00:00:00",
    idGender: 1,
    sid: "DEF-103",
    idPersonType: 2,
    idStatus: 0,
    created_at: "2026-03-18T10:00:00",
    idRole: 3,
    role: "Defendant",
    deviceId: 303,
    idDeviceType: 1,
    caseNumber: "CASE-2026-003",
    userName: "mtorres",
    notes: "Inactivo, util para historial demo.",
    offense: "Seguimiento concluido",
    officer: "Laura Sanchez",
    phone: "555-2003",
    showalerts: false,
  },
];

const baseVictims: RawVictim[] = [
  {
    idDefendant: 101,
    idPerson: 201,
    idOfficer: 2,
    name: "Sofia",
    lastName: "Ramirez",
    idCounty: 1,
    eMail: "sofia.ramirez@example.com",
    birthDate: "1990-04-23T00:00:00",
    idGender: 2,
    sid: "VIC-201",
    idPersonType: 3,
    idStatus: 1,
    created_at: "2026-03-10T10:00:00",
    idRole: 4,
    role: "Victim",
    deviceId: 0,
    idDeviceType: 0,
    caseNumber: "",
    userName: "sofia.r",
    phone: "555-3001",
  },
  {
    idDefendant: 102,
    idPerson: 202,
    idOfficer: 2,
    name: "Valeria",
    lastName: "Cruz",
    idCounty: 2,
    eMail: "valeria.cruz@example.com",
    birthDate: "1989-10-13T00:00:00",
    idGender: 2,
    sid: "VIC-202",
    idPersonType: 3,
    idStatus: 1,
    created_at: "2026-03-11T09:45:00",
    idRole: 4,
    role: "Victim",
    deviceId: 0,
    idDeviceType: 0,
    caseNumber: "",
    userName: "valeriac",
    phone: "555-3002",
  },
];

const baseDevices: RawDevice[] = [
  {
    idDevice: 301,
    description: "865440030123451",
    idDeviceType: 1,
    deviceType: "Bracelet",
    idPerson: 101,
    idStatus: 1,
    available: false,
  },
  {
    idDevice: 302,
    description: "42000102",
    idDeviceType: 3,
    deviceType: "Cell Phone",
    idPerson: 102,
    idStatus: 1,
    available: false,
  },
  {
    idDevice: 303,
    description: "865440030123499",
    idDeviceType: 1,
    deviceType: "Bracelet",
    idPerson: 103,
    idStatus: 0,
    available: true,
  },
];

const baseAlarms: RawAlarm[] = [
  {
    idAlarmType: 1,
    description: "Bracelet Tampering",
    automatic: true,
    responseInterval: 5,
    geocordinateTimeout: 10,
    dynamicDistance: 50,
    enableResponseCall: true,
    resolveTime: 30,
    callText: "Alerta de manipulación",
    smsText: "Se detectó manipulación del dispositivo",
    mailText: "Manipulación detectada",
    idStatus: 1,
  },
  {
    idAlarmType: 2,
    description: "Device Battery Low",
    automatic: true,
    responseInterval: 10,
    geocordinateTimeout: 15,
    dynamicDistance: 0,
    enableResponseCall: false,
    resolveTime: 60,
    callText: "Batería baja",
    smsText: "Batería baja detectada",
    mailText: "Batería baja",
    idStatus: 1,
  },
  {
    idAlarmType: 3,
    description: "Proximity Alert",
    automatic: false,
    responseInterval: 3,
    geocordinateTimeout: 10,
    dynamicDistance: 120,
    enableResponseCall: true,
    resolveTime: 20,
    callText: "Alerta de proximidad",
    smsText: "La distancia segura fue excedida",
    mailText: "Proximidad fuera de rango",
    idStatus: 1,
  },
];

const store: DemoStore = {
  users: [...baseUsers],
  defendants: baseDefendants.filter((item) => item.idStatus === 1),
  inactiveDefendants: baseDefendants.filter((item) => item.idStatus !== 1),
  victims: [...baseVictims],
  devices: [...baseDevices],
  alarms: [...baseAlarms],
  notifications: [
    {
      idNotification: 1,
      idDefendant: 101,
      idOfficer: 2,
      message: "Se registró una alerta de batería baja.",
      officer: "Laura Sanchez",
      defendant: "Carlos Mendoza",
      idStatus: 1,
      fecAlta: nowIso(),
    },
    {
      idNotification: 2,
      idDefendant: 102,
      idOfficer: 2,
      message: "Próximo a zona de exclusión.",
      officer: "Laura Sanchez",
      defendant: "Andrea Lopez",
      idStatus: 2,
      fecAlta: "2026-04-07T16:20:00",
    },
  ],
  communications: [
    {
      idPerson: 101,
      idTypeCommunication: 1,
      typeCommunication: "Call",
      message: "Llamada de seguimiento completada.",
      fecAlta: "2026-04-07T14:10:00",
    },
    {
      idPerson: 102,
      idTypeCommunication: 2,
      typeCommunication: "SMS",
      message: "Recordatorio de permanencia en perímetro.",
      fecAlta: "2026-04-07T17:30:00",
    },
  ],
  comments: [
    {
      idComment: 1,
      idPerson: 101,
      message: "El usuario respondió correctamente durante la visita.",
      fecAlta: "2026-04-06T11:00:00",
    },
  ],
  phones: [
    { idPhone: 1, idPerson: 101, phone: "555-2001", description: "Principal" },
    { idPhone: 2, idPerson: 102, phone: "555-2002", description: "Principal" },
  ],
  addresses: [
    {
      idAddress: 1,
      idPerson: 101,
      idCounty: 1,
      city: "Monterrey",
      address: "Av. Demo 123, Centro",
      latitude: 25.6866,
      longitude: -100.3161,
    },
    {
      idAddress: 2,
      idPerson: 102,
      idCounty: 2,
      city: "Guadalajara",
      address: "Calle Muestra 450, Americana",
      latitude: 20.6736,
      longitude: -103.344,
    },
  ],
  specificAlarms: [
    {
      idSpecificAlarm: 1,
      idPerson: 101,
      idSpecificAlarmType: 1,
      specificAlarmType: "Entry restriction",
      idAlarmType: 3,
      alarmName: "Proximity Alert",
      idStatus: 1,
    },
  ],
  scheduleAlarms: [
    {
      idSpecificAlarmException: 1,
      idSpecificAlarm: 1,
      idPerson: 101,
      days: "Mon,Tue,Wed,Thu,Fri",
      dateInit: "2026-04-01T08:00:00",
      dateFin: "2026-04-30T20:00:00",
      idStatus: 1,
    },
  ],
  references: [
    {
      idReferencePerson: 1,
      idDefendant: 101,
      fullName: "Jose Ramirez",
      phone: "555-4001",
      relationship: "Brother",
    },
  ],
  positionsByPerson: {
    101: makeWaveRoute({
      idPerson: 101,
      startLat: 25.6802,
      startLon: -100.3258,
      steps: 120,
      amplitudeLat: 0.00032,
      amplitudeLon: 0.00048,
      driftLat: 0.0105,
      driftLon: 0.0175,
      iddeviceType: 1,
      startMinutesAgo: 720,
      minuteStep: 6,
      cardioBase: 76,
    }),
    102: makeWaveRoute({
      idPerson: 102,
      startLat: 20.6695,
      startLon: -103.352,
      steps: 115,
      amplitudeLat: 0.00028,
      amplitudeLon: 0.00052,
      driftLat: 0.009,
      driftLon: 0.015,
      iddeviceType: 3,
      startMinutesAgo: 690,
      minuteStep: 6,
      cardioBase: 79,
    }),
    103: makeWaveRoute({
      idPerson: 103,
      startLat: 25.693,
      startLon: -100.321,
      steps: 105,
      amplitudeLat: 0.00025,
      amplitudeLon: 0.00038,
      driftLat: 0.006,
      driftLon: 0.011,
      iddeviceType: 1,
      startMinutesAgo: 630,
      minuteStep: 6,
      cardioBase: 73,
      batteryStart: 84,
    }),
    201: makeWaveRoute({
      idPerson: 201,
      startLat: 25.6805,
      startLon: -100.3254,
      steps: 120,
      amplitudeLat: 0.0002,
      amplitudeLon: 0.00025,
      driftLat: 0.0035,
      driftLon: 0.006,
      iddeviceType: 0,
      startMinutesAgo: 720,
      minuteStep: 6,
      cardioBase: 81,
      batteryStart: 88,
    }).map((position, index) => ({
      ...position,
      lat:
        index < 45
          ? position.lat + 0.00012
          : index < 85
          ? position.lat + 0.0018
          : position.lat + 0.0026,
      lon:
        index < 45
          ? position.lon + 0.00014
          : index < 85
          ? position.lon + 0.0013
          : position.lon + 0.0022,
    })),
    202: makeWaveRoute({
      idPerson: 202,
      startLat: 20.6762,
      startLon: -103.3476,
      steps: 110,
      amplitudeLat: 0.00019,
      amplitudeLon: 0.00024,
      driftLat: 0.0048,
      driftLon: 0.0084,
      iddeviceType: 0,
      startMinutesAgo: 660,
      minuteStep: 6,
      cardioBase: 77,
      batteryStart: 90,
    }).map((position, index) => ({
      ...position,
      lat: position.lat + (index < 35 ? 0.0048 : 0.0072),
      lon: position.lon + (index < 35 ? 0.0042 : 0.0069),
    })),
  },
  devicePositionsByKey: {
    "865440030123451": makeWaveRoute({
      idPerson: 101,
      startLat: 25.6802,
      startLon: -100.3258,
      steps: 120,
      amplitudeLat: 0.00032,
      amplitudeLon: 0.00048,
      driftLat: 0.0105,
      driftLon: 0.0175,
      iddeviceType: 1,
      startMinutesAgo: 720,
      minuteStep: 6,
      cardioBase: 76,
    }),
    "42000102": makeWaveRoute({
      idPerson: 102,
      startLat: 20.6695,
      startLon: -103.352,
      steps: 115,
      amplitudeLat: 0.00028,
      amplitudeLon: 0.00052,
      driftLat: 0.009,
      driftLon: 0.015,
      iddeviceType: 3,
      startMinutesAgo: 690,
      minuteStep: 6,
      cardioBase: 79,
    }),
    "103": makeWaveRoute({
      idPerson: 103,
      startLat: 25.693,
      startLon: -100.321,
      steps: 105,
      amplitudeLat: 0.00025,
      amplitudeLon: 0.00038,
      driftLat: 0.006,
      driftLon: 0.011,
      iddeviceType: 1,
      startMinutesAgo: 630,
      minuteStep: 6,
      cardioBase: 73,
      batteryStart: 84,
    }),
    "101": makeWaveRoute({
      idPerson: 101,
      startLat: 25.6802,
      startLon: -100.3258,
      steps: 120,
      amplitudeLat: 0.00032,
      amplitudeLon: 0.00048,
      driftLat: 0.0105,
      driftLon: 0.0175,
      iddeviceType: 1,
      startMinutesAgo: 720,
      minuteStep: 6,
      cardioBase: 76,
    }),
    "102": makeWaveRoute({
      idPerson: 102,
      startLat: 20.6695,
      startLon: -103.352,
      steps: 115,
      amplitudeLat: 0.00028,
      amplitudeLon: 0.00052,
      driftLat: 0.009,
      driftLon: 0.015,
      iddeviceType: 3,
      startMinutesAgo: 690,
      minuteStep: 6,
      cardioBase: 79,
    }),
  },
  caseNumbersByPerson: {
    101: [{ idCaseNumber: 1, caseNumber: "CASE-2026-001" }],
    102: [{ idCaseNumber: 2, caseNumber: "CASE-2026-002" }],
    103: [{ idCaseNumber: 3, caseNumber: "CASE-2026-003" }],
  },
  victimAssignments: {
    101: [201],
    102: [202],
  },
  deviceAssignments: {
    101: [301],
    102: [302],
    103: [303],
  },
};

const nextId = (values: number[]) => (values.length ? Math.max(...values) + 1 : 1);

const findPerson = (idPerson: number) =>
  [...store.defendants, ...store.inactiveDefendants, ...store.users, ...store.victims].find(
    (item) => item.idPerson === idPerson
  );

const normalizeSearch = (value: string) => value.trim().toLowerCase();

const success = (data: unknown, status = 200) =>
  Promise.resolve(
    new Response(
      JSON.stringify({
        isSuccess: true,
        statusCode: status,
        data,
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );

const failure = (message: string, status = 400) =>
  Promise.resolve(
    new Response(
      JSON.stringify({
        isSuccess: false,
        statusCode: status,
        message,
        data: null,
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );

const getSearchParams = (options?: ApiOptions) => {
  const searchParams = options?.searchParams;
  if (!searchParams) return new URLSearchParams();
  if (searchParams instanceof URLSearchParams) return searchParams;

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  return params;
};

const buildTrackingAlerts = (personId: number, lat: number, lon: number): RawAlert[] => [
  {
    timestamp: nowIso(),
    alarmName: "Bracelet Tampering",
    device1Latitude: lat,
    device1Longitude: lon,
    seqMachineState: personId === 102,
    personId,
  },
  {
    timestamp: nowIso(),
    alarmName: "Device Battery Low",
    device1Latitude: lat,
    device1Longitude: lon,
    seqMachineState: personId === 101,
    personId,
  },
  {
    timestamp: nowIso(),
    alarmName: "Exclusion Alarm",
    device1Latitude: lat,
    device1Longitude: lon,
    seqMachineState: false,
    personId,
  },
  {
    timestamp: nowIso(),
    alarmName: "Perimeter Alarm",
    device1Latitude: lat,
    device1Longitude: lon,
    seqMachineState: personId === 102,
    personId,
  },
  {
    timestamp: nowIso(),
    alarmName: "Position Timeout",
    device1Latitude: lat,
    device1Longitude: lon,
    seqMachineState: false,
    personId,
  },
  {
    timestamp: nowIso(),
    alarmName: "Proximity Alert",
    device1Latitude: lat,
    device1Longitude: lon,
    seqMachineState: personId === 102,
    personId,
  },
];

const listTracking = (source: RawPerson[]) =>
  source.map((person) => {
    const position = store.positionsByPerson[person.idPerson]?.[0] || makePosition(person.idPerson, 25.68, -100.31);
    return {
      personId: person.idPerson,
      name: person.name,
      lastName: person.lastName,
      alerts: buildTrackingAlerts(person.idPerson, position.lat, position.lon),
    };
  });

const trackingDetail = (idPerson: number) => {
  const person = findPerson(idPerson);
  if (!person) return null;

  const defendantHistory = store.positionsByPerson[idPerson] || [];
  const defendantPosition =
    defendantHistory[defendantHistory.length - 1] ||
    makePosition(idPerson, 25.68, -100.31);
  const victims = store.victimAssignments[idPerson] || [];
  const relatedVictims = victims
    .map((victimId) => store.victims.find((victim) => victim.idPerson === victimId))
    .filter(Boolean)
    .map((victim) => {
      const victimHistory = store.positionsByPerson[victim!.idPerson] || [];
      const victimPosition =
        victimHistory[victimHistory.length - 1] ||
        makePosition(
          victim!.idPerson,
          defendantPosition.lat + 0.001,
          defendantPosition.lon + 0.001,
          0
        );
      return {
        ...victim,
        personPosition: {
          ...victimPosition,
          geofences: [],
        },
      };
    });

  return {
    person: [
      {
        ...person,
        personPosition: {
          ...defendantPosition,
          geofences: [
            {
              idGeofence: 1,
              geofence: encodeGeoFence(defendantPosition.lat, defendantPosition.lon, {
                name: "Zona de inclusión",
                radius: 220,
                category: "inclusion",
              }),
              idAlarmType: 3,
              name: "Zona de inclusión",
            },
            {
              idGeofence: 2,
              geofence: encodeGeoFence(
                defendantPosition.lat + exclusionCenterOffset.lat,
                defendantPosition.lon + exclusionCenterOffset.lon,
                {
                  name: "Zona de exclusión",
                  radius: 110,
                  category: "exclusion",
                }
              ),
              idAlarmType: 2,
              name: "Zona de exclusión",
            },
          ],
        },
      },
      ...relatedVictims,
    ],
    personAlert: buildTrackingAlerts(idPerson, defendantPosition.lat, defendantPosition.lon),
  };
};

const filterBySearch = <T extends RawPerson | RawDevice | RawAlarm>(
  items: T[],
  predicate: (item: T) => string,
  search: string
) => {
  if (!search) return items;
  const query = normalizeSearch(search);
  return items.filter((item) => normalizeSearch(predicate(item)).includes(query));
};

const handleGet = (path: string, options?: ApiOptions) => {
  const params = getSearchParams(options);

  if (path === "Catalog/County") {
    return success([
      { idCounty: 1, county: "Nuevo Leon" },
      { idCounty: 2, county: "Jalisco" },
      { idCounty: 3, county: "CDMX" },
    ]);
  }

  if (path === "Catalog/Gender") {
    return success([
      { idGender: 1, gender: "Male" },
      { idGender: 2, gender: "Female" },
    ]);
  }

  if (path === "Catalog/Role") {
    return success([
      { idRole: 1, role: "OTC Administrator" },
      { idRole: 2, role: "County Administrator" },
      { idRole: 3, role: "Officer" },
      { idRole: 4, role: "Monitoring Center Supervisor" },
      { idRole: 5, role: "Monitoring Center Agent" },
    ]);
  }

  if (path === "Catalog/DeviceType") {
    return success([
      { idDeviceType: 1, deviceType: "Bracelet" },
      { idDeviceType: 2, deviceType: "Panic Button" },
      { idDeviceType: 3, deviceType: "Cell Phone" },
    ]);
  }

  if (path === "Catalog/SpecificAlarmType") {
    return success([
      { idSpecificAlarmType: 1, specificAlarmType: "Entry restriction" },
      { idSpecificAlarmType: 2, specificAlarmType: "Exit restriction" },
      { idSpecificAlarmType: 3, specificAlarmType: "Schedule restriction" },
    ]);
  }

  if (path === "Catalog/ResponseDevice") {
    return success([
      { idResponseDevice: 1, responseDevice: "SMS" },
      { idResponseDevice: 2, responseDevice: "Phone call" },
      { idResponseDevice: 3, responseDevice: "Email" },
    ]);
  }

  if (path === "Catalog/City") {
    return success([
      { idCity: 1, city: "Monterrey" },
      { idCity: 2, city: "Guadalajara" },
      { idCity: 3, city: "Ciudad de Mexico" },
    ]);
  }

  if (path === "Defendant") {
    const search = params.get("completeName") || "";
    return success(
      filterBySearch(store.defendants, (item) => `${item.name} ${item.lastName} ${item.userName} ${item.caseNumber}`, search)
    );
  }

  if (path === "Defendant/Deleted") {
    return success(store.inactiveDefendants);
  }

  if (path.startsWith("Defendant/Id/")) {
    const id = Number(path.split("/").pop());
    return success(findPerson(id));
  }

  if (path.startsWith("Defendant/") && path.endsWith("/Alarm")) {
    const idPerson = Number(path.split("/")[1]);
    return success(store.specificAlarms.filter((item) => item.idPerson === idPerson));
  }

  if (path.startsWith("Defendant/") && path.endsWith("/attachment")) {
    return success([
      {
        idAttachment: 1,
        fileName: "respaldo-demo.pdf",
        url: "#",
      },
    ]);
  }

  if (path.startsWith("Victim/Exist/")) {
    const mail = normalizeSearch(decodeURIComponent(path.split("/").pop() || ""));
    return success(store.victims.find((victim) => normalizeSearch(victim.eMail) === mail) || null);
  }

  if (path.startsWith("Victim/id/")) {
    const id = Number(path.split("/").pop());
    return success(store.victims.find((victim) => victim.idPerson === id) || null);
  }

  if (path.startsWith("Victim/")) {
    const idDefendant = Number(path.split("/")[1]);
    const victimIds = store.victimAssignments[idDefendant] || [];
    return success(store.victims.filter((victim) => victimIds.includes(victim.idPerson)));
  }

  if (path === "Device") {
    const search = params.get("completeName") || "";
    return success(filterBySearch(store.devices, (item) => `${item.description} ${item.deviceType}`, search));
  }

  if (path.startsWith("Device/id/")) {
    const id = Number(path.split("/").pop());
    return success(store.devices.find((device) => device.idDevice === id) || null);
  }

  if (path.startsWith("Device/Position/")) {
    const key = decodeURIComponent(path.split("/").pop() || "");
    return success(store.devicePositionsByKey[key] || []);
  }

  if (path === "User") {
    const search = params.get("completeName") || "";
    return success(filterBySearch(store.users, (item) => `${item.name} ${item.lastName} ${item.userName} ${item.role}`, search));
  }

  if (path.startsWith("User/id/")) {
    const id = Number(path.split("/").pop());
    return success(store.users.find((user) => user.idPerson === id) || null);
  }

  if (path === "AlarmType") {
    const search = params.get("completeName") || "";
    return success(filterBySearch(store.alarms, (item) => item.description, search));
  }

  if (path.startsWith("AlarmType/Id/")) {
    const id = Number(path.split("/").pop());
    return success(store.alarms.find((alarm) => alarm.idAlarmType === id) || null);
  }

  if (path === "Position/Alerts") {
    return success(listTracking(store.defendants));
  }

  if (path === "Position/AlertsPlus") {
    return success(listTracking(store.defendants).filter((item) => item.alerts.some((alert) => alert.seqMachineState)));
  }

  if (path.startsWith("Position/")) {
    const idPerson = Number(path.split("/")[1]);
    return success(trackingDetail(idPerson));
  }

  if (path === "Common/Notification") {
    return success(store.notifications);
  }

  if (path.startsWith("Common/Comment/")) {
    const idPerson = Number(path.split("/").pop());
    return success(store.comments.filter((comment) => comment.idPerson === idPerson));
  }

  if (path === "Message/TypeCommunication") {
    return success([
      { idTypecommunication: 1, description: "Call" },
      { idTypecommunication: 2, description: "SMS" },
      { idTypecommunication: 3, description: "Email" },
    ]);
  }

  if (path.startsWith("Message/Communication/")) {
    const idPerson = Number(path.split("/").pop());
    return success(store.communications.filter((item) => item.idPerson === idPerson));
  }

  if (path.startsWith("Address/Id/")) {
    const idAddress = Number(path.split("/").pop());
    return success(store.addresses.find((address) => address.idAddress === idAddress) || null);
  }

  if (path.startsWith("Address/")) {
    const idPerson = Number(path.split("/").pop());
    return success(store.addresses.filter((address) => address.idPerson === idPerson));
  }

  if (path.startsWith("Phone/id/")) {
    const idPhone = Number(path.split("/").pop());
    return success(store.phones.find((phone) => phone.idPhone === idPhone) || null);
  }

  if (path.startsWith("Phone/")) {
    const idPerson = Number(path.split("/").pop());
    return success(store.phones.filter((phone) => phone.idPerson === idPerson));
  }

  if (path.startsWith("SpecificAlarm/id/") || path.startsWith("SpecificAlarm/Id/")) {
    const id = Number(path.split("/").pop());
    const alarm = store.specificAlarms.find((item) => item.idSpecificAlarm === id);
    if (!alarm) {
      return success(null);
    }

    return success({
      idPerson: alarm.idPerson,
      idPersonSpecificAlarm: alarm.idSpecificAlarm,
      idStatus: alarm.idStatus,
      idspecificAlarmType: alarm.idSpecificAlarmType,
      name: alarm.alarmName,
      lGeofence: [
        {
          idGeofence: 1,
          idAlarmType: alarm.idAlarmType,
          geofence: encodeGeoFence(
            store.positionsByPerson[alarm.idPerson]?.[0]?.lat || 25.6866,
            store.positionsByPerson[alarm.idPerson]?.[0]?.lon || -100.3161
          ),
        },
      ],
      alarmException: store.scheduleAlarms
        .filter((item) => item.idSpecificAlarm === id)
        .map((item) => ({
          alarmExceptionType: item.idSpecificAlarmException,
          dateInit: item.dateInit,
          dateFinish: item.dateFin,
          strDays: item.days,
        })),
    });
  }

  if (path.startsWith("SpecificAlarm/")) {
    const idPerson = Number(path.split("/").pop());
    return success(store.specificAlarms.filter((item) => item.idPerson === idPerson));
  }

  if (path.startsWith("PersonDevice/")) {
    const idDefendant = Number(path.split("/").pop());
    const devices = (store.deviceAssignments[idDefendant] || [])
      .map((deviceId) => store.devices.find((device) => device.idDevice === deviceId))
      .filter(Boolean);
    return success(devices);
  }

  if (path.startsWith("Defendant/CaseNumber/")) {
    const idPerson = Number(path.split("/").pop());
    return success(store.caseNumbersByPerson[idPerson] || []);
  }

  if (path.startsWith("Defendant/AlarmDetail/")) {
    const idPerson = Number(path.split("/").pop());
    return success(store.specificAlarms.filter((item) => item.idPerson === idPerson));
  }

  if (path.startsWith("SpecificAlarmException/")) {
    const idSpecificAlarm = Number(path.split("/").pop());
    return success(store.scheduleAlarms.filter((item) => item.idSpecificAlarm === idSpecificAlarm));
  }

  if (path.startsWith("ReferencePerson/Id/")) {
    const idReference = Number(path.split("/").pop());
    return success(store.references.find((item) => item.idReferencePerson === idReference) || null);
  }

  if (path.startsWith("ReferencePerson/")) {
    const idDefendant = Number(path.split("/").pop());
    return success(store.references.filter((item) => item.idDefendant === idDefendant));
  }

  return success([]);
};

const handlePost = (path: string, options?: ApiOptions) => {
  const body = options?.json || {};

  if (path === "Security/Login") {
    const userName = body.user || "demo@farmaleal.com";
    const userInfo = store.users[0];
    return success({
      token: "demo-jwt-token",
      userinfo: {
        ...userInfo,
        eMail: userName,
        roles: [userInfo.role],
      },
    });
  }

  if (path === "Defendant") {
    const idPerson = nextId([...store.defendants, ...store.inactiveDefendants].map((item) => item.idPerson));
    const created = {
      ...store.defendants[0],
      ...body,
      idPerson,
      idDefendant: idPerson,
      created_at: nowIso(),
      idStatus: body.idStatus ?? 1,
      userName: body.userName || `defendant.${idPerson}`,
      role: "Defendant",
    };
    store.defendants.unshift(created);
    return success({ idPerson, ...created });
  }

  if (path === "Victim") {
    const idPerson = nextId(store.victims.map((item) => item.idPerson));
    const created = {
      ...store.victims[0],
      ...body,
      idPerson,
      idDefendant: body.idDefendant ?? body.idPerson ?? 0,
      created_at: nowIso(),
      idPersonType: 3,
      role: "Victim",
      userName: body.userName || `victim.${idPerson}`,
      sid: body.sid || `VIC-${idPerson}`,
    };
    store.victims.unshift(created);
    return success({ idPerson, ...created });
  }

  if (path === "Victim/Assign") {
    const idDefendant = Number(body.idDefendant || body.idPerson || 0);
    const idVictim = Number(body.idVictim || body.idPersonVictim || body.idPerson);
    store.victimAssignments[idDefendant] = Array.from(
      new Set([...(store.victimAssignments[idDefendant] || []), idVictim])
    );
    return success(true);
  }

  if (path === "Device") {
    const idDevice = nextId(store.devices.map((item) => item.idDevice));
    const created = {
      ...store.devices[0],
      ...body,
      idDevice,
      available: body.available ?? true,
      idStatus: body.idStatus ?? 1,
      deviceType:
        body.deviceType ||
        ({
          1: "Bracelet",
          2: "Panic Button",
          3: "Cell Phone",
        }[body.idDeviceType as number] || "Device"),
    };
    store.devices.unshift(created);
    store.devicePositionsByKey[created.description] = [
      makePosition(created.idPerson || 0, 25.6866, -100.3161, created.idDeviceType),
    ];
    return success(created);
  }

  if (path === "User") {
    const idPerson = nextId(store.users.map((item) => item.idPerson));
    const roleName =
      ({
        1: "OTC Administrator",
        2: "County Administrator",
        3: "Officer",
        4: "Monitoring Center Supervisor",
        5: "Monitoring Center Agent",
      }[body.idRole as number] || "Officer");
    const created = {
      ...store.users[0],
      ...body,
      idPerson,
      idDefendant: 0,
      created_at: nowIso(),
      role: body.role || roleName,
      userName: body.userName || `user.${idPerson}`,
      sid: body.sid || `USR-${idPerson}`,
      phone: body.phone || "555-0199",
    };
    store.users.unshift(created);
    return success(created);
  }

  if (path === "AlarmType") {
    const idAlarmType = nextId(store.alarms.map((item) => item.idAlarmType));
    const created = {
      ...store.alarms[0],
      ...body,
      idAlarmType,
      idStatus: body.idStatus ?? 1,
    };
    store.alarms.unshift(created);
    return success(created);
  }

  if (path === "Common/Notification") {
    const idNotification = nextId(store.notifications.map((item) => item.idNotification));
    const defendant = findPerson(Number(body.idPerson || body.idDefendant || 101));
    const notification = {
      idNotification,
      idDefendant: defendant?.idDefendant || 101,
      idOfficer: defendant?.idOfficer || 2,
      message: body.message || body.description || "Notificación demo generada",
      officer: defendant?.officer || "Laura Sanchez",
      defendant: defendant ? `${defendant.name} ${defendant.lastName}` : "Demo",
      idStatus: 1,
      fecAlta: nowIso(),
    };
    store.notifications.unshift(notification);
    return success(notification);
  }

  if (path === "Message/Communication") {
    const communication = {
      idPerson: Number(body.idPerson || 0),
      idTypeCommunication: Number(body.idTypeCommunication || 1),
      typeCommunication: body.typeCommunication || "Call",
      message: body.message || "Comunicación demo",
      fecAlta: nowIso(),
    };
    store.communications.unshift(communication);
    return success(communication);
  }

  if (path === "Common/Comment") {
    const idComment = nextId(store.comments.map((item) => item.idComment));
    const comment = {
      idComment,
      idPerson: Number(body.idPerson || 0),
      message: body.message || body.comment || "Comentario demo",
      fecAlta: nowIso(),
    };
    store.comments.unshift(comment);
    return success(comment);
  }

  if (path === "Address") {
    const idAddress = nextId(store.addresses.map((item) => item.idAddress));
    const address = {
      ...store.addresses[0],
      ...body,
      idAddress,
    };
    store.addresses.unshift(address);
    return success(address);
  }

  if (path === "Phone") {
    const idPhone = nextId(store.phones.map((item) => item.idPhone));
    const phone = {
      idPhone,
      idPerson: Number(body.idPerson || 0),
      phone: body.phone || body.description || "555-9999",
      description: body.description || "Demo",
    };
    store.phones.unshift(phone);
    return success(phone);
  }

  if (path === "SpecificAlarm") {
    const idSpecificAlarm = nextId(store.specificAlarms.map((item) => item.idSpecificAlarm));
    const alarm =
      store.alarms.find((item) => item.idAlarmType === Number(body.idAlarmType)) || store.alarms[0];
    const specificAlarm = {
      idSpecificAlarm,
      idPerson: Number(body.idPerson || 0),
      idSpecificAlarmType: Number(body.idSpecificAlarmType || 1),
      specificAlarmType: body.specificAlarmType || "Entry restriction",
      idAlarmType: alarm.idAlarmType,
      alarmName: alarm.description,
      idStatus: body.idStatus ?? 1,
    };
    store.specificAlarms.unshift(specificAlarm);
    return success(specificAlarm);
  }

  if (path === "SpecificAlarmException") {
    const idSpecificAlarmException = nextId(
      store.scheduleAlarms.map((item) => item.idSpecificAlarmException)
    );
    const schedule = {
      idSpecificAlarmException,
      idSpecificAlarm: Number(body.idSpecificAlarm || 1),
      idPerson: Number(body.idPerson || 0),
      days: body.days || "Mon,Tue,Wed",
      dateInit: body.dateInit || nowIso(),
      dateFin: body.dateFin || nowIso(),
      idStatus: body.idStatus ?? 1,
    };
    store.scheduleAlarms.unshift(schedule);
    return success(schedule);
  }

  if (path === "PersonDevice") {
    const idPerson = Number(body.idPerson || body.idDefendant || 0);
    const idDevice = Number(body.idDevice || 0);
    store.deviceAssignments[idPerson] = Array.from(
      new Set([...(store.deviceAssignments[idPerson] || []), idDevice])
    );
    const device = store.devices.find((item) => item.idDevice === idDevice);
    if (device) {
      device.idPerson = idPerson;
      device.available = false;
    }
    return success(true);
  }

  if (path === "PersonDevice/Change") {
    const idPerson = Number(body.idPerson || body.idDefendant || 0);
    const idDevice = Number(body.idDevice || 0);
    store.deviceAssignments[idPerson] = [idDevice];
    store.devices.forEach((device) => {
      if (device.idPerson === idPerson && device.idDevice !== idDevice) {
        device.available = true;
      }
      if (device.idDevice === idDevice) {
        device.idPerson = idPerson;
        device.available = false;
      }
    });
    return success(true);
  }

  if (path === "Defendant/CaseNumber") {
    const idPerson = Number(body.idPerson || 0);
    const current = store.caseNumbersByPerson[idPerson] || [];
    const item = {
      idCaseNumber: nextId(current.map((entry) => entry.idCaseNumber)),
      caseNumber: body.caseNumber || `CASE-${new Date().getFullYear()}-${idPerson}`,
    };
    store.caseNumbersByPerson[idPerson] = [item, ...current];
    return success(item);
  }

  if (path === "Position/Historic" || path === "Position/HistoricDeleted") {
    const idPerson = Number(body.idPerson || body.idDefendant || 0);
    const person = findPerson(idPerson);
    const history = store.positionsByPerson[idPerson] || [];
    const relatedVictims = (store.victimAssignments[idPerson] || [])
      .map((victimId) => store.victims.find((victim) => victim.idPerson === victimId))
      .filter(Boolean)
      .map((victim) => ({
        ...victim,
        completeName: `${victim!.name} ${victim!.lastName}`,
        historicPersonPosition: store.positionsByPerson[victim!.idPerson] || [],
        geofences: [],
        showalerts: false,
      }));

    return success([
      {
        ...person,
        completeName: person ? `${person.name} ${person.lastName}` : "Demo User",
        historicPersonPosition: history,
        geofences: [
          {
            idGeofence: 1,
            idAlarmType: 3,
            name: "Zona de inclusión",
            geofence: encodeGeoFence(
              history[history.length - 1]?.lat || 25.6866,
              history[history.length - 1]?.lon || -100.3161,
              {
                name: "Zona de inclusión",
                radius: 220,
                category: "inclusion",
              }
            ),
          },
          {
            idGeofence: 2,
            idAlarmType: 2,
            name: "Zona de exclusión",
            geofence: encodeGeoFence(
              (history[history.length - 1]?.lat || 25.6866) +
                exclusionCenterOffset.lat,
              (history[history.length - 1]?.lon || -100.3161) +
                exclusionCenterOffset.lon,
              {
                name: "Zona de exclusión",
                radius: 110,
                category: "exclusion",
              }
            ),
          },
        ],
        showalerts: person?.showalerts ?? false,
      },
      ...relatedVictims,
    ]);
  }

  if (path === "Device/HistoricPosition") {
    const key = String(body.deviceId || body.imei || body.idPerson || "");
    return success(store.devicePositionsByKey[key] || []);
  }

  if (
    path === "Position/ShowAlert" ||
    path === "Common/SMS" ||
    path === "Defendant/AlarmDetail"
  ) {
    return success(true);
  }

  if (path === "ReferencePerson") {
    const idReferencePerson = nextId(store.references.map((item) => item.idReferencePerson));
    const reference = {
      idReferencePerson,
      idDefendant: Number(body.idDefendant || 0),
      fullName: body.fullName || body.name || "Referencia demo",
      phone: body.phone || "555-4009",
      relationship: body.relationship || "Friend",
    };
    store.references.unshift(reference);
    return success(reference);
  }

  if (path.includes("/attachment")) {
    return success({
      idAttachment: 1,
      fileName: "archivo-demo.pdf",
    });
  }

  return success(true);
};

const handlePut = (path: string, options?: ApiOptions) => {
  const body = options?.json || {};

  if (path === "Defendant") {
    const idPerson = Number(body.idPerson);
    const collection = [...store.defendants, ...store.inactiveDefendants];
    const person = collection.find((item) => item.idPerson === idPerson);
    if (!person) return failure("Defendant not found", 404);
    Object.assign(person, body);
    return success(person);
  }

  if (path === "Victim") {
    const victim = store.victims.find((item) => item.idPerson === Number(body.idPerson));
    if (!victim) return failure("Victim not found", 404);
    Object.assign(victim, body);
    return success(victim);
  }

  if (path === "Device") {
    const device = store.devices.find((item) => item.idDevice === Number(body.idDevice));
    if (!device) return failure("Device not found", 404);
    Object.assign(device, body);
    return success(device);
  }

  if (path === "User") {
    const user = store.users.find((item) => item.idPerson === Number(body.idPerson));
    if (!user) return failure("User not found", 404);
    Object.assign(user, body);
    return success(user);
  }

  if (path === "AlarmType") {
    const alarm = store.alarms.find((item) => item.idAlarmType === Number(body.idAlarmType));
    if (!alarm) return failure("Alarm not found", 404);
    Object.assign(alarm, body);
    return success(alarm);
  }

  if (path === "Common/Comment") {
    const comment = store.comments.find((item) => item.idComment === Number(body.idComment));
    if (!comment) return success(true);
    Object.assign(comment, body, { fecAlta: nowIso() });
    return success(comment);
  }

  if (path === "Address") {
    const address = store.addresses.find((item) => item.idAddress === Number(body.idAddress));
    if (!address) return failure("Address not found", 404);
    Object.assign(address, body);
    return success(address);
  }

  if (
    path === "Defendant/CaseNumber" ||
    path === "Defendant/AlarmDetail" ||
    path === "Common/Notification"
  ) {
    return success(true);
  }

  if (path === "ReferencePerson") {
    const reference = store.references.find(
      (item) => item.idReferencePerson === Number(body.idReferencePerson)
    );
    if (!reference) return failure("Reference not found", 404);
    Object.assign(reference, body);
    return success(reference);
  }

  return success(true);
};

const handleDelete = (path: string, options?: ApiOptions) => {
  const body = options?.json || {};

  if (path === "Defendant") {
    const idPerson = Number(body.idPerson || body.idDefendant);
    const index = store.defendants.findIndex((item) => item.idPerson === idPerson);
    if (index >= 0) {
      const [removed] = store.defendants.splice(index, 1);
      removed.idStatus = 0;
      store.inactiveDefendants.unshift(removed);
    }
    return success(true);
  }

  if (path === "Victim") {
    const idPerson = Number(body.idPerson || body.idVictim);
    store.victims = store.victims.filter((item) => item.idPerson !== idPerson);
    Object.keys(store.victimAssignments).forEach((key) => {
      store.victimAssignments[Number(key)] = (store.victimAssignments[Number(key)] || []).filter(
        (victimId) => victimId !== idPerson
      );
    });
    return success(true);
  }

  if (path === "User") {
    const idPerson = Number(body.idPerson || body.idUser);
    store.users = store.users.filter((item) => item.idPerson !== idPerson);
    return success(true);
  }

  if (path.startsWith("Device/")) {
    const idDevice = Number(path.split("/").pop());
    store.devices = store.devices.filter((item) => item.idDevice !== idDevice);
    Object.keys(store.deviceAssignments).forEach((key) => {
      store.deviceAssignments[Number(key)] = (store.deviceAssignments[Number(key)] || []).filter(
        (deviceId) => deviceId !== idDevice
      );
    });
    return success(true);
  }

  if (path.startsWith("AlarmType/")) {
    const idAlarmType = Number(path.split("/").pop());
    store.alarms = store.alarms.filter((item) => item.idAlarmType !== idAlarmType);
    return success(true);
  }

  if (path.startsWith("Address/")) {
    const idAddress = Number(path.split("/").pop());
    store.addresses = store.addresses.filter((item) => item.idAddress !== idAddress);
    return success(true);
  }

  if (path.startsWith("Phone/")) {
    const idPhone = Number(path.split("/").pop());
    store.phones = store.phones.filter((item) => item.idPhone !== idPhone);
    return success(true);
  }

  if (path.startsWith("PersonDevice/")) {
    const idDevice = Number(path.split("/").pop());
    Object.keys(store.deviceAssignments).forEach((key) => {
      store.deviceAssignments[Number(key)] = (store.deviceAssignments[Number(key)] || []).filter(
        (deviceId) => deviceId !== idDevice
      );
    });
    const device = store.devices.find((item) => item.idDevice === idDevice);
    if (device) device.available = true;
    return success(true);
  }

  if (path.startsWith("SpecificAlarm/")) {
    const idSpecificAlarm = Number(path.split("/").pop());
    store.specificAlarms = store.specificAlarms.filter((item) => item.idSpecificAlarm !== idSpecificAlarm);
    return success(true);
  }

  if (path.startsWith("SpecificAlarmException/")) {
    const idException = Number(path.split("/").pop());
    store.scheduleAlarms = store.scheduleAlarms.filter(
      (item) => item.idSpecificAlarmException !== idException
    );
    return success(true);
  }

  if (path.startsWith("Defendant/CaseNumber/")) {
    const idCaseNumber = Number(path.split("/").pop());
    Object.keys(store.caseNumbersByPerson).forEach((key) => {
      store.caseNumbersByPerson[Number(key)] = (store.caseNumbersByPerson[Number(key)] || []).filter(
        (item) => item.idCaseNumber !== idCaseNumber
      );
    });
    return success(true);
  }

  if (path.startsWith("ReferencePerson/")) {
    const idReference = Number(path.split("/").pop());
    store.references = store.references.filter((item) => item.idReferencePerson !== idReference);
    return success(true);
  }

  return success(true);
};

const request = (method: HttpMethod, path: string, options?: ApiOptions) => {
  switch (method) {
    case "GET":
      return handleGet(path, options);
    case "POST":
      return handlePost(path, options);
    case "PUT":
      return handlePut(path, options);
    case "DELETE":
      return handleDelete(path, options);
    default:
      return failure("Unsupported method", 405);
  }
};

export const createMockApi = (): DemoApiClient => ({
  get: (url, options) => request("GET", url, options),
  post: (url, options) => request("POST", url, options),
  put: (url, options) => request("PUT", url, options),
  delete: (url, options) => request("DELETE", url, options),
});
