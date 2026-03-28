export interface Chapter {
  id: string;
  title: string;
  date: string;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  year: string;
  period: string;
  flag: string;
  heading: string;
  locationTag: string;
  content: string;
  stops?: string[];
  markerIndices: number[];
}

export interface Marker {
  coords: [number, number];
  label: string;
  sub: string;
}

export interface ChapterContextType {
  currentChapterIndex: number;
  setCurrentChapterIndex: (index: number) => void;
  chapters: Chapter[];
  markers: Marker[];
}
