"use strict";
// manages { token, user }, persists to storage, exposes login/logout
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
var react_1 = require("react");
var authApi_1 = require("../../lib/authApi");
var storage_1 = require("../../lib/storage");
var AuthCtx = (0, react_1.createContext)(null);
function AuthProvider(_a) {
    var _this = this;
    var children = _a.children, _b = _a.storageKey, storageKey = _b === void 0 ? "auth" : _b;
    var _c = (0, react_1.useState)(null), token = _c[0], setToken = _c[1];
    var _d = (0, react_1.useState)(null), user = _d[0], setUser = _d[1];
    var _e = (0, react_1.useState)(false), ready = _e[0], setReady = _e[1];
    (0, react_1.useEffect)(function () {
        var saved = (0, storage_1.getJSON)("session", storageKey);
        if (saved) {
            setToken(saved.token);
            setUser(saved.user);
        }
        setReady(true);
    }, [storageKey]);
    var login = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, authApi_1.login)(username, password)];
                case 1:
                    data = _a.sent();
                    setToken(data.access_token);
                    setUser(data.user);
                    (0, storage_1.setJSON)("session", { token: data.access_token, user: data.user }, storageKey);
                    return [2 /*return*/];
            }
        });
    }); };
    var logout = function () {
        setToken(null);
        setUser(null);
        (0, storage_1.remove)("session", storageKey);
    };
    var value = (0, react_1.useMemo)(function () { return ({ token: token, user: user, login: login, logout: logout, ready: ready }); }, [token, user, ready]);
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
function useAuth() {
    var ctx = (0, react_1.useContext)(AuthCtx);
    if (!ctx)
        throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
