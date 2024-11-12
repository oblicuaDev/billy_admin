module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "POST",
      path: "/invoices/create-multiple",
      handler: "invoice.createMultiple",
    },
    {
      // Nueva ruta para editar múltiples registros
      method: "PUT",
      path: "/invoices/update-multiple",
      handler: "invoice.updateMultiple",
    },
  ],
};
