import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppConfig from "../../../settings.json";
import { AppAsideLink } from "./AppAsideLink";
import { useClickAway } from "react-use";
import { AppAuthorizationGuard } from "../AppAuthorizationGuard";
import { AppButton } from "../AppButton";
import { useUser } from "../../../modules/user/web/hooks/use-user";
import { UserRole } from "../../../modules/user/domain/entities/user-role";
import { capitalize } from "../../../utils/capitalize";
import OTCLogo from "../../../assets/img/otcLogo-small.png";
import * as Icon from "react-feather";
export type AppAsideV2Props = {
  isVisible?: boolean;
  onClose?: () => void;
};

export const AppAsideV2 = ({
  isVisible = false,
  onClose = () => {},
}: AppAsideV2Props) => {
  const ref = useRef(null);
  useClickAway(ref, onClose);

  const { signOut, user } = useUser();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{
            opacity: 0,
            x: -20,
          }}
          className="fixed z-40 inline-block px-8 py-12 overflow-y-auto bg-white shadow-lg inset-y-8 left-8 rounded-xl bg-opacity-75 filter backdrop-filter backdrop-blur-sm hover:bg-white hover:bg-opacity-100 transition ease-in-out duration-700"
        >
          <div className="flex justify-center w-full">
            <img className="h-20" src={OTCLogo} alt="OTC Logo" />
          </div>

          {user && (
            <div className="w-full mt-8 text-center">
              <div className="text-sm text-primary-500">Welcome</div>
              <div className="font-bold text-primary-600">
                {capitalize(`${user.name}`)}
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <AppAsideLink
              icon={<Icon.Grid size={20} />}
              label="Start"
              to="/"
              exact
            />
            <AppAuthorizationGuard
              roles={
                AppConfig[
                  "userManagement.managerPage.authorization"
                ] as UserRole[]
              }
            >
              <AppAsideLink
                icon={<Icon.Clock size={20} />}
                label="Automatic Alarms"
                to="/alarm-config"
              />
            </AppAuthorizationGuard>
            <AppAuthorizationGuard
              roles={
                AppConfig[
                  "userManagement.managerPage.authorization"
                ] as UserRole[]
              }
            >
              <AppAsideLink
                icon={<Icon.Send size={20} />}
                label="Broadcacst Messages"
                to="/broadcast-messages"
              />
            </AppAuthorizationGuard>
            <AppAuthorizationGuard
              roles={
                AppConfig["defendants.managerPage.authorization"] as UserRole[]
              }
            >
              <AppAsideLink
                icon={<Icon.Users size={20} />}
                label="Defendants"
                to="/defendants"
              />
            </AppAuthorizationGuard>
            <AppAuthorizationGuard
              roles={
                AppConfig["defendants.managerPage.authorization"] as UserRole[]
              }
            >
              <AppAsideLink
                icon={<Icon.Watch size={20} />}
                label="Devices"
                to="/devices"
              />
            </AppAuthorizationGuard>

            <AppAuthorizationGuard
              roles={
                AppConfig[
                  "userManagement.managerPage.authorization"
                ] as UserRole[]
              }
            >
              <AppAsideLink
                icon={<Icon.User size={20} />}
                label="Users Management"
                to="/management-users"
              />
            </AppAuthorizationGuard>
            <AppAuthorizationGuard
              roles={
                AppConfig["defendants.managerPage.authorization"] as UserRole[]
              }
            >
              <AppAsideLink
                icon={<Icon.Mail size={20} />}
                label="Request Admin"
                to="/request-admin"
              />
            </AppAuthorizationGuard>
            <AppAuthorizationGuard
              roles={
                AppConfig["defendants.managerPage.authorization"] as UserRole[]
              }
            >
              <AppAsideLink
                icon={<Icon.MapPin size={20} />}
                label="Tracking"
                to="/tracking"
              />
            </AppAuthorizationGuard>
          </div>

          <div className="mt-14">
            <AppButton
              className="flex items-center text-white p-3  rounded-lg"
              onClick={() => {
                signOut.execute();
              }}
              colorScheme="danger"
              variant="solid"
            >
              <div className="text-white">
                <Icon.LogOut />
              </div>
              <div className="ml-3 text-sm font-medium text-white">
                Cerrar sesión
              </div>
            </AppButton>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
