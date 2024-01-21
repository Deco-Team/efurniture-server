export default () => ({
  mongodbUrl:
    process.env.MONGODB_CONNECTION_STRING ||
    'mongodb://localhost:27017/efurniture',
  mail: {
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT || 465),
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'SMTP_FROM_NAME',
  },
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'accessSecret',
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || 864000, // seconds
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
  JWT_REFRESH_EXPIRATION: Number(process.env.JWT_REFRESH_EXPIRATION) || 90, // 90 days
});

export const AuthRoles = {
  CUSTOMER: 'CUSTOMER',
  USER: 'user',
};

export const Sides = {
  CUSTOMER: 'customer',
  USER: 'user',
};

export const EMAIL_REGEX =
  /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;
export const PHONE_REGEX = /^(?:$|^[+]?\d{10,12}$)/; // empty or format

export const VN_TIMEZONE = 'Asia/Tokyo';
