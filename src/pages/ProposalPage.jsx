import { Popover } from "antd";
import DynamicForm from "../components/forms/DynamicForm";
import { Additem, Minus, TickSquare } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import ProposalModal from "../components/modal/ProposalModal";
import ProposalSendTable from "../components/tables/ProposalSendTable";
import { toast } from "react-toastify";
import api from "../api";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { useAuth } from "../../AuthContext";

export default function ProposalPage() {
  const tableRef = useRef(null);

  const [proposalOpen, setProposalOpen] = useState(false);
  const [loading, setLoading] = useState({
    cardLoading: true,
    graphLoading: false,
  });
  const [stats, setStats] = useState({
    cardStat: [],
    graphStat: [],
  });

  const set = useAuth();
  const isDark = set?.settings?.theme === "dark";
  // close proposal
  const closeProp = () => {
    setProposalOpen(false);
  };

  // successfully submitted
  const proposalSuccess = () => {
    tableRef.current?.refresh();
    fetchCardStat();
  };

  // get the card stats
  const fetchCardStat = async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        cardLoading: true,
      }));
      const response = await api.get(`/proposalstats`);
      if (!response.data?.success)
        return messageApi.error(response.data?.error || `Unable to load stats`);
      setStats((prev) => ({
        ...prev,
        cardStat: response.data?.data,
      }));
    } catch (error) {
      console.log(`Error from getting card stat, `, error);
      return toast.error(error.response?.data?.error);
    } finally {
      setLoading((prev) => ({ ...prev, cardLoading: false }));
    }
  };

  // details for graph
  const fetchGraphStats = async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        graphLoading: true,
      }));
      const response = await api.get(`/proposalgraph`);
      if (!response.data?.success)
        return messageApi.error(response.data?.error);
      // console.log(response?.data);
      setStats((prev) => ({
        ...prev,
        graphStat: response.data?.data || [],
      }));
    } catch (error) {
      console.log(error);
      return toast.error(
        error.response?.data?.error || `Error loading graph details`,
      );
    } finally {
      setLoading((prev) => ({
        ...prev,
        graphLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchCardStat();
    fetchGraphStats();
  }, []);

  return (
    <div className="main-page">
      {proposalOpen && (
        <ProposalModal
          open={proposalOpen}
          onClose={() => closeProp()}
          onSuccess={proposalSuccess}
        />
      )}

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

      <div className="pst-div xmargin">
        <div className={`scard ${loading.cardLoading ? "animate-pulse" : ""}`}>
          <span className="head">All Proposals</span>
          <span className="c-desc">{stats.cardStat.total || "-"}</span>
        </div>
        <div className={`scard ${loading.cardLoading ? "animate-pulse" : ""}`}>
          <div className="d-card">
            <div className="left-1">
              <div className="eq-sp-he">
                <span className="head">Submitted</span>
                <TickSquare color="green" variant="Broken" />
              </div>
              <div className="flex flex-col">
                <span className="c-desc">
                  {stats.cardStat.submitted || "-"}
                </span>
                <span className="sub-desc">
                  {stats.cardStat.submissionRate || 0}%
                </span>
              </div>
            </div>
            <div className="left-2">
              <div className="eq-sp-he">
                <span className="head">Pending</span>
                <Minus color="blue" variant="Broken" />
              </div>
              <span className="c-desc">{stats.cardStat.pending}</span>
            </div>
          </div>
        </div>
        <div className="chart-div">
          <ResponsiveContainer width="100%">
            <LineChart data={stats.graphStat}>
              <XAxis dataKey="monthName" tickLine={false} axisLine={false} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#202124" : "#fff",
                  border: isDark ? "none" : "1px solid #444",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="submitted"
                stroke="#7b9e31"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#d7b155"
                strokeWidth={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="in-content xmargin">
        <div className="prop-div col-span-3">
          <ProposalSendTable ref={tableRef} />
        </div>
      </div>
    </div>
  );
}
