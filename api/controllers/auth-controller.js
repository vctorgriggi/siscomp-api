const AuthService = require("../services/auth-service");

const authService = new AuthService();

class AuthController {
  /* authentication */
  static async signIn(req, res) {
    const { email, password } = req.body;

    try {
      const signIn = await authService.signIn({
        email,
        password,
      });

      res.cookie("authToken", signIn.authToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.status(200).json(signIn.user);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(401).send({ message: error.message });
    }
  }

  static async signUp(req, res) {
    const { firstName, lastName, email, password } = req.body;

    try {
      const signUp = await authService.signUp({
        firstName,
        lastName,
        email,
        password,
      });

      res.cookie("authToken", signUp.authToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.status(201).json(signUp.user);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async signOut(req, res) {
    res.clearCookie("authToken");

    return res.status(204).send();
  }

  /* reset password */
  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      await authService.forgotPassword(email);

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async resetPassword(req, res) {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
      await authService.resetPassword({ id, token, password });

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  /* validate token */
  static async validateUserToken(req, res) {
    const { userId } = req;

    try {
      const user = await authService.validateUserToken(userId);

      return res.status(200).json(user);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async validateResetToken(req, res) {
    const { id, token } = req.params;

    try {
      await authService.validateResetToken({ id, token });

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = AuthController;
