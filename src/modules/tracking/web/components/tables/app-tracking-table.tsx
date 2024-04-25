import * as Icon from "react-feather";
import { Tracking } from "../../../domain/entities/tracking";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import { AppButton } from "../../../../../presentation/Components/AppButton";
import { AppTooltip } from "../../../../../presentation/Components/AppTooltip";

export type TrackingsTableProps = {
  // onToggleStatus?: (index: Client) => void;
  // onUpdateClient: (data: Client) => void;
  items?: Tracking[];
  onEdit: (params: RenderFnParams<Tracking>) => void;
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
const NameTrackingColumn = (params: RenderFnParams<Tracking>) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.name.length,
          })}
        >
          <Icon.MapPin size={20} />
        </AppAvatar>
      </div>
      <div className="font-semibold text-sm text-primary-700 tracking-wider">
        {`${params.record.name} ${params.record.lastName}`}
      </div>
    </div>
  );
};

const CardioTrackingColumn = (params: RenderFnParams<Tracking>) => {
  const cardio = params.record.alerts.find(
    (alert) => alert.alarmName === "Bracelet Low Cardio"
  );
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold tracking-wider">
        {cardio && cardio.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600">
            <Icon.Circle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};
const TamperingTrackingColumn = (params: RenderFnParams<Tracking>) => {
  const tampering = params.record.alerts.find(
    (alert) => alert.alarmName === "Bracelet Tampering"
  );
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold tracking-wider">
        {tampering && tampering.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600">
            <Icon.Circle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

const BatteryTrackingColumn = (params: RenderFnParams<Tracking>) => {
  const battery = params.record.alerts.find(
    (alert) => alert.alarmName === "Device Battery Low"
  );
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold tracking-wider">
        {battery && battery.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600">
            <Icon.Circle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

const ExclusionTrackingColumn = (params: RenderFnParams<Tracking>) => {
  const exclusion = params.record.alerts.find(
    (alert) => alert.alarmName === "Exclusion Alarm"
  );
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold tracking-wider">
        {exclusion && exclusion.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600">
            <Icon.Circle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};
const PerimeterTrackingColumn = (params: RenderFnParams<Tracking>) => {
  const perimeter = params.record.alerts.find(
    (alert) => alert.alarmName === "Perimeter Alarm"
  );
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold tracking-wider">
        {perimeter && perimeter.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600">
            <Icon.Circle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};
const PositionTrackingColumn = (params: RenderFnParams<Tracking>) => {
  const positionTimeout = params.record.alerts.find(
    (alert) => alert.alarmName === "Position Timeout"
  );
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold tracking-wider">
        {positionTimeout && positionTimeout.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600">
            <Icon.Circle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};
const ProximityTrackingColumn = (params: RenderFnParams<Tracking>) => {
  const proximity = params.record.alerts.find(
    (alert) => alert.alarmName === "Proximity Alert"
  );
  return (
    <div className="flex items-center space-x-3">
      <div className="font-semibold tracking-wider">
        {proximity && proximity.seqMachineState ? (
          <div className="bg-danger-300 rounded-lg p-2 text-danger-600">
            <Icon.AlertTriangle size={18} />
          </div>
        ) : (
          <div className="bg-success-300 rounded-lg p-2 text-success-600">
            <Icon.Circle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

const ActionsColumn = ({
  onEdit,
}: // record,
RenderFnParams<Tracking> & {
  onEdit: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-8">
      <div className="group relative inline-block text-center">
        <AppButton
          onClick={() => {
            onEdit();
          }}
          title="Edit Tracking"
          size="sm"
          variant="ghost"
        >
          <Icon.Map size={18} />
        </AppButton>
        <AppTooltip>Tracking</AppTooltip>
      </div>
    </div>
  );
};

export const AppTrackingsTable = ({
  items = [],
  onEdit,
}: TrackingsTableProps) => {
  const columns: AppDataGridColumn<Tracking>[] = [
    {
      key: "TrackingName",
      dataIndex: "TrackingName",
      title: "Name",
      render: NameTrackingColumn,
    },
    {
      key: "TrackingCardio",
      dataIndex: "TrackingCardio",
      title: "Cardio",
      render: CardioTrackingColumn,
    },
    {
      key: "TrackingTampering",
      dataIndex: "TrackingTampering",
      title: "Tampering",
      render: TamperingTrackingColumn,
    },
    {
      key: "TrackingBattery",
      dataIndex: "TrackingBattery",
      title: "Battery",
      render: BatteryTrackingColumn,
    },
    {
      key: "TrackingExclusion",
      dataIndex: "TrackingExclusion",
      title: "Exclusion",
      render: ExclusionTrackingColumn,
    },
    {
      key: "TrackingPerimeter",
      dataIndex: "TrackingPerimeter",
      title: "Perimeter",
      render: PerimeterTrackingColumn,
    },
    {
      key: "TrackingPosition",
      dataIndex: "TrackingPosition",
      title: "Position",
      render: PositionTrackingColumn,
    },
    {
      key: "TrackingProximity",
      dataIndex: "TrackingProximity",
      title: "Proximity",
      render: ProximityTrackingColumn,
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
    <AppDataGrid<Tracking> columns={columns} dataSource={items} itemKey="id" />
  );
};
