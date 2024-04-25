import { AppHero } from "../../../../presentation/Components/AppHero";
import Select from "react-select";
import { useGetDefendants } from "../../../defendants/web/hooks/use-get-defendants";
import { useEffect, useState } from "react";
type AppTrackingHeaderProps = {
  // setTrackingId: (trackingId: number | undefined) => void;
  onSearch: (id: number | undefined) => void;
};
export const AppTrackingHeader = ({ onSearch }: AppTrackingHeaderProps) => {
  const { defendants, getDefendants } = useGetDefendants();
  const [defendantsList, setDefendantsList] =
    useState<{ value: number; label: string }[]>();

  useEffect(() => {
    getDefendants({ completeName: "" });
  }, []);
  useEffect(() => {
    if (defendants) {
      setDefendantsList(
        defendants.map((item) => ({
          value: item.idPerson,
          label: `${item.name} ${item.lastName}`,
        }))
      );
    }
  }, [defendants]);
  return (
    <AppHero
      size="base"
      style={{
        background: "linear-gradient(to right, #133a94, #919bff)",
      }}
    >
      <div className=" flex flex-row items-center justify-between mx-auto gap-5 w-2/3">
        <h1 className="text-xl font-semibold text-white center text-opacity-90">
          Tracking
        </h1>
        <div className="w-2/3 flex flex-row items-center bg-white rounded-lg ">
          <Select
            placeholder="Defendant name"
            className="w-full"
            options={defendantsList}
            onChange={(e) => onSearch(e?.value)}
            isSearchable={true}
          />
          {/* <AppTextField
            placeholder="Name"
            type="text"
            onChange={() => {
              //   setSearchUser(e.target.value);
              //   setVisible(true);
            }}
            // value={searchUser}
          ></AppTextField> */}
          {/* <AppButton
            variant="ghost"
            isLoading={false}
            onClick={() => {
              //   handleClick(fullNameUser);
            }}
          >
            <Icon.Search />
          </AppButton> */}
        </div>
      </div>
    </AppHero>
  );
};
