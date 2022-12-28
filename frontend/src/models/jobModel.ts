export interface Job {
  id: string;
  url: string;
  args?: string;
  config?: string;
  outputFolder?: string;
  username: string;
}

export interface JobStatus {
  id: string;
  status: string;
  outputFiles?: string[];
  elapsedTime?: number;
  username: string;
  url: string;
  args?: string;
  config?: string
}

export interface IgnoreJob {
  id: string;
  username: string;
}