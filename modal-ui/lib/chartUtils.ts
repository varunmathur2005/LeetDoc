// lib/chartUtils.ts
type Submission = {
  timestamp: string;
  difficulty: string;
};

export type ChartPoint = {
  date: string;
  Easy: number;
  Medium: number;
  Hard: number;
};

export function transformSubmissionsToChartData(
  submissions: Submission[]
): ChartPoint[] {
  const countsMap: {
    [date: string]: { Easy: number; Medium: number; Hard: number };
  } = {};

  submissions.forEach(({ timestamp, difficulty }) => {
    const date = new Date(timestamp).toISOString().split("T")[0]; // e.g., "2024-06-01"
    if (!countsMap[date]) {
      countsMap[date] = { Easy: 0, Medium: 0, Hard: 0 };
    }
    if (difficulty in countsMap[date]) {
      countsMap[date][difficulty as "Easy" | "Medium" | "Hard"] += 1;
    }
  });

  const sortedDates = Object.keys(countsMap).sort();
  return sortedDates.map((date) => ({
    date,
    ...countsMap[date],
  }));
}
