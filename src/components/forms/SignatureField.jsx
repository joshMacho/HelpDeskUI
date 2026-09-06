import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useFormContext, Controller } from "react-hook-form";

export default function SignatureField({ field, name }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const sigCanvasRef = useRef(null);

  const getNestedError = (errors, path) =>
    path.split(".").reduce((acc, part) => acc?.[part], errors);

  const fieldError = getNestedError(errors, name);

  const handleEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current.toDataURL("image/png");
      setValue(name, dataUrl, { shouldValidate: true });
    }
  };

  const handleClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setValue(name, null, { shouldValidate: true });
    }
  };

  return (
    <div className="form-input col-span-2">
      <label className="field-label">{field.label}</label>

      <Controller
        name={name}
        control={control}
        defaultValue={null}
        rules={{
          validate: () => {
            if (!field.validation?.required) return true;
            if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
              return typeof field.validation.required === "string"
                ? field.validation.required
                : "Signature is required";
            }
            return true;
          },
        }}
        render={() => (
          <div className="signature-wrapper">
            <div className="signature-canvas-div">
              <SignatureCanvas
                ref={sigCanvasRef}
                onEnd={handleEnd}
                penColor="black"
                canvasProps={{
                  className: "signature-canvas",
                  style: { width: "100%", height: "200px" },
                }}
              />
              <p className="signature-hint">Sign in the box above</p>
            </div>

            <button
              type="button"
              className="act-btn all-border btn-p-s"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        )}
      />

      {fieldError && (
        <span className="danger">{fieldError.message}</span>
      )}
    </div>
  );
}
