import { Tabs } from "antd";
import ViewSection from "./ViewSection";

export default function ViewDocument({ schema, data }) {
  const items = (schema?.sections || []).map((section) => ({
    key: section.name,
    label: section.label,
    children: (
      <ViewSection section={section} data={data?.[section.name] || {}} />
    ),
  }));

  return <Tabs items={items} />;
}
