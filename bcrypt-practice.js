const bcrypt = require('bcryptjs');

const password = '1234';

// Async
bcrypt.genSalt(10, (err, salt) => {
  console.log(salt);
});

// sync
const salt = bcrypt.genSaltSync(10);
console.log(salt);
