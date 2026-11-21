import { useCallback, useState } from "react";
import { Check, Eye, X } from "lucide-react";
import {
  getAdminReports,
  updateAdminReport,
  type AdminReport,
  type AdminReportStatus,
} from "../../services/adminService";
import {
  ActionButton,
  Dialog,
  DetailItem,
  TablePage,
  usePagedData,
} from "./AdminManagement";
import { StatusBadge } from "./AdminOverview";

export default function AdminReports() {
  const load = useCallback(
    (params: Record<string, string | number>) => getAdminReports(params),
    []
  );
  const list = usePagedData(load, { status: "All", targetType: "All" });
  const [selected, setSelected] = useState<AdminReport | null>(null);
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const resolve = async (status: AdminReportStatus) => {
    if (!selected) return;
    try {
      await updateAdminReport(selected._id, {
        status,
        resolutionNote: resolutionNote.trim() || undefined,
      });
      setNotice({
        message: `Report ${status.toLowerCase()}.`,
        error: false,
      });
      setSelected(null);
      setResolutionNote("");
      list.refresh();
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : "Unable to update report.",
        error: true,
      });
    }
  };
  const rows = list.data.map((report) => ({
    id: report._id,
    cells: [
      <div key={`${report._id}-target`}>
        <p className="font-medium capitalize text-gray-900">{report.targetType}</p>
        <p className="text-xs text-gray-500">{String(report.target?.name || report.targetId)}</p>
      </div>,
      <div key={`${report._id}-reason`}>
        <p className="max-w-[240px] truncate text-gray-800">{report.reason}</p>
        <p className="text-xs text-gray-500">By {report.reporterId?.name || "User"}</p>
      </div>,
      <StatusBadge key={`${report._id}-status`} status={report.status} />,
      <span key={`${report._id}-date`} className="whitespace-nowrap text-gray-500">
        {new Date(report.createdAt).toLocaleDateString()}
      </span>,
      <ActionButton
        key={`${report._id}-review`}
        label="Review"
        icon={<Eye size={15} />}
        onClick={() => {
          setSelected(report);
          setResolutionNote(report.resolutionNote || "");
        }}
      />,
    ],
  }));
  return (
    <>
      <TablePage
        title="Reports & complaints"
        description="Review reports submitted by authenticated users and record a resolution or dismissal."
        search={list.search}
        setSearch={list.setSearch}
        searchPlaceholder="Search report, target, or reporter"
        filter="Status"
        filterOptions={["All", "Open", "Resolved", "Dismissed"]}
        filterValue={list.filters.status}
        setFilter={(value) => list.setFilter("status", value)}
        extraFilters={
          <select
            aria-label="Report target type"
            value={list.filters.targetType}
            onChange={(event) => list.setFilter("targetType", event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700"
          >
            <option>All</option>
            <option value="product">Product</option>
            <option value="user">User</option>
          </select>
        }
        loading={list.loading}
        error={list.error}
        page={list.page}
        pages={list.pages}
        total={list.total}
        setPage={list.setPage}
        headers={["Reported target", "Reason / reporter", "Status", "Date", ""]}
        rows={rows}
        notice={notice}
      />
      {selected && (
        <Dialog title="Review report" onClose={() => setSelected(null)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem label="Target type" value={selected.targetType} />
            <DetailItem label="Reporter" value={selected.reporterId?.name || "Unknown"} />
            <DetailItem
              label="Target"
              value={String(selected.target?.name || selected.targetId)}
            />
            <DetailItem label="Current status" value={selected.status} />
          </div>
          <div className="mt-4 rounded-lg border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900">{selected.reason}</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
              {selected.details || "No additional details supplied."}
            </p>
          </div>
          <label className="mt-4 block text-sm font-medium text-gray-700">
            Resolution note (optional)
            <textarea
              rows={3}
              maxLength={1000}
              value={resolutionNote}
              onChange={(event) => setResolutionNote(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => void resolve("Dismissed")}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <X size={15} /> Dismiss
            </button>
            <button
              type="button"
              onClick={() => void resolve("Resolved")}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <Check size={15} /> Resolve
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
