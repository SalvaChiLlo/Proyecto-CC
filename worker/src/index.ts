import { Job, JobStatus } from "./models/jobModel"
import { consumer, getConsumer, updateJobStatus } from './utils/kafka';
import { launchJob } from "./service/jobLauncher";
import { config } from "./config/environment";

const jobListener = async () => {
  // Consuming
  const consumer = await getConsumer('jobs-queue');
  console.log("FINALLY A CONSUMER WITH PARTITION");
  

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const job: Job = JSON.parse(message.value.toString());
      try {
        await launchJob(job);
      } catch (err: any) {
        const jobStatus: JobStatus = {
          id: job.id,
          status: config.FALLO
        }
        updateJobStatus(jobStatus);
        console.error(err)
      }
    },
  })
}
jobListener().catch(console.error)