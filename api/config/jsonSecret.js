let { JWT_SECRET } = process.env;

var jsonSecret = {
  secret: JWT_SECRET,
};

module.exports = jsonSecret;
