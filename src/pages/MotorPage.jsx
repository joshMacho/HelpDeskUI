import { useEffect } from "react";
import DynamicForm from "../components/forms/DynamicForm";
import motorSchema from "../data/motor.json";

export default function MotorPage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page">
      <div className="banner"></div>
      <DynamicForm schema={motorSchema} />
    </div>
  );
}
