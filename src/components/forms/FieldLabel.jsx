import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";

export default function FieldLabel({ field, className = "field-label" }) {
  const inform = field.inform;
  const description =
    typeof inform === "string" ? inform : inform?.description ?? inform?.content;

  return (
    <div className="field-label-row">
      <span className={className}>{field.label}</span>
      {description && (
        <Popover content={description} trigger="click" placement="top">
          <button
            type="button"
            className="inform-button"
            aria-label={`More information about ${field.label}`}
          >
            <InfoCircleOutlined aria-hidden="true" />
          </button>
        </Popover>
      )}
    </div>
  );
}
