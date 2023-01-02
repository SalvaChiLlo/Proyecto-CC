import { addJob, checkJobStatus, deleteJob, showUserJobs } from "./jobService"
import * as constants from '../../constants/constants'
import { expect } from "chai";
import process from "process";
import { assert } from "console";
import { JobStatus } from '../../models/jobModel'

let createdJobId: string;

// Group of tests using describe
describe('Job service tests', () => {

  it('Add job should return a JobId', async () => {
    const url = 'https://salvachillo@github.com/SalvaChiLlo/jobCC.git'
    const args = 'es';
    const jobConfig = "{\"DEEPL_API_KEY\":\"57f25c3f-497c-6a8a-7337-6772230b89a1:fx\",\"SOURCE_TEXT\":\"Job launched from the test area\"}"

    createdJobId = await addJob(url, args, jobConfig, constants.exampleTokenMyUser);

    expect(createdJobId).to.not.be.undefined;
    expect(createdJobId).to.not.be.null;
    expect(createdJobId).to.contain('El id de tu trabajo es:', 'El resultado obtenido no es el esperado')

    createdJobId = createdJobId.split(" ").slice(-1)[0]
  })

  it('Check previous job status is created', async () => {
    const jobStatus: JobStatus = await checkJobStatus(createdJobId, constants.exampleTokenMyUser)

    expect(jobStatus).to.not.be.undefined;
    expect(jobStatus).to.not.be.null;
    expect(jobStatus.id).to.be.eq(createdJobId);
  })

  it('Check job with incorrect id, should fail', async () => {
    const jobStatus: string = await checkJobStatus('incorrect', constants.exampleTokenMyUser2)

    expect(jobStatus).to.not.be.undefined;
    expect(jobStatus).to.not.be.null;
    expect(jobStatus).to.be.eq('Trabajo no encontrado. El id es incorrecto.');
  })

  it('Check job from other user, should fail', async () => {
    const jobStatus: string = await checkJobStatus(createdJobId, constants.exampleTokenMyUser2)

    expect(jobStatus).to.not.be.undefined;
    expect(jobStatus).to.not.be.null;
    expect(jobStatus).to.be.eq('Trabajo no encontrado. El id es incorrecto.');
  })

  it('Show user myuser jobs, should retrieve a list of jobs including the last job created', async () => {
    const userJobs: JobStatus[] = await showUserJobs(constants.exampleTokenMyUser);

    expect(userJobs).to.not.be.null;
    expect(userJobs).to.not.be.undefined;
    expect(userJobs).to.not.be.empty;

    const filteredJobs = userJobs.filter(job => job.id === createdJobId)
    expect(filteredJobs).to.not.be.null;
    expect(filteredJobs).to.not.be.undefined;
    expect(filteredJobs.length).to.be.eq(1)
  })

  it('Show user myuser2 jobs, should retrieve a list of jobs NOT including the last job created', async () => {
    const userJobs: JobStatus[] = await showUserJobs(constants.exampleTokenMyUser2);

    expect(userJobs).to.not.be.null;
    expect(userJobs).to.not.be.undefined;

    const filteredJobs = userJobs.filter(job => job.id === createdJobId)
    expect(filteredJobs).to.not.be.null;
    expect(filteredJobs).to.not.be.undefined;
    expect(filteredJobs.length).to.be.eq(0)
  })

  it('Delete a job by jobId and username, show execute correctly', async () => {

    const response = await deleteJob(createdJobId, constants.exampleTokenMyUser);

    expect(response).to.not.be.null;
    expect(response).to.not.be.undefined;
    expect(response).to.be.eq(`El trabajo ${createdJobId} ha sido eliminado.`)
  })

  it('Delete a job by jobId and username, show execute correctly', async () => {

    const response = await deleteJob(createdJobId, constants.exampleTokenMyUser2);

    expect(response).to.not.be.null;
    expect(response).to.not.be.undefined;
    expect(response).to.be.eq(`El trabajo ${createdJobId} no existe o no te pertenece.`)
  })
})