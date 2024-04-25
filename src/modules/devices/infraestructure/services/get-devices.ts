import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { Device } from "../../domain/entities/device";
import { DeviceRepository } from "../../domain/respositories/device-repositoty";

export const getDevicesService: DeviceRepository["getDevice"] = async (
  params
) => {
  const response = await api().get("Device", {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    searchParams: params,
  });
  const { body } = await verifyResponse({ response });
  const data = body.data as any[];

  const devices = data.map<Device>((device) => ({
    idDevice: device.idDevice,
    idDeviceType: device.idDeviceType,
    deviceType: device.deviceType,
    description: device.description,
    idStatus: device.idStatus,
  }));
  return devices;
};
