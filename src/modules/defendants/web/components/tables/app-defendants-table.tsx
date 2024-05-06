import * as Icon from "react-feather";
import { Defendant } from "../../../domain/entities/defendant";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { Button, Chip, Tooltip } from "@nextui-org/react";
// import dayjs from "dayjs";
export type DefendantsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  loadingDeleteDefendant: boolean;
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
      <div className="flex flex-col items-start justify-center">
        <span className="font-semibold tracking-wider">
          {`${params.record.name} ${params.record.lastName}`}
        </span>
        {/* <Chip color="primary" variant="dot" radius="md">
          <span className="text-xs">
            {dayjs(dayjs(params.record.birthDate).toDate()).format(
              "DD-MM-YYYY"
            )}
          </span>
        </Chip> */}
      </div>
    </div>
  );
};

const EmailDefendantColumn = (params: RenderFnParams<Defendant>) => {
  return (
    <Chip color="primary" variant="shadow">
      <div className="font-medium text-sm">{params.record.eMail}</div>
    </Chip>
  );
};
const SIDDefendantColumn = (params: RenderFnParams<Defendant>) => {
  return (
    <Chip color="danger" variant="dot">
      <div className="font-semibold text-sm text-primary-600 tracking-wider">
        {params.record.sid}
      </div>
    </Chip>
  );
};

const CaseNumberDefendantColumn = (params: RenderFnParams<Defendant>) => {
  return (
    <Chip color="success" variant="dot">
      <div className="font-semibold text-sm text-primary-600 tracking-wider">
        {params.record.caseNumber}
      </div>
    </Chip>
  );
};

const StatusDefendantColumn = (params: RenderFnParams<Defendant>) => {
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
  loadingDeleteDefendant,
}: // record,
RenderFnParams<Defendant> & {
  onEdit: () => void;
  onDelete: () => void;
  loadingDeleteDefendant: boolean;
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
          variant="shadow"
          isIconOnly
          color="primary"
        >
          <Icon.Edit size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Delete Defendant"}
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
          title="Delete Defendant"
          size="sm"
          variant="shadow"
          color="danger"
          isIconOnly
          isDisabled={loadingDeleteDefendant}
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
  loadingDeleteDefendant,
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
          loadingDeleteDefendant: loadingDeleteDefendant,
        }),
    },
  ];
  return (
    <AppDataGrid<Defendant> columns={columns} dataSource={items} itemKey="id" />
  );
};
