import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

export default function MultiSelectTable({ field, name }) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const getNestedError = (errors, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], errors);

  const fieldError = getNestedError(errors, name);

  // the selected keys array e.g. ["TEMPORARY REMOVAL", "PROFESSIONAL FEES"]
  const selectedKeys = watch(`${name}.__selected`) || [];

  const handleSelectionChange = (values) => {
    // preserve existing amounts when reselecting
    const current = watch(name) || {};
    const updated = { __selected: values };
    values.forEach((key) => {
      updated[key] = current[key] || { amount: "" };
    });
    setValue(name, updated, { shouldValidate: true });
  };

  return (
    <div className="form-input col-span-2">
      <label className="field-label">{field.label}</label>

      {/* multiselect dropdown */}
      <div className="select-div">
        <Controller
          name={`${name}.__selected`}
          control={control}
          defaultValue={[]}
          rules={{
            required: field.validation?.required || false,
          }}
          render={({ field: controllerField }) => (
            <Select
              {...controllerField}
              mode="multiple"
              allowClear
              placeholder="Select extensions"
              className="custom-select"
              options={field.options?.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              value={controllerField.value || []}
              onChange={(values) => {
                controllerField.onChange(values);
                handleSelectionChange(values);
              }}
            />
          )}
        />
        {fieldError?.__selected && (
          <span className="danger">{fieldError.__selected.message}</span>
        )}
      </div>

      {/* generated table */}
      {selectedKeys.length > 0 && (
        <div className="multi-select-table-div">
          <table className="multi-select-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Extension / Cover</th>
                <th>Sum Insured (GHS)</th>
              </tr>
            </thead>
            <tbody>
              {selectedKeys.map((key, index) => (
                <tr key={key}>
                  <td>{index + 1}</td>
                  <td>{key}</td>
                  <td>
                    <Controller
                      name={`${name}.${key}.amount`}
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Amount is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Enter a valid amount",
                        },
                      }}
                      render={({ field: amountField }) => (
                        <div className="input-div">
                          <input
                            {...amountField}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                          {getNestedError(errors, `${name}.${key}.amount`) && (
                            <span className="danger">
                              {
                                getNestedError(errors, `${name}.${key}.amount`)
                                  .message
                              }
                            </span>
                          )}
                        </div>
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
