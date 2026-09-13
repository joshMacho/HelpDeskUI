export default function ViewField({ field, data }) {
  function formatValue(field, value) {
    if (value === undefined || value === null || value === "") {
      return "-";
    }

    switch (field.type) {
      case "radio":
        return value === "true" ? "Yes" : "No";

      case "date":
        return new Date(value).toLocaleDateString();

      case "file":
        return (
          <a href={value} target="_blank" rel="noreferrer">
            View File
          </a>
        );

      default:
        return String(value);
    }
  }

  // INFO BLOCKS
  if (field.type === "info") {
    return <div className="text-sm text-gray-600">{field.content}</div>;
  }

  // GROUP FIELDS
  if (field.type === "group") {
    const groupData = data?.[field.name] || {};

    return (
      <div className="border rounded-xl p-4 space-y-4 dark:text-gray-200">
        {field.label && <h3 className="font-semibold">{field.label}</h3>}
        <div className="grid grid-cols-3">
          {(field.fields || []).map((nested, index) => (
            <ViewField
              key={nested.name || index}
              field={nested}
              data={groupData}
            />
          ))}
        </div>
      </div>
    );
  }

  // STATIC TABLE FIELDS
  if (field.type === "staticTable") {
    const tableData = data?.[field.name] || {};
    const hasMultipleFields =
      Array.isArray(field.fields) && field.fields.length > 0;

    // total — only sum number columns
    const total = hasMultipleFields
      ? field.fields
          .filter((f) => f.type === "number")
          .reduce((sum, col) => {
            return (
              sum +
              Object.values(tableData).reduce((rowSum, rowVal) => {
                return rowSum + (parseFloat(rowVal?.[col.key]) || 0);
              }, 0)
            );
          }, 0)
      : Object.values(tableData).reduce(
          (sum, val) => sum + (parseFloat(val) || 0),
          0,
        );

    const hasNumberColumn = hasMultipleFields
      ? field.fields.some((f) => f.type === "number")
      : true;

    return (
      <div className="space-y-2">
        {field.label && (
          <div className="text-sm text-gray-500 font-medium">{field.label}</div>
        )}
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
              {field.rows.map((row, index) => {
                const rowKey = typeof row === "object" ? row.value : row;
                const rowLabel = typeof row === "object" ? row.label : row;
                const rowData = tableData[rowKey];

                return (
                  <tr key={rowKey}>
                    <td>{index + 1}</td>
                    <td>{rowLabel}</td>

                    {hasMultipleFields ? (
                      field.fields.map((col) => (
                        <td key={col.key}>
                          {col.type === "number"
                            ? rowData?.[col.key]
                              ? parseFloat(rowData[col.key]).toLocaleString(
                                  "en-GH",
                                  {
                                    minimumFractionDigits: 2,
                                  },
                                )
                              : "-"
                            : rowData?.[col.key] || "-"}
                        </td>
                      ))
                    ) : (
                      <td>
                        {rowData
                          ? parseFloat(rowData).toLocaleString("en-GH", {
                              minimumFractionDigits: 2,
                            })
                          : "-"}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>

            {hasNumberColumn && (
              <tfoot>
                <tr>
                  <td
                    colSpan={field.columns ? field.columns.length : 2}
                    className="font-semibold"
                  >
                    Total
                  </td>
                  <td className="font-semibold">
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

  // ARRAY FIELDS
  if (field.type === "array") {
    const arrayValues = data?.[field.name] || [];

    return (
      <div className="space-y-4">
        <h3 className="font-semibold">{field.label}</h3>

        {arrayValues.map((item, index) => (
          <div key={index} className="border rounded-xl p-4">
            {(field.itemSchema?.fields || []).map((nested, nestedIndex) => (
              <ViewField
                key={nested.name || nestedIndex}
                field={nested}
                data={item}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // NORMAL FIELDS
  return (
    <div className="border-b pb-2">
      <div className="text-sm text-gray-500">{field.label}</div>

      <div className="font-medium dark:text-gray-200">
        {formatValue(field, data?.[field.name])}
      </div>
    </div>
  );
}
