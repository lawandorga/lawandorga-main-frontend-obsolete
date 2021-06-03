export interface Folder {
  name: string;
  id: number;
  creator: number;
  created: string;
  parent: number;
  path: Folder[];
}
