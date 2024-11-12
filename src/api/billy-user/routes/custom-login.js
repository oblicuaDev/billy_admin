module.exports = {
  routes: [
    {
      method: "POST",
      path: "/billy-user/login",
      handler: "billy-user.login",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/billy-user/register",
      handler: "billy-user.register",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
