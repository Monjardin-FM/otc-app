import * as Icon from "react-feather";
import { Device } from "../../../domain/entities/device";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { Button, Chip, Tooltip } from "@nextui-org/react";
export type DevicessTableProps = {
  items?: Device[];
  onEdit: (params: RenderFnParams<Device>) => void;
  onDelete: (params: RenderFnParams<Device>) => void;
  loadingDeleteDevice: boolean;
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
const NumberDevicesColumn = (params: RenderFnParams<Device>) => {
  return (
    <Chip variant="shadow" color="primary">
      <span className="font-semibold text-sm tracking-wider">
        {params.record.description}
      </span>
    </Chip>
  );
};

const ActionsColumn = ({
  onEdit,
  // record,
  onDelete,
  loadingDeleteDevice,
}: RenderFnParams<Device> & {
  onEdit: () => void;
  onDelete: () => void;
  loadingDeleteDevice: boolean;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
      <Tooltip
        content={"Edit Device"}
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
          title="Edit Device"
          size="sm"
          variant="shadow"
          isIconOnly
          color="primary"
        >
          <Icon.Edit size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Delete Device"}
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
          title="Delete Device"
          size="sm"
          variant="shadow"
          color="danger"
          isIconOnly
          isDisabled={loadingDeleteDevice}
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppDevicessTable = ({
  items = [],
  onEdit,
  onDelete,
  loadingDeleteDevice,
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
      title: "Number/IMEI",
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
          loadingDeleteDevice: loadingDeleteDevice,
        }),
    },
  ];
  return (
    <AppDataGrid<Device> columns={columns} dataSource={items} itemKey="id" />
  );
};
