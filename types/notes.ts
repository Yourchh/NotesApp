export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  color?: string;
  pinned?: boolean;
}

export type ViewMode = "grid" | "list";
