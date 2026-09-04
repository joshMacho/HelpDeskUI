import { useEffect } from "react";
import DynamicForm from "../../components/forms/DynamicForm";
import travelSchema from "../../data/travel.json";
import NSIABanner from "../../components/ui/NSIABanner";

export default function TravelPage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page-proposal">
      <div className="banner">
        <NSIABanner proposal={`TRAVEL Insurance`} />
      </div>
      <DynamicForm schema={travelSchema} />
    </div>
  );
}
