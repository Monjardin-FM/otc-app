import { Button, Tooltip } from "@nextui-org/react";
import { AppAvatar } from "../../../../../presentation/Components/AppAvatar";
import {
  AppDataGrid,
  AppDataGridColumn,
  RenderFnParams,
} from "../../../../../presentation/Components/AppDataGrid";
import { UIColorScheme } from "../../../../../presentation/types/UIColorScheme";
import { AutomaticAlarmsDefendant } from "../../../domain/entities/automatic-alarm-defendant";
import * as Icon from "react-feather";
export type AutomaticAlarmsDefendantTableProps = {
  items?: AutomaticAlarmsDefendant[];
  onEdit: (params: RenderFnParams<AutomaticAlarmsDefendant>) => void;
  onView: (params: RenderFnParams<AutomaticAlarmsDefendant>) => void;
  onEditAlarm: (params: RenderFnParams<AutomaticAlarmsDefendant>) => void;
  onViewAlarm: (params: RenderFnParams<AutomaticAlarmsDefendant>) => void;
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

const NameAutomaticAlarmsDefendantPersonColumn = (
  params: RenderFnParams<AutomaticAlarmsDefendant>
) => {
  return (
    <div className="flex items-center space-x-3">
      <div>
        <AppAvatar
          colorSchema={getRandomColorSchema({
            length: params.record.description.length,
          })}
        >
          <Icon.Map size={20} />
        </AppAvatar>
      </div>
      <div>
        <div className="font-semibold tracking-wider">
          {params.record.description}
        </div>
      </div>
    </div>
  );
};

const ActionsColumn = ({
  onEdit,
  onView,
}: RenderFnParams<AutomaticAlarmsDefendant> & {
  onEdit: () => void;
  onView: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-3 static -z-50">
      <Tooltip
        content={"Add Schedule"}
        color="warning"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onEdit();
          }}
          title="Add Shedule"
          size="sm"
          variant="shadow"
          isIconOnly
          color="warning"
        >
          <Icon.Clock size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"View Schedules"}
        color="primary"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onView();
          }}
          title="View Shedules"
          size="sm"
          variant="shadow"
          isIconOnly
          color="primary"
        >
          <Icon.Eye size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

const AlarmActionsColumn = ({
  onEditAlarm,
  onViewAlarm,
}: RenderFnParams<AutomaticAlarmsDefendant> & {
  onEditAlarm: () => void;
  onViewAlarm: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-3 static -z-50">
      <Tooltip
        content={"View"}
        color="primary"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onViewAlarm();
          }}
          title="View"
          size="sm"
          variant="shadow"
          isIconOnly
          color="primary"
        >
          <Icon.Eye size={18} />
        </Button>
      </Tooltip>
      <Tooltip
        content={"Edit"}
        color="warning"
        offset={5}
        showArrow
        closeDelay={10}
        disableAnimation
      >
        <Button
          onClick={() => {
            onEditAlarm();
          }}
          title="Edit"
          size="sm"
          variant="shadow"
          isIconOnly
          color="warning"
        >
          <Icon.Edit size={18} />
        </Button>
      </Tooltip>
    </div>
  );
};

export const AppAutomaticAlarmsDefendantTable = ({
  items = [],
  onEdit,
  onView,
  onEditAlarm,
  onViewAlarm,
}: AutomaticAlarmsDefendantTableProps) => {
  const columns: AppDataGridColumn<AutomaticAlarmsDefendant>[] = [
    {
      key: "AutomaticAlarmsDefendantPersonName",
      dataIndex: "AutomaticAlarmsDefendantPersonName",
      title: "Alarm Name",
      render: NameAutomaticAlarmsDefendantPersonColumn,
    },
    {
      key: "actionsScheduleAlarmDefendant",
      dataIndex: "actionsScheduleAlarmDefendant",
      title: "Schedule Actions",

      render: (data) =>
        ActionsColumn({
          ...data,
          onEdit: () => {
            onEdit(data);
          },
          onView: () => {
            onView(data);
          },
        }),
    },
    {
      key: "actionsAlarmDefendant",
      dataIndex: "actionsAlarmDefendant",
      title: "Alarm Actions",

      render: (data) =>
        AlarmActionsColumn({
          ...data,
          onEditAlarm: () => {
            onEditAlarm(data);
          },
          onViewAlarm: () => {
            onViewAlarm(data);
          },
        }),
    },
  ];
  return (
    <AppDataGrid<AutomaticAlarmsDefendant>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
