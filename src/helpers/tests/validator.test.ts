import { isObject, objectSchemaSimple } from '../validator';

describe('validator', () => {
  it('should type-guard that subject is an object iff it is a js object', () => {
    const jsObject = { someKey: 'someValue' };
    expect(isObject(jsObject)).toBe(true);

    const jsArray = ['should', 'not', 'pass', 'validator'];
    expect(isObject(jsArray)).toBe(false);

    // typeof null === 'object' is true for reasons you don't want to know
    expect(isObject(null)).toBe(false);
  });

  it('should type-guard if an object passes a simple schema validator', () => {
    interface TestError {
      errorNumber: number;
      message: string;
      errorObject: Error;
    }

    // we are testing this validator
    const isTestError = objectSchemaSimple<TestError>({
      errorNumber: 'number',
      message: 'string',
      errorObject: 'object',
    });

    // fine
    const testError = {
      errorNumber: 1,
      message: 'oops',
      errorObject: new Error('hi!'),
    };
    expect(isTestError(testError)).toBe(true);

    // fine
    const testErrorWithMore = {
      ...testError,
      extra: 'hello there',
    };
    expect(isTestError(testErrorWithMore)).toBe(true);

    // not fine
    const notTestError = {
      message: 'not enough info!',
    };
    expect(isTestError(notTestError)).toBe(false);
  });
});
