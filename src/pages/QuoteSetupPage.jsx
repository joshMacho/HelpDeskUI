import { Popover } from "antd";
import { Add } from "iconsax-reactjs";
import ProductTable from "../components/tables/ProductTable";
import { useState } from "react";
import ProductDrawer from "../components/drawers/ProductDrawer";

export default function QuoteSetupPage() {
  const [productDrawer, setProductDrawer] = useState(false);

  const closeDrawer = () => {
    setProductDrawer(false);
  };

  const onSuccess = () => {
    // close
    console.log("Successfull");
  };

  return (
    <div className="main-page">
      {productDrawer && (
        <ProductDrawer
          open={productDrawer}
          onClose={closeDrawer}
          onSuccess={onSuccess}
          isEdit={false}
          info={{}}
        />
      )}
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Add Product`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setProductDrawer(true)}
            >
              <Add variant="outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          {/* <LocationTable /> */}
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
