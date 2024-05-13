import * as Icon from "react-feather";
import { Victim } from "../../domain/entities/victim";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../presentation/Components/AppAvatar";
import { Button, Chip, Tooltip } from "@nextui-org/react";
import dayjs from "dayjs";

export type VictimsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  items?: Victim[];
  onEdit: (params: RenderFnParams<Victim>) => void;
  onAddAddress: (params: RenderFnParams<Victim>) => void;
  onShowAddress: (params: RenderFnParams<Victim>) => void;
  onDelete: (params: RenderFnParams<Victim>) => void;
  onAddPhone: (params: RenderFnParams<Victim>) => void;
  loadingDeleteVictim: boolean;
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

const NameVictimsColumn = (params: RenderFnParams<Victim>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.name.length,
          })}
        >
          <Icon.User size={20} />
        </AppAvatar>
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="font-semibold tracking-wider">
          {`${params.record.name} ${params.record.lastName}`}
        </span>
        <Chip color="primary" variant="dot" radius="md">
          <span className="text-xs">
            {dayjs(dayjs(params.record.birthDate).toDate()).format(
              "DD-MM-YYYY"
            )}
          </span>
        </Chip>
      </div>
    </div>
  );
};

const EmailVictimsColumn = (params: RenderFnParams<Victim>) => {
  return (
    <Chip color="primary" variant="shadow">
      <div className="font-medium text-sm">{params.record.eMail}</div>
    </Chip>
  );
};
const InfoVictimsColumn = (params: RenderFnParams<Victim>) => {
  return (
    <div className="flex flex-col items-start justify-center gap-1">
      <Chip color="success" variant="dot">
        <div className="flex flex-row font-medium text-sm">
          <span>{`sid: ${params.record.sid}`}</span>
        </div>
      </Chip>
      <Chip color="warning" variant="dot">
        <div className="flex flex-row font-medium text-sm">
          <span>{`Case Number: ${params.record.caseNumber}`}</span>
        </div>
      </Chip>
    </div>
  );
};
const StatusVictimsColumn = (params: RenderFnParams<Victim>) => {
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
  onEdit,
  onAddAddress,
  onShowAddress,
  onDelete,
  loadingDeleteVictim,
  onAddPhone,
}: // record,
RenderFnParams<Victim> & {
  onEdit: () => void;
  onAddAddress: () => void;
  onShowAddress: () => void;
  onDelete: () => void;
  loadingDeleteVictim: boolean;
  onAddPhone: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-3 static -z-50">
      <Tooltip
        content={"Edit Victim"}
        color="primary"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onEdit();
          }}
          title="Edit Victim"
          size="sm"
          variant="shadow"
          isIconOnly
          color="primary"
        >
          <Icon.Edit size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Add Address"}
        color="success"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onAddAddress();
          }}
          title="Add Address"
          size="sm"
          variant="shadow"
          color="success"
          isIconOnly
        >
          <span className="text-md">+</span>
          <Icon.Map size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Add Phone"}
        color="success"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onAddPhone();
          }}
          title="Add Phone"
          size="sm"
          variant="shadow"
          color="success"
          isIconOnly
        >
          <span className="text-md">+</span>
          <Icon.PhoneCall size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Show Address"}
        color="warning"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onShowAddress();
          }}
          title="Show Address"
          size="sm"
          variant="shadow"
          color="warning"
          isIconOnly
        >
          <Icon.Eye size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Delete Victim"}
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
          title="Delete Victim"
          size="sm"
          variant="shadow"
          color="danger"
          isIconOnly
          isDisabled={loadingDeleteVictim}
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppVictimssTable = ({
  items = [],
  onEdit,
  onDelete,
  onAddAddress,
  onShowAddress,
  loadingDeleteVictim,
  onAddPhone,
}: VictimsTableProps) => {
  const columns: AppDataGridColumn<Victim>[] = [
    {
      key: "VictimsName",
      dataIndex: "VictimsName",
      title: "Name",
      render: NameVictimsColumn,
    },
    {
      key: "VictimsEmail",
      dataIndex: "VictimsEmail",
      title: "Email",
      render: EmailVictimsColumn,
    },
    {
      key: "VictimsInfo",
      dataIndex: "VictimsInfo",
      title: "Info",
      render: InfoVictimsColumn,
    },
    {
      key: "VictimsStatus",
      dataIndex: "VictimsStatus",
      title: "Status",
      render: StatusVictimsColumn,
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
          onAddAddress: () => {
            onAddAddress(data);
          },
          onShowAddress: () => {
            onShowAddress(data);
          },
          onAddPhone: () => {
            onAddPhone(data);
          },
          loadingDeleteVictim: loadingDeleteVictim,
        }),
    },
  ];
  return (
    <AppDataGrid<Victim> columns={columns} dataSource={items} itemKey="id" />
  );
};
