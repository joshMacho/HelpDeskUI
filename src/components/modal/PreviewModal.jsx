import { Modal } from "antd";
import { DocumentText1, TickSquare } from "iconsax-reactjs";

export default function PreviewModal({ open, cancel, preview, submit }) {
  return (
    <Modal
      head={null}
      footer={null}
      className=""
      open={open}
      maskClosable={false}
      closable={true}
      onCancel={cancel}
    >
      <div className="main-preview">
        <div className="preview-declare">
          <p>
            By submitting, you declare that the statement and particulars given
            in this application are to the best of my knowledge and belief, true
            and complete and I agree that they shall be the basis of my contract
            with NSIA Insurance Company Ltd
          </p>
        </div>
        <div className="preview-buttons">
          <button onClick={() => preview()}>
            <DocumentText1 className="icnax" variant="Broken" />
            Preview
          </button>
          <button onClick={() => submit()}>
            Submit
            <TickSquare className="icnax" variant="Broken" color="green" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
