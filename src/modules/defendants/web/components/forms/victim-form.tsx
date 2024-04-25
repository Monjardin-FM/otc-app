import * as Icon from "react-feather";
import { useToggle } from "react-use";
import { AddVictimForm } from "./app-add-victim-form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AppButton } from "../../../../../presentation/Components/AppButton";

type VictimFormProps = {
  idDefendant?: number;
};
export const VictimForm = ({ idDefendant }: VictimFormProps) => {
  const [visibleDeviceForm, setVisibleDeviceForm] = useToggle(false);
  const [parent] = useAutoAnimate();
  return (
    <div
      ref={parent}
      className="flex flex-col items-start justify-center gap-3"
    >
      <div className="flex flex-col items-start justify-center mt-3">
        <AppButton
          colorScheme="primary"
          leftIcon={<Icon.PlusCircle size={18} />}
          onClick={() => setVisibleDeviceForm(!visibleDeviceForm)}
        >
          New Victim
        </AppButton>
      </div>
      {visibleDeviceForm && (
        <div className="w-full">
          <AddVictimForm
            onClose={() => setVisibleDeviceForm(false)}
            idDefendant={idDefendant}
            onReload={() => {}}
          />
        </div>
      )}
      <div className="w-full mt-5">
        {/* <AppVictimssTable onEdit={() => {}} /> */}
      </div>
    </div>
  );
};
