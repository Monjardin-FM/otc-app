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
  //   loadingDeleteAutomaticAlarmsDefendant: boolean;
  items?: AutomaticAlarmsDefendant[];
  onEdit: (params: RenderFnParams<AutomaticAlarmsDefendant>) => void;
  onView: (params: RenderFnParams<AutomaticAlarmsDefendant>) => void;
  //   isCreate: boolean;
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

// const StatusAutomaticAlarmsDefendantPersonColumn = (
//   params: RenderFnParams<AutomaticAlarmsDefendant>
// ) => {
//   return (
//     <Tooltip
//       content={params.record.idStatus === 1 ? "Active" : "Inactive"}
//       color="primary"
//       offset={15}
//       showArrow
//       closeDelay={10}
//       disableAnimation
//     >
//       <Chip
//         color={params.record.idStatus === 1 ? "success" : "danger"}
//         variant="shadow"
//         radius="full"
//       >
//         <Icon.Circle size={10} />
//       </Chip>
//     </Tooltip>
//   );
// };

const ActionsColumn = ({
  onEdit,
  onView,
}: //   onDelete,
//   loadingDeleteAutomaticAlarmsDefendant,
// isCreate,
// record,
RenderFnParams<AutomaticAlarmsDefendant> & {
  onEdit: () => void;
  onView: () => void;
  //   onDelete: () => void;
  //   loadingDeleteAutomaticAlarmsDefendant: boolean;
  //   isCreate: boolean;
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

export const AppAutomaticAlarmsDefendantTable = ({
  items = [],
  onEdit,
  onView,
}: AutomaticAlarmsDefendantTableProps) => {
  const columns: AppDataGridColumn<AutomaticAlarmsDefendant>[] = [
    {
      key: "AutomaticAlarmsDefendantPersonName",
      dataIndex: "AutomaticAlarmsDefendantPersonName",
      title: "Alarm Name",
      render: NameAutomaticAlarmsDefendantPersonColumn,
    },

    // {
    //   key: "AutomaticAlarmsDefendanttatus",
    //   dataIndex: "AutomaticAlarmsDefendanttatus",
    //   title: "Status",
    //   render: StatusAutomaticAlarmsDefendantPersonColumn,
    // },
    {
      key: "actionsAlarmDefendant",
      dataIndex: "actionsAlarmDefendant",
      title: "Actions",
      //   className: clsx("", {
      //     hidden: isCreate,
      //   }),
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
  ];
  return (
    <AppDataGrid<AutomaticAlarmsDefendant>
      columns={columns}
      dataSource={items}
      itemKey="id"
    />
  );
};
