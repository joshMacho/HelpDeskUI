import { Dropdown, message, Popconfirm, Table } from "antd";
import api from "../../api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CloseSquare, Edit2, More, Refresh } from "iconsax-reactjs";
import ProductDrawer from "../drawers/ProductDrawer";

export default function ProductTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [messageApi, content] = message.useMessage();
  const [productData, setProductData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      if (!response.data.success) {
        return messageApi.error(
          response.data?.error || `Unable to fetch products`,
        );
      }
      setProductData(response.data.data);
      setTableLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        error?.response?.data?.error ||
          `Error fetching products. Check connection / contact admin`,
      );
      setTableLoading(false);
    }
  };

  // delete product
  const deleteProduct = async (productId) => {};

  // update product
  const updateProduct = (product) => {
    setRecordToUpdate(product);
    setUpdateModal(true);
  };

  const tableColumns = [
    { title: "ID", dataIndex: "product_id" },
    { title: "Name", dataIndex: "name" },
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record) => {
        const isOpen = openDropdownId === record.product_id;
        return (
          <Dropdown
            open={isOpen}
            rootClassName="my-dropdown"
            placement="bottomLeft"
            trigger={["click"]}
            onOpenChange={(open) => {
              setOpenDropdownId(open ? record.product_id : null);
            }}
            menu={{
              items: [
                {
                  key: "edit",
                  label: (
                    <div
                      className="flex items-center gap-2 drop-in-div"
                      onClick={() => updateProduct(record)}
                    >
                      <Edit2 size={20} className="icnax" variant="Broken" />
                      Update Product
                    </div>
                  ),
                },
                {
                  key: "delete",
                  label: (
                    <Popconfirm
                      title={`Delete Product`}
                      description={`Are you sure you want to delete this product?`}
                      onConfirm={() => deleteProduct(record.product_id)}
                      onCancel={() => setOpenDropdownId(null)}
                      okButtonProps={{ danger: true }}
                      okText="Delete"
                      cancelText="Cancel"
                    >
                      <div className="flex items-center gap-2 drop-in-div">
                        <CloseSquare
                          className="icnax red"
                          variant="Broken"
                          size={20}
                        />
                        <span>Delete Form</span>
                      </div>
                    </Popconfirm>
                  ),
                },
              ],
            }}
          >
            <button type="button" className="act-btn all-border btn-p-s">
              <More size={20} className="icnax" variant="Broken" />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const updateSuccess = () => {
    toast.success(`Product updated successfully`);
    setUpdateModal(false);
    fetchProducts();
  };

  const dataSource = (
    Array.isArray(productData) && productData.length > 0 ? productData : []
  ).map((product) => ({
    key: product.product_id,
    product_id: product.product_id,
    name: product.product_name,
  }));

  return (
    <div className="table-div">
      {content}
      {updateModal && (
        <ProductDrawer
          open={updateModal}
          onClose={() => setUpdateModal(false)}
          isEdit={true}
          info={recordToUpdate}
          onSuccess={() => {
            updateSuccess();
          }}
        />
      )}
      <div className="comp-head-div">
        <div className="tab-m"></div>
        <div className="table-actions">
          <div className="search-input-div">
            <input type="text" />
          </div>
          <button
            className="act-btn all-border btn-p-s"
            onClick={() => fetchProducts()}
          >
            <Refresh size={20} className="icnax" variant="Broken" />
          </button>
        </div>
      </div>
      <Table
        columns={tableColumns}
        className="custom-table"
        rowSelection={Object.assign({ type: "checkbox" }, rowSelection)}
        dataSource={dataSource}
        loading={tableLoading}
      />
    </div>
  );
}
