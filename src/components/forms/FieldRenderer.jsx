// forms/FieldRenderer.jsx
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ArrayField from "./ArrayField";
import GroupField from "./GroupField";
import { Select } from "antd";

export default function FieldRenderer({ field, parentName }) {
  const { register, control } = useFormContext();

  const name = parentName ? `${parentName}.${field.name}` : field.name;

  const value = useWatch({ name, control });

  switch (field.type) {
    case "group":
      return <GroupField field={field} parentName={name} />;

    case "array":
      return <ArrayField field={field} name={name} />;

    case "text":
    case "number":
    case "date":
      return (
        <div className="form-input">
          <label>{field.label}</label>
          <div className="input-div">
            <input
              type={field.type}
              {...register(name, { required: field.required })}
            />
          </div>
        </div>
      );

    case "select":
      return (
        <div className="form-input col-span-1">
          <label>{field.label}</label>
          <div className="select-div">
            <Controller
              key={field.name}
              name={name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: controllerField }) => (
                <Select
                  {...controllerField}
                  placeholder="Select"
                  options={field.options?.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  className="custom-select"
                  onChange={(value) => controllerField.onChange(value)}
                  value={controllerField.value}
                />
              )}
            />
            {/* <Select {...register(name)}>
            <option value="">Select</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select> */}
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="rad-div">
          {" "}
          <label>{field.label}</label>{" "}
          {field.options.map((opt) => (
            <label key={opt.value} className="rad-lab">
              {" "}
              <input
                type="radio"
                className="rad"
                value={opt.value}
                {...register(name, {
                  required: field.required,
                })}
              />{" "}
              <span>{opt.label}</span>{" "}
            </label>
          ))}{" "}
        </div>
      );
    case "info":
      return (
        <div className="jtext-div">
          <p className={`infoText ${field.variant}`}>{field.content}</p>
        </div>
      );

    default:
      return null;
  }
}
