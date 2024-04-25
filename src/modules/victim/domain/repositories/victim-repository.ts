import { Victim } from '../entities/victim';

export type VictimRepository = {
  getVictim(params: { completeName: string }): Promise<Victim[]>;
  getVictimById(params: {
    completeName: string;
    idPerson: number;
  }): Promise<Victim>;
  createVictim(params: {
    completeName: string;
    name: string;
    lastName: string;
    idDefendant: number;
    eMail: string;
    caseNumber: string;
    birthDate: string;
    idGender: number;
    idStatus: number;
    password: string;
  }): Promise<void>;
  updateVictim(params: {
    idPerson: number;
    completeName: string;
    name: string;
    lastName: string;
    idDefendant: number;
    caseNumber: string;
    birthDate: string;
    idGender: number;
    idStatus: number;
    password: string;
  }): Promise<void>;
  deleteVictim(parms: { idPerson: number }): Promise<Boolean>;
};
