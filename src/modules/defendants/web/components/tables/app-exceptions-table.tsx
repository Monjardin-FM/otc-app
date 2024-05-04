import { Button, Chip, Tooltip } from "@nextui-org/react";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import {
  AlarmException,
  DateAlarmException,
  DayBasedAlarmException,
} from "../../../domain/entities/alarm-defendant-params";
import * as Icon from "react-feather";
export type AlarmExceptionTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;

  items?: AlarmException[];
  // onEdit: (params: RenderFnParams<AlarmException>) => void;
  onDelete: (params: RenderFnParams<AlarmException>) => void;
  // onNotification: (params: RenderFnParams<UserManage>) => void;
  // onUpdateAlmacen: (params: RenderFnParams<UserManage>) => void;
};
const getRandomColorSchema = (params: { length: number }) => {
  const colors: UIColorScheme[] = [
    "gray",
    "primary",
    "success",
    "info",
    "warn",
    "red",
  ];
  return colors[params.length % colors.length] || "gray";
};

const NameAlarmExceptionPersonColumn = (
  params: RenderFnParams<AlarmException>
) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.description.length,
          })}
        >
          <Icon.Map size={20} />
        </AppAvatar>
      </div>
      <div>
        <div className="font-semibold tracking-wider">
          {`${params.record.description}`}
        </div>
      </div>
    </div>
  );
};

const TypeAlarmExceptionPersonColumn = (
  params: RenderFnParams<AlarmException>
) => {
  return (
    <Chip
      color={params.record.alarmExceptionType === 1 ? "primary" : "warning"}
      variant="shadow"
    >
      <div className="font-semibold text-xs tracking-wider">
        {params.record.alarmExceptionType === 1 ? "Date range" : "Days"}
      </div>
    </Chip>
  );
};

const ActionsColumn = ({
  onDelete,
}: // record,
RenderFnParams<AlarmException> & {
  // onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-3 static -z-50">
      <Tooltip
        content={"Delete AlarmException"}
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
          title="Delete Alarm Exception"
          size="sm"
          variant="shadow"
          color="danger"
          isIconOnly
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppAlarmExceptionTable = ({
  items = [],
  // onEdit,
  onDelete,
}: AlarmExceptionTableProps) => {
  const columns: AppDataGridColumn<
    DateAlarmException | DayBasedAlarmException
  >[] = [
    {
      key: "AlarmExceptionPersonName",
      dataIndex: "AlarmExceptionPersonName",
      title: "AlarmException",
      render: NameAlarmExceptionPersonColumn,
    },
    {
      key: "AlarmExceptionType",
      dataIndex: "AlarmExceptionType",
      title: "AlarmException Type",
      render: TypeAlarmExceptionPersonColumn,
    },

    {
      key: "actionsClient",
      dataIndex: "actionsClient",
      title: "Actions",
      render: (data) =>
        ActionsColumn({
          ...data,
          // onEdit: () => {
          //   onEdit(data);
          // },
          onDelete: () => {
            onDelete(data);
          },
        }),
    },
  ];
  return (
    <AppDataGrid<DateAlarmException | DayBasedAlarmException>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
