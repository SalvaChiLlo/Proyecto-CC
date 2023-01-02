import { Observation } from "../../models/jobModel";
import { consumerLoad } from "../../utils/kafka/kafka";

const observations: Observation[] = [];

export function checkServerStatus(): any {
  return '<h1>Server is running</h1>';
}

export function getLoad(): Observation[] {
  return observations.slice(0, 10);
}

function startLoadListener() {
  const run = async () => {
    // Consuming
    await consumerLoad.connect();
    await consumerLoad.subscribe({ topic: 'observer-queue', fromBeginning: true });
    await consumerLoad.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const observation: Observation = JSON.parse(message.value.toString());
          observations.unshift(observation)
        } catch (err) {
          console.error(err);
        }
      },
    });
  };
  run().catch(console.error);
}
startLoadListener();