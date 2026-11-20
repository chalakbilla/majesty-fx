import { Pencil, Trash2 } from 'lucide-react';

/**
 * Edit / delete icon buttons that reuse the dashboard's existing
 * `.admin-action-btn` look, so rows stay visually consistent.
 */
export default function RowActions({ onEdit, onDelete, editTitle = 'Edit', deleteTitle = 'Delete' }) {
  return (
    <span className="admin-action-group" style={{ display: 'inline-flex' }}>
      {onEdit && (
        <button type="button" title={editTitle} aria-label={editTitle} onClick={onEdit} className="admin-action-btn admin-action-btn-view">
          <Pencil style={{ width: '14px', height: '14px' }} />
        </button>
      )}
      {onDelete && (
        <button type="button" title={deleteTitle} aria-label={deleteTitle} onClick={onDelete} className="admin-action-btn admin-action-btn-reject">
          <Trash2 style={{ width: '14px', height: '14px' }} />
        </button>
      )}
    </span>
  );
}
