import { Button, Chip, Tooltip } from "@nextui-org/react";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { UserManage } from "../../../domain/entities/userManage";
import * as Icon from "react-feather";
// import dayjs from "dayjs";
// import { useEffect, useState } from "react";

export type ManagementUsersTableProps = {
  items?: UserManage[];
  onEdit: (params: RenderFnParams<UserManage>) => void;
  onDelete: (params: RenderFnParams<UserManage>) => void;
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

const NamUserColumn = (params: RenderFnParams<UserManage>) => {
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

const RoleUserColumn = (params: RenderFnParams<UserManage>) => {
  return (
    <Chip color="primary" variant="shadow">
      {params.record.role}
    </Chip>
  );
};

const EmailUserColumn = (params: RenderFnParams<UserManage>) => {
  return (
    <Chip color="warning" variant="shadow">
      {params.record.eMail}
    </Chip>
  );
};

const ActionsColumn = ({
  onEdit,
  // record,
  onDelete,
}: RenderFnParams<UserManage> & {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
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
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppManagementUsersTable = ({
  items = [],
  onEdit,
  onDelete,
}: ManagementUsersTableProps) => {
  const columns: AppDataGridColumn<UserManage>[] = [
    {
      key: "userName",
      dataIndex: "userName",
      title: "User Name",
      render: NamUserColumn,
    },
    {
      key: "roleUser",
      dataIndex: "roleUser",
      title: "Role",
      render: RoleUserColumn,
    },
    {
      key: "emailUser",
      dataIndex: "emailUser",
      title: "Email",
      render: EmailUserColumn,
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
    <AppDataGrid<UserManage>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
