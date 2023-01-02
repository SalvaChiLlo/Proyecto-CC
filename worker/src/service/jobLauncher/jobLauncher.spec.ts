import { launchJob } from "./jobLauncher"
import { Job } from '../../models/jobModel'
import { expect } from "chai"
import { minioClient } from "../../utils/minio/minio"
import { config } from "../../config/environment"

// Group of tests using describe
describe('Job launcher tests', function () {
  it(`Launch job, it should return a 
          JobStatus with status === "Finalizado", 
          a list of 3 different files (stdout, stderr, TranslatedText), 
          elapsedTime, and responseTime should not be null nor undefined`, async () => {
    const job: Job = {
      id: 'Test_'+Date.now(),
      url: "https://salvachillo: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@github.com/SalvaChiLlo/jobCC.git",
      args: "es",
      config: "{\"DEEPL_API_KEY\":\"57f25c3f-497c-6a8a-7337-6772230b89a1:fx\",\"SOURCE_TEXT\":\"Job launched from the test area\"}",
      username: 'myUser'
    }
    const jobStatus = await launchJob(job)

    expect(jobStatus).to.not.be.null
    expect(jobStatus).to.not.be.undefined
    expect(jobStatus.id).to.be.eq(job.id)
    expect(jobStatus.outputFiles).to.not.be.undefined
    expect(jobStatus.outputFiles.length).to.be.eq(3)
    expect(jobStatus.elapsedTime).to.not.be.undefined
    expect(jobStatus.responseTime).to.not.be.undefined

    const fileReader = await minioClient.getObject(config.MINIO_BUCKET, `${job.id}/TranslatedText`);
    expect(fileReader.read().toString()).to.be.eq('Trabajo lanzado desde la zona de pruebas')
  }).timeout(15 * 1000)
})