// import assert from 'assert';
import HamalJubi from '../lib';

const client = new HamalJubi({
  key: '',
  secret: ''
});
const coin = 'eth';

describe('hamal-jubi', function () {
  it('balance', function (done) {
    client.balance().then(data => {
      console.log(data);
      done();
    });
  });

  it('wallet', function (done) {
    client.wallet(coin).then(data => {
      console.log(data);
      done();
    }).catch(done);
  });

  ['ticker', 'depth', 'orders'].forEach(method => {
    it(method, function (done) {
      client[method](coin).then(data => {
        console.log(data);
        done();
      }).catch(done);
    });
  });
});
