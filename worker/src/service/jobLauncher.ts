import { performance } from "perf_hooks";
import { Job } from "../models/jobModel";
import { updateJobStatus } from "../utils/kafka";
import executeJob from "./jobExecutor";

export async function launchJob(job: Job) {  
  console.log(job);
  console.log("Lanzando Trabajo");
  
  const startTime = performance.now()
  
  const status = await executeJob(job);
  
  const endTime = performance.now()
  const elapsedTime = (endTime - startTime) / 1000;

  status.elapsedTime = elapsedTime;

  // SEND RESULTS
  console.log("Trabajo Terminado")
  updateJobStatus(status)
}