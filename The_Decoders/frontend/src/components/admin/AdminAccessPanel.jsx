import { useState, useEffect } from "react";
import { auth } from "../../firebase.js";
import api from "../../api.js";
import toast from "react-hot-toast";

/* ── Shared input style ── */
const inputStyle = {
  backgroundColor: "rgba(13,17,23,0.8)",
  border: "1px solid rgba(35,43,58,0.95)",
  borderRadius: 8,
  padding: "9px 12px",
  color: "#e2e8f0",
  fontSize: 13,
  fontFamily: '"Fira Code", "Cascadia Code", monospace',
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

/* ── Member row in the file tree sidebar ── */
function MemberTreeItem({ member, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={() => onSelect(member)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          backgroundColor: isSelected
            ? "rgba(20,184,166,0.1)"
            : hovered
              ? "rgba(255,255,255,0.03)"
              : "transparent",
          borderLeft: isSelected
            ? "2px solid #14B8A6"
            : "2px solid transparent",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        {/* Status dot */}
        {member.photo_url ? (
  <img
    src={member.photo_url}
    alt={member.name}
    style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    onError={e => { e.target.style.display = 'none' }}
  />
) : (
  <div style={{
    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
    backgroundColor: member.hasAdminAccess ? 'rgba(20,184,166,0.15)' : 'rgba(75,85,99,0.15)',
    border: `1px solid ${member.hasAdminAccess ? 'rgba(20,184,166,0.4)' : 'rgba(75,85,99,0.3)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, color: member.hasAdminAccess ? '#14B8A6' : '#4B5563', fontWeight: 700,
  }}>
    {member.name?.[0]?.toUpperCase()}
  </div>
)}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              color: isSelected ? "#e2e8f0" : "#9CA3AF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
            }}
          >
            {member.name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: member.hasAdminAccess ? "#14B8A6" : "#374151",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {member.hasAdminAccess ? "access: granted" : "access: none"}
          </div>
        </div>

        {/* Access indicator pip */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            flexShrink: 0,
            backgroundColor: member.hasAdminAccess ? "#14B8A6" : "#374151",
            boxShadow: member.hasAdminAccess
              ? "0 0 6px rgba(20,184,166,0.6)"
              : "none",
            transition: "all 0.3s",
          }}
        />
      </div>
    </div>
  );
}

/* ── Access detail / action panel ── */
function AccessDetail({ member, onGiveAccess, onRemoveAccess, loading, isMobile }) {
  // const [focused, setFocused] = useState(false);

  if (!member)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#374151",
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>🔐</div>
        <div style={{ fontSize: 13 }}>select a member to manage access</div>
        <div style={{ fontSize: 11, marginTop: 4, color: "#1f2937" }}>
          access_control — bash
        </div>
      </div>
    );

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
      }}
    >
      {/* Terminal title bar */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "rgba(13,17,23,0.6)",
          borderBottom: "1px solid rgba(20,184,166,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#4B5563",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57", "#FFBD2E", "#28CA41"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        <span style={{ marginLeft: 6 }}>access_control — bash</span>
      </div>

      <div style={{ padding: isMobile ? "16px 12px" : "20px 24px" }}>
        {/* Member header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          {member.photo_url ? (
  <img
    src={member.photo_url}
    alt={member.name}
    style={{
      width: 52, height: 52, borderRadius: '50%', objectFit: 'cover',
      border: `2px solid ${member.hasAdminAccess ? 'rgba(20,184,166,0.4)' : 'rgba(75,85,99,0.3)'}`,
      boxShadow: member.hasAdminAccess ? '0 0 20px rgba(20,184,166,0.2)' : 'none',
    }}
    onError={e => { e.target.style.display = 'none' }}
  />
) : (
  <div style={{
    width: 52, height: 52, borderRadius: '50%',
    background: member.hasAdminAccess
      ? 'linear-gradient(135deg, rgba(20,184,166,0.25), rgba(20,184,166,0.08))'
      : 'linear-gradient(135deg, rgba(75,85,99,0.2), rgba(75,85,99,0.05))',
    border: `2px solid ${member.hasAdminAccess ? 'rgba(20,184,166,0.4)' : 'rgba(75,85,99,0.3)'}`,
    boxShadow: member.hasAdminAccess ? '0 0 20px rgba(20,184,166,0.2)' : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, color: member.hasAdminAccess ? '#14B8A6' : '#4B5563', fontWeight: 700,
    transition: 'all 0.4s',
  }}>
    {member.name?.[0]?.toUpperCase()}
  </div>
)}
          <div>
            <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>
              {member.name}
            </div>
            <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>
              {member.role} · Batch {member.batch}
            </div>
          </div>
          <div
            style={{
              marginLeft: isMobile ? 0 : "auto",
              backgroundColor: member.hasAdminAccess
                ? "rgba(20,184,166,0.1)"
                : "rgba(75,85,99,0.1)",
              border: `1px solid ${member.hasAdminAccess ? "rgba(20,184,166,0.3)" : "rgba(75,85,99,0.2)"}`,
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 10,
              color: member.hasAdminAccess ? "#14B8A6" : "#4B5563",
              letterSpacing: "0.1em",
              transition: "all 0.3s",
            }}
          >
            {member.hasAdminAccess ? "ADMIN" : "NO ACCESS"}
          </div>
        </div>

        {/* cat access.json */}
        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 10 }}>
          <span style={{ color: "#14B8A6" }}>$ </span>cat access.json
        </div>

        <div
          style={{
            backgroundColor: "rgba(13,17,23,0.7)",
            border: "1px solid rgba(35,43,58,0.9)",
            borderRadius: 10,
            padding: "16px 18px",
            fontSize: 13,
            lineHeight: 2,
            marginBottom: 24,
          }}
        >
          <div style={{ color: "#6B7280" }}>{"{"}</div>
          {[
            { key: "name", val: member.name },
            { key: "role", val: member.role },
            { key: "batch", val: member.batch },
            {
              key: "hasAccess",
              val: member.hasAdminAccess ? "true" : "false",
              isFlag: true,
            },
            {
              key: "adminEmail",
              val: member.hasAdminAccess ? member.adminEmail : "null",
            },
          ].map(({ key, val, isFlag }) => (
            <div key={key} style={{ paddingLeft: 16 }}>
              <span style={{ color: "#14B8A6" }}>"{key}"</span>
              <span style={{ color: "#6B7280" }}>: </span>
              <span
                style={{
                  color: isFlag
                    ? val === "true"
                      ? "#4ade80"
                      : "#ef4444"
                    : "#e2e8f0",
                }}
              >
                "{val}"
              </span>
              <span style={{ color: "#6B7280" }}>,</span>
            </div>
          ))}
          <div style={{ color: "#6B7280" }}>{"}"}</div>
        </div>

        {/* Action section */}
        {member.hasAdminAccess ? (
          <>
            {/* Already has access — show revoke */}
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
              <span style={{ color: "#14B8A6" }}>$ </span>
              sudo revoke-admin{" "}
              <span style={{ color: "#e2e8f0" }}>{member.name}</span>
            </div>

            <div
              style={{
                backgroundColor: "rgba(239,68,68,0.04)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 16,
                fontSize: 12,
                color: "#6B7280",
                lineHeight: 1.7,
              }}
            >
              <div>
                {"// WARNING: this will invalidate their admin credentials"}
              </div>
              <div>
                {"// admin email: "}
                <span style={{ color: "#e2e8f0" }}>{member.adminEmail}</span>
              </div>
            </div>

            <button
              onClick={() => onRemoveAccess(member)}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 8,
                padding: "10px 20px",
                color: "#ef4444",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontWeight: 600,
                letterSpacing: "0.05em",
                transition: "all 0.15s",
                opacity: loading ? 0.45 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(239,68,68,0.15)";
                  e.currentTarget.style.boxShadow =
                    "0 0 16px rgba(239,68,68,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              $ rm -f admin_access
            </button>
          </>
        ) : (
  <>
    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
      <span style={{ color: "#14B8A6" }}>$ </span>
      sudo grant-admin{" "}
      <span style={{ color: "#e2e8f0" }}>{member.name}</span>
    </div>

    <div style={{
      backgroundColor: "rgba(13,17,23,0.5)",
      border: "1px solid rgba(35,43,58,0.9)",
      borderRadius: 10,
      padding: "14px 16px",
      marginBottom: 16,
      fontSize: 12,
      color: "#374151",
      lineHeight: 1.8,
    }}>
      <div>{"// credentials will be generated automatically"}</div>
      <div>{"// save them when shown — password is shown only once"}</div>
    </div>

    <button
      onClick={() => onGiveAccess(member)}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "linear-gradient(135deg, rgba(20,184,166,0.9), rgba(20,184,166,0.7))",
        border: "none", borderRadius: 8,
        padding: "10px 20px",
        color: "#0D1117", fontSize: 12,
        cursor: "pointer",
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontWeight: 700, letterSpacing: "0.08em",
        transition: "transform 0.15s, box-shadow 0.15s",
        opacity: loading ? 0.45 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(20,184,166,0.35)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {loading ? "$ executing..." : "$ grant admin_access"}
    </button>
  </>
)}

        {/* Terminal prompt */}
        <div style={{ marginTop: 20, fontSize: 13, color: "#6B7280" }}>
          <span style={{ color: "#14B8A6" }}>$ </span>
          <span style={{ borderBottom: "1px solid #374151" }}>_</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
function AdminAccessPanel() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null)
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  const [treeOpen, setTreeOpen] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setTreeOpen(true);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchMembers = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await api.get("/admin-access", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
      // Re-sync selected if it was updated
      if (selected) {
        const updated = res.data.find((m) => m._id === selected._id);
        if (updated) setSelected(updated);
      }
    } catch (err) {
      toast.error("Failed to fetch members");
    }
  };

  const handleGiveAccess = async (member) => {
  setLoading(true)
  try {
    const token = await auth.currentUser.getIdToken()
    const res = await api.post(
      `/admin-access/give/${member._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setCredentials({
      name: member.name,
      email: res.data.credentials.email,
      password: res.data.credentials.password
    })
    toast.success(`Admin access given to ${member.name}`)
    await fetchMembers()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

  const handleRemoveAccess = async (member) => {
    if (!confirm(`rm -f admin_access for ${member.name}?`)) return;
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await api.post(
        `/admin-access/remove/${member._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Access removed from ${member.name}`);
      await fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const withAccess = members.filter((m) => m.hasAdminAccess);
  const withoutAccess = members.filter((m) => !m.hasAdminAccess);

  const handleSelectMember = (member) => {
    setSelected(member);
    if (isMobile) setTreeOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* ── IDE-style 2-panel layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "240px 1fr",
          gridTemplateRows: isMobile ? "auto auto auto 1fr" : "auto 1fr",
          gap: 0,
          minHeight: "calc(100vh - 180px)",
          border: "1px solid rgba(20,184,166,0.12)",
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: "rgba(13,17,23,0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* ── Left: member tree ── */}
        <div
          style={{
            gridRow: isMobile ? "auto" : "1 / 3",
            borderRight: "1px solid rgba(20,184,166,0.1)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(10,13,18,0.5)",
            borderBottom: isMobile ? "1px solid rgba(20,184,166,0.1)" : "none",
          }}
        >
          {/* Tree header */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid rgba(20,184,166,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#374151",
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
              }}
            >
              MEMBERS ({members.length})
            </span>
            <div
              style={{
                fontSize: 10,
                color: "#14B8A6",
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                backgroundColor: "rgba(20,184,166,0.08)",
                border: "1px solid rgba(20,184,166,0.2)",
                borderRadius: 5,
                padding: "1px 7px",
              }}
            >
              {withAccess.length} admin
            </div>
          </div>

          {isMobile && (
            <button
              onClick={() => setTreeOpen((v) => !v)}
              style={{
                margin: "10px 12px 8px",
                background: "rgba(20,184,166,0.08)",
                border: "1px solid rgba(20,184,166,0.2)",
                borderRadius: 8,
                color: "#14B8A6",
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 12,
                padding: "8px 10px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {treeOpen ? "$ hide member explorer" : "$ show member explorer"}
            </button>
          )}

          {/* Member list — grouped */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: 12,
              maxHeight: isMobile ? 260 : "none",
              display: !isMobile || treeOpen ? "block" : "none",
            }}
          >
            {members.length === 0 ? (
              <div
                style={{
                  padding: "20px 14px",
                  fontSize: 11,
                  color: "#374151",
                  fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  textAlign: "center",
                }}
              >
                no members found
              </div>
            ) : (
              <>
                {withAccess.length > 0 && (
                  <div>
                    <div
                      style={{
                        padding: "8px 12px",
                        fontSize: 11,
                        color: "#14B8A6",
                        fontFamily: '"Fira Code", "Cascadia Code", monospace',
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: 0.7,
                      }}
                    >
                      <span>▾</span>
                      <span>🔓 granted/</span>
                    </div>
                    {withAccess.map((m) => (
                      <MemberTreeItem
                        key={m._id}
                        member={m}
                        isSelected={selected?._id === m._id}
                        onSelect={handleSelectMember}
                      />
                    ))}
                  </div>
                )}

                {withoutAccess.length > 0 && (
                  <div>
                    <div
                      style={{
                        padding: "8px 12px",
                        fontSize: 11,
                        color: "#374151",
                        fontFamily: '"Fira Code", "Cascadia Code", monospace',
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: 0.7,
                      }}
                    >
                      <span>▾</span>
                      <span>🔒 pending/</span>
                    </div>
                    {withoutAccess.map((m) => (
                      <MemberTreeItem
                        key={m._id}
                        member={m}
                        isSelected={selected?._id === m._id}
                        onSelect={handleSelectMember}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Top-right: tab bar ── */}
        <div
          style={{
            borderBottom: "1px solid rgba(20,184,166,0.1)",
            display: "flex",
            alignItems: "flex-end",
            backgroundColor: "rgba(10,13,18,0.4)",
            padding: "0 4px",
            overflowX: "auto",
          }}
        >
          <button
            style={{
              padding: "8px 16px",
              background: "rgba(22,27,38,0.9)",
              border: "none",
              borderTop: "1px solid #14B8A6",
              color: "#e2e8f0",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: 12,
              cursor: "default",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            🔐 {selected ? `manage — ${selected.name}` : "access_control.js"}
          </button>
        </div>

        {/* ── Bottom-right: detail panel ── */}
        <div
          style={{ overflow: "auto", display: "flex", flexDirection: "column" }}
        >
          <AccessDetail
  member={selected}
  onGiveAccess={handleGiveAccess}
  onRemoveAccess={handleRemoveAccess}
  loading={loading}
  isMobile={isMobile}
/>
        </div>
      </div>

    {/* Credentials modal */}
    {credentials && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 999,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{
          backgroundColor: "#161B26",
          border: "1px solid rgba(20,184,166,0.3)",
          borderRadius: 16,
          width: "100%", maxWidth: 420,
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(20,184,166,0.15)",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(20,184,166,0.1)",
            display: "flex", alignItems: "center", gap: 8,
            backgroundColor: "rgba(13,17,23,0.6)",
          }}>
            {["#FF5F57", "#FFBD2E", "#28CA41"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c, opacity: 0.7 }} />
            ))}
            <span style={{ marginLeft: 8, color: "#4B5563", fontSize: 12, fontFamily: "monospace" }}>
              credentials.env — {credentials.name}
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: "24px 24px 16px", fontFamily: "monospace" }}>
            <div style={{ fontSize: 12, color: "#14B8A6", marginBottom: 16 }}>
              $ access granted — save these credentials now
            </div>

            <div style={{
              backgroundColor: "#0D1117",
              border: "1px solid #232B3A",
              borderRadius: 10,
              padding: "16px 18px",
              fontSize: 13, lineHeight: 2.2,
              marginBottom: 16,
            }}>
              <div>
                <span style={{ color: "#4B5563" }}>EMAIL</span>
                <span style={{ color: "#6B7280" }}> = </span>
                <span style={{ color: "#E8EAED" }}>{credentials.email}</span>
              </div>
              <div>
                <span style={{ color: "#4B5563" }}>PASSWORD</span>
                <span style={{ color: "#6B7280" }}> = </span>
                <span style={{ color: "#8B5CF6" }}>{credentials.password}</span>
              </div>
              <div>
                <span style={{ color: "#4B5563" }}>LOGIN_URL</span>
                <span style={{ color: "#6B7280" }}> = </span>
                <span style={{ color: "#14B8A6" }}>kp-devcell.vercel.app/login</span>
              </div>
            </div>

            <div style={{
              backgroundColor: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 11, color: "#ef4444",
              marginBottom: 20, lineHeight: 1.6,
            }}>
              ⚠️ This is the only time the password will be shown. Copy it now.
            </div>

            <button
              onClick={() => setCredentials(null)}
              style={{
                width: "100%", padding: "10px",
                background: "linear-gradient(135deg, rgba(20,184,166,0.9), rgba(20,184,166,0.7))",
                border: "none", borderRadius: 8,
                color: "#0D1117", fontFamily: "monospace",
                fontWeight: 700, fontSize: 12,
                cursor: "pointer", letterSpacing: "0.08em",
              }}
            >
              $ i have saved the credentials
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default AdminAccessPanel;
