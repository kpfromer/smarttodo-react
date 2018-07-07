import validateIsEmail from "validator/lib/isEmail";

export const required = isRequired => ({
  hint: name => isRequired ? `${name} is required` : '',
  validate: value => isRequired ? !!value : true
});

export const minLength = minValue => ({
  hint: name => `${name} must be ${minValue + 1} characters or more`,
  validate: value => value.length > minValue
});

export const maxLength = maxValue => ({
  hint: name => `${name} must be ${maxValue - 1} characters or less`,
  validate: value => value.length < maxValue
});

export const email = isEmail => ({
  hint: () => isEmail ? `Must be a valid email` : '',
  validate: value => isEmail ? validateIsEmail(value) : true
});