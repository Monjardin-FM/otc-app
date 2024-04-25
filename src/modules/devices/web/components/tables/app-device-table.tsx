import * as Icon from "react-feather";
import { Device } from "../../../domain/entities/device";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { AppTooltip } from "../../../../../presentation/Components/AppTooltip";
import { AppBadge } from "../../../../../presentation/Components/AppBadge";
import { AppButton } from "../../../../../presentation/Components/AppButton";
export type DevicessTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  items?: Device[];
  onEdit: (params: RenderFnParams<Device>) => void;
  onDelete: (params: RenderFnParams<Device>) => void;

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

const NameDevicesColumn = (params: RenderFnParams<Device>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.description.length,
          })}
        >
          <Icon.User size={20} />
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

const StatusDevicesColumn = (params: RenderFnParams<Device>) => {
  return (
    <div className="font-medium text-sm">
      {params.record.idStatus === 1 ? (
        <div className="bg-success-300 rounded-lg p-2 text-success-600 group relative inline-block text-center">
          <Icon.Circle size={18} />
          <AppTooltip>Active</AppTooltip>
        </div>
      ) : (
        <div className="bg-red-300 rounded-lg p-2 text-red-600  group relative inline-block text-center">
          <Icon.AlertTriangle size={18} />
          <AppTooltip>Inactive</AppTooltip>
        </div>
      )}
    </div>
  );
};
const NumberDevicesColumn = (params: RenderFnParams<Device>) => {
  return (
    <AppBadge>
      <div className="font-semibold text-sm text-primary-600 tracking-wider">
        {params.record.description}
      </div>
    </AppBadge>
  );
};

const ActionsColumn = ({
  onEdit,
  // record,
  onDelete,
}: RenderFnParams<Device> & {
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
          title="Edit Device"
          size="sm"
          variant="ghost"
        >
          <Icon.Eye size={18} />
        </AppButton>
        <AppTooltip>Edit Device</AppTooltip>
      </div>
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onDelete();
          }}
          title="Delete Device"
          size="sm"
          variant="ghost"
        >
          <Icon.Trash size={18} />
        </AppButton>
        <AppTooltip>Delete Device</AppTooltip>
      </div>
    </div>
  );
};

export const AppDevicessTable = ({
  items = [],
  onEdit,
  onDelete,
}: DevicessTableProps) => {
  const columns: AppDataGridColumn<Device>[] = [
    {
      key: "DevicesName",
      dataIndex: "DevicesName",
      title: "Name",
      render: NameDevicesColumn,
    },
    {
      key: "DevicesStatus",
      dataIndex: "DevicesStatus",
      title: "Status",
      render: StatusDevicesColumn,
    },
    {
      key: "DevicesNumber",
      dataIndex: "DevicesNumber",
      title: "Number/EMAI",
      render: NumberDevicesColumn,
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
    <AppDataGrid<Device> columns={columns} dataSource={items} itemKey="id" />
  );
};
