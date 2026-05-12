import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const location = useLocation();
  const from = location.state?.from || '/userpage'

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      login(data.token);
      navigate(from);
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Log in</h1>
        <form className="auth-page__form" onSubmit={handleSubmit}>
          <input className="auth-page__input" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="auth-page__input" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="auth-page__error">{error}</p>}
          <button className="auth-page__btn" type="submit">Log in</button>
        </form>
        <p className="auth-page__link">No account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  );
}

export default Login;
