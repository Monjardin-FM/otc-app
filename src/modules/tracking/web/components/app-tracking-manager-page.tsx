import { useEffect } from "react";
import AppConfig from "../../../../settings.json";
import { AppTrackingHeader } from "./app-tracking-header";
import { AppTrackingsTable } from "./tables/app-tracking-table";
import { AppTrackingModal } from "./modals/app-tracking-modal";
import { useAudio, useToggle } from "react-use";
import { useGetTracking } from "../hooks/use-get-tracking";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppLoading } from "../../../../presentation/Components/AppLoading";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import { Button } from "@nextui-org/react";
import * as Icon from "react-feather";
export const AppTrackingManagerPage = () => {
  const [visibleTrackingModal, setVisibleTrackingModal] = useToggle(false);
  const { tracking, getTracking } = useGetTracking();
  const [audio, state, controls] = useAudio({
    src: "https://freesound.org/s/34563/",
    autoPlay: true,
  });

  useEffect(() => {
    getTracking();
    const intervalId = setInterval(() => {
      const fetchData = () => {
        getTracking();
      };
      fetchData();
    }, 30000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    console.log(state);
    if (tracking && tracking?.length > 0) {
      controls.play;
    }
    // if (tracking && tracking.length === 0) {
    //   controls.pause;
    // }
  }, [tracking]);

  return (
    <div>
      <AppAuthorizationGuard
        roles={
          AppConfig["userManagement.managerPage.authorization"] as UserRole[]
        }
        redirect={{ to: "/" }}
      >
        {!tracking && <AppLoading />}
        <AppTrackingModal
          isVisible={visibleTrackingModal}
          onClose={() => setVisibleTrackingModal(false)}
          // toggle={toggle}
        />
        <AppPageTransition>
          <div className="items-center mx-auto ">
            <AppTrackingHeader
              // setTrackingId={setTrackingId}
              onSearch={(id: number | undefined) => {
                if (id) {
                  localStorage.setItem("trackingId", String(id));
                }
                setVisibleTrackingModal(true);
              }}
            />
            <div className="container mx-auto my-5 ">
              <div
                className={"w-full flex flex-row items-end justify-end mb-5"}
              >
                {audio}
                {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
                <div
                  className={
                    state.muted === false
                      ? " flex flex-row items-end justify-end mb-5 border-8 border-danger-400 animate-pulse bg-danger-500  rounded-full"
                      : "flex flex-row items-end justify-end mb-5 border-8 border-opacity-0 bg-white rounded-full "
                  }
                >
                  {state.muted ? (
                    <Button isIconOnly color="danger" onClick={controls.unmute}>
                      <Icon.Volume2 size={15} />{" "}
                    </Button>
                  ) : (
                    <Button isIconOnly color="danger" onClick={controls.mute}>
                      <Icon.VolumeX size={15} />{" "}
                    </Button>
                  )}
                </div>
              </div>
              <AppTrackingsTable
                onEdit={({ record }) => {
                  if (record.personId) {
                    localStorage.setItem("trackingId", String(record.personId));
                    // setTrackingId(record.personId);
                    setVisibleTrackingModal(true);
                  }
                }}
                items={tracking}
              />
            </div>
          </div>
        </AppPageTransition>
      </AppAuthorizationGuard>
    </div>
  );
};
