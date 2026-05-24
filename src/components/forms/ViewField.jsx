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
      <div className="border rounded-xl p-4 space-y-4">
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

      <div className="font-medium">
        {formatValue(field, data?.[field.name])}
      </div>
    </div>
  );
}
