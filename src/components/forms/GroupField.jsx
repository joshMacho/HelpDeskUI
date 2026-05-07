// forms/GroupField.jsx
import FieldRenderer from "./FieldRenderer";

export default function GroupField({ field, parentName }) {
  return (
    <div>
      {/* <h4>{field.label}</h4> */}
      <div className="group">
        {field.fields.map((subField) => (
          <FieldRenderer
            key={subField.name}
            field={subField}
            parentName={parentName}
          />
        ))}
      </div>
    </div>
  );
}
