import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#members", label: "Core" },
  { href: "#projects", label: "Projects" },
  { href: "#login", label: "Login" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Dev Cell home">
        <span className="brand-mark">DC</span>
        <span>Dev Cell</span>
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={open ? "nav-links nav-links-open" : "nav-links"}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
