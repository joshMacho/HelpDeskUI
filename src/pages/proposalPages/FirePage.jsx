import { useEffect } from "react";
import DynamicForm from "../../components/forms/DynamicForm";
import fireSchema from "../../data/fire.json";
import NSIABanner from "../../components/ui/NSIABanner";

export default function FirePage() {
  useEffect(() => {}, []);

  return (
    <div className="main-page-proposal">
      <div className="banner">
        <NSIABanner proposal={`FIRE Insurance`} />
      </div>
      <DynamicForm schema={fireSchema} />
    </div>
  );
}
