"use strict";
// guards nested routes; accepts optional redirectTo="/login" prop
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
var react_router_dom_1 = require("react-router-dom");
var AuthProvider_1 = require("./AuthProvider");
function ProtectedRoute(_a) {
    var _b = _a.redirectTo, redirectTo = _b === void 0 ? "/login" : _b;
    var _c = (0, AuthProvider_1.useAuth)(), token = _c.token, ready = _c.ready;
    if (!ready)
        return null; // or loader
    return token ? <react_router_dom_1.Outlet /> : <react_router_dom_1.Navigate to={redirectTo} replace/>;
}
