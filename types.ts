export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE'
}

export interface KeywordMetric {
  keyword: string;
  rank: number;
  previousRank: number;
  searchVolume: number; // Monthly estimated
  competition: 'Low' | 'Medium' | 'High';
  trend: TrendDirection;
  change: number; // Rank change value
}

export interface KeywordAnalysisResult {
  keyword: string;
  difficultyScore: number; // 0-100
  potentialScore: number; // 0-100
  relatedKeywords: string[];
  seasonalTrend: { month: string; volume: number }[]; // For chart
  summary: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  SETTINGS = 'SETTINGS'
}