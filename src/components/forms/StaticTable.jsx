import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function StaticTable({ field, name }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getNestedError = (errors, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], errors);

  const [col1, col2] = field.columns || ["Item", "Value"];

  // inside StaticTable, below the tbody
  const allValues = useWatch({ name, control }) || {};
  const total = Object.entries(allValues)
    .filter(([key]) => key !== "__selected")
    .reduce((sum, [, val]) => sum + (parseFloat(val) || 0), 0);

  return (
    <div className="form-input col-span-2">
      <label className="field-label">{field.label}</label>

      <div className="multi-select-table-div">
        <table className="multi-select-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{col1}</th>
              <th>{col2}</th>
            </tr>
          </thead>
          <tbody>
            {field.rows.map((row, index) => {
              const rowKey = typeof row === "object" ? row.value : row;
              const rowLabel = typeof row === "object" ? row.label : row;
              const fieldName = `${name}.${rowKey}`;
              const rowError = getNestedError(errors, fieldName);

              return (
                <tr key={rowKey}>
                  <td>{index + 1}</td>
                  <td>{rowLabel}</td>
                  <td>
                    <Controller
                      name={fieldName}
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
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                          {rowError && (
                            <span className="danger">{rowError.message}</span>
                          )}
                        </div>
                      )}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total</td>
              <td>
                {total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
