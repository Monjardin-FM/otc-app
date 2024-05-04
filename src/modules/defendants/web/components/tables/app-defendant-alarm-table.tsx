import { Button, Chip, Tooltip } from "@nextui-org/react";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AlarmDefendant } from "../../../domain/entities/alarm-defendant";
import * as Icon from "react-feather";
export type AlarmDefendantsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;

  items?: AlarmDefendant[];
  // onEdit: (params: RenderFnParams<AlarmDefendant>) => void;
  onDelete: (params: RenderFnParams<AlarmDefendant>) => void;
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

const NameAlarmDefendantColumn = (params: RenderFnParams<AlarmDefendant>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.specificAlarmType.length,
          })}
        >
          <Icon.Bell size={20} />
        </AppAvatar>
      </div>
      <div>
        <div className="font-semibold tracking-wider">
          {params.record.specificAlarmType}
        </div>
      </div>
    </div>
  );
};

const StatusAlarmDefendantColumn = (params: RenderFnParams<AlarmDefendant>) => {
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
  //   onEdit,
  onDelete,
}: // record,
RenderFnParams<AlarmDefendant> & {
  //   onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-3 static -z-50">
      {/* <Tooltip
        content={"Edit AlarmDefendant"}
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
          title="Edit AlarmDefendant"
          size="sm"
          variant="shadow"
          isIconOnly
          color="primary"
        >
          <Icon.Edit size={18} />
        </Button>
      </Tooltip> */}
      <Tooltip
        content={"Delete Alarm Defendant"}
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
          title="Delete Alarm Defendant"
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

export const AppAlarmDefendantsTable = ({
  items = [],
  //   onEdit,
  onDelete,
}: AlarmDefendantsTableProps) => {
  const columns: AppDataGridColumn<AlarmDefendant>[] = [
    {
      key: "AlarmDefendantName",
      dataIndex: "AlarmDefendantName",
      title: "Alarm Defendant",
      render: NameAlarmDefendantColumn,
    },
    // {
    //   key: "AlarmDefendantType",
    //   dataIndex: "AlarmDefendantType",
    //   title: "AlarmDefendant Type",
    //   render: TypeAlarmDefendantColumn,
    // },

    {
      key: "AlarmDefendantStatus",
      dataIndex: "AlarmDefendantStatus",
      title: "Status",
      render: StatusAlarmDefendantColumn,
    },
    {
      key: "actionsClient",
      dataIndex: "actionsClient",
      title: "Actions",
      render: (data) =>
        ActionsColumn({
          ...data,
          onDelete: () => {
            onDelete(data);
          },
        }),
    },
  ];
  return (
    <AppDataGrid<AlarmDefendant>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
