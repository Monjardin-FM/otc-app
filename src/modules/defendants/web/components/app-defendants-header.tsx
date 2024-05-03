import * as Icon from "react-feather";
import { AppHero } from "../../../../presentation/Components/AppHero";
import AppTextField from "../../../../presentation/Components/AppTextField";
import { AppButton } from "../../../../presentation/Components/AppButton";

export type AppDefendantsHeaderProps = {
  onClick: (search: string) => void;
  loadingDefendants: boolean;
  search: string;
  setSearch: (search: string) => void;
};
export const AppDefendantsHeader = ({
  loadingDefendants,
  onClick,
  search,
  setSearch,
}: AppDefendantsHeaderProps) => {
  return (
    <AppHero
      size="base"
      style={{
        background: "linear-gradient(to right,#091970, #133a94)",
      }}
    >
      <div className="mx-auto flex flex-row items-center justify-between w-2/3 ">
        <div className="lg:text-xl sm:text-xs font-semibold text-white text-opacity-90">
          Defendants
        </div>
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
            isDisabled={loadingDefendants}
            variant="ghost"
            isLoading={loadingDefendants}
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
