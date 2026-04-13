import { useState, useEffect } from "react";
import { auth } from "../../firebase.js";
import api from "../../api.js";
import toast from "react-hot-toast";

const emptyForm = {
  title: "",
  message: "",
  active: true,
};

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

/* ── Terminal-style labeled input ── */
function TermInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: focused ? "#14B8A6" : "#4B5563",
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          transition: "color 0.2s",
        }}
      >
        <span style={{ color: "#374151" }}>const </span>
        <span style={{ color: focused ? "#14B8A6" : "#9CA3AF" }}>{label}</span>
        <span style={{ color: "#374151" }}> =</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? "#14B8A6" : "rgba(35,43,58,0.95)",
          boxShadow: focused ? "0 0 14px rgba(20,184,166,0.18)" : "none",
        }}
      />
    </div>
  );
}

/* ── Announcement row in the sidebar ── */
function AnnouncementTreeItem({
  announcement,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isMobile,
}) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMenuOpen(false);
      }}
    >
      <div
        onClick={() => onSelect(announcement)}
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
        {/* Status icon */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            flexShrink: 0,
            backgroundColor: announcement.active
              ? "rgba(20,184,166,0.1)"
              : "rgba(75,85,99,0.1)",
            border: `1px solid ${announcement.active ? "rgba(20,184,166,0.3)" : "rgba(75,85,99,0.2)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
          }}
        >
          {announcement.active ? "📢" : "📭"}
        </div>

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
            {announcement.title}
          </div>
          <div
            style={{
              fontSize: 10,
              color: announcement.active ? "#14B8A6" : "#374151",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
            }}
          >
            {announcement.active ? "active" : "inactive"}
          </div>
        </div>

        {/* Context menu trigger */}
        {(hovered || isMobile) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((m) => !m);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6B7280",
              cursor: "pointer",
              padding: "0 2px",
              fontSize: 14,
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            ⋯
          </button>
        )}
      </div>

      {/* Context dropdown */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            right: 8,
            top: "100%",
            zIndex: 200,
            backgroundColor: "#161b22",
            border: "1px solid rgba(20,184,166,0.2)",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            minWidth: 160,
          }}
        >
          <button
            onClick={() => {
              onEdit(announcement);
              setMenuOpen(false);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "9px 14px",
              background: "none",
              border: "none",
              color: "#9CA3AF",
              fontSize: 12,
              textAlign: "left",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(20,184,166,0.08)";
              e.target.style.color = "#14B8A6";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#9CA3AF";
            }}
          >
            $ edit announcement
          </button>
          <button
            onClick={() => {
              onDelete(announcement._id);
              setMenuOpen(false);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "9px 14px",
              background: "none",
              border: "none",
              color: "#6B7280",
              fontSize: 12,
              textAlign: "left",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              cursor: "pointer",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(239,68,68,0.08)";
              e.target.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#6B7280";
            }}
          >
            $ rm announcement
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Announcement detail panel ── */
function AnnouncementDetail({ announcement, isMobile }) {
  if (!announcement)
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
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>📢</div>
        <div style={{ fontSize: 13 }}>select an announcement to preview</div>
        <div style={{ fontSize: 11, marginTop: 4, color: "#1f2937" }}>
          announcement_info — bash
        </div>
      </div>
    );

  const fields = [
    { key: "title", val: announcement.title },
    { key: "message", val: announcement.message },
    {
      key: "active",
      val: announcement.active ? "true" : "false",
      isFlag: true,
    },
  ];

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
        <span style={{ marginLeft: 6 }}>announcement_info — bash</span>
      </div>

      <div style={{ padding: isMobile ? "16px 12px" : "20px 20px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 24,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 10,
              flexShrink: 0,
              background: announcement.active
                ? "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(20,184,166,0.05))"
                : "linear-gradient(135deg, rgba(75,85,99,0.15), rgba(75,85,99,0.04))",
              border: `2px solid ${announcement.active ? "rgba(20,184,166,0.35)" : "rgba(75,85,99,0.25)"}`,
              boxShadow: announcement.active
                ? "0 0 18px rgba(20,184,166,0.15)"
                : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              transition: "all 0.3s",
            }}
          >
            {announcement.active ? "📢" : "📭"}
          </div>
          <div>
            <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>
              {announcement.title}
            </div>
            <div style={{ marginTop: 4 }}>
              <span
                style={{
                  fontSize: 10,
                  color: announcement.active ? "#14B8A6" : "#4B5563",
                  backgroundColor: announcement.active
                    ? "rgba(20,184,166,0.1)"
                    : "rgba(75,85,99,0.1)",
                  border: `1px solid ${announcement.active ? "rgba(20,184,166,0.3)" : "rgba(75,85,99,0.2)"}`,
                  borderRadius: 20,
                  padding: "2px 10px",
                  letterSpacing: "0.1em",
                }}
              >
                {announcement.active ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        </div>

        {/* cat announcement.json */}
        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 10 }}>
          <span style={{ color: "#14B8A6" }}>$ </span>cat announcement.json
        </div>

        <div
          style={{
            backgroundColor: "rgba(13,17,23,0.7)",
            border: "1px solid rgba(35,43,58,0.9)",
            borderRadius: 10,
            padding: "16px 18px",
            fontSize: 13,
            lineHeight: 2,
          }}
        >
          <div style={{ color: "#6B7280" }}>{"{"}</div>
          {fields.map(({ key, val, isFlag }) => (
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

        {/* Hero preview */}
        {announcement.active && (
          <>
            <div
              style={{
                fontSize: 13,
                color: "#6B7280",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <span style={{ color: "#14B8A6" }}>$ </span>preview hero_card
            </div>
            <div
              style={{
                backgroundColor: "rgba(20,184,166,0.05)",
                border: "1px solid rgba(20,184,166,0.2)",
                borderRadius: 10,
                padding: "14px 16px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#14B8A6",
                  letterSpacing: "0.12em",
                  fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                📢 Announcement
              </div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {announcement.title}
              </div>
              <div style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 1.6 }}>
                {announcement.message}
              </div>
            </div>
          </>
        )}

        {/* Prompt */}
        <div style={{ marginTop: 16, fontSize: 13, color: "#6B7280" }}>
          <span style={{ color: "#14B8A6" }}>$ </span>
          <span style={{ borderBottom: "1px solid #374151" }}>_</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("form"); // 'form' | 'preview'
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  const [treeOpen, setTreeOpen] = useState(true);

  const [titleFocused, setTitleFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
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

  const fetchAnnouncements = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await api.get("/announcements/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data);
      if (selected) {
        const updated = res.data.find((a) => a._id === selected._id);
        if (updated) setSelected(updated);
      }
    } catch (err) {
      toast.error("Failed to fetch announcements");
    }
  };

  const getToken = async () => {
    const token = await auth.currentUser.getIdToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = await getToken();
      if (editingId) {
        await api.put(`/announcements/${editingId}`, form, config);
        toast.success("Announcement updated");
      } else {
        await api.post("/announcements", form, config);
        toast.success("Announcement posted");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setForm({
      title: announcement.title,
      message: announcement.message,
      active: announcement.active,
    });
    setEditingId(announcement._id);
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("rm -rf announcement? This cannot be undone.")) return;
    try {
      const config = await getToken();
      await api.delete(`/announcements/${id}`, config);
      toast.success("Announcement deleted");
      if (selected?._id === id) setSelected(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelect = (announcement) => {
    setSelected(announcement);
    setView("preview");
    if (isMobile) setTreeOpen(false);
  };

  const active = announcements.filter((a) => a.active);
  const inactive = announcements.filter((a) => !a.active);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap');
        .term-btn-primary {
          background: linear-gradient(135deg, rgba(20,184,166,0.9), rgba(20,184,166,0.7));
          border: none; border-radius: 8px;
          color: #0D1117; font-family: "Fira Code","Cascadia Code",monospace;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
          padding: 10px 20px; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .term-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 20px rgba(20,184,166,0.35); }
        .term-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .term-btn-ghost {
          background: none;
          border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
          color: #6B7280; font-family: "Fira Code","Cascadia Code",monospace;
          font-size: 12px; padding: 10px 20px; cursor: pointer;
          transition: all 0.15s;
        }
        .term-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: #9CA3AF; }
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
        {/* ── Left: file tree ── */}
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
              ANNOUNCEMENTS ({announcements.length})
            </span>
            <button
              onClick={() => {
                setView("form");
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={{
                background: "rgba(20,184,166,0.1)",
                border: "1px solid rgba(20,184,166,0.25)",
                borderRadius: 5,
                color: "#14B8A6",
                fontSize: 16,
                lineHeight: 1,
                padding: "1px 7px",
                cursor: "pointer",
                fontWeight: 300,
              }}
              title="New announcement"
            >
              +
            </button>
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
              {treeOpen ? "$ hide announcement explorer" : "$ show announcement explorer"}
            </button>
          )}

          {/* Grouped list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: 12,
              maxHeight: isMobile ? 260 : "none",
              display: !isMobile || treeOpen ? "block" : "none",
            }}
          >
            {announcements.length === 0 ? (
              <div
                style={{
                  padding: "20px 14px",
                  fontSize: 11,
                  color: "#374151",
                  fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  textAlign: "center",
                }}
              >
                no announcements yet
              </div>
            ) : (
              <>
                {active.length > 0 && (
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
                      <span>
                        📢 active/{" "}
                        <span style={{ color: "#374151" }}>
                          ({active.length}/3)
                        </span>
                      </span>
                    </div>
                    {active.map((a) => (
                      <AnnouncementTreeItem
                        key={a._id}
                        announcement={a}
                        isSelected={
                          selected?._id === a._id && view === "preview"
                        }
                        onSelect={handleSelect}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                )}

                {inactive.length > 0 && (
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
                      <span>📭 inactive/</span>
                    </div>
                    {inactive.map((a) => (
                      <AnnouncementTreeItem
                        key={a._id}
                        announcement={a}
                        isSelected={
                          selected?._id === a._id && view === "preview"
                        }
                        onSelect={handleSelect}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Active count hint */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(20,184,166,0.08)",
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: 10,
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            <div>{"// max 3 active at a time"}</div>
            <div>{"// shown on homepage hero"}</div>
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
          {[
            {
              id: "form",
              label: editingId
                ? "✏️ edit_announcement.js"
                : "➕ new_announcement.js",
            },
            {
              id: "preview",
              label: `👁 preview${selected ? ` — ${selected.title}` : ""}`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                padding: "8px 16px",
                background:
                  view === tab.id ? "rgba(22,27,38,0.9)" : "transparent",
                border: "none",
                borderTop:
                  view === tab.id
                    ? "1px solid #14B8A6"
                    : "1px solid transparent",
                color: view === tab.id ? "#e2e8f0" : "#4B5563",
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Bottom-right: form or preview ── */}
        <div
          style={{ overflow: "auto", display: "flex", flexDirection: "column" }}
        >
          {view === "form" ? (
            <div style={{ padding: isMobile ? "16px 12px" : "24px 28px" }}>
              {/* Form header comment */}
              <div
                style={{
                  fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  fontSize: 12,
                  color: "#374151",
                  marginBottom: 20,
                  lineHeight: 1.8,
                }}
              >
                <div>
                  {"// " +
                    (editingId
                      ? "editing existing announcement"
                      : "posting new announcement to homepage")}
                </div>
                <div>
                  {
                    "// active announcements float on the hero as clickable cards"
                  }
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: titleFocused ? "#14B8A6" : "#4B5563",
                      fontFamily: '"Fira Code", "Cascadia Code", monospace',
                      transition: "color 0.2s",
                    }}
                  >
                    <span style={{ color: "#374151" }}>const </span>
                    <span
                      style={{ color: titleFocused ? "#14B8A6" : "#9CA3AF" }}
                    >
                      title
                    </span>
                    <span style={{ color: "#374151" }}> =</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder='"Recruitment Open!"'
                    onFocus={() => setTitleFocused(true)}
                    onBlur={() => setTitleFocused(false)}
                    style={{
                      ...inputStyle,
                      borderColor: titleFocused
                        ? "#14B8A6"
                        : "rgba(35,43,58,0.95)",
                      boxShadow: titleFocused
                        ? "0 0 14px rgba(20,184,166,0.18)"
                        : "none",
                    }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: messageFocused ? "#14B8A6" : "#4B5563",
                      fontFamily: '"Fira Code", "Cascadia Code", monospace',
                      transition: "color 0.2s",
                    }}
                  >
                    <span style={{ color: "#374151" }}>const </span>
                    <span
                      style={{ color: messageFocused ? "#14B8A6" : "#9CA3AF" }}
                    >
                      message
                    </span>
                    <span style={{ color: "#374151" }}> =</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder='"Write your announcement here..."'
                    onFocus={() => setMessageFocused(true)}
                    onBlur={() => setMessageFocused(false)}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                      borderColor: messageFocused
                        ? "#14B8A6"
                        : "rgba(35,43,58,0.95)",
                      boxShadow: messageFocused
                        ? "0 0 14px rgba(20,184,166,0.18)"
                        : "none",
                    }}
                  />
                </div>

                {/* Active toggle */}
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    marginBottom: 24,
                    fontFamily: '"Fira Code", "Cascadia Code", monospace',
                    fontSize: 12,
                    color: "#6B7280",
                    backgroundColor: "rgba(20,184,166,0.05)",
                    border: "1px solid rgba(20,184,166,0.12)",
                    borderRadius: 8,
                    padding: "8px 14px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    style={{ accentColor: "#14B8A6", width: 14, height: 14 }}
                  />
                  <span>
                    <span style={{ color: "#374151" }}>active</span>
                    <span style={{ color: "#6B7280" }}> = </span>
                    <span
                      style={{ color: form.active ? "#4ade80" : "#ef4444" }}
                    >
                      {form.active ? "true" : "false"}
                    </span>
                    <span
                      style={{ color: "#374151", fontSize: 10, marginLeft: 8 }}
                    >
                      {"// show on homepage"}
                    </span>
                  </span>
                </label>

                {/* Live preview strip */}
                {(form.title || form.message) && (
                  <div style={{ marginBottom: 22 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#374151",
                        marginBottom: 8,
                        fontFamily: '"Fira Code", "Cascadia Code", monospace',
                      }}
                    >
                      {"// live preview →"}
                    </div>
                    <div
                      style={{
                        backgroundColor: form.active
                          ? "rgba(20,184,166,0.05)"
                          : "rgba(75,85,99,0.05)",
                        border: `1px solid ${form.active ? "rgba(20,184,166,0.18)" : "rgba(75,85,99,0.15)"}`,
                        borderRadius: 10,
                        padding: "12px 16px",
                        transition: "all 0.3s",
                      }}
                    >
                      {form.title && (
                        <div
                          style={{
                            color: "#e2e8f0",
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily:
                              '"Fira Code", "Cascadia Code", monospace',
                            marginBottom: form.message ? 4 : 0,
                          }}
                        >
                          {form.active ? "📢 " : "📭 "}
                          {form.title}
                        </div>
                      )}
                      {form.message && (
                        <div
                          style={{
                            color: "#9CA3AF",
                            fontSize: 12,
                            lineHeight: 1.6,
                            fontFamily:
                              '"Fira Code", "Cascadia Code", monospace',
                          }}
                        >
                          {form.message}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="term-btn-primary"
                  >
                    {loading
                      ? "$ executing..."
                      : editingId
                        ? '$ git commit -m "update"'
                        : "$ post announcement"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="term-btn-ghost"
                      onClick={() => {
                        setForm(emptyForm);
                        setEditingId(null);
                      }}
                    >
                      $ cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <AnnouncementDetail announcement={selected} isMobile={isMobile} />
          )}
        </div>
      </div>
    </>
  );
}

export default AnnouncementsAdmin;
