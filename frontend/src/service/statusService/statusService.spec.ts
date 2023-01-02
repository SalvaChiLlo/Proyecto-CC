import { expect } from "chai"
import { checkServerStatus, getLoad } from "./statusService"
import { wait } from "../../utils/utils"

// Group of tests using describe
describe('Status service tests', function () {
  it('Status check test', () => {
    expect(checkServerStatus()).to.be.eq('<h1>Server is running</h1>')
  })

  it('Check get load info', async () => {
    await wait(15)
    const load = getLoad()

    expect(load).to.not.be.null;
    expect(load).to.not.be.undefined;
    expect(load).to.not.be.empty;
  }).timeout(20 * 1000)
})