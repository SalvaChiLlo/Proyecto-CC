export interface Job {
  url: string;
  id: string;
  args?: string;
  config?: string;
  outputFolder?: string;
  token?: string;
}

export interface JobStatus {
  id: string;
  status: string;
  outputFiles?: string[];
}