import * as Icon from "react-feather";
import { PersonAlert } from "../../../domain/entities/tracking-detail";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { AppBadge } from "../../../../../presentation/Components/AppBadge";
import { AppTooltip } from "../../../../../presentation/Components/AppTooltip";
import { AppButton } from "../../../../../presentation/Components/AppButton";

export type TrackingDetailsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  items?: PersonAlert[];
  onEdit: (params: RenderFnParams<PersonAlert>) => void;
  // onNotification: (params: RenderFnParams<UserManage>) => void;
  // onUpdateAlmacen: (params: RenderFnParams<UserManage>) => void;
};

const NameTrackingDetailColumn = (params: RenderFnParams<PersonAlert>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar colorSchema={"warn"}>
          <Icon.AlertCircle size={20} />
        </AppAvatar>
      </div>
      <div className="font-semibold text-sm text-primary-700 TrackingDetail-wider">
        {params.record.alarmName}
      </div>
    </div>
  );
};
const DateTrackingDetailColumn = (params: RenderFnParams<PersonAlert>) => {
  return (
    <div className="flex items-center space-x-3">
      <AppBadge colorScheme="info">
        <div className="font-semibold text-sm text-primary-600 TrackingDetail-wider">
          {params.record.timestamp}
        </div>
      </AppBadge>
    </div>
  );
};
const StatusTrackingDetailColumn = (params: RenderFnParams<PersonAlert>) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold TrackingDetail-wider">
        {params.record.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600 group relative inline-block text-center">
            <Icon.Circle size={18} />
            <AppTooltip>Active</AppTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionsColumn = ({
  onEdit,
}: // record,
RenderFnParams<PersonAlert> & {
  onEdit: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onEdit();
          }}
          title="Edit TrackingDetail"
          size="sm"
          variant="ghost"
          colorScheme="red"
        >
          <Icon.XCircle size={18} />
        </AppButton>
        <AppTooltip>Cancel Alarm</AppTooltip>
      </div>
    </div>
  );
};

export const AppTrackingDetailsTable = ({
  items = [],
  onEdit,
}: TrackingDetailsTableProps) => {
  const columns: AppDataGridColumn<PersonAlert>[] = [
    {
      key: "TrackingDetailName",
      dataIndex: "TrackingDetailName",
      title: "Type Alarm",
      render: NameTrackingDetailColumn,
    },
    {
      key: "TrackingDetailDate",
      dataIndex: "TrackingDetailDate",
      title: "Date",
      render: DateTrackingDetailColumn,
    },
    {
      key: "TrackingDetailStatus",
      dataIndex: "TrackingDetailStatus",
      title: "Status",
      render: StatusTrackingDetailColumn,
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
    <AppDataGrid<PersonAlert>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
