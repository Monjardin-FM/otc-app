import { HistoricPosition } from "../entities/historic-position";
import { NotificationTracking } from "../entities/notification";
import { Tracking } from "../entities/tracking";
import { TrackingDetail } from "../entities/tracking-detail";

export type TrackingRepository = {
  getTracking: () => Promise<Tracking[]>;
  getTrackingDetail: (params: { personId: number }) => Promise<TrackingDetail>;
  postHistoricPosition: (params: {
    dateInit: string;
    dateFin: string;
    idPerson: number;
  }) => Promise<HistoricPosition[]>;
  postNofitication: (params: {
    idDefendant: number;
    message: string;
  }) => Promise<void>;
  getNotification: () => Promise<NotificationTracking[]>;
  checkNotification: (params: { idNotification: number }) => Promise<void>;
};
