import BottomNav from "../components/layout/BottomNav";
import Deliveries from "./Deliveries";

// const deliveries = [
// 	{
// 		id: "ORD-001",
// 		customer: "Alice Johnson",
// 		address: "123 Main St",
// 		status: "On the Way",
// 		eta: "15 mins",
// 	},
// 	{
// 		id: "ORD-002",
// 		customer: "Bob Smith",
// 		address: "456 Elm St",
// 		status: "Delivered",
// 		eta: "0 mins",
// 	},
// 	{
// 		id: "ORD-003",
// 		customer: "Carol Davis",
// 		address: "789 Oak St",
// 		status: "Pending",
// 		eta: "30 mins",
// 	},
// 	{
// 		id: "ORD-004",
// 		customer: "David Wilson",
// 		address: "321 Pine St",
// 		status: "On the Way",
// 		eta: "20 mins",
// 	},
// 	{
// 		id: "ORD-005",
// 		customer: "Eva Brown",
// 		address: "654 Maple St",
// 		status: "Delayed",
// 		eta: "45 mins",
// 	},
// ];

const HomePage: React.FC = () => {
  return (
    <div className="bg-bg-default">
        <h1 className="text-2xl text-text-primary font-bold mb-6 text-center">Deliveries 📦</h1>
        <Deliveries />
      <BottomNav />
    </div>
  );
};

export default HomePage;
