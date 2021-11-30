'use strict';

const https = require("https");
const http = require("http");
const zlib = require("zlib");
const { URL } = require("url");
const qs = require("qs");
class Request {
  constructor() {
    this.cookies = [];
  }
  getHeaders(host, postData) {
    const headers = {
      Host: host,
      rejectUnauthorized: false,
      Pragma: "no-cache",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,es;q=0.2",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36"
    };
    if (this.cookies.length) {
      headers.Cookie = this.cookies.join("; ");
    }
    if (postData) {
      headers["Content-Length"] = Buffer.byteLength(postData);
    }
    return headers;
  }
  setCookie(cookie) {
    const cookies = cookie.split(";");
    for (let item of cookies) {
      item = item.replace(/^\s/, "");
      this.cookies.push(item);
    }
    return this;
  }
  request(method, url, params) {
    const postData = qs.stringify(params || {}, {
      arrayFormat: "indices",
      allowDots: true
    });
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: this.getHeaders(urlObj.host, postData)
    };
    return new Promise((resolve, reject) => {
      const req = (urlObj.protocol == "http:" ? http : https).request(options, (res) => {
        const chunks = [];
        res.on("data", (buf) => {
          chunks.push(buf);
        });
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const encoding = res.headers["content-encoding"];
          if (encoding === "gzip") {
            zlib.gunzip(buffer, function(err, decoded) {
              resolve(decoded.toString());
            });
          } else if (encoding === "deflate") {
            zlib.inflate(buffer, function(err, decoded) {
              resolve(decoded.toString());
            });
          } else {
            resolve(JSON.parse(buffer.toString()));
          }
        });
      });
      req.on("error", (err) => {
        reject(err);
      });
      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  }
  async get({ url }) {
    return await this.request("GET", url);
  }
  async post({ url, params }) {
    return await this.request("POST", url, params);
  }
}
module.exports = new Request();
