import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { config } from "../../config/env.js";

export function AuthSection() {
  const { user, authReady, authError, signIn, signOut } = useAuth();

  return (
    <section className="auth-section" id="login">
      <div className="auth-copy">
        <p className="eyebrow">College access</p>
        <h2>Student doubt room</h2>
        <p>
          Sign in with your college account to open the shared chat and ask development
          doubts.
        </p>
        {config.collegeEmailDomain ? (
          <p className="domain-note">Allowed domain: @{config.collegeEmailDomain}</p>
        ) : null}
      </div>

      <div className="auth-panel">
        {user ? (
          <>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "Signed in student"} />
            ) : (
              <span className="profile-fallback" aria-hidden="true">
                {(user.displayName || user.email || "S").charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <h3>{user.displayName || "Student"}</h3>
              <p>{user.email}</p>
            </div>
            <button className="secondary-button auth-button" type="button" onClick={signOut}>
              <LogOut size={18} />
              Sign out
            </button>
          </>
        ) : (
          <>
            <h3>Login to continue</h3>
            <p>The chat appears here after Firebase authentication succeeds.</p>
            <button
              className="primary-button auth-button"
              type="button"
              disabled={!authReady}
              onClick={signIn}
            >
              <LogIn size={18} />
              Sign in with Google
            </button>
          </>
        )}
        {authError ? <p className="form-error">{authError}</p> : null}
      </div>
    </section>
  );
}
