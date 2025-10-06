import BottomNav from "@/components/layout/BottomNav";
import OptionsNav from "@/components/layout/OptionsNav";

export default function HomePage() {
  return (
    <div className="text-center">
      <h1>This is the homepage</h1>
      <OptionsNav />
      
      <BottomNav />
    </div>
  );
}
