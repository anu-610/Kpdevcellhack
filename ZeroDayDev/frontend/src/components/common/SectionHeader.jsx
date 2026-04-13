export function SectionHeader({ kicker, title, copy }) {
  return (
    <div className="section-header">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}
