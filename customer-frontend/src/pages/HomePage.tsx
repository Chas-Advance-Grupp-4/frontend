import { Button } from "@frontend/common";
import { Scan } from "lucide-react";

export default function HomePage() {
	return (
		<div className="text-center">
			<h1>Hi, {name}</h1>
			<Button onClick={() => alert("Button clicked!")}>My parcels</Button>
			<Button onClick={() => alert("Button clicked!")}></Button>
		</div>
	);
}
