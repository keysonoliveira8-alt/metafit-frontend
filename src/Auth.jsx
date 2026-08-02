import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "./supabaseClient";

const C = {
  purple: "#7C3AED",
  green: "#22C55E",
  bg: "#000000",
  card: "#161F35",
  cardAlt: "#1B2542",
  border: "#243050",
  white: "#F8FAFC",
  gray: "#64748B",
};

const inputStyle = {
  width: "100%",
  background: C.cardAlt,
  border: "1px solid " + C.border,
  borderRadius: 12,
  padding: "13px 14px",
  color: C.white,
  fontSize: 14,
  outline: "none",
  marginBottom: 12,
};

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    if (mode === "login") {
      const result = await supabase.auth.signInWithPassword({ email: email, password: password });
      if (result.error) setError(traduzErro(result.error.message));
    } else {
      const result = await supabase.auth.signUp({ email: email, password: password });
      if (result.error) setError(traduzErro(result.error.message));
      else setInfo("Conta criada. Verifique seu email para confirmar o cadastro.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 24px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <span style={{ fontWeight: 800, fontSize: 30 }}>
          <span style={{ color: C.white }}>Meta</span><span style={{ color: C.green }}>Fit</span>
        </span>
        <div style={{ color: C.gray, fontSize: 13, marginTop: 6 }}>Seu corpo. Seus dados. Seus resultados.</div>
      </div>

      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 20, padding: 22 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button onClick={() => { setMode("login"); setError(""); setInfo(""); }} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: mode === "login" ? C.purple : C.cardAlt, color: mode === "login" ? "#fff" : C.gray,
          }}>Entrar</button>
          <button onClick={() => { setMode("signup"); setError(""); setInfo(""); }} style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: mode === "signup" ? C.purple : C.cardAlt, color: mode === "signup" ? "#fff" : C.gray,
          }}>Criar conta</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="email" required placeholder="E-mail" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required placeholder="Senha" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
          {mode === "signup" && (
            <input type="password" required placeholder="Confirmar senha" style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          )}

          {error ? <div style={{ color: "#F87171", fontSize: 12, marginBottom: 12 }}>{error}</div> : null}
          {info ? <div style={{ color: C.green, fontSize: 12, marginBottom: 12 }}>{info}</div> : null}

          <button type="submit" disabled={loading} style={{
            width: "100%", border: "none", borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: 14,
            background: "linear-gradient(135deg, " + C.purple + ", #9333EA)", color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
            {mode === "login" ? "Entrar" : "Criar minha conta"}
          </button>
        </form>
      </div>

      <p style={{ color: C.gray, fontSize: 11, textAlign: "center", marginTop: 16 }}>
        Ao continuar, voce concorda com os Termos de Uso e a Politica de Privacidade do MetaFit.
      </p>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}

function traduzErro(msg) {
  if (msg.indexOf("Invalid login credentials") !== -1) return "E-mail ou senha incorretos.";
  if (msg.indexOf("User already registered") !== -1) return "Ja existe uma conta com esse e-mail.";
  if (msg.indexOf("rate limit") !== -1) return "Muitas tentativas seguidas. Aguarde um pouco e tente de novo.";
  return msg;
}
