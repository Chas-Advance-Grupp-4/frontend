"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Input;
var react_1 = require("react");
function Input(props) {
    return (<input {...props} className={"w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none " +
            (props.className || "")}/>);
}
