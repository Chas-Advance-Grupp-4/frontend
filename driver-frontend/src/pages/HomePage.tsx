import BottomNav from "@/components/layout/BottomNav";
import OptionsNav from "@/components/layout/OptionsNav";
import { Button, Card } from "@frontend/common";

const deliveries = [
	{
		id: "ORD-001",
		customer: "Alice Johnson",
		address: "123 Main St",
		status: "On the Way",
		eta: "15 mins",
	},
	{
		id: "ORD-002",
		customer: "Bob Smith",
		address: "456 Elm St",
		status: "Delivered",
		eta: "0 mins",
	},
	{
		id: "ORD-003",
		customer: "Carol Davis",
		address: "789 Oak St",
		status: "Pending",
		eta: "30 mins",
	},
	{
		id: "ORD-004",
		customer: "David Wilson",
		address: "321 Pine St",
		status: "On the Way",
		eta: "20 mins",
	},
	{
		id: "ORD-005",
		customer: "Eva Brown",
		address: "654 Maple St",
		status: "Delayed",
		eta: "45 mins",
	},
];

const HomePage: React.FC = () => {
  return (
    <div className="bg-bg-default">
      <OptionsNav />
        <h1 className="p-6 space-y-4 text-text-primary">Deliveries</h1>
        <section className="p-6 flex flex-wrap justify-center gap-4">
				{deliveries.map((d) => (
					<Card key={d.id} title={d.customer} subtitle={d.address}>
						<p>Status: {d.status}</p>
						<p>ETA: {d.eta}</p>
					</Card>
				))}
			</section>
			<section className="display flex flex-col items-center gap-4 p-6">
				<h1>Button Variants</h1>
				<div className="flex flex-wrap justify-center gap-4">
					{/* Primary Buttons */}
					<Button variant="primary" appearance="filled">
						Primary Button
					</Button>
					<Button variant="primary" appearance="outline">
						Primary Outline
					</Button>

					{/* Secondary Buttons */}
					<Button variant="secondary" appearance="filled">
						Secondary Button
					</Button>
					<Button variant="secondary" appearance="outline">
						Secondary Outline
					</Button>

					{/* Danger Buttons */}
					<Button variant="danger" appearance="filled">
						Danger Button
					</Button>
					<Button variant="danger" appearance="outline">
						Danger Outline
					</Button>
				</div>
			</section>
      <BottomNav />
    </div>
  );
};

export default HomePage;
