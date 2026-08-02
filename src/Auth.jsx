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
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "13px 14px",
  color: C.white,
  fontSize: 14,
  outline: "none",
  marginBottom: 12,
};

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
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
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(traduzErro(error.message));
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(traduzErro(error.message));
      else setInfo('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
