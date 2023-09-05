export type Workday = {
  date: string;
  time: number;
}

export type HistoryWeek = {
  week: number;
  histories: Workday[];
  lieuTime: number;
};

export type HistoryYear = {
  year: number;
  histories: HistoryWeek[];
};

