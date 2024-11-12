module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "POST",
      path: "/records/create-multiple",
      handler: "record.createMultiple",
    },
    {
      // Nueva ruta para editar múltiples registros
      method: "PUT",
      path: "/records/update-multiple",
      handler: "record.updateMultiple",
    },
    {
      method: "POST",
      path: "/create-bulk-entries",
      handler: "record.createBulkEntries",
    },
    {
      method: "GET",
      path: "/clean-records",
      handler: "record.customCleanedRecords",
    },
  ],
};
