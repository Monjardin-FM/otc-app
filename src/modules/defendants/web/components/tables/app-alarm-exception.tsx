import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { Intervals } from "../../../domain/entities/alarm-defendant";
import { Chip } from "@nextui-org/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Importa el plugin UTC de Day.js
import timezone from "dayjs/plugin/timezone"; // Importa el plugin de zona horaria de Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
export type AlarmExceptionSchedulesTableProps = {
  items?: Intervals[];
};
const convertHour = (utcTime: string): string => {
  // Parsear la hora UTC como un objeto Date
  const utcDate = new Date(`2000-01-01T${utcTime}:00Z`); // Asignamos una fecha arbitraria ya que solo nos interesa la hora

  // Obtener el desplazamiento de la zona horaria local en minutos
  const offsetMinutes = new Date().getTimezoneOffset();

  // Aplicar el desplazamiento de la zona horaria local a la hora UTC
  const localTime = new Date(utcDate.getTime() - offsetMinutes * 60000);

  // Formatear la hora local en formato HH:mm
  const horaLocal = localTime.toISOString().slice(11, 16);

  return horaLocal;
};
const convertDaysWeek = (days: number[]): string => {
  const nameDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const daysNames = days.map((day) => nameDays[day - 1]);
  return daysNames.join(", ");
};
const DateInitAlarmExceptionScheduleColumn = (
  params: RenderFnParams<Intervals>
) => {
  return (
    <Chip color={"primary"} variant="shadow" radius="full">
      <span>{convertHour(params.record.start)}</span>
    </Chip>
  );
};
const DateFinishAlarmExceptionScheduleColumn = (
  params: RenderFnParams<Intervals>
) => {
  return (
    <Chip color={"primary"} variant="shadow" radius="full">
      <span>{convertHour(params.record.end)}</span>
    </Chip>
  );
};

const DateDaysAlarmExceptionScheduleColumn = (
  params: RenderFnParams<Intervals>
) => {
  return (
    <Chip color="warning" variant="shadow">
      {convertDaysWeek(params.record.days)}
    </Chip>
  );
};

export const AppAlarmExceptionSchedulesTable = ({
  items = [],
}: AlarmExceptionSchedulesTableProps) => {
  const columns: AppDataGridColumn<Intervals>[] = [
    {
      key: "DateInitAlarmExceptionScheduleColumn",
      dataIndex: "DateInitAlarmExceptionScheduleColumn",
      title: "Start",
      render: DateInitAlarmExceptionScheduleColumn,
    },
    {
      key: "DateFinishAlarmExceptionScheduleColumn",
      dataIndex: "DateFinishAlarmExceptionScheduleColumn",
      title: "End",
      render: DateFinishAlarmExceptionScheduleColumn,
    },
    {
      key: "DateDaysAlarmExceptionScheduleColumn",
      dataIndex: "DateDaysAlarmExceptionScheduleColumn",
      title: "Days",
      render: DateDaysAlarmExceptionScheduleColumn,
    },
  ];
  return (
    <AppDataGrid<Intervals> columns={columns} dataSource={items} itemKey="id" />
  );
};
