export interface FolderPermission {
  id: number;
  group: { id: number; name: string };
  permission: { id: number; name: string };
  folder: { id: number; name: string };
}
