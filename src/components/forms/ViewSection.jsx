import ViewField from "./ViewField";

export default function ViewSection({ section, data }) {
  return (
    <div className="space-y-6">
      {(section?.fields || []).map((field, index) => (
        <ViewField key={field.name || index} field={field} data={data} />
      ))}
    </div>
  );
}
