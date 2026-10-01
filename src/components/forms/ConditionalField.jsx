// ConditionalField.jsx
// Evaluates showWhen and mounts/unmounts FieldRenderer accordingly
// When unmounted, unregisters the field from form state via cleanup
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";

function UnregisterOnUnmount({ name, children }) {
  const { unregister } = useFormContext();

  useEffect(() => {
    return () => {
      unregister(name, { keepDefaultValue: false });
    };
  }, [name]);

  return children;
}

export default function ConditionalField({ field, parentName }) {
  const { watch } = useFormContext();

  const name = parentName ? `${parentName}.${field.name}` : field.name;

  // evaluate showWhen here so we control mounting
  let shouldShow = true;
  if (field.showWhen) {
    let dependencyName = field.showWhen.field;

    if (dependencyName.startsWith("$root.")) {
      dependencyName = dependencyName.replace("$root.", "");
    } else if (parentName && !dependencyName.includes(".")) {
      dependencyName = `${parentName}.${dependencyName}`;
    }

    const dependentValue = watch(dependencyName);
    const expectedValue = field.showWhen.value;

    shouldShow = Array.isArray(expectedValue)
      ? expectedValue.includes(dependentValue)
      : dependentValue === expectedValue;
  }

  if (!shouldShow) return null;

  // when shouldShow is true, wrap in UnregisterOnUnmount so cleanup
  // fires when this field transitions back to hidden
  return (
    <UnregisterOnUnmount name={name}>
      <FieldRenderer field={field} parentName={parentName} />
    </UnregisterOnUnmount>
  );
}
