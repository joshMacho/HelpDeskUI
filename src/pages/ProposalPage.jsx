import { Popover } from "antd";
import DynamicForm from "../components/forms/DynamicForm";
import { Additem } from "iconsax-reactjs";
import { useState } from "react";
import ProposalModal from "../components/modal/ProposalModal";
import ProposalSendTable from "../components/tables/ProposalSendTable";

export default function ProposalPage() {
  // const schema = {
  //   type: "object",
  //   sections: [
  //     {
  //       name: "personalDetails",
  //       label: "Personal Details",
  //       fields: [
  //         {
  //           type: "group",
  //           name: "insuredName",
  //           label: "Insured Name",
  //           fields: [
  //             {
  //               type: "text",
  //               name: "firstName",
  //               label: "First Name",
  //               required: true,
  //             },
  //             { type: "text", name: "middleName", label: "Middle Name" },
  //             {
  //               type: "text",
  //               name: "surname",
  //               label: "Surname",
  //               required: true,
  //             },
  //           ],
  //         },
  //         {
  //           type: "group",
  //           name: "details",
  //           label: "",
  //           fields: [
  //             { type: "text", name: "address", label: "Address" },
  //             { type: "text", name: "occupation", label: "Occupation" },

  //             {
  //               type: "select",
  //               name: "typeOfId",
  //               label: "Type of ID",
  //               options: [
  //                 { label: "National ID", value: "GHANA CARD" },
  //                 { label: "Passport", value: "PASSPORT" },
  //               ],
  //             },
  //             { type: "text", name: "idNumber", label: "Valid National ID No" },
  //           ],
  //         },
  //         {
  //           type: "array",
  //           name: "vehicles",
  //           label: "VEHICLES",
  //           minItems: 1,
  //           itemSchema: {
  //             type: "object",
  //             fields: [
  //               {
  //                 type: "group",
  //                 name: "vehdet",
  //                 label: "",
  //                 fields: [
  //                   {
  //                     type: "text",
  //                     name: "make",
  //                     label: "Make",
  //                     required: true,
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "model",
  //                     label: "Model",
  //                     required: true,
  //                   },
  //                   { type: "text", name: "typeOfBody", label: "Type of Body" },
  //                   {
  //                     type: "text",
  //                     name: "regNumber",
  //                     label: "Vehicle Registration Number",
  //                     required: true,
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "manufactureYear",
  //                     label: "Year of Manufacture",
  //                     required: true,
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "cubicCapacity",
  //                     label: "Cubic Capacity",
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "seatingCapacity",
  //                     label: "Seating Capacity",
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "color",
  //                     label: "Color of Vehicle",
  //                     required: true,
  //                   },
  //                   { type: "text", name: "engineNo", label: "Engine Number" },
  //                   {
  //                     type: "text",
  //                     name: "chassisNo",
  //                     label: "Chassis Number",
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "otherAssessories",
  //                     label: "Other accessories (please list)",
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "valueOfAssess",
  //                     label: "Value of Accessories",
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "valueOfVehicle",
  //                     label: "Value of Vehicle Incl. Accessories",
  //                   },
  //                   {
  //                     type: "text",
  //                     name: "newOrUsed",
  //                     label: "Is the vehicle new or old (used)",
  //                     required: true,
  //                   },
  //                 ],
  //               },
  //               {
  //                 type: "text",
  //                 name: "isUsed",
  //                 label: "Is the vehicle new or old (used) ",
  //               },
  //               {
  //                 type: "radio",
  //                 name: "vehicleAltered",
  //                 label:
  //                   "Has the vehicle been altered, adapted or modified from the original manufacturer's design in any way:",
  //                 options: [
  //                   { label: "YES", value: true },
  //                   { label: "NO", value: false },
  //                 ],
  //               },
  //               {
  //                 type: "text",
  //                 name: "ifYesAltered",
  //                 label: "If Yes, provide details",
  //               },
  //               {
  //                 type: "radio",
  //                 name: "vehCondition",
  //                 label: "Is the vehicle in good condition?",
  //                 options: [
  //                   { label: "YES", value: true },
  //                   { label: "NO", value: false },
  //                 ],
  //               },
  //               {
  //                 type: "radio",
  //                 name: "isOwner",
  //                 label: "Are you the owner of the vehicle",
  //                 options: [
  //                   { label: "YES", value: true },
  //                   { label: "NO", value: false },
  //                 ],
  //               },
  //               {
  //                 type: "radio",
  //                 name: "isRegisterdInYourName",
  //                 label: "Is it registered in your Name",
  //                 options: [
  //                   { label: "YES", value: true },
  //                   { label: "NO", value: false },
  //                 ],
  //               },
  //               {
  //                 type: "text",
  //                 name: "notInName",
  //                 label:
  //                   "If NO state in whose name it is registered and the address",
  //               },
  //               {
  //                 type: "radio",
  //                 name: "subjectToHirePurchase",
  //                 label:
  //                   "Is the vehicle subject to any Hire Purchase Agreement? ",
  //                 options: [
  //                   { label: "YES", value: true },
  //                   { label: "NO", value: false },
  //                 ],
  //               },
  //               {
  //                 type: "text",
  //                 name: "ifYesNameCompany",
  //                 label: "if Yes, name the Company? ",
  //               },
  //               {
  //                 type: "select",
  //                 name: "product",
  //                 label: "What is the vehicle (s) used or licensed for:",
  //                 options: [
  //                   {
  //                     label: "PRIVATE INDIVIDUAL USE",
  //                     value: "PRIVATE INDIVIDUAL USE",
  //                   },
  //                   {
  //                     label: "PRIVATE COPORATE USE",
  //                     value: "PRIVATE COPORATE USE",
  //                   },
  //                   {
  //                     label: "FARE PAYING USE (TAXI)",
  //                     value: "FARE PAYING USE (TAXI)",
  //                   },
  //                   {
  //                     label: "FARE PAYING (HIRING)",
  //                     value: "FARE PAYING (HIRING)",
  //                   },
  //                   {
  //                     label: "CARRIAGE OF OWN GOODS",
  //                     value: "CARRIAGE OF OWN GOODS",
  //                   },
  //                   {
  //                     label: "CARRIAGE OF OTHER PERSON's GOODS",
  //                     value: "CARRIAGE OF OTHER PERSON's GOODS",
  //                   },
  //                 ],
  //               },
  //               {
  //                 type: "text",
  //                 name: "otherProduct",
  //                 label: "Any other use not stated above",
  //               },
  //               {
  //                 type: "text",
  //                 name: "garageAddress",
  //                 label:
  //                   "Please state the address at which the vehicle is usually garaged",
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // };

  const [proposalOpen, setProposalOpen] = useState(false);

  // close proposal
  const closeProp = () => {
    setProposalOpen(false);
  };

  // successfully submitted
  const proposalSuccess = () => {
    console.log("success fired.");
  };

  return (
    <div className="main-page">
      {proposalOpen && (
        <ProposalModal
          open={proposalOpen}
          onClose={() => closeProp()}
          onSuccess={proposalSuccess}
        />
      )}
      {/* <DynamicForm schema={schema} /> */}
      <div className="top-action-div xmargin">
        <div className="actions-div">
          <Popover placement="top" content={`Propose form`}>
            <button
              className="act-btn all-border btn-p-lg"
              onClick={() => setProposalOpen(true)}
            >
              <Additem variant="Outline" className="icnax" size={20} />
            </button>
          </Popover>
        </div>
      </div>
      <div className="in-content xmargins">
        <div className="col-span-3">
          <ProposalSendTable />
        </div>
      </div>
    </div>
  );
}
