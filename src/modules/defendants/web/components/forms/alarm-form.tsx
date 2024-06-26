import { AddAlarmForm } from "./add-alarm-form";

export type AlarmFormProps = {
  idDefendant?: number | null;
  onClose: () => void;
};
export const AlarmForm = ({ idDefendant, onClose }: AlarmFormProps) => {
  return (
    <div className="grid grid-cols-12 col-span-12 gap-4">
      <div className="col-span-12 grid grid-cols-12">
        <AddAlarmForm
          idDefendant={idDefendant}
          onReload={() => {}}
          onClose={onClose}
        />
      </div>
      <div className=" col-span-12">
        {/* <AppAlarmssTable onEdit={() => {}} onDelete={() => {}} /> */}
      </div>
    </div>
  );
};
