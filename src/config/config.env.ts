export const config = () => ({
  port: process.env.PORT || 3000,
  jwtSecretAccess: process.env.JWT_SECRET_ACCESS || 'secret',
  jwtExpiresInAccess: process.env.JWT_EXPIRES_IN_ACCESS || '15m',
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH || 'secret',
  jwtExpiresInRefresh: process.env.JWT_EXPIRES_IN_REFRESH || '1d',
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/looklook',
});
