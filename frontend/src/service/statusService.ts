import { Request, Response } from "express";
import { consumerLoad } from "../utils/kafka";
import { Observation } from "../models/jobModel";

const observations: Observation[] = [];

export default function checkServerStatus(req: Request, res: Response) {
  res.status(200).send('<h1>Server is running</h1>');
}

export function getLoad(req: Request, res: Response) {
  res.send(observations.slice(0, 10))
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