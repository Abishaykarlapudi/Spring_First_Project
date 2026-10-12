import { 
  Search, 
  X, 
  Hash, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Download, 
  Filter 
} from 'lucide-react';

export default function Toolbar({
  searchQuery,
  onSearchChange,
  idSearch,
  onIdSearchChange,
  onIdSearchSubmit,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onExportCSV,
  totalRecords,
  filteredCount
}) {
  const handleIdKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onIdSearchSubmit();
    }
  };

  return (
    <div className="toolbar-container">
      <div className="toolbar-top">
        {/* Live Filter Search */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search-btn" 
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Quick ID Lookup */}
        <div className="id-lookup-group">
          <div className="id-input-wrap">
            <Hash size={16} className="id-icon" />
            <input
              type="number"
              className="id-input"
              placeholder="Find ID..."
              value={idSearch}
              onChange={(e) => onIdSearchChange(e.target.value)}
              onKeyDown={handleIdKeyDown}
              min="1"
            />
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onIdSearchSubmit}
          >
            Lookup
          </button>
        </div>
      </div>

      <div className="toolbar-bottom">
        {/* Count summary */}
        <div className="results-badge">
          <span>Showing <strong>{filteredCount}</strong> of <strong>{totalRecords}</strong> records</span>
          {searchQuery && <span className="filter-pill"><Filter size={11} /> Filtered</span>}
        </div>

        {/* Actions & Filters */}
        <div className="toolbar-controls">
          {/* Sort Selector */}
          <div className="sort-group">
            <ArrowUpDown size={15} className="sort-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => onSortChange(e.target.value)}
              className="sort-select"
              aria-label="Sort records by"
            >
              <option value="id-asc">ID: Low to High</option>
              <option value="id-desc">ID: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle" role="group" aria-label="View format">
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
            >
              <List size={17} />
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Card Grid View"
            >
              <LayoutGrid size={17} />
            </button>
          </div>

          {/* Export Button */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onExportCSV}
            title="Download CSV export"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
