import { performance } from "perf_hooks";
import { Job, JobStatus } from "../../models/jobModel";
import { updateJobStatus } from "../../utils/kafka/kafka";
import executeJob from "../jobExecutor/jobExecutor";

export async function launchJob(job: Job): Promise<JobStatus> {  
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
  return status
}