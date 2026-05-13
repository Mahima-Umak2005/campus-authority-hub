import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
  getFileDownloadUrl,
  getRepositoryFiles,
  updateFileApprovalApi,
} from "../api/repository";

const APPROVER_ROLES = ["chairman", "principal", "admin"];

const categories = [
  "academic",
  "student",
  "faculty",
  "quality",
  "activities",
  "administration",
  "confidential",
];

const departments = ["computer", "civil", "mechanical", "electrical", "all"];

const statusClasses = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const canPreview = (file) =>
  file.fileType?.startsWith("image/") || file.fileType === "application/pdf";

const fileStatus = (file) => file.approvalStatus || "approved";

const Repository = () => {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  const canApprove = APPROVER_ROLES.includes(user?.role);
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getRepositoryFiles({
        search,
        department,
        category,
        status: canApprove ? status : "all",
      });
      setFiles(data || []);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to load repository files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchFiles, 250);
    return () => clearTimeout(timer);
  }, [search, department, category, status, user]);

  const groupedCounts = useMemo(
    () => ({
      total: files.length,
      pending: files.filter((file) => fileStatus(file) === "pending").length,
      approved: files.filter((file) => fileStatus(file) === "approved").length,
      rejected: files.filter((file) => fileStatus(file) === "rejected").length,
    }),
    [files]
  );

  const handleApproval = async (file, nextStatus) => {
    const rejectionReason =
      nextStatus === "rejected"
        ? prompt("Reason for rejection", file.rejectionReason || "")
        : "";

    if (nextStatus === "rejected" && rejectionReason === null) return;

    try {
      await updateFileApprovalApi(
        file._id,
        { status: nextStatus, rejectionReason },
        token
      );
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update approval status");
    }
  };

  const handleDownload = () => {
    setTimeout(fetchFiles, 700);
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <i className="fas fa-folder-open text-2xl text-blue-600"></i>
          <h1 className="text-2xl font-bold text-gray-800">
            Centralized Repository
          </h1>
        </div>
        <p className="text-gray-500">
          Search, preview, approve, and download files based on role and department access.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Visible Files</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{groupedCounts.total}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-900">{groupedCounts.approved}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{groupedCounts.pending}</p>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-900">{groupedCounts.rejected}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search title, description, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[240px] flex-1 rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments
            .filter((item) => item !== "all")
            .map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>

        {canApprove && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading repository files...</span>
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-10 text-center">
          <i className="fas fa-folder-open mb-2 text-4xl text-gray-300"></i>
          <p className="text-gray-500">No files found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <i className="fas fa-file text-blue-600"></i>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
                    statusClasses[fileStatus(file)] || statusClasses.pending
                  }`}
                >
                  {fileStatus(file)}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-800">{file.title}</h3>
              {file.description && (
                <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                  {file.description}
                </p>
              )}

              <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p>
                  <b className="text-gray-800">Department:</b>{" "}
                  <span className="capitalize">{file.department}</span>
                </p>
                <p>
                  <b className="text-gray-800">Category:</b>{" "}
                  <span className="capitalize">{file.category}</span>
                </p>
                <p>
                  <b className="text-gray-800">Access:</b>{" "}
                  {(file.accessRoles || []).join(", ")}
                </p>
                <p>
                  <b className="text-gray-800">Downloads:</b>{" "}
                  {file.downloadCount || 0}
                </p>
                <p>
                  <b className="text-gray-800">Uploaded:</b>{" "}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>

              {file.rejectionReason && (
                <p className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                  {file.rejectionReason}
                </p>
              )}

              <div className="mt-auto flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                {canPreview(file) && (
                  <button
                    type="button"
                    onClick={() => setPreviewFile(file)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Preview
                  </button>
                )}

                <a
                  href={getFileDownloadUrl(file._id, token)}
                  onClick={handleDownload}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Download
                </a>

                {canApprove && fileStatus(file) !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleApproval(file, "approved")}
                    className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}

                {canApprove && fileStatus(file) !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => handleApproval(file, "rejected")}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3 className="font-bold text-gray-800">{previewFile.title}</h3>
                <p className="text-sm text-gray-500">{previewFile.originalName}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="min-h-[60vh] bg-gray-100 p-4">
              {previewFile.fileType?.startsWith("image/") ? (
                <img
                  src={previewFile.fileUrl}
                  alt={previewFile.title}
                  className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain"
                />
              ) : (
                <iframe
                  src={previewFile.fileUrl}
                  title={previewFile.title}
                  className="h-[70vh] w-full rounded-lg bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Repository;
