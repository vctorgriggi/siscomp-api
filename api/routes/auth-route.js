const { Router } = require("express");

const AuthController = require("../controllers/auth-controller");
const auth = require("../middlewares/auth");

const router = Router();

router
  /* sign in, sign up, sign out */
  .post("/sign-in", AuthController.signIn)
  .post("/sign-up", AuthController.signUp)
  .post("/sign-out", AuthController.signOut)

  /* reset password */
  .post("/forgot-password", AuthController.forgotPassword)
  .post("/reset-password/:id/:token", AuthController.resetPassword)

  /* validate token */
  .get("/validate-user-token", auth, AuthController.validateUserToken) // 'auth' is necessary to get the userId from the request
  .get("/validate-reset-token/:id/:token", AuthController.validateResetToken);

module.exports = router;
