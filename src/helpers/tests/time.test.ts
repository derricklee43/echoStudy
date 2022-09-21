import { getFormattedMilliseconds } from '../time';

describe('getFormattedMilliseconds', () => {
  it('should return ~0:01 for times less than one second', () => {
    expect(getFormattedMilliseconds(999)).toEqual('~0:01');
  });

  it('100000ms should return 1:40', () => {
    expect(getFormattedMilliseconds(100000)).toEqual('1:40');
  });

  it('should round to a whole second', () => {
    expect(getFormattedMilliseconds(1001)).toEqual('0:01');
  });

  it('should how hours when over 60 minutes', () => {
    expect(getFormattedMilliseconds(10000000)).toEqual('2:46:40');
  });
});
