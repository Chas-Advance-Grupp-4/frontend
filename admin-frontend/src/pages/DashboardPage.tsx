import React from "react";
import Card from "../../../common/src/components/Card";

const deliveries = [
  { id: "ORD-001", customer: "Alice Johnson", address: "123 Main St", status: "On the Way", eta: "15 mins" },
  { id: "ORD-002", customer: "Bob Smith", address: "456 Elm St", status: "Delivered", eta: "0 mins" },
  { id: "ORD-003", customer: "Carol Davis", address: "789 Oak St", status: "Pending", eta: "30 mins" },
  { id: "ORD-004", customer: "David Wilson", address: "321 Pine St", status: "On the Way", eta: "20 mins" },
  { id: "ORD-005", customer: "Eva Brown", address: "654 Maple St", status: "Delayed", eta: "45 mins" },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="bg-bg-default">
  <div className="p-6 space-y-4 text-text-primary">Dashboard</div>
  <section className="p-6 flex flex-wrap justify-center gap-4">
      {deliveries.map((d) => (
        <Card
          key={d.id}
          title={d.customer}
          subtitle={d.address}
        >
          <p>Status: {d.status}</p>
          <p>ETA: {d.eta}</p>
        </Card>
      ))}
    </section>
  </div>
);
};

export default DashboardPage;
