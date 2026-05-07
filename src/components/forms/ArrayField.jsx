// forms/ArrayField.jsx
import { useFieldArray, useFormContext } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";

export default function ArrayField({ field, name }) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

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
            >
              Remove Vehicle
            </button>
          </div>
        </div>
      ))}
      <div className="form-cancel-div">
        <button className="add-btn" type="button" onClick={() => append({})}>
          Add Vehicle
        </button>
      </div>
    </div>
  );
}
