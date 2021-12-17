'use strict';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const https = require("https");
const http = require("http");
const zlib = require("zlib");
const { URL } = require("url");
const qs = require("qs");
const getType = require("js-cool/lib/getType");
const { debug } = require("./utils/debug");
const { version: GITMARS_VERSION } = require("../../package.json");
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
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 Gitmars/" + GITMARS_VERSION
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
  request(method, url, postData, headers = {}, options = {}) {
    const urlObj = new URL(url);
    headers = __spreadValues(__spreadValues({}, this.getHeaders(urlObj.host, postData)), headers);
    const params = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers
    };
    return new Promise((resolve, reject) => {
      const req = (urlObj.protocol == "http:" ? http : https).request(params, (res) => {
        const chunks = [];
        res.on("data", (buffer) => {
          chunks.push(buffer);
        });
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const encoding = res.headers["content-encoding"];
          let data;
          if (encoding === "gzip") {
            zlib.gunzip(buffer, function(err, decoded) {
              data = decoded.toString();
            });
          } else if (encoding === "deflate") {
            zlib.inflate(buffer, function(err, decoded) {
              data = decoded.toString();
            });
          } else {
            data = buffer.toString();
            try {
              data = JSON.parse(data);
            } catch (e) {
            }
          }
          debug("request-result", { method, url, postData, headers, options }, data);
          if (/<html>/.test(data) || getType(data) === "object" && (data.status === false || data.success === false)) {
            if (options.error) {
              reject(data);
            } else {
              console.error(typeof data === "object" ? data.msg || data.message : data);
            }
            return;
          }
          resolve(data);
        });
      });
      req.on("error", (err) => {
        if (options.error) {
          reject(err);
          return;
        }
        console.error(err);
      });
      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  }
  async get({ url, data = {}, headers = {}, options = {} }) {
    const postData = qs.stringify(data, {
      arrayFormat: "indices",
      allowDots: true
    });
    if (postData) {
      url += url.indexOf("?") === -1 ? "?" : "&";
      url += postData;
    }
    return await this.request("GET", url, "", headers, options);
  }
  async post({ url, data = {}, headers = {}, options = {} }) {
    let postData;
    if (["application/json"].includes(headers["Content-Type"])) {
      postData = JSON.stringify(data);
    } else {
      postData = qs.stringify(data, {
        arrayFormat: "indices",
        allowDots: true
      });
    }
    return await this.request("POST", url, postData, headers, options);
  }
  async put({ url, data = {}, headers = {}, options = {} }) {
    let postData;
    if (["application/json"].includes(headers["Content-Type"])) {
      postData = JSON.stringify(data);
    } else {
      postData = qs.stringify(data, {
        arrayFormat: "indices",
        allowDots: true
      });
    }
    return await this.request("PUT", url, postData, headers, options);
  }
  async delete({ url, data = {}, headers = {}, options = {} }) {
    let postData;
    if (["application/json"].includes(headers["Content-Type"])) {
      postData = JSON.stringify(data);
    } else {
      postData = qs.stringify(data, {
        arrayFormat: "indices",
        allowDots: true
      });
    }
    return await this.request("DELETE", url, postData, headers, options);
  }
}
module.exports = new Request();
