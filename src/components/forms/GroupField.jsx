// forms/GroupField.jsx
import FieldRenderer from "./FieldRenderer";
import ConditionalField from "./ConditionalField";

export default function GroupField({ field, parentName }) {
  return (
    <div>
      <div className="group">
        {field.fields.map((subField, index) =>
          subField.showWhen ? (
            <ConditionalField
              key={`${subField.name}-${index}`}
              field={subField}
              parentName={parentName}
            />
          ) : (
            <FieldRenderer
              key={`${subField.name}-${index}`}
              field={subField}
              parentName={parentName}
            />
          ),
        )}
      </div>
    </div>
  );
}
