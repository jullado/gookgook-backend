export const config = () => ({
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/looklook',
});
