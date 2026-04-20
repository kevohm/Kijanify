const UsernamePasswordStrategy = require("../passport/UsernamePasswordStrategy");
const JwtStrategy = require("../passport/JwtStrategy");
const { getUserByEmail, getUserById } = require("../services/userService");
const { verifyPassword, verifyJwt } = require("../services/authService");

function configurePassport(passport) {
  passport.use(
    new UsernamePasswordStrategy(
      { name: "local", usernameField: "email", passwordField: "password" },
      async (email, password) => {
        const user = await getUserByEmail(email);
        if (!user) return null;

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;

        return user;
      },
    ),
  );

  passport.use(
    new JwtStrategy({ name: "jwt", verifyToken: verifyJwt }, async (payload) => {
      const userId = payload?.id;
      if (!userId) return null;
      return getUserById(userId);
    }),
  );
}

module.exports = configurePassport;

