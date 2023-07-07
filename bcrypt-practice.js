const bcrypt = require('bcryptjs');

const password = '1234';

// sync
const salt = bcrypt.genSaltSync(10);
console.log('salt: ',salt);

const hash = bcrypt.hashSync(password, salt);
console.log('hash: ',hash);

const storedHash = '$2a$10$AactWg6XjQ8kQiTstOLdtew.zt18FUqgQdgnoevpY/7sIIpTpedLe';

const isMatch = bcrypt.compareSync(password, storedHash);
console.log(isMatch);
