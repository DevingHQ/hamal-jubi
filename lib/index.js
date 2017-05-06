import request from 'request-promise';
import crypto from 'crypto';
import querystring from 'querystring';

const DOMAIN = 'https://www.jubi.com';

export default class {
  constructor({key, secret, version = 'v1'}) {
    this._key = key;
    this._version = version;

    const _secret = crypto.createHash('md5').update(secret).digest('hex');
    this._hasher = crypto.createHmac('sha256', _secret);

    this._generatePublicMetheds();
  }

  // private api
  balance() {
    const api = this._makeApi('balance');
    return this._post(api);
  }

  wallet(coin) {
    const api = this._makeApi('wallet');
    return this._post(api, {coin});
  }

  tradeList(coin, all = 0, since = 0) {
    const type = all ? 'all' : 'open';
    const api = this._makeApi('trade_list');
    return this._post(api, {coin, type, since});
  }

  tradeView(coin, id) {
    const api = this._makeApi('trade_view');
    return this._post(api, {coin, id});
  }

  tradeCancel(coin, id) {
    const api = this._makeApi('trade_cancel');
    return this._post(api, {coin, id});
  }

  tradeAdd(type, {coin, price, amount}) {
    const api = this._makeApi('trade_add');
    return this._post(api, {type, coin, price, amount});
  }

  buy(coin, price, amount) {
    return this.tradeAdd('buy', {coin, price, amount});
  }

  sell(coin, price, amount) {
    return this.tradeAdd('sell', {coin, price, amount});
  }

  // Utils
  _generatePublicMetheds() {
    ['ticker', 'depth', 'orders'].forEach(item => {
      this[item] = coin => {
        const api = this._makeApi(item);
        return this._get(api, {coin});
      };
    });
  }

  _makeApi(name) {
    return `/api/${this._version}/${name}`;
  }

  _sign(params = {}) {
    params.key = this._key;
    params.nonce = new Date().getTime();

    const temp = {};
    Object.keys(params).forEach(key => {
      temp[key] = params[key];
    });
    const qs = querystring.stringify(temp);
    params.signature = this._hasher.update(qs).digest('hex');
    return params;
  }

  _get(api, qs) {
    const uri = DOMAIN + api;
    return request.get({uri, qs});
  }

  _post(api, params) {
    const uri = DOMAIN + api;
    const form = this._sign(params);
    return request.post({uri, form});
  }
}
