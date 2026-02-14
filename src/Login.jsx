import { useState } from "react";
import { login } from "./api/auth";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      onLogin();
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "100px auto" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button>Ingresar</button>
        {error && <p style={{color:"red"}}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;