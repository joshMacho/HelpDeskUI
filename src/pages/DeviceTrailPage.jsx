import { SearchNormal } from "iconsax-reactjs";
import api from "../api";
import { Flex, message, Modal, Table, Timeline } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { searchValidation } from "../configurations/formValidation";
import LoadingModal from "../components/LoadingModal";
import { useDispatch, useSelector } from "react-redux";
import { setInfo, setTrail } from "../redux/trailSlice";
import dayjs from "dayjs";

export default function DeviceTrailPage() {
  const trail = useSelector((state) => state.trail);
  const dispatch = useDispatch();

  const searchColumn = [
    { title: "ID", dataIndex: "id" },
    {
      title: "Name",
      dataIndex: "name",
    },
  ];

  const [messageApi, content] = message.useMessage();
  const [searchData, setSearchData] = useState({
    data: [],
    loading: false,
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  // use effect for the debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
    }, 500); // wait a second
    return () => clearTimeout(timer);
  }, [search]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      search: "",
    },
    validationSchema: searchValidation,
    onSubmit: (values, { setSubmitting }) => {
      searchEntity(values, setSubmitting);
    },
  });

  // const search api
  const searchEntity = async (values, setSubmitting) => {
    setSubmitting(true);
    setSearchData((prev) => ({ ...prev, loading: true }));
    try {
      const response = await api.post("/searchidentity", values);
      if (!response.data.success)
        return messageApi.error(response.data?.error || "Nothing found");
      setSearchData({
        data: response.data.data,
        loading: false,
      });
      setOpenModal(true);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      setSearchData((prev) => ({ ...prev, loading: false }));
      return toast.error(
        error.response?.data?.error ||
          `Error fetching search. Check connection / contact admin`,
      );
    }
  };

  // close modal
  const closeModal = () => {
    setOpenModal(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selected) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelected(selected);
    },
  };

  // filtered data
  const filteredData = (
    Array.isArray(searchData.data) && searchData.data.length > 0
      ? searchData.data
      : []
  ).filter((entity) => {
    if (!debounced) return true;
    const q = debounced.toLowerCase();
    if (!q) return true;
    return entity.name?.toLowerCase().includes(q);
  });

  // const data
  const dataSource = (
    Array.isArray(filteredData) && filteredData.length > 0 ? filteredData : []
  ).map((entity) => ({
    key: entity.id,
    id: entity.id,
    name: entity.name,
    type: entity.type,
  }));

  // when ok is selected
  const selectedSearch = async () => {
    if (selectedRowKeys.length > 1)
      return messageApi.warning("Only one (1) selection needed");
    if (selectedRowKeys.length === 0)
      return messageApi.error("Select an entity");

    // make the api request to fetch trail
    try {
      setSearchData((prev) => ({ ...prev, loading: true }));
      const response = await api.post("/searchtrail", selected[0]);
      if (!response.data.success)
        return messageApi.error(
          response.data.error || `Unable to get trail for ${selected[0].name}`,
        );
      if (response.data.data.length === 0)
        return messageApi.warning(response.data?.message || `No trail found`);
      dispatch(setTrail(response.data.data));
      dispatch(setInfo({ name: selected[0]?.name || "" }));
      setOpenModal(false);
    } catch (error) {
      console.log("Error form fetching trail: ", error);
      // setSearchData((prev) => ({ ...prev, loading: false }));
      return toast.error(
        error.reponse?.data?.error ||
          `Error fetching trail. Check connection / contact admin`,
      );
    } finally {
      setSearchData((prev) => ({ ...prev, loading: false }));
    }
  };

  // time line items
  const timelineItems = (
    Array.isArray(trail.data) && trail.data.length > 0 ? trail.data : []
  ).map((item) => ({
    key: item.id,
    label: dayjs(item.date_assigned).format("D MMMM, YYYY HH:mm"),
    children: (
      <>
        <div>
          <strong>Device: </strong> {` ${item.assigned_device}`}
        </div>
        <div>
          <strong>Assigned To:</strong>
          {` ${item.assigned_user}`}
        </div>
        <div>
          <strong>Assigned By:</strong>
          {` ${item.created_by}`}
        </div>
      </>
    ),
  }));

  if (searchData.loading && formik.isSubmitting)
    return <LoadingModal message={"Loading"} open={searchData.loading} />;

  return (
    <div className="main-page">
      {content}
      <div className="top-search-div xmargin">
        <div className="actions-div xmargin">
          <form method="POST" onSubmit={formik.handleSubmit} className="form2">
            <fieldset disabled={formik.isSubmitting}>
              <div className="search-input-div">
                <input
                  type="text"
                  placeholder="Search Device or User"
                  id="search"
                  name="search"
                  value={formik.values.search}
                  onChange={formik.handleChange}
                />
                {formik.touched && formik.errors.search && (
                  <span className="danger">{formik.errors.search}</span>
                )}
              </div>
            </fieldset>
            <button
              type="submit"
              className="assign-search-div btn-p-s"
              disabled={formik.isSubmitting}
            >
              <SearchNormal className="icnax" variant="Broken" />
            </button>
          </form>
          {openModal && (
            <Modal
              header={`Search Result`}
              closable={true}
              open={openModal}
              onCancel={closeModal}
              onOk={selectedSearch}
              okButtonProps={{ loading: searchData.loading }}
              className=""
            >
              <div className="margin-top">
                <div className="comp-head-div">
                  <p>Result</p>
                  <div className="table-actions">
                    <div className="search-input-div">
                      <input
                        type="text"
                        id="sch"
                        name="sch"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Table
                  columns={searchColumn}
                  className="custom-table"
                  rowSelection={Object.assign(
                    { type: "checkbox" },
                    rowSelection,
                  )}
                  dataSource={dataSource}
                  pagination={{ pageSize: 5 }}
                />
              </div>
            </Modal>
          )}
        </div>
      </div>
      <div className="trail-div xmargin">
        <div className="trail-title">
          <p>
            <span className="desc">Assignment trail for</span>{" "}
            {` ${trail.info?.name || ""}`}
          </p>
        </div>
        <Timeline orientation="vertical" items={timelineItems} mode="left" />
      </div>
    </div>
  );
}
