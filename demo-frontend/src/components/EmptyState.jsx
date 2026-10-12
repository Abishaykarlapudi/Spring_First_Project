import { UserX, SearchX, Plus, RefreshCw } from 'lucide-react';

export default function EmptyState({
  isSearching,
  searchQuery,
  onClearSearch,
  onOpenAddModal
}) {
  if (isSearching) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap">
          <SearchX size={36} />
        </div>
        <h3 className="empty-title">No matching records found</h3>
        <p className="empty-text">
          We couldn't find any contact matching <strong>"{searchQuery}"</strong>. Try checking for typos or searching by phone number or ID.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClearSearch}
        >
          <RefreshCw size={15} />
          <span>Clear Search Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrap empty-icon-primary">
        <UserX size={36} />
      </div>
      <h3 className="empty-title">Your directory is currently empty</h3>
      <p className="empty-text">
        Get started by adding your first contact record. All records will be stored in MySQL via the Spring Boot REST API.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onOpenAddModal}
      >
        <Plus size={16} />
        <span>Add Your First Contact</span>
      </button>
    </div>
  );
}
