// forms/ArrayField.jsx
import { useFieldArray, useFormContext } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";
import { useEffect } from "react";

export default function ArrayField({ field, name }) {
  const { control, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  useEffect(() => {
    const currentValues = getValues(name) || [];

    const minItems = field.minItems ?? 1;

    if (currentValues.length < minItems) {
      for (let i = currentValues.length; i < minItems; i++) {
        append({});
      }
    }
  }, []);

  return (
    <div>
      {/* <h3>{field.label}</h3> */}

      {fields.map((item, index) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
          }}
        >
          {field.itemSchema.fields.map((subField) => (
            <FieldRenderer
              key={subField.name}
              field={subField}
              parentName={`${name}.${index}`}
            />
          ))}
          <div className="form-cancel-div">
            <button
              className="rem-btn"
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === (field.minItems ?? 1)}
            >
              {field?.removeButtonLabel || "Remove"}
            </button>
          </div>
        </div>
      ))}
      <div className="form-cancel-div">
        <button className="add-btn" type="button" onClick={() => append({})}>
          {field?.addButtonLabel || "Add Item"}
        </button>
      </div>
    </div>
  );
}
