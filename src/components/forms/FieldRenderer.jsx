// forms/FieldRenderer.jsx
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ArrayField from "./ArrayField";
import GroupField from "./GroupField";
import { DatePicker, Select } from "antd";
import FileField from "./FileField";
import MultiSelectTable from "./MultiSelectTable";
import StaticTable from "./StaticTable";
import SignatureField from "./SignatureField";
import FieldLabel from "./FieldLabel";
import dayjs from "dayjs";

export default function FieldRenderer({ field, parentName }) {
  const {
    register,
    control,
    watch,
    formState: { errors, dirtyFields },
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

    // case "date": {
    //   const getDateConstraint = (value) => {
    //     if (!value) return undefined;

    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);

    //     if (value === "today") {
    //       return today.toISOString().split("T")[0];
    //     }

    //     const match = value.match(/^today([+-]\d+)$/);

    //     if (match) {
    //       const offset = parseInt(match[1], 10);
    //       today.setDate(today.getDate() + offset);
    //       return today.toISOString().split("T")[0];
    //     }

    //     return dayjs(value).format("YYYY MM DD");
    //   };

    //   const minDate = getDateConstraint(field.minDate);
    //   const maxDate = getDateConstraint(field.maxDate);

    //   // only enforce the picker min constraint if this field has been touched
    //   // this prevents saved past dates from being blocked on load
    //   const isFieldDirty = !!name
    //     .split(".")
    //     .reduce((acc, part) => acc?.[part], dirtyFields);
    //   const effectiveMin = isFieldDirty ? minDate : undefined;

    //   return (
    //     <div className="form-input">
    //       <label className="field-label">{field.label}</label>

    //       <div className="input-div">
    //         <input
    //           type="date"
    //           min={effectiveMin}
    //           max={maxDate}
    //           {...register(name, {
    //             ...validation,

    //             validate: (value) => {
    //               if (!value) return true;

    //               const selected = new Date(value);
    //               selected.setHours(0, 0, 0, 0);

    //               // only enforce minDate if the field was changed this session
    //               if (minDate && isFieldDirty) {
    //                 const min = new Date(minDate);
    //                 min.setHours(0, 0, 0, 0);

    //                 if (selected < min) {
    //                   return `Date cannot be earlier than ${minDate}`;
    //                 }
    //               }

    //               // maxDate always enforced — it's a hard cap
    //               if (maxDate) {
    //                 const max = new Date(maxDate);
    //                 max.setHours(0, 0, 0, 0);

    //                 if (selected > max) {
    //                   return `Date cannot be later than ${maxDate}`;
    //                 }
    //               }
    //               // age validation
    //               if (field.minAge) {
    //                 const today = new Date();
    //                 today.setHours(0, 0, 0, 0);

    //                 const minAgeDate = new Date(today);
    //                 minAgeDate.setFullYear(today.getFullYear() - field.minAge);

    //                 if (selected > minAgeDate) {
    //                   return `Must be at least ${field.minAge} years old`;
    //                 }
    //               }

    //               return true;
    //             },
    //           })}
    //         />

    //         {fieldError && <span className="danger">{fieldError.message}</span>}
    //       </div>
    //     </div>
    //   );
    // }

    case "date": {
      const getDateConstraint = (value) => {
        if (!value) return undefined;
        const today = dayjs().startOf("day");
        if (value === "today") return today.format("YYYY-MM-DD");
        const match = value.match(/^today([+-]\d+)$/);
        if (match) {
          const offset = parseInt(match[1], 10);
          return today.add(offset, "day").format("YYYY-MM-DD");
        }
        return value;
      };

      const minDate = getDateConstraint(field.minDate);
      const maxDate = getDateConstraint(field.maxDate);

      const isFieldDirty = !!name
        .split(".")
        .reduce((acc, part) => acc?.[part], dirtyFields);

      // compute max selectable date based on minAge
      const minAgeMaxDate = field.minAge
        ? dayjs()
            .startOf("day")
            .subtract(field.minAge, "year")
            .format("YYYY-MM-DD")
        : undefined;

      const effectiveMax = minAgeMaxDate || maxDate;
      const effectiveMin = isFieldDirty ? minDate : undefined;

      return (
        <div className="form-input">
          <FieldLabel field={field} />
          <div className="input-div">
            <Controller
              name={name}
              control={control}
              rules={{
                ...validation,
                validate: (value) => {
                  if (!value) return true;
                  const selected = dayjs(value).startOf("day");

                  if (minDate && isFieldDirty) {
                    if (selected.isBefore(dayjs(minDate).startOf("day"))) {
                      return `Date cannot be earlier than ${dayjs(minDate).format("DD/MM/YYYY")}`;
                    }
                  }

                  if (maxDate) {
                    if (selected.isAfter(dayjs(maxDate).startOf("day"))) {
                      return `Date cannot be later than ${dayjs(maxDate).format("DD/MM/YYYY")}`;
                    }
                  }

                  if (field.minAge) {
                    const minAgeCutoff = dayjs()
                      .startOf("day")
                      .subtract(field.minAge, "year");
                    if (selected.isAfter(minAgeCutoff)) {
                      return `Must be at least ${field.minAge} years old`;
                    }
                  }

                  return true;
                },
              }}
              render={({ field: controllerField }) => (
                <DatePicker
                  format="DD/MM/YYYY"
                  value={
                    controllerField.value
                      ? dayjs(controllerField.value, "YYYY-MM-DD", true)
                      : null
                  }
                  onChange={(date) => {
                    controllerField.onChange(
                      date ? date.format("YYYY-MM-DD") : null,
                    );
                  }}
                  minDate={
                    effectiveMin
                      ? dayjs(effectiveMin, "YYYY-MM-DD", true)
                      : undefined
                  }
                  maxDate={
                    effectiveMax
                      ? dayjs(effectiveMax, "YYYY-MM-DD", true)
                      : undefined
                  }
                  style={{ width: "100%" }}
                />
              )}
            />
            {fieldError && <span className="danger">{fieldError.message}</span>}
          </div>
        </div>
      );
    }

    case "text":
    case "number":
      return (
        <div className="form-input">
          <FieldLabel field={field} />
          <div className="input-div">
            <input type={field.type} {...register(name, validation)} />
            {fieldError && <span className="danger">{fieldError.message}</span>}
          </div>
        </div>
      );
    case "file":
      return <FileField field={field} fieldName={field.name} />;

    case "select":
      return (
        <div className="form-input col-span-1">
          <FieldLabel field={field} />
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
                  variant="borderless"
                  onChange={(value) => controllerField.onChange(value)}
                  value={controllerField.value}
                />
              )}
            />
            {fieldError && <span className="danger">{fieldError.message}</span>}
          </div>
        </div>
      );

    case "multiSelect":
      console.log("MULTI SELECT NAME:", name);
      return (
        <div className="form-input col-span-1">
          <FieldLabel field={field} />

          <div className="select-div">
            <Controller
              name={name}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              defaultValue={[]}
              render={({ field: controllerField }) => (
                <Select
                  {...controllerField}
                  mode="multiple"
                  allowClear
                  placeholder="Select"
                  className="custom-select"
                  options={field.options?.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  value={controllerField.value || []}
                  onChange={(values) => {
                    controllerField.onChange(values);
                  }}
                />
              )}
            />

            {fieldError && <span className="danger">{fieldError.message}</span>}
          </div>
        </div>
      );
    case "multiSelectTable":
      return <MultiSelectTable field={field} name={name} />;

    case "radio":
      return (
        <div className="rad-div">
          {" "}
          <FieldLabel field={field} />{" "}
          {field.options.map((opt) => (
            <label key={opt.value} className="rad-lab">
              {" "}
              <input
                type="radio"
                className="rad"
                value={opt.value}
                {...register(name, validation)}
              />{" "}
              <span className="rad-opt">{opt.label}</span>{" "}
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

    case "staticTable":
      return <StaticTable field={field} name={name} />;

    case "signature":
      return <SignatureField field={field} name={name} />;

    default:
      return null;
  }
}
