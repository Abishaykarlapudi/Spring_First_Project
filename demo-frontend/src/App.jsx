import { useEffect, useState, useMemo, useCallback } from "react";
import { apiService, authService } from "./api";
import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import Toolbar from "./components/Toolbar";
import RecordTable from "./components/RecordTable";
import RecordGrid from "./components/RecordGrid";
import RecordModal from "./components/RecordModal";
import PatchNameModal from "./components/PatchNameModal";
import ViewDetailsModal from "./components/ViewDetailsModal";
import DeleteModal from "./components/DeleteModal";
import ToastContainer from "./components/Toast";
import EmptyState from "./components/EmptyState";
import AuthLayout from "./components/AuthLayout";
import { exportToCSV } from "./utils/helpers";
import { AlertCircle, RefreshCw } from "lucide-react";
import "./App.css";

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("vcube-theme");
    if (saved) return saved === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("vcube_user_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Data & status state
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // online | offline | checking

  // Filters & controls
  const [searchQuery, setSearchQuery] = useState("");
  const [idSearch, setIdSearch] = useState("");
  const [sortBy, setSortBy] = useState("id-desc");
  const [viewMode, setViewMode] = useState("table"); // table | grid

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedRecordForEdit, setSelectedRecordForEdit] = useState(null);
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);

  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [selectedRecordForPatch, setSelectedRecordForPatch] = useState(null);
  const [isSubmittingPatch, setIsSubmittingPatch] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecordForView, setSelectedRecordForView] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecordForDelete, setSelectedRecordForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("vcube-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Toast notification helper
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all records
  const loadRecords = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const data = await apiService.getAll();
      const items = Array.isArray(data) ? data : [];
      setRecords(items);
      setBackendStatus("online");
    } catch (err) {
      console.error("API Error loading records:", err);
      setBackendStatus("offline");
      if (!isSilent) {
        addToast("Cannot connect to Spring Boot API on port 5000. Verify the server is running.", "error");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    apiService.getAll()
      .then((data) => {
        if (!isMounted) return;
        setRecords(Array.isArray(data) ? data : []);
        setBackendStatus("online");
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("API error loading records:", err);
        setBackendStatus("offline");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Authentication Handlers
  const handleLogin = async ({ email, password, isDemo }) => {
    setIsAuthLoading(true);
    try {
      if (isDemo) {
        const demoUser = {
          id: 1,
          fullName: "Demo Administrator",
          email: "demo@vcube.com",
          role: "ADMIN"
        };
        setCurrentUser(demoUser);
        localStorage.setItem("vcube_user_session", JSON.stringify(demoUser));
        addToast("Signed in as Demo Administrator!", "success");
        return;
      }

      const res = await authService.login({ email, password });
      if (res.success) {
        const userData = {
          id: res.id,
          fullName: res.fullName,
          email: res.email,
          role: res.role || "USER"
        };
        setCurrentUser(userData);
        localStorage.setItem("vcube_user_session", JSON.stringify(userData));
        addToast(`Welcome back, ${userData.fullName}!`, "success");
      } else {
        addToast(res.message || "Invalid credentials.", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Login failed. Check your credentials or server connection.";
      addToast(msg, "error");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async ({ fullName, email, password }) => {
    setIsAuthLoading(true);
    try {
      const res = await authService.register({ fullName, email, password });
      if (res.success) {
        const userData = {
          id: res.id,
          fullName: res.fullName,
          email: res.email,
          role: res.role || "USER"
        };
        setCurrentUser(userData);
        localStorage.setItem("vcube_user_session", JSON.stringify(userData));
        addToast(`Account created! Welcome to VCube Directory, ${userData.fullName}!`, "success");
      } else {
        addToast(res.message || "Registration failed.", "error");
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg = err.response?.data?.message || "Failed to create account. Email may already be in use.";
      addToast(msg, "error");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("vcube_user_session");
    addToast("Signed out successfully.", "info");
  };

  // Add / Edit Modal handlers
  const openAddModal = useCallback(() => {
    setSelectedRecordForEdit(null);
    setIsRecordModalOpen(true);
  }, []);

  const openEditModal = (record) => {
    setSelectedRecordForEdit(record);
    setIsRecordModalOpen(true);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ctrl+K or Cmd+K: Open Add Record Modal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (currentUser) {
          openAddModal();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [currentUser, openAddModal]);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    let result = [...records];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const email = (item.email || "").toLowerCase();
        const phone = String(item.number || "");
        const id = String(item.id || "");
        return name.includes(q) || email.includes(q) || phone.includes(q) || id.includes(q);
      });
    }

    result.sort((a, b) => {
      if (sortBy === "id-asc") return (a.id || 0) - (b.id || 0);
      if (sortBy === "id-desc") return (b.id || 0) - (a.id || 0);
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      return 0;
    });

    return result;
  }, [records, searchQuery, sortBy]);

  // Quick ID Lookup
  const handleIdSearchSubmit = async () => {
    if (!idSearch.trim()) {
      addToast("Please enter an ID to look up.", "warning");
      return;
    }

    try {
      const idNum = Number(idSearch.trim());
      const data = await apiService.getById(idNum);
      if (data && data.id) {
        setSelectedRecordForView(data);
        setIsViewModalOpen(true);
        addToast(`Found record #${data.id}: ${data.name}`, "success");
        setIdSearch("");
      } else {
        addToast(`No record found with ID #${idSearch}`, "error");
      }
    } catch (err) {
      console.error(err);
      addToast(`Record with ID #${idSearch} was not found.`, "error");
    }
  };

  const handleRecordSubmit = async (formData) => {
    setIsSubmittingRecord(true);
    try {
      if (selectedRecordForEdit && selectedRecordForEdit.id) {
        // PUT update
        await apiService.update(selectedRecordForEdit.id, formData);
        addToast(`Record #${selectedRecordForEdit.id} updated successfully!`, "success");
        setIsRecordModalOpen(false);
        await loadRecords(true);
      } else {
        // POST create
        const created = await apiService.create(formData);
        addToast(`Record #${created.id || "new"} created successfully!`, "success");
        setIsRecordModalOpen(false);
        await loadRecords(true);
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to save record. Please check backend status.", "error");
    } finally {
      setIsSubmittingRecord(false);
    }
  };

  // Patch Name Modal handlers
  const openPatchModal = (record) => {
    setSelectedRecordForPatch(record);
    setIsPatchModalOpen(true);
  };

  const handlePatchSubmit = async (id, newName) => {
    setIsSubmittingPatch(true);
    try {
      await apiService.updateName(id, newName);
      addToast(`Name for record #${id} updated to "${newName}"!`, "success");
      setIsPatchModalOpen(false);
      await loadRecords(true);
    } catch (err) {
      console.error(err);
      addToast("Failed to update name via PATCH.", "error");
    } finally {
      setIsSubmittingPatch(false);
    }
  };

  // View Details Modal handlers
  const openViewModal = (record) => {
    setSelectedRecordForView(record);
    setIsViewModalOpen(true);
  };

  // Delete Modal handlers
  const openDeleteModal = (record) => {
    setSelectedRecordForDelete(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await apiService.remove(id);
      addToast(`Record #${id} deleted successfully.`, "success");
      setIsDeleteModalOpen(false);
      await loadRecords(true);
    } catch (err) {
      console.error(err);
      addToast(`Failed to delete record #${id}.`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (records.length === 0) {
      addToast("No records available to export.", "warning");
      return;
    }
    const success = exportToCSV(filteredRecords, `vcube_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    if (success) {
      addToast(`Exported ${filteredRecords.length} records to CSV!`, "success");
    } else {
      addToast("Failed to export CSV.", "error");
    }
  };

  // If user is not authenticated, show Auth Page
  if (!currentUser) {
    return (
      <div className="auth-root-wrapper">
        <AuthLayout
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLoading={isAuthLoading}
          onNotify={addToast}
        />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenAddModal={openAddModal}
        backendStatus={backendStatus}
        onRefresh={() => loadRecords(false)}
        isRefreshing={refreshing}
        totalCount={records.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Backend Offline Warning Banner */}
      {backendStatus === "offline" && (
        <div className="backend-alert-banner">
          <div className="banner-content">
            <AlertCircle size={18} className="banner-icon" />
            <span>
              <strong>Backend Disconnected:</strong> Could not reach Spring Boot API at <code>http://localhost:5000/dmo</code>. Make sure the Spring Boot application is started.
            </span>
          </div>
          <button 
            type="button" 
            className="btn btn-sm btn-outline-danger" 
            onClick={() => loadRecords(false)}
            disabled={refreshing}
          >
            <RefreshCw size={13} className={refreshing ? "spin-anim" : ""} />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="main-content">
        {/* Statistics Overview */}
        <StatsCards records={records} backendStatus={backendStatus} />

        {/* Toolbar Controls */}
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          idSearch={idSearch}
          onIdSearchChange={setIdSearch}
          onIdSearchSubmit={handleIdSearchSubmit}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExportCSV={handleExport}
          totalRecords={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* Records Content */}
        {loading ? (
          <div className="skeleton-loading-card">
            <div className="skeleton-line skeleton-header"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-text">Loading directory records from Spring Boot...</div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            isSearching={Boolean(searchQuery.trim())}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
            onOpenAddModal={openAddModal}
          />
        ) : viewMode === "table" ? (
          <RecordTable
            records={filteredRecords}
            onViewRecord={openViewModal}
            onEditRecord={openEditModal}
            onPatchName={openPatchModal}
            onDeleteRecord={openDeleteModal}
            onNotify={addToast}
          />
        ) : (
          <RecordGrid
            records={filteredRecords}
            onViewRecord={openViewModal}
            onEditRecord={openEditModal}
            onPatchName={openPatchModal}
            onDeleteRecord={openDeleteModal}
            onNotify={addToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>VCube Directory Hub &bull; Powered by Spring Boot 4 & React 19 &bull; MySQL Database</p>
          <div className="footer-links">
            <span className="footer-shortcut">Shortcut: <kbd>Ctrl+K</kbd> to add contact</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <RecordModal
        key={selectedRecordForEdit?.id ? `edit-${selectedRecordForEdit.id}` : "create-new"}
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSubmit={handleRecordSubmit}
        initialData={selectedRecordForEdit}
        isSubmitting={isSubmittingRecord}
      />

      <PatchNameModal
        key={selectedRecordForPatch?.id ? `patch-${selectedRecordForPatch.id}` : "patch-none"}
        isOpen={isPatchModalOpen}
        onClose={() => setIsPatchModalOpen(false)}
        onSubmit={handlePatchSubmit}
        record={selectedRecordForPatch}
        isSubmitting={isSubmittingPatch}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        record={selectedRecordForView}
        onEdit={openEditModal}
        onPatchName={openPatchModal}
        onDelete={openDeleteModal}
        onNotify={addToast}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        record={selectedRecordForDelete}
        isDeleting={isDeleting}
      />

      {/* Stacked Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
