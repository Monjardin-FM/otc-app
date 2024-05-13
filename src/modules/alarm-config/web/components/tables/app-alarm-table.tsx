import * as Icon from "react-feather";
import { Alarm } from "../../../domain/entities/alarms";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { Button, Chip, Tooltip } from "@nextui-org/react";

export type AlarmsTableProps = {
  items?: Alarm[];
  onEdit: (params: RenderFnParams<Alarm>) => void;
  onDelete: (params: RenderFnParams<Alarm>) => void;
  loadingDeleteAlarm: boolean;
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

const NameAlarmsColumn = (params: RenderFnParams<Alarm>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.description.length,
          })}
        >
          <Icon.Clock size={20} />
        </AppAvatar>
      </div>
      <div>
        <div className="font-semibold tracking-wider">
          {params.record.description}
        </div>
      </div>
    </div>
  );
};

const StatusAlarmsColumn = (params: RenderFnParams<Alarm>) => {
  return (
    <Tooltip
      content={params.record.idStatus === 1 ? "Active" : "Inactive"}
      color="primary"
      offset={15}
      showArrow
      closeDelay={10}
      disableAnimation
    >
      <Chip
        color={params.record.idStatus === 1 ? "success" : "danger"}
        variant="shadow"
        radius="full"
      >
        {params.record.idStatus === 1 ? (
          <Icon.Circle size={12} />
        ) : (
          <Icon.AlertTriangle size={12} />
        )}
      </Chip>
    </Tooltip>
  );
};

const ActionsColumn = ({
  onEdit,
  onDelete,
  loadingDeleteAlarm,
}: // record,
RenderFnParams<Alarm> & {
  onEdit: () => void;
  onDelete: () => void;
  loadingDeleteAlarm: boolean;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
      <Tooltip
        content={"Edit Alarm"}
        color="primary"
        style={{
          zIndex: 0,
        }}
        offset={1}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onEdit();
          }}
          title="Edit Alarm"
          size="sm"
          variant="shadow"
          isIconOnly
          color="primary"
        >
          <Icon.Edit size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Delete Alarm"}
        color="danger"
        style={{
          zIndex: 0,
        }}
        offset={1}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onDelete();
          }}
          title="Delete Alarm"
          size="sm"
          variant="shadow"
          color="danger"
          isIconOnly
          isDisabled={loadingDeleteAlarm}
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppAlarmssTable = ({
  items = [],
  onEdit,
  onDelete,
  loadingDeleteAlarm,
}: AlarmsTableProps) => {
  const columns: AppDataGridColumn<Alarm>[] = [
    {
      key: "AlarmsName",
      dataIndex: "AlarmsName",
      title: "Name",
      render: NameAlarmsColumn,
    },
    {
      key: "AlarmsStatus",
      dataIndex: "AlarmsStatus",
      title: "Status",
      render: StatusAlarmsColumn,
    },

    {
      key: "actionsClient",
      dataIndex: "actionsClient",
      title: "Actions",
      render: (data) =>
        ActionsColumn({
          ...data,
          onEdit: () => {
            onEdit(data);
          },
          onDelete: () => {
            onDelete(data);
          },
          loadingDeleteAlarm: loadingDeleteAlarm,
        }),
    },
  ];
  return (
    <AppDataGrid<Alarm> columns={columns} dataSource={items} itemKey="id" />
  );
};
