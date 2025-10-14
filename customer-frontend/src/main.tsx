import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import "../../common/src/theme.css";
import App from "./App";

// set common base URL getter
import { setBaseUrlGetter } from "@frontend/common";
import { API_BASE_URL } from "./lib/env";
setBaseUrlGetter(() => API_BASE_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
