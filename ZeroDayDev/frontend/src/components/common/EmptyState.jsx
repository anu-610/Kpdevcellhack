export function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <p className="eyebrow">Awaiting content</p>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
