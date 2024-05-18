import { Button, Chip, Tooltip } from "@nextui-org/react";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { ScheduleAlarm } from "../../../domain/entities/schedule-alarm";
import * as Icon from "react-feather";
import { DateInitParse } from "./date-init-parse";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Importa el plugin UTC de Day.js
import timezone from "dayjs/plugin/timezone"; // Importa el plugin de zona horaria de Day.js
import { DateFinishParse } from "./date-finish-parse";
import { DaysParse } from "./days-parse";

dayjs.extend(utc);
dayjs.extend(timezone);
export type ScheduleAlarmsTableProps = {
  items?: ScheduleAlarm[];
  onDelete: (params: RenderFnParams<ScheduleAlarm>) => void;
  loadingScheduleAlarm: boolean;
};

const DateInitAlarmExceptionScheduleColumn = (
  params: RenderFnParams<ScheduleAlarm>
) => {
  return (
    <>
      {params.record.strDays !== "" ? (
        <DateInitParse strDays={params.record.strDays} />
      ) : (
        <Chip color={"primary"} variant="shadow" radius="full">
          <span>
            {dayjs
              .utc(params.record.dateInit)
              .local()
              .format("MM/DD/YYYY HH:mm:ss A")}
          </span>
        </Chip>
      )}
    </>
  );
};
const DateFinishAlarmExceptionScheduleColumn = (
  params: RenderFnParams<ScheduleAlarm>
) => {
  return (
    <>
      {params.record.strDays !== "" ? (
        <DateFinishParse strDays={params.record.strDays}></DateFinishParse>
      ) : (
        <Chip color={"primary"} variant="shadow" radius="full">
          <span>
            {dayjs
              .utc(params.record.dateFinish)
              .local()
              .format("MM/DD/YYYY HH:mm:ss A")}
          </span>
        </Chip>
      )}
    </>
  );
};
const DaysAlarmExceptionScheduleColumn = (
  params: RenderFnParams<ScheduleAlarm>
) => {
  return (
    <>
      {params.record.strDays !== "" ? (
        <DaysParse strDays={params.record.strDays}></DaysParse>
      ) : (
        ""
      )}
    </>
  );
};

const ActionsColumn = ({
  onDelete,
  loadingScheduleAlarm,
}: RenderFnParams<ScheduleAlarm> & {
  onDelete: () => void;

  loadingScheduleAlarm: boolean;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-3 static -z-50">
      <Tooltip
        content={"Delete Schedule"}
        color="danger"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onDelete();
          }}
          title="Delete Schedule"
          size="sm"
          variant="shadow"
          isIconOnly
          color="danger"
          isDisabled={loadingScheduleAlarm}
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppScheduleAlarmsTable = ({
  items = [],
  onDelete,
  loadingScheduleAlarm,
}: ScheduleAlarmsTableProps) => {
  const columns: AppDataGridColumn<ScheduleAlarm>[] = [
    {
      key: "DateInitAlarmExceptionScheduleColumn",
      dataIndex: "DateInitAlarmExceptionScheduleColumn",
      title: "Date/Hour Init",
      render: DateInitAlarmExceptionScheduleColumn,
    },
    {
      key: "DateFinishAlarmExceptionScheduleColumn",
      dataIndex: "DateFinishAlarmExceptionScheduleColumn",
      title: "Date/Hour Finish",
      render: DateFinishAlarmExceptionScheduleColumn,
    },
    {
      key: "DaysAlarmExceptionScheduleColumn",
      dataIndex: "DaysAlarmExceptionScheduleColumn",
      title: "Days",
      render: DaysAlarmExceptionScheduleColumn,
    },
    {
      key: "actionsAlarmDefendant",
      dataIndex: "actionsAlarmDefendant",
      title: "Actions",
      //   className: clsx("", {
      //     hidden: isCreate,
      //   }),
      render: (data) =>
        ActionsColumn({
          ...data,
          onDelete: () => {
            onDelete(data);
          },
          loadingScheduleAlarm: loadingScheduleAlarm,
        }),
    },
  ];
  return (
    <AppDataGrid<ScheduleAlarm>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
