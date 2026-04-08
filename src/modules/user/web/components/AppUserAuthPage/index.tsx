import { Navigate } from "react-router-dom";
import AuthPageBackground from "../../../../../assets/img/background-login.jpg";
import OTCLogo from "../../../../../assets/img/otcLogo-small.png";
import { AppPageTransition } from "../../../../../presentation/Components/AppPageTransition";
import { AppBackgroundImageMotion } from "../../../../../presentation/Components/AppBackgroundImageMotion";
import { AppUserAuthForm } from "../AppUserAuthForm";
import { useUser } from "../../hooks/use-user";
import { useTranslation } from "react-i18next";

export const AppUserAuth = () => {
  const { t } = useTranslation(["Login"]);
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
              <div className="app-glass app-border max-w-4xl flex py-8 px-36 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm border shadow-xl">
                <div className="w-full max-w-md ">
                  <div className="rounded-xl">
                    <img
                      className="mx-auto w-24"
                      src={OTCLogo}
                      alt="OTC Logo"
                    />
                    <div className="text-primary-900 dark:text-primary-100 text-center mt-5 text-lg">
                      {t("Welcome")}
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
