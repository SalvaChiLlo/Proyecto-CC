import { AxiosError } from 'axios';
import { assert, expect } from 'chai';
import { login } from './authService';

// Group of tests using describe
describe('Auth service tests', function () {
  it('Should get token with correct username and password', async () => {
    const res = await login('myuser', '1234');

    expect(res).to.not.be.undefined;
    expect(res).to.not.be.null;
    assert(!(res instanceof AxiosError))
    assert(typeof res === 'string')
  })

  it('Should not get token with incorrect username', async () => {
    const res = await login('incorrect', '1234');

    expect(res).to.not.be.undefined;
    expect(res).to.not.be.null;
    assert(res instanceof AxiosError)
  })

  it('Should not get token with incorrect password', async () => {
    const res = await login('myuser', 'incorrect');

    expect(res).to.not.be.undefined;
    expect(res).to.not.be.null;
    assert(res instanceof AxiosError)
  })

  it('Should not get token with incorrect pusername and assword', async () => {
    const res = await login('incorrect', 'incorrect');

    expect(res).to.not.be.undefined;
    expect(res).to.not.be.null;
    assert(res instanceof AxiosError)
  })
})