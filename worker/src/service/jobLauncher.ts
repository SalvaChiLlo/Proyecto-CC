import { Job } from "../models/jobModel";
import { updateJobStatus } from "../utils/kafka";
import executeJob from "./jobExecutor";

export async function launchJob(job: Job) {
  console.log(job);
  console.log("Lanzando Trabajo");

  const status = await executeJob(job);

  // SEND RESULTS
  console.log("Trabajo Terminado")
  updateJobStatus(status)
}