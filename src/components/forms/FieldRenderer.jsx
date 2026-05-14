// forms/FieldRenderer.jsx
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ArrayField from "./ArrayField";
import GroupField from "./GroupField";
import { Select } from "antd";

export default function FieldRenderer({ field, parentName }) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const name = parentName ? `${parentName}.${field.name}` : field.name;

  const value = useWatch({ name, control });
  const getNestedError = (errors, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], errors);
  };

  const fieldError = getNestedError(errors, name);

  const validation = { ...(field.validation || {}) };

  if (validation.pattern?.value) {
    validation.pattern.value = new RegExp(validation.pattern.value);
  }

  // show when condition
  // if (field.showWhen) {
  //   const dependencyName = parentName
  //     ? `${parentName}.${field.showWhen.field}`
  //     : field.showWhen.field;
  //   const dependentValue = watch(dependencyName);
  //   const expectedValue = field.showWhen.value;
  //   const shouldShow = dependentValue === field.showWhen.value;
  //   if (!shouldShow) {
  //     return null;
  //   }
  // }

  if (field.showWhen) {
    let dependencyName = field.showWhen.field;

    // ROOT HANDLING
    if (dependencyName.startsWith("$root.")) {
      dependencyName = dependencyName.replace("$root.", "");
    }

    // 🧠 ONLY APPLY parentName if NOT absolute path
    else if (parentName && !dependencyName.includes(".")) {
      dependencyName = `${parentName}.${dependencyName}`;
    }

    const dependentValue = watch(dependencyName);
    const expectedValue = field.showWhen.value;

    const shouldShow = Array.isArray(expectedValue)
      ? expectedValue.includes(dependentValue)
      : dependentValue === expectedValue;

    if (!shouldShow) return null;
  }

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
          <label className="field-label">{field.label}</label>
          <div className="input-div">
            <input type={field.type} {...register(name, validation)} />
            {fieldError && <span className="danger">{fieldError.message}</span>}
          </div>
        </div>
      );

    case "select":
      return (
        <div className="form-input col-span-1">
          <label className="field-label">{field.label}</label>
          <div className="select-div">
            <Controller
              key={field.name}
              name={name}
              control={control}
              rules={field.validation || {}}
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
            {fieldError && <span className="danger">{fieldError.message}</span>}
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="rad-div">
          {" "}
          <label className="field-label">{field.label}</label>{" "}
          {field.options.map((opt) => (
            <label key={opt.value} className="rad-lab">
              {" "}
              <input
                type="radio"
                className="rad"
                value={opt.value}
                {...register(name, validation)}
              />{" "}
              <span>{opt.label}</span>{" "}
            </label>
          ))}
          {fieldError && <span className="danger">{fieldError.message}</span>}
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
