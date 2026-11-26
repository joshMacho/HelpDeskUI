import DynamicForm from "../../components/forms/DynamicForm";
import NSIABanner from "../../components/ui/NSIABanner";
import publicSchema from "../../data/publicLiability.json";

export default function PublicLiabilityPage() {
  return (
    <div className="main-page-proposal">
      <div className="banner">
        <NSIABanner proposal={`PUBLIC LIABILITY Insurance`} />
      </div>
      <DynamicForm schema={publicSchema} />
    </div>
  );
}
