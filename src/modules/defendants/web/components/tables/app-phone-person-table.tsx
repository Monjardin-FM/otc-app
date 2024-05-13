import { Button, Tooltip } from "@nextui-org/react";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { Phone } from "../../../domain/entities/phone";
import * as Icon from "react-feather";
import clsx from "clsx";

export type PhoneTableProps = {
  items?: Phone[];
  onEdit: (params: RenderFnParams<Phone>) => void;
  onDelete: (params: RenderFnParams<Phone>) => void;
  loadingDeletePhone: boolean;
  isCreate: boolean;
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

const NamPhoneColumn = (params: RenderFnParams<Phone>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.phone.length,
          })}
        >
          <Icon.User size={20} />
        </AppAvatar>
      </div>
      <div>
        <div className="font-semibold tracking-wider">
          {params.record.phone}
        </div>
      </div>
    </div>
  );
};

const ActionsColumn = ({
  // onEdit,
  onDelete,
  loadingDeletePhone,
}: //   isCreate,
// record,
RenderFnParams<Phone> & {
  onEdit: () => void;
  onDelete: () => void;
  loadingDeletePhone: boolean;
  isCreate: boolean;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-2 static">
      <Tooltip
        content={"Delete Phone"}
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
          title="Delete Phone"
          size="sm"
          variant="shadow"
          color="danger"
          isIconOnly
          isDisabled={loadingDeletePhone}
        >
          <Icon.Trash size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppPhoneTable = ({
  items = [],
  onEdit,
  onDelete,
  loadingDeletePhone,
  isCreate,
}: PhoneTableProps) => {
  const columns: AppDataGridColumn<Phone>[] = [
    {
      key: "PhoneName",
      dataIndex: "PhoneName",
      title: "Phone",
      render: NamPhoneColumn,
    },
    {
      key: "actionsClient",
      dataIndex: "actionsClient",
      title: "Actions",
      className: clsx("", {
        hidden: isCreate === true,
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
          loadingDeletePhone: loadingDeletePhone,
          isCreate: isCreate,
        }),
    },
  ];
  return (
    <AppDataGrid<Phone> columns={columns} dataSource={items} itemKey="id" />
  );
};
