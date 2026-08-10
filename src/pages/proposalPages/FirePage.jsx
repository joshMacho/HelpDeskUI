import { useEffect } from "react";
import DynamicForm from "../../components/forms/DynamicForm";
import fireSchema from "../../data/fire.json";

export default function FirePage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page">
      <div className="banner"></div>
      <DynamicForm schema={fireSchema} />
    </div>
  );
}
