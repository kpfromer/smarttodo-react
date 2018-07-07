import * as validatedMethods from "./TextValidatedMethods";

describe('TextValidatedMethods', () => {
  let name = 'hintName';
  [
    {
      name: 'required',
      value: true,
      expected: [
        ['notempty', true],
        ['', false]
      ]
    },
    {
      name: 'minLength',
      value: 4,
      expected: [
        ['four', false],
        ['five5', true]
      ]
    },
    {
      name: 'maxLength',
      value: 6,
      expected: [
        ['sixsix', false],
        ['five', true]
      ]
    },
    {
      name: 'email',
      value: true,
      expected: [
        ['valid@email.com', true],
        ['invalid.com', false],
        ['invalid@email', false]
      ]
    }
  ].forEach(
    ({ name: methodName, value, expected }) => {

      describe(methodName, () => {
        let hintFn, validateFn;

        beforeEach(() => {
          ({ hint: hintFn, validate: validateFn } = validatedMethods[methodName](value));
        });

        it('creates a hint with the input name', () => {
          expect(hintFn(name)).toMatchSnapshot();
        });

        describe('validation', () => {
          expected.forEach(value => {
            const [ inputValue, expectedValue ] = value;
            const message = expectedValue ? 'valid' : 'invalid';
            it(`expect ${inputValue} to be ${message}`, () =>
              expect(validateFn(inputValue)).toBe(expectedValue)
            );
          });
        });
      });
    }
  );

  describe('required', () => {

  });

  describe('minLength', () => {

  });

  describe('maxLength', () => {

  });

  describe('email', () => {

  });
});