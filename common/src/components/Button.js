"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Button;
var clsx_1 = require("clsx");
function Button(_a) {
    var loading = _a.loading, _b = _a.variant, variant = _b === void 0 ? "primary" : _b, _c = _a.appearance, appearance = _c === void 0 ? "filled" : _c, className = _a.className, children = _a.children, rest = __rest(_a, ["loading", "variant", "appearance", "className", "children"]);
    var baseStyles = "rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-60";
    var variantMap = {
        primary: {
            filled: "bg-blue-600 text-white hover:bg-blue-700",
            outline: "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50",
            ghost: "text-blue-600 bg-transparent hover:bg-blue-50",
        },
        secondary: {
            filled: "bg-gray-600 text-white hover:bg-gray-700",
            outline: "border border-gray-600 text-gray-600 bg-transparent hover:bg-gray-50",
            ghost: "text-gray-600 bg-transparent hover:bg-gray-50",
        },
        danger: {
            filled: "bg-red-600 text-white hover:bg-red-700",
            outline: "border border-red-600 text-red-600 bg-transparent hover:bg-red-50",
            ghost: "text-red-600 bg-transparent hover:bg-red-50",
        },
        success: {
            filled: "bg-green-600 text-white hover:bg-green-700",
            outline: "border border-green-600 text-green-600 bg-transparent hover:bg-green-50",
            ghost: "text-green-600 bg-transparent hover:bg-green-50",
        },
        warning: {
            filled: "bg-amber-500 text-white hover:bg-amber-600",
            outline: "border border-amber-500 text-amber-500 bg-transparent hover:bg-amber-50",
            ghost: "text-amber-500 bg-transparent hover:bg-amber-50",
        },
    };
    var styles = variantMap[variant][appearance];
    return (<button className={(0, clsx_1.default)(baseStyles, styles, className)} disabled={loading || rest.disabled} {...rest}>
      {loading ? "Loading…" : children}
    </button>);
}
