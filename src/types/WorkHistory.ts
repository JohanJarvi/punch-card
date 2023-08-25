export type Workday = {
  date: string;
  time: number;
}

export type HistoryWeek = {
  week: number;
  histories: Workday[];
  lieuTime: number;
};