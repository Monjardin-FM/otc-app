import * as Icon from "react-feather";
import { AppHero } from "../../../../presentation/Components/AppHero";
import AppTextField from "../../../../presentation/Components/AppTextField";
import { AppButton } from "../../../../presentation/Components/AppButton";
export const AppDefendantsHeader = () => {
  return (
    <AppHero
      size="base"
      style={{
        background: "linear-gradient(to right, #133a94, #919bff)",
      }}
    >
      <div className="mx-auto flex flex-row items-center justify-between w-2/3 ">
        <div className="lg:text-xl sm:text-xs font-semibold text-white text-opacity-90">
          Defendants
        </div>
        <div className="w-2/3 flex flex-row items-center bg-white rounded-lg ">
          <AppTextField
            placeholder="Search by name or email"
            type="text"
            onChange={() => {
              //   setSearchUser(e.target.value);
              //   setVisible(true);
            }}
            // value={searchUser}
          ></AppTextField>
          <AppButton
            variant="ghost"
            isLoading={false}
            onClick={() => {
              //   handleClick(fullNameUser);
            }}
          >
            <Icon.Search />
          </AppButton>
        </div>
      </div>
    </AppHero>
  );
};
