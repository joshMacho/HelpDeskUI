import { useEffect } from "react";
import DynamicForm from "../../components/forms/DynamicForm";
import travelSchema from "../../data/travel.json";

export default function TravelPage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page-proposal">
      <div className="banner"></div>
      <DynamicForm schema={travelSchema} />
    </div>
  );
}
