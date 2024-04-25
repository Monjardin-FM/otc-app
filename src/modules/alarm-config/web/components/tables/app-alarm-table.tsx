import * as Icon from "react-feather";
import { Alarm } from "../../../domain/entities/alarms";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { AppTooltip } from "../../../../../presentation/Components/AppTooltip";
import { AppButton } from "../../../../../presentation/Components/AppButton";

export type AlarmsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  items?: Alarm[];
  onEdit: (params: RenderFnParams<Alarm>) => void;
  onDelete: (params: RenderFnParams<Alarm>) => void;
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
    <div className="font-medium text-sm">
      {params.record.idStatus === 1 ? (
        <div className="bg-success-300 rounded-lg p-2 text-success-600 group relative inline-block text-center">
          <Icon.Circle size={18} />
          <AppTooltip>Active</AppTooltip>
        </div>
      ) : (
        <div className="bg-danger-300 rounded-lg p-2 text-danger-600  group relative inline-block text-center">
          <Icon.AlertTriangle size={18} />
          <AppTooltip>Inactive</AppTooltip>
        </div>
      )}
    </div>
  );
};

const ActionsColumn = ({
  onEdit,
  onDelete,
}: // record,
RenderFnParams<Alarm> & {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onEdit();
          }}
          title="Edit Alarm"
          size="sm"
          variant="ghost"
        >
          <Icon.Eye size={18} />
        </AppButton>
        <AppTooltip>Edit Alarm</AppTooltip>
      </div>
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onDelete();
          }}
          title="Delete Alarm"
          size="sm"
          variant="ghost"
          colorScheme="red"
        >
          <Icon.XOctagon size={18} />
        </AppButton>
        <AppTooltip>Delete Alarm</AppTooltip>
      </div>
    </div>
  );
};

export const AppAlarmssTable = ({
  items = [],
  onEdit,
  onDelete,
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
        }),
    },
  ];
  return (
    <AppDataGrid<Alarm> columns={columns} dataSource={items} itemKey="id" />
  );
};
