"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isInIframe = exports.isInIframe = function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (error) {
    return true;
  }
};