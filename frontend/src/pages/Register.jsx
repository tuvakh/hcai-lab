import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      navigate('/login', { state: { from: location.state?.from } })
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Register</h1>
        <form className="auth-page__form" onSubmit={handleSubmit}>
          <input className="auth-page__input" type="text" pattern="[a-zA-ZæøåÆØÅ\s\-']+" title="Name can only contain letters, spaces, and hyphens" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <input className="auth-page__input" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="auth-page__input" type="password" minLength={8} placeholder="Password (min 8 characters)" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="auth-page__error">{error}</p>}
          <button className="auth-page__btn" type="submit">Register</button>
        </form>
        <p className="auth-page__link">Already have an account? <Link to="/login" state={{ from: location.state?.from }}>Log in</Link></p>
      </div>
    </main>
  );
}

export default Register;
