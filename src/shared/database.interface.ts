export interface DatabaseClient<T> {
  get(id: string): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
