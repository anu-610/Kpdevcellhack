import { EmptyState } from "../common/EmptyState.jsx";
import { SectionHeader } from "../common/SectionHeader.jsx";
import { getCoreMembers } from "../../services/contentService.js";
import { useAsyncResource } from "../../hooks/useAsyncResource.js";

export function MembersSection() {
  const { data: members, status, error } = useAsyncResource(getCoreMembers);

  return (
    <section className="content-section tinted-section" id="members">
      <SectionHeader
        kicker="People"
        title="Core members"
        
      />

      {members.length ? (
        <div className="member-grid">
          {members.map((member) => (
            <article className="member-card" key={member._id || member.id || member.email}>
              {member.imageUrl || member.photoUrl || member.avatar ? (
                <img
                  src={member.imageUrl || member.photoUrl || member.avatar}
                  alt={member.name}
                />
              ) : (
                <span className="member-fallback" aria-hidden="true">
                  {(member.name || "M").charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <h3>{member.name}</h3>
                <p>{member.role || member.designation || member.position}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={status === "loading" ? "Loading members..." : "No core members found"}
          message={error || "Add member records in MongoDB and they will appear here."}
        />
      )}
    </section>
  );
}
