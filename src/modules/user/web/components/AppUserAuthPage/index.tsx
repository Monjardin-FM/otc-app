import { Navigate } from "react-router-dom";
import AuthPageBackground from "../../../../../assets/img/background-login.jpg";
import OTCLogo from "../../../../../assets/img/otcLogo-small.png";
import { AppPageTransition } from "../../../../../presentation/Components/AppPageTransition";
import { AppBackgroundImageMotion } from "../../../../../presentation/Components/AppBackgroundImageMotion";
import { AppUserAuthForm } from "../AppUserAuthForm";
import { useUser } from "../../hooks/use-user";

export const AppUserAuth = () => {
  const { user } = useUser();
  return (
    <>
      {user ? (
        <Navigate to="/tracking" />
      ) : (
        <AppPageTransition>
          <div className="flex min-h-screen min-w-full">
            <AppBackgroundImageMotion
              duration={18}
              backgroundImage={AuthPageBackground}
            >
              <div className="max-w-4xl flex py-8 px-36 bg-white bg-opacity-60 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm border border-white border-opacity-10 shadow-xl">
                <div className="w-full max-w-md ">
                  <div className="rounded-xl">
                    <img
                      className="mx-auto w-24"
                      src={OTCLogo}
                      alt="OTC Logo"
                    />
                    <div className="text-primary-900 text-center mt-5 text-lg">
                      Welcome
                    </div>
                  </div>
                  <AppUserAuthForm />
                </div>
              </div>
            </AppBackgroundImageMotion>
          </div>
        </AppPageTransition>
      )}
    </>
  );
};
