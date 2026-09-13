import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function StaticTable({ field, name }) {
  const {
    control,
    watch,
    setValue,
    unregister,
    formState: { errors },
  } = useFormContext();

  const getNestedError = (errors, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], errors);

  const hasMultipleFields =
    Array.isArray(field.fields) && field.fields.length > 0;

  const allValues = useWatch({ name, control }) || {};

  // only sum number columns
  const total = hasMultipleFields
    ? field.fields
        .filter((f) => f.type === "number")
        .reduce((sum, col) => {
          return (
            sum +
            Object.values(allValues).reduce((rowSum, rowVal) => {
              return rowSum + (parseFloat(rowVal?.[col.key]) || 0);
            }, 0)
          );
        }, 0)
    : Object.entries(allValues)
        .filter(([key]) => key !== "__selected")
        .reduce((sum, [, val]) => sum + (parseFloat(val) || 0), 0);

  const hasNumberColumn = hasMultipleFields
    ? field.fields.some((f) => f.type === "number")
    : true;

  // resolve dependency name for a row's showWhen
  const resolveDependencyName = (showWhen) => {
    let dependencyName = showWhen.field;
    if (dependencyName.startsWith("$root.")) {
      return dependencyName.replace("$root.", "");
    }
    const parts = name.split(".");
    parts.pop();
    const parentPath = parts.join(".");
    return parentPath ? `${parentPath}.${dependencyName}` : dependencyName;
  };

  // evaluate showWhen condition for a row — pure, no side effects
  const shouldShowRow = (row) => {
    if (!row.showWhen) return true;
    const dependencyName = resolveDependencyName(row.showWhen);
    const dependentValue = watch(dependencyName);
    const expectedValue = row.showWhen.value;
    return Array.isArray(expectedValue)
      ? expectedValue.includes(dependentValue)
      : dependentValue === expectedValue;
  };

  // collect all unique dependency names from showWhen rows
  const showWhenDeps = field.rows
    .filter((r) => typeof r === "object" && r.showWhen)
    .map((r) => resolveDependencyName(r.showWhen));

  const depValues = useWatch({ name: showWhenDeps, control });

  // clear stale values for hidden rows in an effect — never during render
  useEffect(() => {
    field.rows.forEach((row) => {
      if (typeof row !== "object" || !row.showWhen) return;
      if (!shouldShowRow(row)) {
        const rowKey = row.value;
        if (hasMultipleFields) {
          field.fields.forEach((col) => {
            unregister(`${name}.${rowKey}.${col.key}`);
          });
          unregister(`${name}.${rowKey}`);
        } else {
          unregister(`${name}.${rowKey}`);
        }
      }
    });
  }, [JSON.stringify(depValues)]);

  return (
    <div className="form-input col-span-2">
      <label className="field-label">{field.label}</label>

      <div className="multi-select-table-div">
        <table className="multi-select-table">
          <thead>
            <tr>
              <th>#</th>
              {(field.columns || ["Item", "Value"]).map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              let visibleIndex = 0;
              return field.rows.map((row) => {
                const rowKey = typeof row === "object" ? row.value : row;
                const rowLabel = typeof row === "object" ? row.label : row;

                if (!shouldShowRow(row)) return null;

                visibleIndex += 1;

                return (
                  <tr key={rowKey}>
                    <td>{visibleIndex}</td>
                    <td>{rowLabel}</td>

                    {hasMultipleFields ? (
                      field.fields.map((col) => {
                        const fieldName = `${name}.${rowKey}.${col.key}`;
                        const colError = getNestedError(errors, fieldName);

                        return (
                          <td key={col.key}>
                            <Controller
                              name={fieldName}
                              control={control}
                              defaultValue=""
                              rules={
                                col.type === "number"
                                  ? col.validation || {
                                      required: "Required",
                                      pattern: {
                                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                        message: "Enter a valid amount",
                                      },
                                    }
                                  : col.validation || {}
                              }
                              render={({ field: inputField }) => (
                                <div className="input-div">
                                  <input
                                    {...inputField}
                                    type={col.type || "text"}
                                    min={
                                      col.type === "number" ? "0" : undefined
                                    }
                                    step={
                                      col.type === "number" ? "0.01" : undefined
                                    }
                                    placeholder={col.placeholder || ""}
                                  />
                                  {colError && (
                                    <span className="danger">
                                      {colError.message}
                                    </span>
                                  )}
                                </div>
                              )}
                            />
                          </td>
                        );
                      })
                    ) : (
                      <td>
                        <Controller
                          name={`${name}.${rowKey}`}
                          control={control}
                          defaultValue=""
                          rules={
                            field.rowValidation || {
                              required: "This field is required",
                              pattern: {
                                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                message: "Enter a valid amount",
                              },
                            }
                          }
                          render={({ field: inputField }) => (
                            <div className="input-div">
                              <input
                                {...inputField}
                                type={field.inputType || "number"}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                              />
                              {getNestedError(errors, `${name}.${rowKey}`) && (
                                <span className="danger">
                                  {
                                    getNestedError(errors, `${name}.${rowKey}`)
                                      .message
                                  }
                                </span>
                              )}
                            </div>
                          )}
                        />
                      </td>
                    )}
                  </tr>
                );
              });
            })()}
          </tbody>

          {hasNumberColumn && (
            <tfoot>
              <tr>
                <td colSpan={field.columns ? field.columns.length : 2}>
                  Total
                </td>
                <td>
                  {total.toLocaleString("en-GH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
