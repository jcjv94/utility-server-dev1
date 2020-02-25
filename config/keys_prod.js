module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  mongoAtlasURI: process.env.MONGO_ATLAS_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  emailID: process.env.BAANDA_EMAIL_FOR_VERIFY,
  emailPassKey: process.env.BAANDA_EMAIL_PASSKEY,
  emailHost: process.env.BAANDA_SERVER_URL,
  baandaApp: process.env.BAANDA_APP,
  jwtSecretKey: process.env.BAANDA_JWT_SECRET_KEY,
  clientHost: process.env.BAANDA_LOGIN_URL,
  clientHostRegister: process.env.BAANDA_REGISTER_URL
};