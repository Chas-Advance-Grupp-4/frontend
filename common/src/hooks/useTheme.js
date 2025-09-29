"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useTheme;
var react_1 = require("react");
function useTheme() {
    var _a = (0, react_1.useState)(function () {
        if (typeof window !== "undefined") {
            var stored = localStorage.getItem("theme");
            return stored === "dark" || stored === "light" ? stored : "light";
        }
        return "light";
    }), theme = _a[0], setTheme = _a[1];
    (0, react_1.useEffect)(function () {
        var root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        }
        else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);
    var toggleTheme = function () {
        setTheme(function (prev) { return (prev === "dark" ? "light" : "dark"); });
    };
    return { theme: theme, toggleTheme: toggleTheme };
}
