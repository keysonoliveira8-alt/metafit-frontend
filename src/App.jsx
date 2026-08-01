import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Utensils, Dumbbell, TrendingUp, User, Plus, Flame, ChevronRight,
  ChevronLeft, Check, X, Camera, Sparkles, Bot, Send, Clock, Target,
  ArrowLeft, Loader2, Crown, Search, Trash2, Edit3, ImagePlus, CheckCircle2,
  Circle, RotateCcw, Info, Zap, Award, Calendar as CalendarIcon, Bell, FileText
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

/* ============================== DESIGN TOKENS ============================== */
const C = {
  purple: "#7C3AED",
  purpleDim: "#7C3AED33",
  green: "#22C55E",
  greenDim: "#22C55E33",
  bg: "#000000",
  card: "#161F35",
  cardAlt: "#1B2542",
  border: "#243050",
  white: "#F8FAFC",
  gray: "#64748B",
  yellow: "#F59E0B",
};

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
* { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
::-webkit-scrollbar { display: none; }
body { -ms-overflow-style: none; scrollbar-width: none; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.35s ease both; }
@keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.35); } 70% { box-shadow: 0 0 0 10px rgba(124,58,237,0); } 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); } }
`;

/* ============================== DEMO / DEFAULT DATA ============================== */
const defaultProfile = {
  name: "Keyson",
  age: 27,
  sex: "Masculino",
  height: 178,
  weight: 57.4,
  weightGoal: 70,
  goal: "Ganhar massa",
  activityLevel: "Moderado",
  trainDays: 5,
  trainTime: "45–60 min",
  location: "Academia",
  equipment: "Barra, halteres, máquinas",
  dailyCalories: 2500,
  proteinGoal: 140,
  carbsGoal: 300,
  fatGoal: 70,
};

const defaultConsumed = { calories: 1780, protein: 105, carbs: 220, fat: 55 };

const defaultMeals = {
  "Café da manhã": [
    { id: "m1", name: "Omelete de 3 ovos + queijo", time: "07:30", calories: 380, protein: 28, carbs: 4, fat: 26 },
    { id: "m2", name: "Aveia com banana e mel", time: "07:45", calories: 320, protein: 10, carbs: 55, fat: 6 },
  ],
  "Almoço": [
    { id: "m3", name: "Frango grelhado + arroz + feijão", time: "12:30", calories: 650, protein: 48, carbs: 70, fat: 12 },
  ],
  "Lanches": [
    { id: "m4", name: "Whey protein + pasta de amendoim", time: "16:00", calories: 280, protein: 26, carbs: 18, fat: 11 },
    { id: "m5", name: "Mix de castanhas", time: "17:00", calories: 150, protein: 4, carbs: 8, fat: 12 },
  ],
  "Jantar": [],
};

const foodsDB = [
  { name: "Peito de frango grelhado (100g)", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: "Arroz branco cozido (100g)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Feijão carioca cozido (100g)", calories: 90, protein: 6, carbs: 16, fat: 0.5 },
  { name: "Ovo cozido (unidade)", calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: "Batata doce cozida (100g)", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: "Whey protein (1 dose)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: "Banana (unidade)", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Aveia em flocos (30g)", calories: 117, protein: 4, carbs: 20, fat: 2.5 },
  { name: "Pão integral (fatia)", calories: 70, protein: 3, carbs: 12, fat: 1 },
  { name: "Pasta de amendoim (1 colher)", calories: 95, protein: 4, carbs: 3, fat: 8 },
  { name: "Iogurte natural (100g)", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
  { name: "Salmão grelhado (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
];

const exerciseLibrary = {
  "Peito": ["Supino reto", "Supino inclinado", "Supino com halteres", "Crucifixo", "Crossover", "Peck deck"],
  "Costas": ["Puxada frontal", "Remada curvada", "Remada baixa", "Pull-down", "Levantamento terra"],
  "Pernas": ["Agachamento livre", "Leg press", "Cadeira extensora", "Cadeira flexora", "Stiff", "Panturrilha em pé"],
  "Ombro": ["Desenvolvimento com halteres", "Elevação lateral", "Elevação frontal", "Remada alta"],
  "Bíceps": ["Rosca direta", "Rosca alternada", "Rosca scott", "Rosca martelo"],
  "Tríceps": ["Tríceps pulley", "Tríceps francês", "Mergulho no banco", "Tríceps corda"],
  "Abdômen": ["Abdominal supra", "Prancha", "Elevação de pernas", "Abdominal na polia"],
};

const defaultTodayWorkout = {
  name: "Treino A — Peito + Tríceps",
  muscleGroup: "Peito + Tríceps",
  durationEstimate: 50,
  exercises: [
    { id: "e1", name: "Supino reto", sets: 4, reps: 10, load: 20 },
    { id: "e2", name: "Supino inclinado com halteres", sets: 3, reps: 12, load: 16 },
    { id: "e3", name: "Crucifixo", sets: 3, reps: 12, load: 12 },
    { id: "e4", name: "Crossover", sets: 3, reps: 15, load: 15 },
    { id: "e5", name: "Tríceps pulley", sets: 3, reps: 12, load: 25 },
    { id: "e6", name: "Tríceps francês", sets: 2, reps: 12, load: 10 },
  ],
};

const defaultWorkoutHistory = [
  { id: "w1", date: "Seg, 21 jul", name: "Peito + Tríceps", duration: 48, sets: 18, feeling: "Bom", difficulty: "Normal", notes: "" },
  { id: "w2", date: "Ter, 22 jul", name: "Costas + Bíceps", duration: 52, sets: 16, feeling: "Excelente", difficulty: "Pesado", notes: "Aumentei a carga na remada." },
];

const weekPlan = [
  { day: "SEG", label: "Peito + Tríceps", status: "done" },
  { day: "TER", label: "Costas + Bíceps", status: "done" },
  { day: "QUA", label: "Descanso", status: "rest" },
  { day: "QUI", label: "Pernas", status: "suggested" },
  { day: "SEX", label: "Não registrado", status: "empty" },
  { day: "SÁB", label: "Não registrado", status: "empty" },
  { day: "DOM", label: "Descanso", status: "rest" },
];

const defaultWeightHistory = [
  { date: "01/06", weight: 56.0 },
  { date: "08/06", weight: 56.3 },
  { date: "15/06", weight: 56.5 },
  { date: "22/06", weight: 56.8 },
  { date: "29/06", weight: 57.0 },
  { date: "06/07", weight: 57.1 },
  { date: "13/07", weight: 57.2 },
  { date: "20/07", weight: 57.4 },
];

const defaultMeasurements = {
  current: { braço: 33, peito: 92, cintura: 74, quadril: 95, coxa: 54, panturrilha: 36 },
  initial: { braço: 31, peito: 89, cintura: 75, quadril: 94, coxa: 52, panturrilha: 35 },
};

const defaultGoals = [
  { id: "g1", label: "Peso corporal", current: 57.4, target: 70, unit: "kg" },
  { id: "g2", label: "Treinos por semana", current: 2, target: 5, unit: "treinos" },
  { id: "g3", label: "Meta de proteína diária", current: 105, target: 140, unit: "g" },
];

const STORAGE_KEY = "metafit-app-state";

/* ============================== CLAUDE API HELPER ============================== */
// A IA do MetaFit roda atraves do backend (Railway), que guarda a chave da API da Anthropic
// em uma variavel de ambiente segura e nunca expoe ela no navegador.
// Configure VITE_BACKEND_URL no Vercel apontando para o seu backend (ex: agente-financeiro).
// O backend deve expor um endpoint POST /api/ai que recebe { system, userText, imageBase64, mediaType }
// e retorna { text }, repassando a chamada para a API da Anthropic (model claude-sonnet-4-6-ish, seu backend decide).
async function askClaude(system, userText, imageBase64, mediaType) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.warn("VITE_BACKEND_URL nao configurada — a IA do MetaFit ainda nao esta conectada a um backend.");
    return null;
  }
  try {
    const response = await fetch(`${backendUrl}/api/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, userText, imageBase64, mediaType }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.text || null;
  } catch (e) {
    return null;
  }
}

function tryParseJSON(text) {
  if (!text) return null;
  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

/* ============================== SMALL UI PRIMITIVES ============================== */
function Card({ children, style, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`fade-up ${className}`}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "22px 4px 10px" }}>
      <h2 style={{ color: C.white, fontSize: 16, fontWeight: 700, margin: 0 }}>{children}</h2>
      {right}
    </div>
  );
}

let ringGradId = 0;
function ProgressRing({ value, max, size = 160, stroke = 14, color = C.green, label, sub }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const labelSize = Math.round(size * 0.19);
  const subSize = Math.max(9, Math.round(size * 0.1));
  const gradId = useRef(`ringGrad${ringGradId++}`).current;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 6px ${color}55)` }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.purple} />
            <stop offset="100%" stopColor={C.green} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={C.border} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={`url(#${gradId})`} strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={circ - pct * circ} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1.15 }}>
        <div style={{ color: C.white, fontSize: labelSize, fontWeight: 800 }}>{label}</div>
        {sub && <div style={{ color: C.gray, fontSize: subSize, marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div>}
      </div>
    </div>
  );
}

function MacroBar({ label, icon, current, target, unit, color }) {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: C.white, fontWeight: 500 }}>{icon} {label}</span>
        <span style={{ color: C.gray }}>{current}{unit} / {target}{unit}</span>
      </div>
      <div style={{ height: 8, borderRadius: 8, background: C.border, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 8, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function Pill({ children, color = C.purple, bg }) {
  return (
    <span style={{ background: bg || `${color}22`, color, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>
      {children}
    </span>
  );
}

function IconBadge({ icon, color = C.purple, size = 40, rounded = 14 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: rounded, background: `${color}22`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      fontSize: size * 0.46,
    }}>
      {icon}
    </div>
  );
}

function Eyebrow({ children, color = C.white }) {
  return (
    <div style={{ color, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", style, disabled, full }) {
  const base = {
    border: "none", borderRadius: 14, padding: "13px 18px", fontWeight: 600, fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: full ? "100%" : "auto", opacity: disabled ? 0.6 : 1, transition: "transform 0.15s ease",
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.purple}, #9333EA)`, color: "#fff" },
    green: { background: C.green, color: "#052e12" },
    outline: { background: "transparent", color: C.white, border: `1px solid ${C.border}` },
    ghost: { background: C.cardAlt, color: C.white },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <Card style={{ textAlign: "center", padding: "30px 18px" }}>
      <div style={{ fontSize: 30, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: C.white, fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ color: C.gray, fontSize: 13, marginBottom: 14 }}>{subtitle}</div>
      {action}
    </Card>
  );
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up"
        style={{ background: C.bg, borderTop: `1px solid ${C.border}`, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, maxHeight: "88vh", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ color: C.white, margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.cardAlt, border: "none", borderRadius: 10, padding: 6, cursor: "pointer" }}>
            <X size={18} color={C.gray} />
          </button>
        </div>
        <div style={{ padding: 20, overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", color: C.gray, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12,
  padding: "12px 14px", color: C.white, fontSize: 14, outline: "none",
};

function OptionGrid({ options, value, onChange, columns = 2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: "12px 10px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${value === opt ? C.purple : C.border}`,
            background: value === opt ? C.purpleDim : C.cardAlt,
            color: value === opt ? "#C4B5FD" : C.white,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: C.cardAlt, border: `1px solid ${C.green}`, color: C.white, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }} className="fade-up">
      <CheckCircle2 size={16} color={C.green} /> {message}
    </div>
  );
}

/* ============================== ONBOARDING ============================== */
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", age: "", sex: "Feminino", height: "", weight: "", goal: "Perder peso",
    activityLevel: "Moderado", trainDays: 3, trainTime: "30–45 min", location: "Academia", equipment: "Halteres",
  });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const steps = [
    {
      title: "Como podemos te chamar?",
      body: (
        <>
          <Field label="Nome"><input style={inputStyle} value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Seu nome" /></Field>
          <Field label="Idade"><input type="number" style={inputStyle} value={data.age} onChange={(e) => set("age", e.target.value)} placeholder="Ex: 27" /></Field>
          <Field label="Sexo"><OptionGrid options={["Feminino", "Masculino", "Outro"]} value={data.sex} onChange={(v) => set("sex", v)} columns={3} /></Field>
        </>
      ),
      valid: data.name && data.age,
    },
    {
      title: "Seu corpo hoje",
      body: (
        <>
          <Field label="Altura (cm)"><input type="number" style={inputStyle} value={data.height} onChange={(e) => set("height", e.target.value)} placeholder="Ex: 170" /></Field>
          <Field label="Peso atual (kg)"><input type="number" style={inputStyle} value={data.weight} onChange={(e) => set("weight", e.target.value)} placeholder="Ex: 65" /></Field>
        </>
      ),
      valid: data.height && data.weight,
    },
    {
      title: "Qual é a sua meta?",
      body: <OptionGrid options={["Ganhar massa", "Perder peso", "Manter peso", "Melhorar condicionamento"]} value={data.goal} onChange={(v) => set("goal", v)} columns={1} />,
      valid: true,
    },
    {
      title: "Sua rotina de treino",
      body: (
        <>
          <Field label="Nível de atividade física"><OptionGrid options={["Sedentário", "Leve", "Moderado", "Intenso"]} value={data.activityLevel} onChange={(v) => set("activityLevel", v)} /></Field>
          <Field label="Dias por semana"><OptionGrid options={["2", "3", "4", "5", "6"]} value={String(data.trainDays)} onChange={(v) => set("trainDays", Number(v))} columns={5} /></Field>
          <Field label="Tempo disponível por treino"><OptionGrid options={["15–30 min", "30–45 min", "45–60 min", "60+ min"]} value={data.trainTime} onChange={(v) => set("trainTime", v)} /></Field>
        </>
      ),
      valid: true,
    },
    {
      title: "Onde você treina?",
      body: (
        <>
          <Field label="Local"><OptionGrid options={["Academia", "Casa"]} value={data.location} onChange={(v) => set("location", v)} /></Field>
          <Field label="Equipamentos disponíveis"><OptionGrid options={["Nenhum", "Halteres", "Elásticos", "Barra, halteres, máquinas"]} value={data.equipment} onChange={(v) => set("equipment", v)} /></Field>
        </>
      ),
      valid: true,
    },
  ];

  const finish = () => {
    const h = Number(data.height) / 100;
    const w = Number(data.weight);
    const age = Number(data.age);
    let bmr = data.sex === "Masculino" ? 10 * w + 6.25 * (h * 100) - 5 * age + 5 : 10 * w + 6.25 * (h * 100) - 5 * age - 161;
    const activityMult = { "Sedentário": 1.2, "Leve": 1.375, "Moderado": 1.55, "Intenso": 1.725 }[data.activityLevel] || 1.4;
    let tdee = bmr * activityMult;
    if (data.goal === "Ganhar massa") tdee += 300;
    if (data.goal === "Perder peso") tdee -= 400;
    tdee = Math.round(tdee / 10) * 10;
    const protein = Math.round((w * (data.goal === "Ganhar massa" ? 2.0 : 1.8)) / 5) * 5;
    const fat = Math.round((tdee * 0.25) / 9 / 5) * 5;
    const carbs = Math.round(((tdee - protein * 4 - fat * 9) / 4) / 5) * 5;
    onComplete({
      ...defaultProfile,
      name: data.name, age, sex: data.sex, height: Number(data.height), weight: w, goal: data.goal,
      activityLevel: data.activityLevel, trainDays: data.trainDays, trainTime: data.trainTime,
      location: data.location, equipment: data.equipment,
      weightGoal: data.goal === "Perder peso" ? Math.max(40, w - 8) : data.goal === "Ganhar massa" ? w + 8 : w,
      dailyCalories: tdee, proteinGoal: protein, carbsGoal: Math.max(carbs, 50), fatGoal: fat,
    });
  };

  const s = steps[step];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", padding: "24px 20px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? C.purple : C.border, transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ marginBottom: 4, color: C.gray, fontSize: 12, fontWeight: 600 }}>PASSO {step + 1} DE {steps.length}</div>
      <h1 style={{ color: C.white, fontSize: 22, fontWeight: 800, marginTop: 4, marginBottom: 20 }}>{s.title}</h1>
      <div style={{ flex: 1 }} className="fade-up" key={step}>{s.body}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}><ChevronLeft size={16} /> Voltar</Button>}
        <div style={{ flex: 1 }}>
          <Button full disabled={!s.valid} onClick={() => (step === steps.length - 1 ? finish() : setStep(step + 1))}>
            {step === steps.length - 1 ? "Calcular minhas metas" : "Continuar"} <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      {step === steps.length - 1 && (
        <p style={{ color: C.gray, fontSize: 11, textAlign: "center", marginTop: 14 }}>
          Os valores calculados são estimativas e não substituem a avaliação de um nutricionista ou médico.
        </p>
      )}
    </div>
  );
}

/* ============================== LOGO ============================== */
function LogoMark({ size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: C.cardAlt, border: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none">
        <path d="M4 26V8L11 18L16 9L19 15" stroke={C.purple} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 21L22 15L26 19L31 12" stroke={C.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 10H31V15" stroke={C.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Wordmark({ size = 20 }) {
  return (
    <span style={{ fontWeight: 800, fontSize: size, letterSpacing: -0.3 }}>
      <span style={{ color: C.white }}>Meta</span><span style={{ color: C.green }}>Fit</span>
    </span>
  );
}

function Logo({ size = 22 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size + 20} />
      <div>
        <Wordmark size={size} />
        <div style={{ color: C.gray, fontSize: size * 0.34, marginTop: 2 }}>Seu corpo. Seus dados. Seus resultados.</div>
      </div>
    </div>
  );
}

/* ============================== HOME / DASHBOARD ============================== */
function HomeScreen({ profile, consumed, todayWorkout, weekCompleted, onNav, onOpenAISuggest, onOpenWorkoutSuggest }) {
  const remaining = {
    calories: Math.max(0, profile.dailyCalories - consumed.calories),
    protein: Math.max(0, profile.proteinGoal - consumed.protein),
    carbs: Math.max(0, profile.carbsGoal - consumed.carbs),
    fat: Math.max(0, profile.fatGoal - consumed.fat),
  };
  const pct = Math.round((consumed.calories / profile.dailyCalories) * 100);
  return (
    <div style={{ padding: "4px 16px 100px" }}>
      <div style={{ color: C.gray, fontSize: 14, marginTop: 2 }}>Olá, {profile.name}! 👋</div>

      <Card style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: C.gray, fontSize: 12 }}>Meta diária</div>
            <div style={{ color: C.white, fontSize: 26, fontWeight: 800, marginTop: 2 }}>{profile.dailyCalories} <span style={{ fontSize: 14, fontWeight: 500, color: C.gray }}>kcal</span></div>
            <div style={{ marginTop: 6, fontSize: 12, color: C.gray }}>Objetivo: <span style={{ color: C.green, fontWeight: 600 }}>{profile.goal}</span></div>
          </div>
          <ProgressRing value={consumed.calories} max={profile.dailyCalories} size={108} stroke={11} color={C.green} label={`${pct}%`} sub="da meta" />
        </div>
        <div style={{ display: "flex", marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: C.gray, fontSize: 11 }}>Consumidas</div>
            <div style={{ color: C.green, fontWeight: 700, fontSize: 15, marginTop: 2 }}>{consumed.calories} <span style={{ fontSize: 10, fontWeight: 500 }}>kcal</span></div>
          </div>
          <div style={{ width: 1, background: C.border }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: C.gray, fontSize: 11 }}>Faltam</div>
            <div style={{ color: C.yellow, fontWeight: 700, fontSize: 15, marginTop: 2 }}>{remaining.calories} <span style={{ fontSize: 10, fontWeight: 500 }}>kcal</span></div>
          </div>
          <div style={{ width: 1, background: C.border }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: C.gray, fontSize: 11 }}>Meta</div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 15, marginTop: 2 }}>{profile.dailyCalories} <span style={{ fontSize: 10, fontWeight: 500 }}>kcal</span></div>
          </div>
        </div>
      </Card>

      <SectionTitle>Macronutrientes</SectionTitle>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <MacroCol icon="🥩" label="Proteínas" color={C.purple} current={consumed.protein} target={profile.proteinGoal} />
          <MacroCol icon="🍚" label="Carboidratos" color={C.green} current={consumed.carbs} target={profile.carbsGoal} />
          <MacroCol icon="🥑" label="Gorduras" color={C.yellow} current={consumed.fat} target={profile.fatGoal} />
        </div>
      </Card>

      <SectionTitle>O que falta para bater sua meta</SectionTitle>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          <RemainingChip icon="🔥" color={C.yellow} value={remaining.calories} label="kcal" />
          <RemainingChip icon="🥩" color="#F43F5E" value={`${remaining.protein}g`} label="proteína" />
          <RemainingChip icon="🍚" color="#EC4899" value={`${remaining.carbs}g`} label="carboidrato" />
          <RemainingChip icon="🥑" color={C.yellow} value={`${remaining.fat}g`} label="gordura" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Button full variant="primary" onClick={onOpenAISuggest}><Sparkles size={16} /> Sugerir refeições</Button>
        </div>
      </Card>

      <SectionTitle>Treino de hoje</SectionTitle>
      {todayWorkout ? (
        <Card onClick={() => onNav("workout")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Pill>🏋️ Treino de hoje</Pill>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 17, marginTop: 8 }}>{todayWorkout.muscleGroup}</div>
              <div style={{ color: C.gray, fontSize: 13, marginTop: 4 }}>
                {todayWorkout.exercises.length} exercícios · {todayWorkout.exercises.reduce((a, e) => a + e.sets, 0)} séries · ⏱️ ~{todayWorkout.durationEstimate} min
              </div>
            </div>
            <ChevronRight color={C.gray} />
          </div>
          <div style={{ marginTop: 14 }}>
            <Button full variant="green" onClick={(e) => { e.stopPropagation(); onNav("workout"); }}>Começar treino</Button>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon="🏋️"
          title="Você ainda não possui um treino para hoje"
          subtitle="Peça uma sugestão da IA ou monte o seu próprio treino."
          action={
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <Button onClick={onOpenWorkoutSuggest}><Bot size={16} /> Sugerir treino</Button>
              <Button variant="outline" onClick={() => onNav("workout")}><Plus size={16} /> Montar treino</Button>
            </div>
          }
        />
      )}

      <SectionTitle>Esta semana</SectionTitle>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekPlan.map((d) => (
            <div key={d.day} style={{ textAlign: "center" }}>
              <div style={{ color: C.gray, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>{d.day}</div>
              <div style={{
                width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                background: d.status === "done" ? C.greenDim : d.status === "suggested" ? C.purpleDim : "transparent",
                border: d.status === "empty" ? `1px dashed ${C.border}` : "none",
              }}>
                {d.status === "done" && <Check size={14} color={C.green} />}
                {d.status === "rest" && <span style={{ fontSize: 12 }}>💤</span>}
                {d.status === "suggested" && <span style={{ fontSize: 12 }}>🔵</span>}
                {d.status === "empty" && <span style={{ fontSize: 10, color: C.gray }}>–</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", color: C.gray, fontSize: 12, marginTop: 12 }}>Treinos esta semana: {weekCompleted}/{profile.trainDays}</div>
      </Card>
    </div>
  );
}

function MacroCol({ icon, label, color, current, target }) {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div style={{ textAlign: "center" }}>
      <IconBadge icon={icon} color={color} size={38} rounded={12} />
      <div style={{ color: C.gray, fontSize: 10, marginTop: 8 }}>{label}</div>
      <div style={{ color: C.white, fontSize: 13, fontWeight: 700, marginTop: 2 }}>{current}g<span style={{ color: C.gray, fontWeight: 500 }}>/{target}g</span></div>
      <div style={{ height: 6, borderRadius: 6, background: C.border, marginTop: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function RemainingChip({ icon, color, value, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <IconBadge icon={icon} color={color} size={38} rounded={12} />
      <div style={{ color: C.white, fontWeight: 700, fontSize: 13, marginTop: 8 }}>{value}</div>
      <div style={{ color: C.gray, fontSize: 10, marginTop: 1 }}>{label}</div>
    </div>
  );
}

function StatChip({ icon, value }) {
  return (
    <div style={{ background: C.cardAlt, borderRadius: 12, padding: "10px 12px", fontSize: 13, color: C.white, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
      <span>{icon}</span> {value}
    </div>
  );
}

function mealEmoji(category) {
  return { "Café da manhã": "🍳", "Almoço": "🍛", "Jantar": "🍽️", "Lanches": "🥪" }[category] || "🍴";
}
function mealColor(category) {
  return { "Café da manhã": C.yellow, "Almoço": C.green, "Jantar": C.purple, "Lanches": "#EC4899" }[category] || C.gray;
}

/* ============================== NUTRITION ============================== */
function NutritionScreen({ profile, meals, setMeals, consumed, onOpenAISuggest, onOpenPhoto, showToast }) {
  const [addCategory, setAddCategory] = useState(null);
  const [search, setSearch] = useState("");
  const remaining = {
    calories: Math.max(0, profile.dailyCalories - consumed.calories),
    protein: Math.max(0, profile.proteinGoal - consumed.protein),
    carbs: Math.max(0, profile.carbsGoal - consumed.carbs),
    fat: Math.max(0, profile.fatGoal - consumed.fat),
  };

  const addFood = (food) => {
    setMeals((m) => ({
      ...m,
      [addCategory]: [...m[addCategory], { id: "f" + Date.now(), name: food.name, time: new Date().toTimeString().slice(0, 5), ...food }],
    }));
    showToast("Alimento adicionado ao diário");
    setAddCategory(null);
    setSearch("");
  };

  const removeFood = (cat, id) => setMeals((m) => ({ ...m, [cat]: m[cat].filter((f) => f.id !== id) }));

  const filtered = foodsDB.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "4px 0 4px" }}>🍽️ Alimentação</h1>
      <p style={{ color: C.gray, fontSize: 13, margin: "0 0 16px" }}>Restam {remaining.calories} kcal hoje · {remaining.protein}g proteína</p>

      <div style={{ display: "flex", gap: 10 }}>
        <Button full variant="primary" onClick={onOpenAISuggest}><Sparkles size={16} /> Sugerir refeições</Button>
        <Button full variant="outline" onClick={onOpenPhoto}><Camera size={16} /> Analisar foto</Button>
      </div>

      {Object.entries(meals).map(([category, items]) => {
        const totals = items.reduce((a, i) => ({ calories: a.calories + i.calories, protein: a.protein + i.protein, carbs: a.carbs + i.carbs, fat: a.fat + i.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
        return (
          <div key={category}>
            <SectionTitle right={<button onClick={() => setAddCategory(category)} style={{ background: C.purpleDim, border: "none", borderRadius: 10, padding: "6px 10px", display: "flex", alignItems: "center", gap: 4, color: "#C4B5FD", fontWeight: 600, fontSize: 12, cursor: "pointer" }}><Plus size={14} /> Adicionar</button>}>
              {category} {items.length > 0 && <span style={{ color: C.gray, fontWeight: 400, fontSize: 12 }}>· {totals.calories} kcal</span>}
            </SectionTitle>
            {items.length === 0 ? (
              <Card style={{ textAlign: "center", color: C.gray, fontSize: 13, padding: 20 }}>Nenhum alimento registrado ainda.</Card>
            ) : (
              <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                    <IconBadge icon={mealEmoji(category)} color={mealColor(category)} size={36} rounded={11} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                      <div style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>{item.time} · {item.calories} kcal · P{item.protein} C{item.carbs} G{item.fat}</div>
                    </div>
                    <button onClick={() => removeFood(category, item.id)} style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16} color={C.gray} /></button>
                  </div>
                ))}
              </Card>
            )}
          </div>
        );
      })}

      {addCategory && (
        <Modal title={`Adicionar em ${addCategory}`} onClose={() => setAddCategory(null)}>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Search size={16} color={C.gray} style={{ position: "absolute", left: 12, top: 14 }} />
            <input style={{ ...inputStyle, paddingLeft: 36 }} placeholder="Buscar alimento..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
            {filtered.map((f) => (
              <div key={f.name} onClick={() => addFood(f)} style={{ background: C.cardAlt, borderRadius: 12, padding: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ color: C.gray, fontSize: 11, marginTop: 2 }}>{f.calories} kcal · P{f.protein} C{f.carbs} G{f.fat}</div>
                </div>
                <Plus size={16} color={C.green} />
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== AI MEAL SUGGEST MODAL ============================== */
function AISuggestMealModal({ profile, consumed, onClose, onAdd }) {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const remaining = {
      calories: Math.max(0, profile.dailyCalories - consumed.calories),
      protein: Math.max(0, profile.proteinGoal - consumed.protein),
      carbs: Math.max(0, profile.carbsGoal - consumed.carbs),
      fat: Math.max(0, profile.fatGoal - consumed.fat),
    };
    const system = "Você é o assistente nutricional do app MetaFit. Responda APENAS com um JSON válido, sem markdown, sem texto adicional.";
    const prompt = `O usuário ainda precisa consumir hoje aproximadamente: ${remaining.calories} kcal, ${remaining.protein}g de proteína, ${remaining.carbs}g de carboidratos, ${remaining.fat}g de gordura. Objetivo do usuário: ${profile.goal}. Sugira 3 opções de refeições simples e realistas (culinária brasileira) que ajudem a completar essas metas. Responda no formato JSON: {"suggestions": [{"emoji": "🍗", "name": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0}]}`;
    askClaude(system, prompt).then((text) => {
      const parsed = tryParseJSON(text);
      if (parsed && parsed.suggestions) setSuggestions(parsed.suggestions);
      else setError(true);
      setLoading(false);
    });
  }, []);

  return (
    <Modal title="✨ Sugestões da IA" onClose={onClose}>
      <p style={{ color: C.gray, fontSize: 12, marginTop: -6, marginBottom: 14 }}>Baseado no que ainda falta para sua meta de hoje. Valores são estimativas.</p>
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 30, color: C.gray, gap: 10 }}>
          <Loader2 className="fade-up" size={28} style={{ animation: "spin 1s linear infinite" }} />
          Pensando em boas opções para você...
        </div>
      )}
      {!loading && error && (
        <EmptyState icon="⚠️" title="Não conseguimos gerar sugestões agora" subtitle="Tente novamente em instantes." />
      )}
      {!loading && suggestions && suggestions.map((s, i) => (
        <div key={i} style={{ background: C.cardAlt, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
          <IconBadge icon={s.emoji || "🍽️"} color={C.green} size={44} rounded={13} />
          <div style={{ flex: 1 }}>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{s.name}</div>
            <div style={{ color: C.gray, fontSize: 12, margin: "4px 0 8px" }}>{s.calories} kcal · P{s.protein} C{s.carbs} G{s.fat}</div>
            <Button variant="green" onClick={() => onAdd(s)} style={{ padding: "8px 12px", fontSize: 12 }}><Plus size={13} /> Adicionar</Button>
          </div>
        </div>
      ))}
    </Modal>
  );
}

/* ============================== PHOTO MEAL ANALYSIS MODAL ============================== */
function PhotoMealModal({ onClose, onAdd }) {
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setImage(dataUrl);
      setBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const analyze = () => {
    setLoading(true);
    setError(false);
    const system = "Você é um analista nutricional visual do app MetaFit. Responda APENAS com um JSON válido, sem markdown.";
    const prompt = `Analise essa foto de refeição. Identifique os alimentos visíveis e estime a quantidade aproximada, calorias e macronutrientes totais. Responda no formato: {"foods": ["item1","item2"], "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "note": "breve observação"}`;
    askClaude(system, prompt, base64, mediaType).then((text) => {
      const parsed = tryParseJSON(text);
      if (parsed) setResult(parsed); else setError(true);
      setLoading(false);
    });
  };

  return (
    <Modal title="📸 Analisar refeição com IA" onClose={onClose}>
      <p style={{ color: C.gray, fontSize: 12, marginTop: -6, marginBottom: 14 }}>Os valores são estimativas e podem variar conforme quantidade, ingredientes e preparo.</p>
      {!image && (
        <div onClick={() => fileRef.current.click()} style={{ border: `1.5px dashed ${C.border}`, borderRadius: 16, padding: 34, textAlign: "center", cursor: "pointer" }}>
          <ImagePlus size={30} color={C.gray} style={{ margin: "0 auto 10px" }} />
          <div style={{ color: C.white, fontWeight: 600, fontSize: 13 }}>Toque para enviar uma foto</div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
        </div>
      )}
      {image && (
        <>
          <img src={image} alt="refeição" style={{ width: "100%", borderRadius: 14, marginBottom: 14, maxHeight: 220, objectFit: "cover" }} />
          {!result && !loading && <Button full onClick={analyze}><Sparkles size={16} /> Analisar com IA</Button>}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: C.gray, padding: 20 }}>
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Analisando refeição...
            </div>
          )}
          {error && <EmptyState icon="⚠️" title="Não foi possível analisar" subtitle="Tente novamente com outra foto." action={<Button onClick={analyze}>Tentar novamente</Button>} />}
          {result && (
            <div style={{ background: C.cardAlt, borderRadius: 14, padding: 14, marginTop: 6 }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{(result.foods || []).join(", ")}</div>
              <EditableMacros result={result} setResult={setResult} />
              {result.note && <div style={{ color: C.gray, fontSize: 11, margin: "8px 0" }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />{result.note}</div>}
              <Button full variant="green" style={{ marginTop: 8 }} onClick={() => onAdd(result)}><Plus size={14} /> Adicionar ao diário</Button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

function EditableMacros({ result, setResult }) {
  const upd = (k, v) => setResult((r) => ({ ...r, [k]: Number(v) || 0 }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {["calories", "protein", "carbs", "fat"].map((k) => (
        <div key={k}>
          <label style={{ color: C.gray, fontSize: 10, textTransform: "uppercase" }}>{k}</label>
          <input type="number" style={{ ...inputStyle, padding: "8px 10px", fontSize: 13 }} value={result[k]} onChange={(e) => upd(k, e.target.value)} />
        </div>
      ))}
    </div>
  );
}

/* ============================== WORKOUTS ============================== */
function WorkoutScreen({ profile, todayWorkout, setTodayWorkout, history, setHistory, weekCompleted, setWeekCompleted, onOpenSuggest, showToast }) {
  const [tab, setTab] = useState("hoje");
  const [setsProgress, setSetsProgress] = useState({});
  const [restTimer, setRestTimer] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [openHistoryItem, setOpenHistoryItem] = useState(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (restTimer === null) return;
    if (restTimer <= 0) { setRestTimer(null); return; }
    const t = setTimeout(() => setRestTimer((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [restTimer]);

  const toggleSet = (exId, setIdx, totalSets) => {
    setSetsProgress((p) => {
      const cur = p[exId] || [];
      const next = cur.includes(setIdx) ? cur.filter((i) => i !== setIdx) : [...cur, setIdx];
      return { ...p, [exId]: next };
    });
    setRestTimer(60);
  };

  const totalSetsPlanned = todayWorkout ? todayWorkout.exercises.reduce((a, e) => a + e.sets, 0) : 0;
  const totalSetsDone = Object.values(setsProgress).reduce((a, arr) => a + arr.length, 0);
  const allDone = todayWorkout && totalSetsDone >= totalSetsPlanned && totalSetsPlanned > 0;

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "4px 0 14px" }}>🏋️ Treinos</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
        {[["hoje", "Meu treino"], ["calendario", "Calendário"], ["historico", "Histórico"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "9px 16px", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            background: tab === key ? C.purple : C.cardAlt, color: tab === key ? "#fff" : C.gray,
          }}>{label}</button>
        ))}
      </div>

      {tab === "hoje" && (
        <>
          {!todayWorkout ? (
            <EmptyState icon="🏋️" title="Nenhum treino montado para hoje" subtitle="Peça uma sugestão da IA ou monte o seu treino."
              action={<div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <Button onClick={onOpenSuggest}><Bot size={16} /> Sugerir treino</Button>
                <Button variant="outline" onClick={() => setShowBuilder(true)}><Plus size={16} /> Montar treino</Button>
              </div>} />
          ) : (
            <>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>{todayWorkout.name}</div>
                    <div style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>{totalSetsDone}/{totalSetsPlanned} séries concluídas</div>
                  </div>
                  <Pill color={C.green}>~{todayWorkout.durationEstimate} min</Pill>
                </div>
                {restTimer !== null && (
                  <div style={{ marginTop: 12, background: C.purpleDim, borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 8, color: "#C4B5FD", fontWeight: 700 }}>
                    <Clock size={16} /> Descanso: {restTimer}s
                  </div>
                )}
              </Card>

              {todayWorkout.exercises.map((ex) => (
                <Card key={ex.id} style={{ marginTop: 12 }}>
                  <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{ex.name}</div>
                  <div style={{ color: C.gray, fontSize: 12, marginBottom: 10 }}>{ex.sets} séries × {ex.reps} repetições · {ex.load}kg</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Array.from({ length: ex.sets }).map((_, i) => {
                      const done = (setsProgress[ex.id] || []).includes(i);
                      return (
                        <button key={i} onClick={() => toggleSet(ex.id, i, ex.sets)} style={{
                          width: 40, height: 40, borderRadius: 10, border: `1px solid ${done ? C.green : C.border}`,
                          background: done ? C.greenDim : C.cardAlt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {done ? <Check size={16} color={C.green} /> : <span style={{ color: C.gray, fontSize: 12 }}>{i + 1}</span>}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              ))}

              <div style={{ marginTop: 16 }}>
                <Button full variant="green" disabled={totalSetsDone === 0} onClick={() => setShowFeedback(true)}><CheckCircle2 size={16} /> Concluir treino</Button>
              </div>
            </>
          )}

          <SectionTitle right={<button onClick={() => setShowBuilder(true)} style={{ background: C.purpleDim, border: "none", borderRadius: 10, padding: "6px 10px", color: "#C4B5FD", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Plus size={14} /> Montar treino</button>}>
            Precisando de algo diferente?
          </SectionTitle>
          <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: C.gray, fontSize: 13 }}>Deixe a IA montar um treino considerando seu histórico e objetivo.</div>
            <Button onClick={onOpenSuggest}><Bot size={16} /></Button>
          </Card>
        </>
      )}

      {tab === "calendario" && (
        <Card>
          {weekPlan.map((d) => (
            <div key={d.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.white, fontWeight: 700, fontSize: 12, width: 40 }}>{d.day}</span>
              <span style={{ color: C.gray, fontSize: 13, flex: 1 }}>{d.label}</span>
              <span>{d.status === "done" ? "✅" : d.status === "rest" ? "💤" : d.status === "suggested" ? "🔵" : "⚪"}</span>
            </div>
          ))}
          <div style={{ textAlign: "center", color: C.gray, fontSize: 12, marginTop: 12 }}>Treinos esta semana: {weekCompleted}/{profile.trainDays}</div>
        </Card>
      )}

      {tab === "historico" && (
        history.length === 0 ? <EmptyState icon="📋" title="Nenhum treino no histórico" subtitle="Seus treinos concluídos aparecerão aqui." /> :
        history.slice().reverse().map((h) => (
          <Card key={h.id} style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => setOpenHistoryItem(openHistoryItem === h.id ? null : h.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{h.name}</div>
                <div style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>{h.date} · {h.duration} min · {h.sets} séries</div>
              </div>
              <Pill color={h.difficulty === "Pesado" ? C.yellow : C.green}>{h.difficulty}</Pill>
            </div>
            {openHistoryItem === h.id && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, color: C.gray, fontSize: 13 }}>
                <div>Como se sentiu: {h.feeling}</div>
                {h.notes && <div style={{ marginTop: 4 }}>Observações: {h.notes}</div>}
              </div>
            )}
          </Card>
        ))
      )}

      {showBuilder && <WorkoutBuilderModal onClose={() => setShowBuilder(false)} onSave={(w) => { setTodayWorkout(w); setShowBuilder(false); showToast("Treino salvo"); }} />}
      {showFeedback && (
        <WorkoutFeedbackModal
          onClose={() => setShowFeedback(false)}
          onSubmit={(fb) => {
            const durationMin = Math.max(10, Math.round((Date.now() - startTimeRef.current) / 60000) || 45);
            setHistory((h) => [...h, { id: "w" + Date.now(), date: "Hoje", name: todayWorkout.muscleGroup, duration: durationMin, sets: totalSetsDone, ...fb }]);
            setWeekCompleted((c) => c + 1);
            setShowFeedback(false);
            showToast("Treino concluído! 🎉");
          }}
        />
      )}
    </div>
  );
}

function WorkoutFeedbackModal({ onClose, onSubmit }) {
  const [difficulty, setDifficulty] = useState("Normal");
  const [feeling, setFeeling] = useState("Bom");
  const [notes, setNotes] = useState("");
  return (
    <Modal title="✅ Treino concluído" onClose={onClose}>
      <Field label="Como foi seu treino?"><OptionGrid options={["Fácil", "Normal", "Pesado"]} value={difficulty} onChange={setDifficulty} columns={3} /></Field>
      <Field label="Como você se sentiu?"><OptionGrid options={["Excelente", "Bom", "Normal", "Cansado", "Muito cansado"]} value={feeling} onChange={setFeeling} /></Field>
      <Field label="Observações"><textarea style={{ ...inputStyle, minHeight: 70, resize: "none" }} placeholder="Ex: Hoje senti dificuldade no supino." value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <Button full variant="green" onClick={() => onSubmit({ difficulty, feeling, notes })}>Salvar treino</Button>
    </Modal>
  );
}

function WorkoutBuilderModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("Peito");
  const [selected, setSelected] = useState([]);

  const addExercise = (exName) => {
    if (selected.find((s) => s.name === exName)) return;
    setSelected((s) => [...s, { id: "ex" + Date.now() + Math.random(), name: exName, sets: 3, reps: 12, load: 10 }]);
  };
  const updateExercise = (id, key, value) => setSelected((s) => s.map((e) => (e.id === id ? { ...e, [key]: Number(value) || 0 } : e)));
  const removeExercise = (id) => setSelected((s) => s.filter((e) => e.id !== id));

  const save = () => {
    if (!name || selected.length === 0) return;
    onSave({
      name: `${name} — ${group}`, muscleGroup: group,
      durationEstimate: Math.max(20, selected.reduce((a, e) => a + e.sets, 0) * 3),
      exercises: selected,
    });
  };

  return (
    <Modal title="➕ Montar meu treino" onClose={onClose}>
      <Field label="Nome do treino"><input style={inputStyle} placeholder="Ex: Treino A" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Grupo muscular"><OptionGrid options={Object.keys(exerciseLibrary)} value={group} onChange={setGroup} columns={3} /></Field>
      <Field label="Biblioteca de exercícios">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {exerciseLibrary[group].map((ex) => (
            <button key={ex} onClick={() => addExercise(ex)} style={{ background: C.cardAlt, border: `1px solid ${C.border}`, color: C.white, borderRadius: 10, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>+ {ex}</button>
          ))}
        </div>
      </Field>
      {selected.length > 0 && (
        <Field label="Exercícios selecionados">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {selected.map((ex) => (
              <div key={ex.id} style={{ background: C.cardAlt, borderRadius: 12, padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: C.white, fontWeight: 600, fontSize: 13 }}>{ex.name}</span>
                  <Trash2 size={14} color={C.gray} style={{ cursor: "pointer" }} onClick={() => removeExercise(ex.id)} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["sets", "reps", "load"].map((k) => (
                    <div key={k} style={{ flex: 1 }}>
                      <label style={{ color: C.gray, fontSize: 9, textTransform: "uppercase" }}>{k === "sets" ? "Séries" : k === "reps" ? "Reps" : "Carga(kg)"}</label>
                      <input type="number" value={ex[k]} onChange={(e) => updateExercise(ex.id, k, e.target.value)} style={{ ...inputStyle, padding: "6px 8px", fontSize: 12 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>
      )}
      <Button full variant="green" disabled={!name || selected.length === 0} onClick={save}>Salvar treino</Button>
    </Modal>
  );
}

/* ============================== AI WORKOUT SUGGEST MODAL ============================== */
function AISuggestWorkoutModal({ profile, history, onClose, onApply }) {
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const historyText = history.map((h) => `${h.date}: ${h.name}`).join("; ") || "sem histórico recente";
    const system = "Você é o treinador de IA do app MetaFit. Responda APENAS com um JSON válido, sem markdown.";
    const prompt = `Perfil: objetivo ${profile.goal}, nível de atividade ${profile.activityLevel}, treina em ${profile.location}, equipamentos: ${profile.equipment}, tempo disponível ${profile.trainTime}. Histórico recente de treinos: ${historyText}. Sugira o próximo treino considerando qual grupo muscular precisa de atenção e o tempo de descanso adequado. Responda: {"muscleGroup": "...", "justification": "frase curta explicando o motivo", "exercises": [{"name": "...", "sets": 3, "reps": 12, "load": 10}]}`;
    askClaude(system, prompt).then((text) => {
      const parsed = tryParseJSON(text);
      if (parsed && parsed.exercises) setSuggestion(parsed); else setError(true);
      setLoading(false);
    });
  }, []);

  return (
    <Modal title="🤖 Sugerir treino com IA" onClose={onClose}>
      {loading && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 30, color: C.gray, gap: 10 }}><Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} /> Analisando seu histórico...</div>}
      {!loading && error && <EmptyState icon="⚠️" title="Não conseguimos sugerir agora" subtitle="Tente novamente em instantes." />}
      {!loading && suggestion && (
        <>
          <Pill>🏋️ Treino de {suggestion.muscleGroup}</Pill>
          <p style={{ color: C.gray, fontSize: 13, margin: "10px 0 14px", fontStyle: "italic" }}>"{suggestion.justification}"</p>
          {suggestion.exercises.map((ex, i) => (
            <div key={i} style={{ background: C.cardAlt, borderRadius: 12, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{ex.name}</span>
              <span style={{ color: C.gray, fontSize: 12 }}>{ex.sets}×{ex.reps} · {ex.load}kg</span>
            </div>
          ))}
          <Button full variant="green" style={{ marginTop: 8 }} onClick={() => onApply({
            name: `Treino sugerido — ${suggestion.muscleGroup}`, muscleGroup: suggestion.muscleGroup,
            durationEstimate: Math.max(20, suggestion.exercises.reduce((a, e) => a + e.sets, 0) * 3),
            exercises: suggestion.exercises.map((e, i) => ({ id: "sug" + i, ...e })),
          })}>Usar este treino</Button>
        </>
      )}
    </Modal>
  );
}

/* ============================== EVOLUTION ============================== */
function EvolutionScreen({ profile, weightHistory, setWeightHistory, measurements, setMeasurements, goals, weekCompleted }) {
  const [tab, setTab] = useState("peso");
  const [newWeight, setNewWeight] = useState("");
  const lastWeight = weightHistory[weightHistory.length - 1]?.weight || profile.weight;

  const addWeight = () => {
    const w = Number(newWeight);
    if (!w) return;
    setWeightHistory((h) => [...h, { date: "Hoje", weight: w }]);
    setNewWeight("");
  };

  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "4px 0 14px" }}>📊 Evolução</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
        {[["peso", "Peso"], ["medidas", "Medidas"], ["metas", "Metas"], ["fotos", "Fotos"], ["relatorios", "Relatórios"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "9px 16px", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: tab === key ? C.purple : C.cardAlt, color: tab === key ? "#fff" : C.gray }}>{label}</button>
        ))}
      </div>

      {tab === "peso" && (
        <>
          <Card>
            <Eyebrow color={C.green}>Evolução de peso</Eyebrow>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ color: C.gray, fontSize: 12 }}>Peso atual</div>
                <div style={{ color: C.white, fontSize: 22, fontWeight: 800 }}>{lastWeight} kg</div>
                <div style={{ color: C.green, fontSize: 12, marginTop: 2, fontWeight: 600 }}>
                  {lastWeight - weightHistory[0].weight >= 0 ? "+" : ""}{(lastWeight - weightHistory[0].weight).toFixed(1)} kg nos últimos registros
                </div>
              </div>
              <Pill color={C.green}>Meta: {profile.weightGoal} kg</Pill>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weightHistory}>
                <defs>
                  <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: C.gray, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fill: C.gray, fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }} labelStyle={{ color: C.white }} />
                <Area type="monotone" dataKey="weight" stroke={C.green} fill="url(#wgrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <div style={{ textAlign: "center", color: C.gray, fontSize: 12, marginTop: 10 }}>
            Faltam <span style={{ color: C.white, fontWeight: 700 }}>{Math.abs(profile.weightGoal - lastWeight).toFixed(1)} kg</span> para sua meta
          </div>
          <SectionTitle>Registrar peso</SectionTitle>
          <Card style={{ display: "flex", gap: 10 }}>
            <input type="number" placeholder="Ex: 58.1" style={inputStyle} value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
            <Button onClick={addWeight}><Plus size={16} /></Button>
          </Card>
        </>
      )}

      {tab === "relatorios" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Eyebrow color={C.purple}>Resumo do mês</Eyebrow>
            <RotateCcw size={15} color={C.gray} />
          </div>
          {[
            ["Peso", `${(lastWeight - weightHistory[0].weight >= 0 ? "+" : "")}${(lastWeight - weightHistory[0].weight).toFixed(1)} kg`, C.green],
            ["Média de calorias", `${Math.round((profile.dailyCalories + (profile.dailyCalories - 320)) / 2)} kcal`, C.white],
            ["Treinos realizados", `${weekCompleted}`, C.white],
            ["Meta", "68% concluída", C.purple],
          ].map(([label, value, color]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.gray, fontSize: 13 }}>{label}</span>
              <span style={{ color, fontWeight: 700, fontSize: 13 }}>{value}</span>
            </div>
          ))}
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={weightHistory}>
              <Area type="monotone" dataKey="weight" stroke={C.purple} fill={`${C.purple}33`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <Button full variant="outline" style={{ marginTop: 4 }}><FileText size={14} /> Ver relatório completo</Button>
        </Card>
      )}

      {tab === "medidas" && (
        <Card>
          {Object.entries(measurements.current).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.white, textTransform: "capitalize", fontSize: 14 }}>{k}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: C.white, fontWeight: 700 }}>{v} cm</span>
                <span style={{ color: v - measurements.initial[k] >= 0 ? C.green : C.yellow, fontSize: 12, marginLeft: 8 }}>
                  {v - measurements.initial[k] >= 0 ? "+" : ""}{(v - measurements.initial[k]).toFixed(1)} cm
                </span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === "metas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <Card key={g.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.white, fontWeight: 700, fontSize: 14 }}><Target size={14} style={{ display: "inline", marginRight: 6 }} color={C.purple} />{g.label}</span>
                  <span style={{ color: C.gray, fontSize: 12 }}>{g.current}/{g.target} {g.unit}</span>
                </div>
                <div style={{ height: 8, borderRadius: 8, background: C.border }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${C.purple}, ${C.green})` }} />
                </div>
                <div style={{ color: C.gray, fontSize: 11, marginTop: 6 }}>{pct}% concluído</div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "fotos" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {["Frente", "Lado", "Costas"].map((angle) => (
            <PhotoSlot key={angle} label={angle} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoSlot({ label }) {
  const [img, setImg] = useState(null);
  const ref = useRef();
  return (
    <div onClick={() => ref.current.click()} style={{ background: C.card, border: `1px dashed ${C.border}`, borderRadius: 16, aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }}>
      {img ? <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
        <div style={{ textAlign: "center", color: C.gray }}>
          <Camera size={20} style={{ margin: "0 auto 6px" }} />
          <div style={{ fontSize: 12 }}>{label}</div>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => {
        const f = e.target.files[0]; if (!f) return;
        const reader = new FileReader(); reader.onload = () => setImg(reader.result); reader.readAsDataURL(f);
      }} />
    </div>
  );
}

/* ============================== PROFILE ============================== */
function ProfileScreen({ profile, onOpenPremium, onRestartOnboarding }) {
  const rows = [
    ["Objetivo", profile.goal], ["Altura", `${profile.height} cm`], ["Peso atual", `${profile.weight} kg`],
    ["Meta de peso", `${profile.weightGoal} kg`], ["Nível de atividade", profile.activityLevel],
    ["Dias de treino/semana", profile.trainDays], ["Local de treino", profile.location], ["Equipamentos", profile.equipment],
  ];
  return (
    <div style={{ padding: "20px 16px 100px" }}>
      <h1 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "4px 0 18px" }}>👤 Perfil</h1>
      <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 22 }}>{profile.name[0]}</div>
        <div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 17 }}>{profile.name}</div>
          <div style={{ color: C.gray, fontSize: 13 }}>{profile.age} anos · {profile.sex}</div>
        </div>
      </Card>

      <Card onClick={onOpenPremium} style={{ marginTop: 14, cursor: "pointer", background: `linear-gradient(135deg, ${C.purple}22, ${C.green}15)`, border: `1px solid ${C.purple}55` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Crown size={22} color={C.yellow} />
            <div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>MetaFit Premium</div>
              <div style={{ color: C.gray, fontSize: 12 }}>7 dias grátis, depois R$ 19,90/mês</div>
            </div>
          </div>
          <ChevronRight color={C.gray} />
        </div>
      </Card>

      <SectionTitle>Dados</SectionTitle>
      <Card>
        {rows.map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.gray, fontSize: 13 }}>{label}</span>
            <span style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </Card>

      <SectionTitle>Metas nutricionais diárias</SectionTitle>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <StatChip icon="🔥" value={`${profile.dailyCalories} kcal`} />
          <StatChip icon="🥩" value={`${profile.proteinGoal}g proteína`} />
          <StatChip icon="🍚" value={`${profile.carbsGoal}g carbo`} />
          <StatChip icon="🥑" value={`${profile.fatGoal}g gordura`} />
        </div>
        <p style={{ color: C.gray, fontSize: 11, marginTop: 12 }}>
          <Info size={12} style={{ display: "inline", marginRight: 4 }} />
          Estimativas calculadas pelo app. Não substituem orientação de nutricionista ou médico.
        </p>
      </Card>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        <Button variant="outline" full onClick={onRestartOnboarding}><RotateCcw size={16} /> Refazer onboarding</Button>
      </div>
    </div>
  );
}

/* ============================== PREMIUM SCREEN ============================== */
function PremiumModal({ onClose, showToast }) {
  const [plan, setPlan] = useState("annual");
  const features = [
    "Acompanhamento completo", "Alimentação inteligente", "Controle de calorias", "Macronutrientes",
    "IA para alimentação", "Análise de refeições por foto", "Treinos personalizados", "Criador de treinos",
    "IA para sugerir treinos", "Histórico de cargas", "Metas personalizadas", "Evolução corporal",
    "Fotos antes e depois", "Relatórios", "Alertas inteligentes", "Sem anúncios",
  ];
  return (
    <Modal title=" " onClose={onClose}>
      <div style={{ textAlign: "center", marginTop: -10 }}>
        <Crown size={34} color={C.yellow} style={{ marginBottom: 8 }} />
        <h2 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: 0 }}>MetaFit Premium</h2>
        <p style={{ color: C.gray, fontSize: 13, marginTop: 4 }}>Seu corpo. Seus dados. Seus resultados.</p>
      </div>

      <div style={{ display: "flex", gap: 10, margin: "18px 0" }}>
        <PlanCard active={plan === "monthly"} onClick={() => setPlan("monthly")} title="Mensal" price="R$ 19,90" sub="/mês" />
        <PlanCard active={plan === "annual"} onClick={() => setPlan("annual")} title="Anual" price="R$ 149,90" sub="/ano" badge="equivale a R$ 12,49/mês" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {features.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={15} color={C.green} /> <span style={{ color: C.white, fontSize: 13 }}>{f}</span>
          </div>
        ))}
      </div>

      <Button full onClick={() => { showToast("Assinatura iniciada (demonstração)"); onClose(); }}>
        <Zap size={16} /> Começar meus 7 dias grátis
      </Button>
      <p style={{ color: C.gray, fontSize: 10, textAlign: "center", marginTop: 10 }}>Cancele quando quiser. Sem anúncios.</p>
    </Modal>
  );
}

function PlanCard({ active, onClick, title, price, sub, badge }) {
  return (
    <div onClick={onClick} style={{ flex: 1, borderRadius: 16, padding: 14, cursor: "pointer", border: `1.5px solid ${active ? C.purple : C.border}`, background: active ? C.purpleDim : C.cardAlt, position: "relative" }}>
      {badge && <div style={{ position: "absolute", top: -10, left: 10, background: C.green, color: "#052e12", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>MELHOR VALOR</div>}
      <div style={{ color: C.gray, fontSize: 12, fontWeight: 600 }}>{title}</div>
      <div style={{ color: C.white, fontWeight: 800, fontSize: 18, marginTop: 4 }}>{price}<span style={{ fontSize: 12, color: C.gray, fontWeight: 500 }}>{sub}</span></div>
      {badge && <div style={{ color: C.green, fontSize: 10, marginTop: 4 }}>{badge}</div>}
    </div>
  );
}

/* ============================== AI ASSISTANT CHAT ============================== */
function AIAssistantModal({ profile, consumed, todayWorkout, weightHistory, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Olá, ${profile.name}! Sou a IA do MetaFit. Posso te ajudar com alimentação, treinos e sua evolução. O que você quer saber?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    const remaining = profile.dailyCalories - consumed.calories;
    const system = `Você é a assistente de IA dentro do app MetaFit, um app de fitness e nutrição. Responda em português do Brasil, de forma curta, direta, amigável e motivadora (no máximo 5 frases). Use os dados reais do usuário abaixo para responder. Nunca dê diagnósticos médicos; deixe claro quando algo é estimativa.
Dados do usuário: nome ${profile.name}, objetivo ${profile.goal}, meta calórica diária ${profile.dailyCalories} kcal, consumidas hoje ${consumed.calories} kcal, restantes ${remaining} kcal, proteína consumida ${consumed.protein}/${profile.proteinGoal}g. Treino de hoje: ${todayWorkout ? todayWorkout.muscleGroup : "nenhum treino definido"}. Peso atual: ${weightHistory[weightHistory.length - 1]?.weight}kg, meta ${profile.weightGoal}kg.`;
    const reply = await askClaude(system, userMsg);
    setMessages((m) => [...m, { role: "assistant", text: reply || "Não consegui responder agora, tente novamente em instantes." }]);
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, zIndex: 150, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 16px", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onClose} style={{ background: C.cardAlt, border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}><ArrowLeft size={18} color={C.white} /></button>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.purple}, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={18} color="#fff" /></div>
        <div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>MetaFit IA</div>
          <div style={{ color: C.green, fontSize: 11 }}>● online</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <div style={{
              background: m.role === "user" ? `linear-gradient(135deg, ${C.purple}, #9333EA)` : C.cardAlt,
              color: C.white, padding: "10px 14px", borderRadius: 16,
              borderBottomRightRadius: m.role === "user" ? 4 : 16, borderBottomLeftRadius: m.role === "assistant" ? 4 : 16,
              fontSize: 14, lineHeight: 1.5,
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", background: C.cardAlt, padding: "10px 14px", borderRadius: 16, borderBottomLeftRadius: 4 }}>
            <Loader2 size={16} color={C.gray} style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 10, padding: 16, borderTop: `1px solid ${C.border}` }}>
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Pergunte algo..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <Button onClick={send} disabled={loading}><Send size={16} /></Button>
      </div>
    </div>
  );
}

/* ============================== NOTIFICATIONS ============================== */
function NotificationsModal({ onClose }) {
  const items = [
    { icon: "🏋️", text: "Seu treino de hoje está esperando por você.", color: C.purple },
    { icon: "🥩", text: "Você ainda precisa de aproximadamente 35g de proteína hoje.", color: "#F43F5E" },
    { icon: "🔥", text: "Você está perto de bater sua meta calórica de hoje.", color: C.yellow },
    { icon: "⚖️", text: "Já faz alguns dias que você não registra seu peso.", color: C.green },
    { icon: "📸", text: "Que tal atualizar suas fotos de evolução esta semana?", color: C.purple },
  ];
  return (
    <Modal title="🔔 Notificações" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.cardAlt, borderRadius: 14, padding: 12 }}>
            <IconBadge icon={n.icon} color={n.color} size={34} rounded={10} />
            <div style={{ color: C.white, fontSize: 13, lineHeight: 1.4, paddingTop: 4 }}>{n.text}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ============================== BOTTOM NAV ============================== */
function BottomNav({ active, onNav, onOpenAssistant }) {
  const left = [["home", Home, "Início"], ["food", Utensils, "Alimentação"]];
  const right = [["evolution", TrendingUp, "Evolução"], ["profile", User, "Perfil"]];
  const NavItem = ([key, Icon, label]) => (
    <div key={key} onClick={() => onNav(key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 6px", minWidth: 52 }}>
      <div style={{ width: 30, height: 30, borderRadius: 10, background: active === key ? C.greenDim : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={19} color={active === key ? C.green : C.gray} strokeWidth={active === key ? 2.5 : 2} />
      </div>
      <span style={{ fontSize: 10, color: active === key ? C.green : C.gray, fontWeight: active === key ? 700 : 500 }}>{label}</span>
    </div>
  );
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: "rgba(15,23,42,0.97)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 4px calc(8px + env(safe-area-inset-bottom))", zIndex: 50 }}>
      {left.map(NavItem)}
      <div onClick={() => onNav("workout")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 6px", minWidth: 52 }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: active === "workout" ? C.greenDim : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Dumbbell size={19} color={active === "workout" ? C.green : C.gray} strokeWidth={active === "workout" ? 2.5 : 2} />
        </div>
        <span style={{ fontSize: 10, color: active === "workout" ? C.green : C.gray, fontWeight: active === "workout" ? 700 : 500 }}>Treinos</span>
      </div>
      <div onClick={onOpenAssistant} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 6px", minWidth: 52 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 11, border: "none",
          background: `linear-gradient(135deg, ${C.purple}, #9333EA)`, display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulseRing 2.5s infinite", boxShadow: `0 4px 12px ${C.purple}66`,
        }}>
          <Bot size={18} color="#fff" />
        </div>
        <span style={{ fontSize: 10, color: "#C4B5FD", fontWeight: 600 }}>IA</span>
      </div>
      {right.map(NavItem)}
    </div>
  );
}

// Pequeno shim de armazenamento local (localStorage) para rodar fora do ambiente de artifacts.
// Quando o backend com Supabase estiver pronto, isso pode ser trocado por chamadas reais ao banco.
const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch {
      return null;
    }
  },
};

/* ============================== APP ROOT ============================== */
export default function App() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(true);
  const [profile, setProfile] = useState(defaultProfile);
  const [tab, setTab] = useState("home");
  const [meals, setMeals] = useState(defaultMeals);
  const [consumed, setConsumed] = useState(defaultConsumed);
  const [todayWorkout, setTodayWorkout] = useState(defaultTodayWorkout);
  const [workoutHistory, setWorkoutHistory] = useState(defaultWorkoutHistory);
  const [weekCompleted, setWeekCompleted] = useState(2);
  const [weightHistory, setWeightHistory] = useState(defaultWeightHistory);
  const [measurements, setMeasurements] = useState(defaultMeasurements);
  const [goals] = useState(defaultGoals);

  const [showAISuggestMeal, setShowAISuggestMeal] = useState(false);
  const [showPhotoMeal, setShowPhotoMeal] = useState(false);
  const [showAISuggestWorkout, setShowAISuggestWorkout] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  // recompute consumed whenever meals change
  useEffect(() => {
    const totals = Object.values(meals).flat().reduce((a, i) => ({
      calories: a.calories + i.calories, protein: a.protein + i.protein, carbs: a.carbs + i.carbs, fat: a.fat + i.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    setConsumed(totals);
  }, [meals]);

  // load persisted state
  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get(STORAGE_KEY);
        if (res && res.value) {
          const saved = JSON.parse(res.value);
          if (saved.profile) setProfile(saved.profile);
          if (saved.onboarded !== undefined) setOnboarded(saved.onboarded);
          if (saved.meals) setMeals(saved.meals);
          if (saved.todayWorkout !== undefined) setTodayWorkout(saved.todayWorkout);
          if (saved.workoutHistory) setWorkoutHistory(saved.workoutHistory);
          if (saved.weekCompleted !== undefined) setWeekCompleted(saved.weekCompleted);
          if (saved.weightHistory) setWeightHistory(saved.weightHistory);
          if (saved.measurements) setMeasurements(saved.measurements);
        }
      } catch (e) { /* no saved state yet */ }
      setReady(true);
    })();
  }, []);

  // persist state
  useEffect(() => {
    if (!ready) return;
    const payload = { profile, onboarded, meals, todayWorkout, workoutHistory, weekCompleted, weightHistory, measurements };
    storage.set(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  }, [ready, profile, onboarded, meals, todayWorkout, workoutHistory, weekCompleted, weightHistory, measurements]);

  const addSuggestedMeal = (s, category = "Lanches") => {
    setMeals((m) => ({ ...m, [category]: [...m[category], { id: "ai" + Date.now(), name: s.name || (s.foods || []).join(", "), time: new Date().toTimeString().slice(0, 5), calories: s.calories, protein: s.protein, carbs: s.carbs, fat: s.fat }] }));
    showToast("Refeição adicionada ao diário");
    setShowAISuggestMeal(false);
    setShowPhotoMeal(false);
  };

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{FONT_STYLE}</style>
        <Logo size={26} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, maxWidth: 480, margin: "0 auto", position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}>
      <style>{FONT_STYLE}{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {!onboarded ? (
        <Onboarding onComplete={(p) => { setProfile(p); setOnboarded(true); setMeals(defaultMeals); setTodayWorkout(null); setWorkoutHistory([]); setWeekCompleted(0); setWeightHistory([{ date: "Hoje", weight: p.weight }]); }} />
      ) : (
        <>
          <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Wordmark size={19} />
            <button onClick={() => setShowNotifications(true)} style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Bell size={17} color={C.white} />
              <span style={{ position: "absolute", top: 8, right: 9, width: 6, height: 6, borderRadius: 6, background: C.green }} />
            </button>
          </div>

          {tab === "home" && (
            <HomeScreen
              profile={profile} consumed={consumed} todayWorkout={todayWorkout} weekCompleted={weekCompleted}
              onNav={setTab} onOpenAISuggest={() => setShowAISuggestMeal(true)} onOpenWorkoutSuggest={() => setShowAISuggestWorkout(true)}
            />
          )}
          {tab === "food" && (
            <NutritionScreen profile={profile} meals={meals} setMeals={setMeals} consumed={consumed}
              onOpenAISuggest={() => setShowAISuggestMeal(true)} onOpenPhoto={() => setShowPhotoMeal(true)} showToast={showToast} />
          )}
          {tab === "workout" && (
            <WorkoutScreen profile={profile} todayWorkout={todayWorkout} setTodayWorkout={setTodayWorkout}
              history={workoutHistory} setHistory={setWorkoutHistory} weekCompleted={weekCompleted} setWeekCompleted={setWeekCompleted}
              onOpenSuggest={() => setShowAISuggestWorkout(true)} showToast={showToast} />
          )}
          {tab === "evolution" && (
            <EvolutionScreen profile={profile} weightHistory={weightHistory} setWeightHistory={setWeightHistory}
              measurements={measurements} setMeasurements={setMeasurements} goals={goals} weekCompleted={weekCompleted} />
          )}
          {tab === "profile" && (
            <ProfileScreen profile={profile} onOpenPremium={() => setShowPremium(true)} onRestartOnboarding={() => setOnboarded(false)} />
          )}

          <BottomNav active={tab} onNav={setTab} onOpenAssistant={() => setShowAssistant(true)} />

          {showAISuggestMeal && <AISuggestMealModal profile={profile} consumed={consumed} onClose={() => setShowAISuggestMeal(false)} onAdd={(s) => addSuggestedMeal(s)} />}
          {showPhotoMeal && <PhotoMealModal onClose={() => setShowPhotoMeal(false)} onAdd={(r) => addSuggestedMeal(r, "Jantar")} />}
          {showAISuggestWorkout && <AISuggestWorkoutModal profile={profile} history={workoutHistory} onClose={() => setShowAISuggestWorkout(false)} onApply={(w) => { setTodayWorkout(w); setShowAISuggestWorkout(false); showToast("Treino definido para hoje"); }} />}
          {showPremium && <PremiumModal onClose={() => setShowPremium(false)} showToast={showToast} />}
          {showAssistant && <AIAssistantModal profile={profile} consumed={consumed} todayWorkout={todayWorkout} weightHistory={weightHistory} onClose={() => setShowAssistant(false)} />}
          {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
          <Toast message={toast} />
        </>
      )}
    </div>
  );
}
