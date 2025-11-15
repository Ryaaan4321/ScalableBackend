"use client"
import React, { useEffect, useState } from "react";

type ImportLog = {
  id: string;
  fileName: string;
  total: number;
  new: number;
  updated: number;
  failed: number;
  timestamp: string;
};

type ApiResponse = {
  data: ImportLog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const API_BASE = "http://scalable-backend.vercel.app"; 

export const ImportHistoryPage: React.FC = () => {
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_BASE}/job/import?page=${pageNum}&limit=20`
      );
      console.log("res = ",res);
      if (!res.ok) {
        throw new Error(`Failed to fetch logs: ${res.status}`);
      }
      const json: ApiResponse = await res.json();
      setLogs(json.data);
      setPage(json.page);
      setTotalPages(json.totalPages);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handlePrev = () => {
    if (page > 1) {
      fetchLogs(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      fetchLogs(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Job Import History</h1>
            <p className="text-sm text-slate-400 mt-1">
              Track every import run from your external job feeds.
            </p>
          </div>
          {/* Optional: manual import button in future */}
          {/* <button className="px-4 py-2 rounded-md bg-emerald-500 text-sm font-medium">
            Run Import Now
          </button> */}
        </div>

        {/* Status / error */}
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">
                    File / URL
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-emerald-300">
                    New
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-sky-300">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-rose-300">
                    Failed
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">
                    Imported At
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      Loading import history…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No import history found yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-slate-800 hover:bg-slate-900/70"
                    >
                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-xs font-medium text-slate-100 truncate">
                          {log.fileName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {log.total ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-300">
                        {log.new ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-sky-300">
                        {log.updated ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-rose-300">
                        {log.failed ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-400">
                        {new Date(log.timestamp).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 text-xs rounded-md border border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={page >= totalPages || loading}
                className="px-3 py-1.5 text-xs rounded-md border border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
