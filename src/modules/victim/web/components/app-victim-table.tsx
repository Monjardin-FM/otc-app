import * as Icon from "react-feather";
import { Victim } from "../../domain/entities/victim";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../presentation/Components/AppAvatar";
import { AppBadge } from "../../../../presentation/Components/AppBadge";
import { AppButton } from "../../../../presentation/Components/AppButton";
import { AppTooltip } from "../../../../presentation/Components/AppTooltip";

export type VictimsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  items?: Victim[];
  onEdit: (params: RenderFnParams<Victim>) => void;
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
      <div>
        <div className="font-semibold tracking-wider">
          {`${params.record.name} ${params.record.lastName}`}
        </div>
      </div>
    </div>
  );
};

const EmailVictimsColumn = (params: RenderFnParams<Victim>) => {
  return (
    <AppBadge colorScheme="primary">
      <div className="font-medium text-sm">{params.record.eMail}</div>
    </AppBadge>
  );
};
const StatusVictimsColumn = (params: RenderFnParams<Victim>) => {
  return (
    <AppBadge colorScheme="primary">
      <div className="font-medium text-sm">{params.record.idStatus}</div>
    </AppBadge>
  );
};

const ActionsColumn = ({
  onEdit,
}: // record,
RenderFnParams<Victim> & {
  onEdit: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onEdit();
          }}
          title="Edit Victim"
          size="sm"
          variant="ghost"
          colorScheme="red"
        >
          <Icon.Eye size={18} />
        </AppButton>
        <AppTooltip>Delete Victim</AppTooltip>
      </div>
    </div>
  );
};

export const AppVictimssTable = ({ items = [], onEdit }: VictimsTableProps) => {
  const columns: AppDataGridColumn<Victim>[] = [
    {
      key: "VictimsName",
      dataIndex: "VictimsName",
      title: "Name",
      render: NameVictimsColumn,
    },
    {
      key: "VictimsNumber",
      dataIndex: "VictimsNumber",
      title: "Email",
      render: EmailVictimsColumn,
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
        }),
    },
  ];
  return (
    <AppDataGrid<Victim> columns={columns} dataSource={items} itemKey="id" />
  );
};
