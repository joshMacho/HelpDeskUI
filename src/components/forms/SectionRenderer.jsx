// forms/SectionRenderer.jsx
import FieldRenderer from "./FieldRenderer";

export default function SectionRenderer({ section }) {
  return (
    <div style={{ marginBottom: 40 }} className="section">
      {/* <h2>{section.label}</h2> */}

      {section.fields &&
        section.fields.map((field, index) => (
          <FieldRenderer
            key={`${field.name}=${index}`}
            field={field}
            parentName={section.name}
          />
        ))}

      {/* ✅ Handle array sections (like vehicles) */}
      {section.type === "array" && (
        <FieldRenderer field={section} parentName={section.name} />
      )}
    </div>
  );
}
