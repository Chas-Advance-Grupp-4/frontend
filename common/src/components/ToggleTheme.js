"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleTheme = ToggleTheme;
var lucide_react_1 = require("lucide-react");
var useTheme_1 = require("../hooks/useTheme");
function ToggleTheme() {
    var _a = (0, useTheme_1.default)(), theme = _a.theme, toggleTheme = _a.toggleTheme;
    return (<button onClick={toggleTheme} title="change theme" aria-label="Toggle theme">
            {theme === "dark" ?
            <lucide_react_1.Sun size={20} className="text-white"/>
            :
                <lucide_react_1.Moon size={20} className="text-black"/>}  
        </button>);
}
exports.default = ToggleTheme;
