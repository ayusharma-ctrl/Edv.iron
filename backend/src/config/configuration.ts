// access env variables
export const AppConfig = () => ({
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  frontend_url: process.env.FRONTEND_URL,
  jwt_secret: process.env.JWT_SECRET,
  pg_key: process.env.PG_KEY,
  pg_uri: process.env.PG_URI,
  callback_url: process.env.CALLBACK_URL,
  payment_api_key: process.env.PAYMENT_API_KEY,
});
