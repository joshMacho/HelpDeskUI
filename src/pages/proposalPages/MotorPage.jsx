import { useEffect } from "react";
import DynamicForm from "../../components/forms/DynamicForm";
import motorSchema from "../../data/motor.json";
import NSIABanner from "../../components/ui/NSIABanner";

export default function MotorPage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page-proposal">
      <div className="banner">
        <NSIABanner proposal={`MOTOR Insurance`} />
      </div>
      <DynamicForm schema={motorSchema} />
    </div>
  );
}
