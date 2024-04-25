import { HistoricPosition } from '../entities/historic-position';
import { Tracking } from '../entities/tracking';
import { TrackingDetail } from '../entities/tracking-detail';

export type TrackingRepository = {
  getTracking: () => Promise<Tracking[]>;
  getTrackingDetail: (params: { personId: number }) => Promise<TrackingDetail>;
  postHistoricPosition: (params: {
    dateInit: string;
    dateFin: string;
    idPerson: number;
  }) => Promise<HistoricPosition[]>;
};
