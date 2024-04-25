import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { HistoricPosition } from "../../domain/entities/historic-position";
import { TrackingRepository } from "../../domain/repositories/tracking-repository";

export const findHistoricPositionService: TrackingRepository["postHistoricPosition"] =
  async (params) => {
    const response = await api().post("Position/Historic", {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
      json: params,
    });

    const { body } = await verifyResponse({ response });
    const data = body.data as any[];
    const historicPositions = data.map<HistoricPosition>((position) => ({
      battery: position.battery,
      bloodOxygen: position.bloodOxygen,
      cardioFrequency: position.cardioFrequency,
      dateFin: position.dateFin,
      dateInit: position.dateInit,
      delta: position.delta,
      idPerson: position.idPerson,
      lat: position.lat,
      lon: position.lon,
      positionType: position.position_type,
      positionDate: position.positionDate,
      type: position.type,
    }));
    return historicPositions;
  };
