const FlakeIdGen = require('flake-idgen');
const base62 = require('base62/lib/ascii');

const gen = new FlakeIdGen({ datacenter: 1, worker: 1 });

function newShortCode() {
  return new Promise((resolve, reject) => {
    gen.next((err, id) => {
      if (err) return reject(err);
      const n = id.readUInt32BE(0);
      resolve({ id: id.readBigUInt64BE(0).toString(), code: base62.encode(n) });
    });
  });
}

module.exports = { newShortCode };
