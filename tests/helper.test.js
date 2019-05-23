import { expect } from 'chai';
import Auth from '../util/auth';

describe('JWT, BCRYPT', () => {
  let result;
  it('Should return hashed password', () => {
    result = Auth.hashPassword('123456');
    expect(result).to.be.a('string');
  });
  it('Should return true if password matches hashed', () => {
    result = Auth.compareHash('123456', result);
    expect(result).to.be.equal(true);
  });
  it('Should return false if password does not matches hashed', () => {
    result = Auth.compareHash('12345', `${result}`);
    expect(result).to.be.equal(false);
  });
});
