import { ManagementUsersManagerPage } from "./modules/management-users/web/components/app-management-users-manager-page";
import { AppUserAuth } from "./modules/user/web/components/AppUserAuthPage";
import { AppHomePage } from "./presentation/Components/AppHomePage";
import { AppLayout } from "./presentation/Components/AppLayout";
import { AppNotFoundPage } from "./presentation/Components/AppNotFoundPage";
import { IRoute } from "./presentation/Components/AppRouter";

export const routes: IRoute[] = [
  {
    key: "auth-user",
    path: "/sign",
    component: AppUserAuth,
  },
  {
    key: "private-layout",
    path: "/",
    component: AppLayout,
    routes: [
      // {
      //   key: 'alarm-config-view',
      //   path: '/alarm-config',
      //   component: AppAlarmConfigManagerPage,
      // },
      // {
      //   key: 'broadcast-messages-view',
      //   path: '/broadcast-messages',
      //   component: AppBroadcastMessagesManagerPage,
      // },
      // {
      //   key: 'defendants-view',
      //   path: '/defendants',
      //   component: AppDefendantsManagerPage,
      // },
      // {
      //   key: 'devices-view',
      //   path: '/devices',
      //   component: AppDevicesManagerPage,
      // },
      {
        key: "management-users-view",
        path: "/management-users",
        component: ManagementUsersManagerPage,
      },
      // {
      //   key: 'request-admin-view',
      //   path: '/request-admin',
      //   component: AppRequestAdminManagerPage,
      // },
      // {
      //   key: 'tracking-view',
      //   path: '/tracking',
      //   component: AppTrackingManagerPage,
      // },
      {
        key: "home-view",
        path: "/",
        // exact: true,
        component: AppHomePage,
      },
    ],
  },
  {
    key: "page-not-found",
    path: "*",
    component: AppNotFoundPage,
  },
];
