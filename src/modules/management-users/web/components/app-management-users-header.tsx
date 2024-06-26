import { AppButton } from "../../../../presentation/Components/AppButton";
import { AppHero } from "../../../../presentation/Components/AppHero";
import AppTextField from "../../../../presentation/Components/AppTextField";
import * as Icon from "react-feather";

export type AppManagemenetUsersHeaderProps = {
  onClick: (search: string) => void;
  loadingUsers: boolean;
  search: string;
  setSearch: (search: string) => void;
};
export const AppManagemenetUsersHeader = ({
  loadingUsers,
  onClick,
  search,
  setSearch,
}: AppManagemenetUsersHeaderProps) => {
  return (
    <AppHero
      size="base"
      style={{
        background: "linear-gradient(to right,#091970, #133a94)",
      }}
    >
      <div className=" flex flex-row items-center justify-between mx-auto gap-5 w-2/3">
        <h1 className="text-xl font-semibold text-white center text-opacity-90">
          Users Management
        </h1>
        <div className="w-2/3 flex flex-row items-center bg-white rounded-lg ">
          <AppTextField
            placeholder="Search by Name or Email"
            type="text"
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
            value={search}
          ></AppTextField>
          <AppButton
            isDisabled={loadingUsers}
            variant="ghost"
            isLoading={loadingUsers}
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
