import { useEffect } from "react";
import DynamicForm from "../../components/forms/DynamicForm";
import homeSchema from "../../data/homehouse.json";
import NSIABanner from "../../components/ui/NSIABanner";

export default function HomeHousePage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page-proposal">
      <div className="banner">
        <NSIABanner proposal={`HOME or HOUSE Insurance`} />
      </div>
      <DynamicForm schema={homeSchema} />
    </div>
  );
}
