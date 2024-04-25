import * as Icon from "react-feather";
import { Defendant } from "../../../domain/entities/defendant";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { AppBadge } from "../../../../../presentation/Components/AppBadge";
import { AppTooltip } from "../../../../../presentation/Components/AppTooltip";
import { Button, Tooltip } from "@nextui-org/react";
export type DefendantsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;

  items?: Defendant[];
  onEdit: (params: RenderFnParams<Defendant>) => void;
  onDelete: (params: RenderFnParams<Defendant>) => void;
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

const NamDefendantColumn = (params: RenderFnParams<Defendant>) => {
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
      <div>
        <div className="font-semibold tracking-wider">{params.record.name}</div>
      </div>
    </div>
  );
};

const EmailDefendantColumn = (params: RenderFnParams<Defendant>) => {
  return (
    <AppBadge colorScheme="primary">
      <div className="font-medium text-sm">{params.record.eMail}</div>
    </AppBadge>
  );
};
const SIDDefendantColumn = (params: RenderFnParams<Defendant>) => {
  return (
    <AppBadge>
      <div className="font-semibold text-sm text-primary-600 tracking-wider">
        {params.record.sid}
      </div>
    </AppBadge>
  );
};

const CaseNumberDefendantColumn = (params: RenderFnParams<Defendant>) => {
  return (
    <AppBadge>
      <div className="font-semibold text-sm text-primary-600 tracking-wider">
        {params.record.caseNumber}
      </div>
    </AppBadge>
  );
};

const StatusDefendantColumn = (params: RenderFnParams<Defendant>) => {
  return (
    <div className="font-medium text-sm">
      {}
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

const ActionsColumn = ({
  onEdit,
  onDelete,
}: // record,
RenderFnParams<Defendant> & {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-3 static -z-50">
      <Tooltip
        content={"Edit Defendant"}
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
          title="Edit Defendant"
          size="sm"
          variant="light"
          isIconOnly
        >
          <Icon.Eye size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Delete Defendant"}
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
            onDelete();
          }}
          title="Delete Defendant"
          size="sm"
          variant="light"
          color="danger"
          isIconOnly
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppDefendantsTable = ({
  items = [],
  onEdit,

  onDelete,
}: DefendantsTableProps) => {
  const columns: AppDataGridColumn<Defendant>[] = [
    {
      key: "defendantName",
      dataIndex: "defendantName",
      title: "Name",
      render: NamDefendantColumn,
    },
    {
      key: "defendantEmail",
      dataIndex: "defendantEmail",
      title: "Email",
      render: EmailDefendantColumn,
    },
    {
      key: "defendantSID",
      dataIndex: "defendantSID",
      title: "SID",
      render: SIDDefendantColumn,
    },
    {
      key: "defendantCaseNumber",
      dataIndex: "defendantCaseNumber",
      title: "Case Number",
      render: CaseNumberDefendantColumn,
    },
    {
      key: "defendantStatus",
      dataIndex: "defendantStatus",
      title: "Status",
      render: StatusDefendantColumn,
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
    <AppDataGrid<Defendant> columns={columns} dataSource={items} itemKey="id" />
  );
};
