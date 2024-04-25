import * as Icon from "react-feather";
import { AppHero } from "../../../../presentation/Components/AppHero";
import AppTextField from "../../../../presentation/Components/AppTextField";
import { AppButton } from "../../../../presentation/Components/AppButton";
export type AppDevicesHeaderProps = {
  onClick: (search: string) => void;
  loadingDevices: boolean;
  search: string;
  setSearch: (search: string) => void;
};
export const AppDevicesHeader = ({
  loadingDevices,
  onClick,
  search,
  setSearch,
}: AppDevicesHeaderProps) => {
  return (
    <AppHero
      size="base"
      style={{
        background: "linear-gradient(to right, #133a94, #919bff)",
      }}
    >
      <div className=" flex flex-row items-center justify-between mx-auto gap-5 w-2/3">
        <h1 className="text-xl font-semibold text-white center text-opacity-90">
          Devices
        </h1>
        <div className="w-2/3 flex flex-row items-center bg-white rounded-lg ">
          <AppTextField
            placeholder="Search by name or email"
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
          ></AppTextField>
          <AppButton
            variant="ghost"
            isLoading={loadingDevices}
            onClick={() => {
              onClick(search);
            }}
          >
            <Icon.Search />
          </AppButton>
        </div>
      </div>
    </AppHero>
  );
};
