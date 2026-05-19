import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import mailerApi from "../../api/mailer";
import { message } from "antd";
import { CloseCircle } from "iconsax-reactjs";
import { toast } from "react-toastify";

export default function FileField({ field, fieldName }) {
  const { setValue, watch } = useFormContext();

  const [messageApi, context] = message.useMessage();
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const uploadedUrl = watch(fieldName);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await mailerApi.post(`/uploadfile`, formData);
      console.log(response);
      const data = await response.data;

      setValue(fieldName, data.imageUrl);
    } catch (error) {
      console.log(error);
      messageApi.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (url) => {
    try {
      setUploading(true);
      const response = await mailerApi.delete(`/deletes3file`, {
        data: { key: url },
      });
      if (response?.data?.success) {
        messageApi.success(response?.data?.message);
        // remove url and file

        setValue(fieldName, null);

        // clear actual input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.log(error);
      return toast.error(error?.response?.data?.error || `Error removing file`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {context}
      <div className="file-div">
        <label>{field.label}</label>

        <input
          ref={fileInputRef}
          type="file"
          accept={field.accept}
          onChange={handleFileChange}
        />

        {uploading && <p>Uploading...</p>}

        {uploadedUrl && (
          <div className="image-prev">
            <div
              className="remove-img"
              onClick={() => removeImage(uploadedUrl)}
            >
              <CloseCircle className="icnax" size={20} variant="Broken" />
            </div>
            <img src={uploadedUrl} alt="Preview" width={100} />

            <p>Upload complete</p>
          </div>
        )}
      </div>
    </>
  );
}
