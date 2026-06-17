import { Popover } from "antd";
import { Add } from "iconsax-reactjs";
import { useState } from "react";
import IncidentTable from "../components/tables/IncidentTable";

export default function IssuesPage() {
  return (
    <>
      <div className="in-content xmargin">
        <div className="assign-table-div col-span-3">
          <IncidentTable />
        </div>
      </div>
    </>
  );
}
