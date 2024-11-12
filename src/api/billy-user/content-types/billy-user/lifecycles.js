const bcrypt = require('bcryptjs');

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
  },
  beforeUpdate(event) {
    const { data } = event.params;

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
  },
};
