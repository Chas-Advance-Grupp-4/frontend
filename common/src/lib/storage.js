"use strict";
// localStorage helpers (get/set/remove with namespacing)
Object.defineProperty(exports, "__esModule", { value: true });
exports.setJSON = setJSON;
exports.getJSON = getJSON;
exports.remove = remove;
var ns = function (key, prefix) {
    if (prefix === void 0) { prefix = "auth"; }
    return "".concat(prefix, ":").concat(key);
};
function setJSON(key, value, prefix) {
    localStorage.setItem(ns(key, prefix), JSON.stringify(value));
}
function getJSON(key, prefix) {
    var raw = localStorage.getItem(ns(key, prefix));
    return raw ? JSON.parse(raw) : null;
}
function remove(key, prefix) {
    localStorage.removeItem(ns(key, prefix));
}
