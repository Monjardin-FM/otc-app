import * as Icon from "react-feather";
import { ReferenceContact } from "../../../domain/entities/reference-contact";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { AppBadge } from "../../../../../presentation/Components/AppBadge";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import { AppTooltip } from "../../../../../presentation/Components/AppTooltip";

export type ReferenceContactsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  items?: ReferenceContact[];
  onEdit: (params: RenderFnParams<ReferenceContact>) => void;
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

const NamReferenceContactColumn = (
  params: RenderFnParams<ReferenceContact>
) => {
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

const EmailReferenceContactColumn = (
  params: RenderFnParams<ReferenceContact>
) => {
  return (
    <AppBadge colorScheme="primary">
      <div className="font-medium text-sm">{params.record.relationship}</div>
    </AppBadge>
  );
};
const SIDReferenceContactColumn = (
  params: RenderFnParams<ReferenceContact>
) => {
  return (
    <AppBadge>
      <div className="font-semibold text-sm text-primary-600 tracking-wider">
        {params.record.address}
      </div>
    </AppBadge>
  );
};

const CaseNumberReferenceContactColumn = (
  params: RenderFnParams<ReferenceContact>
) => {
  return (
    <AppBadge>
      <div className="font-semibold text-sm text-primary-600 tracking-wider">
        {params.record.phoneNumber}
      </div>
    </AppBadge>
  );
};

const ActionsColumn = ({
  onEdit,
}: // record,
RenderFnParams<ReferenceContact> & {
  onEdit: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onEdit();
          }}
          title="Edit User"
          size="sm"
          variant="ghost"
        >
          <Icon.Eye size={18} />
        </AppButton>
        <AppTooltip>Edit ReferenceContact</AppTooltip>
      </div>
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onEdit();
          }}
          title="Delete ReferenceContact"
          size="sm"
          variant="ghost"
        >
          <Icon.Trash size={18} />
        </AppButton>
        <AppTooltip>Delete ReferenceContact</AppTooltip>
      </div>
    </div>
  );
};

export const AppReferenceContactsTable = ({
  items = [],
  onEdit,
}: ReferenceContactsTableProps) => {
  const columns: AppDataGridColumn<ReferenceContact>[] = [
    {
      key: "ReferenceContactName",
      dataIndex: "ReferenceContactName",
      title: "Name",
      render: NamReferenceContactColumn,
    },
    {
      key: "ReferenceContactEmail",
      dataIndex: "ReferenceContactEmail",
      title: "Relationship",
      render: EmailReferenceContactColumn,
    },
    {
      key: "ReferenceContactSID",
      dataIndex: "ReferenceContactSID",
      title: "Address",
      render: SIDReferenceContactColumn,
    },
    {
      key: "ReferenceContactCaseNumber",
      dataIndex: "ReferenceContactCaseNumber",
      title: "Phone Number",
      render: CaseNumberReferenceContactColumn,
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
        }),
    },
  ];
  return (
    <AppDataGrid<ReferenceContact>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
