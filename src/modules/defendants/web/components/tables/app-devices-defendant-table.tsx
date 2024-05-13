import { Button, Chip, Tooltip } from "@nextui-org/react";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { DefendantDevice } from "../../../domain/entities/defendant-device";
import * as Icon from "react-feather";
import clsx from "clsx";
export type DefendantDevicesTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;

  items?: DefendantDevice[];
  onEdit: (params: RenderFnParams<DefendantDevice>) => void;
  onDelete: (params: RenderFnParams<DefendantDevice>) => void;
  loadingDeleteDefendantDevice: boolean;
  isCreate: boolean;
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

const NamDefendantDeviceColumn = (params: RenderFnParams<DefendantDevice>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.deviceType.length,
          })}
        >
          <Icon.User size={20} />
        </AppAvatar>
      </div>
      <div>
        <div className="font-semibold tracking-wider">
          {params.record.deviceType}
        </div>
      </div>
    </div>
  );
};

const StatusDefendantDeviceColumn = (
  params: RenderFnParams<DefendantDevice>
) => {
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
        <Icon.Circle size={10} />
      </Chip>
    </Tooltip>
  );
};

const ActionsColumn = ({
  // onEdit,
  isCreate,
  onDelete,
  loadingDeleteDefendantDevice,
}: // record,
RenderFnParams<DefendantDevice> & {
  onEdit: () => void;
  onDelete: () => void;
  loadingDeleteDefendantDevice: boolean;
  isCreate: boolean;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-2 static">
      <Tooltip
        content={"Delete Device"}
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
          title="Delete Device"
          size="sm"
          variant="shadow"
          color="danger"
          isIconOnly
          isDisabled={loadingDeleteDefendantDevice || isCreate}
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppDefendantDevicesTable = ({
  items = [],
  onEdit,
  onDelete,
  loadingDeleteDefendantDevice,
  isCreate,
}: DefendantDevicesTableProps) => {
  const columns: AppDataGridColumn<DefendantDevice>[] = [
    {
      key: "DefendantDeviceName",
      dataIndex: "DefendantDeviceName",
      title: "Device",
      render: NamDefendantDeviceColumn,
    },

    {
      key: "DefendantDeviceStatus",
      dataIndex: "DefendantDeviceStatus",
      title: "Status",
      render: StatusDefendantDeviceColumn,
    },
    {
      key: "actionsClient",
      dataIndex: "actionsClient",
      title: "Actions",
      className: clsx("", {
        hidden: isCreate,
      }),
      render: (data) =>
        ActionsColumn({
          ...data,
          onEdit: () => {
            onEdit(data);
          },
          onDelete: () => {
            onDelete(data);
          },
          loadingDeleteDefendantDevice: loadingDeleteDefendantDevice,
          isCreate: isCreate,
        }),
    },
  ];
  return (
    <AppDataGrid<DefendantDevice>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
