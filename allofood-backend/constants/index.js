const REGEX = {
  EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
  NAME: /^[a-zA-Z\u00C0-\u017F]{2,30}(([',. -][a-zA-Z\u00C0-\u017F ])?[a-zA-Z\u00C0-\u017F]*)*$/,
  PHONE: /^\+?[\d\s-]{10,}$/
};

const ERROR_MESSAGES = {
  required: field => `${field} is required`,
  email: 'Please enter a valid email address',
  password: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
  passwordMatch: 'Passwords do not match',
  name: "Name must be 2-30 characters long and can only contain letters, spaces, and certain special characters (',.-)",
  phone: 'Please enter a valid phone number'
};

module.exports = { REGEX, ERROR_MESSAGES };