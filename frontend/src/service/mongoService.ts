import { Collection, Document, MongoClient, WithId } from 'mongodb'
import { config } from '../config/environment/';
import { Job, JobStatus } from '../models/jobModel';

// Connection URL
const url = `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.monogHost}`
let client: MongoClient
let collection: Collection<Document>;


(async function main() {
  client = new MongoClient(url);
  await client.connect();

  console.log(url)
  console.log('Connected successfully to server');

  const db = client.db(config.mongoDbName);
  collection = db.collection('proyectocc-jobs');

})()

export async function addDocuments(documents: any[]) {
  await collection.insertMany(documents);
}

export async function getJobsByUsername(username: string): Promise<JobStatus[]> {
  return documentToObjectStatus(await collection.find({ username }).toArray());
}

export async function getJobById(jobId: string): Promise<JobStatus[]> {
  return documentToObjectStatus(await collection.find({ id: jobId }).toArray());

}

export async function updateJobById(jobStatus: JobStatus) {
  await collection.updateOne((await collection.find({ id: jobStatus.id }).toArray())[0], { $set: jobStatus });
}

function documentToObjectStatus(documents: WithId<Document>[]): JobStatus[] {
  const statusList: JobStatus[] = [];

  documents.forEach((value, index, array) => {
    statusList.push(JSON.parse(JSON.stringify(value)))
  })

  return statusList.sort((a, b) => +b.id - +a.id)
}
