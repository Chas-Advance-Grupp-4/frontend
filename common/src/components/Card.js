"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Card;
var clsx_1 = require("clsx");
function Card(_a) {
    var title = _a.title, subtitle = _a.subtitle, children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b;
    return (<div className={(0, clsx_1.default)("card w-80 p-4", className)}>
      {title && <h2 className="card-title text-lg font-semibold">{title}</h2>}
      {subtitle && <p className="card-subtitle text-sm">{subtitle}</p>}
      <div className="card-text mt-2">{children}</div>
    </div>);
}
