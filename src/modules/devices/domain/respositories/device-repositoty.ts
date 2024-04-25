import { Device } from '../entities/device';

export type DeviceRepository = {
  getDevice(params: { completeName: string }): Promise<Device[]>;
  getDeviceById(params: { idDevice: number }): Promise<Device>;
  createDevice(params: {
    idDeviceType: number;
    description: string;
    status: string;
    idStatus: number;
  }): Promise<void>;
  updateDevice(params: {
    idDevice: number;
    idDeviceType: number;
    description: string;
    status: string;
    idStatus: number;
  }): Promise<void>;
  deleteDevice(params: { idDevice: number }): Promise<Boolean>;
};
