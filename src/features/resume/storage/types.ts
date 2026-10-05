import { IResume } from '../types';

export interface IStorageProvider {
  save(resume: IResume): Promise<IResume>;
  load(id: string): Promise<IResume | null>;
  list(): Promise<IResume[]>;
  delete(id: string): Promise<void>;
  setActive?(id: string): Promise<IResume>;
}
