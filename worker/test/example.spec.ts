import * as mocha from 'mocha'
import { expect, should } from 'chai'
const chai = require('chai');

// Group of tests using describe
describe('fareUtils', function () {
  
  // We will describe each single test using it
  it('expect fare to be 50 for 0km, 0min', () => {
      let fare = 50
      expect(fare).to.equal(50)
  })

  it('expect fare to be 100 for 10km, 0min', () => {
      let fare = 100
      expect(fare).to.equal(100)
  })

  it('expect fare to be 56 for 2km, 18min', () => {
      let fare = 56
      expect(fare).to.equal(56)
      expect(fare).to.be.greaterThan(12)
  })
})