module.exports = {
  routes: [
    {
      method: "GET",
      path: "/cron-jobs",
      handler: "billy-configuration.listCrons",
      config: {
        auth: false, // Cambia a true si necesitas autenticación
        policies: [],
        middlewares: [],
      },
    },
  ],
};
