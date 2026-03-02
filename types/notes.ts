// Definimos los bloques para el editor de texto enriquecido
export type TextBlock = { type: "text"; id: string; value: string };
export type ImageBlock = { type: "image"; id: string; uri: string };
export type ContentBlock = TextBlock | ImageBlock;

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  color?: string;
  pinned?: boolean;
  imageUris?: string[];
  richContent?: ContentBlock[];
  order: number;
}

export type ViewMode = "grid" | "list";
