import { useParams } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import { message, Popconfirm, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import LoadingModal from "../components/LoadingModal";
import { Add, CloseCircle, DocumentUpload } from "iconsax-reactjs";

export default function IssueDetailsPage() {
  const { issue_id } = useParams();
  const [messageApi, content] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [delLoading, setDelLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // combine old and new files
    const updated = [...selectedFiles, ...files];

    // limit to 3
    if (updated.length > 3)
      return messageApi.error("Maximum of 3 images allowed");

    setSelectedFiles(updated);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // fetch the issues using the issue_id and show the details
  const fetchIssueDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/getincidents/${issue_id}`);
      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to fetch issue details`,
        );
      setInfo(response?.data?.data || {});
    } catch (error) {
      console.log(`Error from fetching issue details: `, error);
      setInfo([]);
      return toast.error(
        error?.response?.data?.error ||
          `Unable to fetch issue details. Contact Admin / Check connection`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetails();
  }, []);

  // remove image selected
  const removeImage = (indexToRemove) => {
    setSelectedFiles((preview) =>
      preview.filter((_, index) => index !== indexToRemove),
    );
  };

  // upload the files
  const uploadFiles = async () => {
    const formData = new FormData();
    if (selectedFiles.length === 0) {
      return;
      // return messageApi.error("Please select at least 1 file");
    }
    setLoading(true);
    // add report id
    formData.append("incident_id", issue_id);
    // add files
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await api.post(`/incident/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (!response.data.success) {
        return messageApi.error(
          response?.data?.error || `Error uploading file`,
        );
      }
      // set uploading array to empty
      toast.success(response?.data?.message || `Upload successfull`);

      setSelectedFiles([]);
      await fetchIssueDetails();
      return;
    } catch (error) {
      console.log(`Error from uploading `, error);
      return toast.error(
        error?.response?.data?.error || `Error uploading files`,
      );
    } finally {
      setLoading(false);
    }
  };

  // remove an attached image
  const deleteImage = async (id) => {
    // all in
    try {
      setDelLoading(true);
      const response = await api.post(`/removeattachment`, { attach_id: id });

      if (!response?.data?.success)
        return messageApi.error(
          response?.data?.error || `Unable to remove object`,
        );
      setInfo((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((attach) => attach.id !== id),
      }));
      return messageApi.success(response?.data?.message || `Object removed`);
    } catch (error) {
      console.log(`Error from deleting image: `, error);
      return toast.error(
        error?.response?.data?.error || `Error deleting image.`,
      );
    } finally {
      setDelLoading(false);
    }
  };

  if (loading)
    return <LoadingModal message={"Uploading Files..."} open={loading} />;

  return (
    <div className="main-page">
      {content}
      <div className="title-div xmargin">
        <h3 className="title-text">{info?.title || " "}</h3>
        <Tag color={info?.color || `#d7d7d7`} className="tag">
          {info?.status || " "}
        </Tag>
      </div>
      <div className="xmargin det-body-div">
        <div className="detbody-div">
          {/* details or description */}
          <p className="he">Description</p>
          <p className="bod">{info?.description || " "}</p>
        </div>
        <div className="detbody-div">
          {/* reported details */}
          <div className="repdet-div">
            <p className="he">Date Reported</p>
            <p className="bod2">{info?.date_created || " "}</p>
          </div>
          <div className="repdet-div">
            <p className="he">Reported User</p>
            <p className="bod2">{info?.reported_user || " "}</p>
          </div>
        </div>
      </div>
      <div className="attachment-div xmargin">
        {info?.attachments?.length > 0 ? (
          <div className="preview-div">
            {info.attachments.map((attachment) => (
              <div key={attachment.id} className="imges">
                <span
                  className="attachment-name"
                  onClick={() => {
                    const win = window.open(attachment.attach_url, "_blank");
                    if (win) win.focus();
                  }}
                >
                  {attachment.original_name}
                </span>
                <Popconfirm
                  title={`Remove Attachment`}
                  description={`Are you sure you want to remove ${attachment.original_name}`}
                  onConfirm={() => deleteImage(attachment.id)}
                  onCancel={() => {
                    return;
                  }}
                  okButtonProps={{
                    loading: delLoading,
                    disabled: delLoading,
                  }}
                  okText="Remove"
                  cancelText="No"
                >
                  <button type="button" className="delib">
                    <CloseCircle className="icnax" variant="Bold" color="red" />
                  </button>
                </Popconfirm>
              </div>
            ))}
          </div>
        ) : (
          <div className="preview-div center-flex">
            <p className="text-gray-400">No Image Attached</p>
          </div>
        )}
        <div className="attimage-div">
          <div className="ldiv">
            {selectedFiles.map((file, index) => (
              <p key={index} className="afiles">
                <button
                  type="button"
                  className="delib"
                  onClick={() => removeImage(index)}
                >
                  <CloseCircle className="icnax" variant="Bold" color="red" />
                </button>

                <span className="afile-text">
                  {file.name} - {(file.size / 1024).toFixed(2)} KB
                </span>
              </p>
            ))}
          </div>
          <div className="all-attach">
            <div className="select-file" onClick={handleButtonClick}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
                accept="image/jpeg,image/png,application/pdf,.jpeg,.jpg,.img,.pdf"
              />

              <button type="button" disabled={loading}>
                <Add className="icnax" variant="Broken" />
                Select
              </button>
            </div>
            <div className="select-file">
              <button
                type="button"
                disabled={selectedFiles.length === 0 || loading}
                onClick={uploadFiles}
              >
                <DocumentUpload className="icnax" variant="Broken" />
                Upload File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
