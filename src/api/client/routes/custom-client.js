
module.exports = {
    routes: [
      { // Path defined with a URL parameter
        method: 'POST',
        path: '/clients/create-multiple',
        handler: 'client.createMultiple',
      }
    ]
  }
  