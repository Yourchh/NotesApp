// Definimos los bloques para el editor de texto enriquecido
export type TextBlock = { type: "text"; id: string; value: string };
export type ImageBlock = { type: "image"; id: string; uri: string };
export type ContentBlock = TextBlock | ImageBlock;

export interface Note {
  id: string;
  title: string;
  content: string; // Se usará solo como "vista previa" para la lista
  createdAt: number;
  updatedAt: number;
  color?: string;
  pinned?: boolean;
  imageUris?: string[]; // Soporte para notas antiguas
  richContent?: ContentBlock[]; // <-- Nuestra nueva estructura de bloques
}

export type ViewMode = "grid" | "list";
