import { useEffect } from "react";
import DynamicForm from "../../components/forms/DynamicForm";
import homeSchema from "../../data/homehouse.json";

export default function HomeHousePage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page-proposal">
      <div className="banner"></div>
      <DynamicForm schema={homeSchema} />
    </div>
  );
}
