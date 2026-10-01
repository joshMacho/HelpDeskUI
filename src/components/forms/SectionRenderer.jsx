// forms/SectionRenderer.jsx
import FieldRenderer from "./FieldRenderer";
import ConditionalField from "./ConditionalField";

export default function SectionRenderer({ section }) {
  return (
    <div style={{ marginBottom: 40 }} className="section">
      {section.fields &&
        section.fields.map((field, index) =>
          field.showWhen ? (
            <ConditionalField
              key={`${field.name}-${index}`}
              field={field}
              parentName={section.name}
            />
          ) : (
            <FieldRenderer
              key={`${field.name}-${index}`}
              field={field}
              parentName={section.name}
            />
          ),
        )}

      {/* handle array sections (like vehicles) */}
      {section.type === "array" && (
        <FieldRenderer field={section} parentName={section.name} />
      )}
    </div>
  );
}
