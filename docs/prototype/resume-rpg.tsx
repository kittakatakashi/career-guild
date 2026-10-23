import { useState, useEffect } from "react";

const CHAR_DATA = {
  name: "アルス・ヴェルデ",
  kana: "ARS VERDE",
  class: "プリセールスコンサルタント",
  subclass: "AIアドバイザー",
  level: 42,
  exp: 7800,
  expNext: 10000,
  hp: 88,
  mp: 94,
  stats: [
    { name: "構造化力", short: "STR", value: 91, max: 100, color: "#f97316" },
    { name: "仮説駆動", short: "INT", value: 87, max: 100, color: "#818cf8" },
    { name: "技術理解", short: "TEC", value: 83, max: 100, color: "#34d399" },
    { name: "提案力", short: "PRE", value: 74, max: 100, color: "#60a5fa" },
    { name: "PM観点", short: "PM", value: 58, max: 100, color: "#fb923c" },
    { name: "結論提示", short: "CON", value: 55, max: 100, color: "#f472b6" },
  ],
  skills: [
    { name: "生成AI活用支援", level: "B", icon: "🤖", desc: "PoC企画・Gem設計・活用定着支援" },
    { name: "要件整理", level: "A", icon: "📐", desc: "顧客課題の構造化と論点整理" },
    { name: "提案資料設計", level: "A", icon: "📊", desc: "プリセールス向け資料設計・推進" },
    { name: "研修カリキュラム設計", level: "A+", icon: "🎓", desc: "社内外向け研修の企画・登壇" },
    { name: "PHP/Laravel", level: "B+", icon: "⚙️", desc: "実務経験複数年" },
    { name: "Python/Go", level: "B", icon: "🐍", desc: "業務自動化・スクリプト実装" },
  ],
  equipment: [
    { slot: "所属", value: "IT業界（大手SIer）" },
    { slot: "学歴", value: "理工系大学院卒" },
    { slot: "副業", value: "エンジニア研修講師 / カリキュラム設計" },
    { slot: "得意領域", value: "技術×業務の橋渡し" },
  ],
  quests: [
    { title: "副業案件を獲得せよ", status: "active", progress: 60 },
    { title: "PM観点を型化する", status: "active", progress: 30 },
    { title: "結論提示力を鍛える", status: "active", progress: 25 },
    { title: "資格を1つ取得する", status: "active", progress: 45 },
  ],
};

const RANK_COLOR = {
  "A+": "#fbbf24",
  "A": "#f97316",
  "B+": "#34d399",
  "B": "#60a5fa",
  "C": "#94a3b8",
};

function StatBar({ stat, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(stat.value), 200 + delay);
    return () => clearTimeout(t);
  }, [stat.value, delay]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.05em" }}>
          {stat.short} <span style={{ color: "#cbd5e1" }}>{stat.name}</span>
        </span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: stat.color }}>{stat.value}</span>
      </div>
      <div style={{
        height: "6px", background: "#1e293b", borderRadius: "3px",
        border: "1px solid #334155", overflow: "hidden"
      }}>
        <div style={{
          height: "100%", width: `${width}%`,
          background: `linear-gradient(90deg, ${stat.color}99, ${stat.color})`,
          borderRadius: "3px",
          transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: `0 0 8px ${stat.color}66`
        }} />
      </div>
    </div>
  );
}

function HexStat({ stat, cx, cy, r }) {
  const pct = stat.value / stat.max;
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push([cx + r * pct * Math.cos(angle), cy + r * pct * Math.sin(angle)]);
  }
  const gridPoints = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    gridPoints.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return { points: points.map(p => p.join(",")).join(" "), gridPoints };
}

function RadarChart({ stats }) {
  const cx = 110, cy = 110, r = 80;
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 400); }, []);

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const axisAngles = stats.map((_, i) => (Math.PI / 3) * i - Math.PI / 2);
  const axisPoints = axisAngles.map(a => [cx + r * Math.cos(a), cy + r * Math.sin(a)]);

  const dataPoints = stats.map((s, i) => {
    const pct = animated ? s.value / s.max : 0;
    const a = axisAngles[i];
    return [cx + r * pct * Math.cos(a), cy + r * pct * Math.sin(a)];
  });

  const labelPoints = stats.map((s, i) => {
    const a = axisAngles[i];
    const lr = r + 22;
    return [cx + lr * Math.cos(a), cy + lr * Math.sin(a)];
  });

  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      {gridLevels.map((lvl, li) => {
        const pts = axisAngles.map(a => [cx + r * lvl * Math.cos(a), cy + r * lvl * Math.sin(a)]);
        return (
          <polygon key={li}
            points={pts.map(p => p.join(",")).join(" ")}
            fill="none" stroke="#1e3a5f" strokeWidth="1" opacity="0.7"
          />
        );
      })}
      {axisPoints.map((pt, i) => (
        <line key={i} x1={cx} y1={cy} x2={pt[0]} y2={pt[1]}
          stroke="#1e3a5f" strokeWidth="1" />
      ))}
      <polygon
        points={dataPoints.map(p => p.join(",")).join(" ")}
        fill="#3b82f633" stroke="#60a5fa" strokeWidth="1.5"
        style={{ transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      {dataPoints.map((pt, i) => (
        <circle key={i} cx={pt[0]} cy={pt[1]} r="3"
          fill={stats[i].color} style={{ transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      ))}
      {labelPoints.map((pt, i) => (
        <text key={i} x={pt[0]} y={pt[1]}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#94a3b8" fontFamily="monospace" fontWeight="600">
          {stats[i].short}
        </text>
      ))}
    </svg>
  );
}

export default function ResumeRPG() {
  const [tab, setTab] = useState("status");
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanLine(s => (s + 1) % 100), 50);
    return () => clearInterval(t);
  }, []);

  const expPct = (CHAR_DATA.exp / CHAR_DATA.expNext) * 100;

  const tabs = ["status", "skills", "quests"];
  const tabLabels = { status: "ステータス", skills: "スキル", quests: "クエスト" };

  return (
    <div style={{
      minHeight: "100vh", background: "#020817",
      fontFamily: "'Courier New', monospace",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, #0f2a4a33 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, #1a0a3333 0%, transparent 50%)
      `
    }}>
      {/* Main Panel */}
      <div style={{
        width: "100%", maxWidth: "680px",
        background: "#0a1628",
        border: "1px solid #1e3a5f",
        borderRadius: "4px",
        boxShadow: "0 0 60px #0ea5e922, 0 0 120px #0ea5e911, inset 0 1px 0 #1e4a7f",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Scan line effect */}
        <div style={{
          position: "absolute", top: `${scanLine}%`, left: 0, right: 0,
          height: "2px", background: "linear-gradient(90deg, transparent, #0ea5e911, transparent)",
          pointerEvents: "none", zIndex: 10
        }} />

        {/* Corner decorations */}
        {["topLeft", "topRight", "bottomLeft", "bottomRight"].map(pos => (
          <div key={pos} style={{
            position: "absolute",
            top: pos.includes("top") ? 0 : "auto",
            bottom: pos.includes("bottom") ? 0 : "auto",
            left: pos.includes("Left") ? 0 : "auto",
            right: pos.includes("Right") ? 0 : "auto",
            width: "20px", height: "20px",
            borderTop: pos.includes("top") ? "2px solid #0ea5e9" : "none",
            borderBottom: pos.includes("bottom") ? "2px solid #0ea5e9" : "none",
            borderLeft: pos.includes("Left") ? "2px solid #0ea5e9" : "none",
            borderRight: pos.includes("Right") ? "2px solid #0ea5e9" : "none",
          }} />
        ))}

        {/* Header */}
        <div style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #1e3a5f",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: "9px", color: "#0ea5e9", letterSpacing: "0.2em", marginBottom: "4px" }}>
              ◆ CHARACTER STATUS ◆
            </div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#e2e8f0", letterSpacing: "0.05em" }}>
              {CHAR_DATA.name}
            </div>
            <div style={{ fontSize: "9px", color: "#475569", letterSpacing: "0.15em" }}>
              {CHAR_DATA.kana}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              border: "1px solid #f97316",
              color: "#f97316", fontSize: "10px", letterSpacing: "0.1em",
              marginBottom: "6px"
            }}>
              LV.{CHAR_DATA.level}
            </div>
            <div style={{ fontSize: "9px", color: "#64748b" }}>{CHAR_DATA.class}</div>
            <div style={{ fontSize: "8px", color: "#475569" }}>{CHAR_DATA.subclass}</div>
          </div>
        </div>

        {/* EXP Bar */}
        <div style={{ padding: "8px 20px", borderBottom: "1px solid #0f1e35" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "9px", color: "#64748b", letterSpacing: "0.1em" }}>EXPERIENCE</span>
            <span style={{ fontSize: "9px", color: "#fbbf24" }}>{CHAR_DATA.exp.toLocaleString()} / {CHAR_DATA.expNext.toLocaleString()}</span>
          </div>
          <div style={{ height: "4px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${expPct}%`,
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
              boxShadow: "0 0 8px #fbbf2466"
            }} />
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid #1e3a5f" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px",
              background: tab === t ? "#0f2a4a" : "transparent",
              border: "none", borderBottom: tab === t ? "2px solid #0ea5e9" : "2px solid transparent",
              color: tab === t ? "#e2e8f0" : "#475569",
              fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer",
              transition: "all 0.2s"
            }}>
              {tabLabels[t].toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "20px", minHeight: "380px" }}>

          {/* STATUS TAB */}
          {tab === "status" && (
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* Left: Radar + HP/MP */}
              <div style={{ flex: "0 0 auto" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <RadarChart stats={CHAR_DATA.stats} />
                </div>
                <div style={{ marginTop: "8px" }}>
                  {[
                    { label: "HP", value: CHAR_DATA.hp, color: "#34d399" },
                    { label: "MP", value: CHAR_DATA.mp, color: "#818cf8" },
                  ].map(bar => (
                    <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "10px", color: bar.color, width: "20px" }}>{bar.label}</span>
                      <div style={{ flex: 1, height: "5px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${bar.value}%`, background: bar.color, boxShadow: `0 0 6px ${bar.color}` }} />
                      </div>
                      <span style={{ fontSize: "10px", color: bar.color }}>{bar.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Stats + Equipment */}
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ marginBottom: "16px" }}>
                  {CHAR_DATA.stats.map((s, i) => (
                    <StatBar key={s.name} stat={s} delay={i * 80} />
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #1e3a5f", paddingTop: "12px" }}>
                  <div style={{ fontSize: "9px", color: "#0ea5e9", letterSpacing: "0.15em", marginBottom: "8px" }}>
                    ◆ EQUIPMENT
                  </div>
                  {CHAR_DATA.equipment.map(eq => (
                    <div key={eq.slot} style={{ display: "flex", gap: "8px", marginBottom: "5px", fontSize: "10px" }}>
                      <span style={{ color: "#475569", minWidth: "60px" }}>{eq.slot}</span>
                      <span style={{ color: "#94a3b8" }}>{eq.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {tab === "skills" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {CHAR_DATA.skills.map((skill, i) => (
                <div key={i} style={{
                  background: "#0f1e35",
                  border: "1px solid #1e3a5f",
                  borderRadius: "3px",
                  padding: "12px",
                  transition: "border-color 0.2s",
                  cursor: "default"
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f6"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1e3a5f"}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "16px" }}>{skill.icon}</span>
                      <span style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "600" }}>{skill.name}</span>
                    </div>
                    <span style={{
                      fontSize: "10px", fontWeight: "700",
                      color: RANK_COLOR[skill.level] || "#94a3b8",
                      padding: "1px 6px",
                      border: `1px solid ${RANK_COLOR[skill.level] || "#94a3b8"}44`,
                      borderRadius: "2px"
                    }}>
                      {skill.level}
                    </span>
                  </div>
                  <div style={{ fontSize: "9px", color: "#64748b", lineHeight: 1.5 }}>{skill.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* QUESTS TAB */}
          {tab === "quests" && (
            <div>
              <div style={{ fontSize: "9px", color: "#0ea5e9", letterSpacing: "0.15em", marginBottom: "14px" }}>
                ◆ ACTIVE QUESTS
              </div>
              {CHAR_DATA.quests.map((quest, i) => (
                <div key={i} style={{
                  background: "#0f1e35",
                  border: "1px solid #1e3a5f",
                  borderRadius: "3px",
                  padding: "12px 14px",
                  marginBottom: "10px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#e2e8f0" }}>
                      ▷ {quest.title}
                    </span>
                    <span style={{
                      fontSize: "9px", color: "#fbbf24",
                      border: "1px solid #fbbf2444", padding: "2px 8px"
                    }}>ACTIVE</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1, height: "5px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${quest.progress}%`,
                        background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
                        boxShadow: "0 0 6px #0ea5e966",
                        transition: "width 1s ease"
                      }} />
                    </div>
                    <span style={{ fontSize: "9px", color: "#0ea5e9", minWidth: "30px", textAlign: "right" }}>
                      {quest.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "8px 20px",
          borderTop: "1px solid #1e3a5f",
          display: "flex", justifyContent: "space-between",
          fontSize: "8px", color: "#334155", letterSpacing: "0.1em"
        }}>
          <span>RESUME v2026.05</span>
          <span>◆ CAREER SYSTEM ◆</span>
          <span>{CHAR_DATA.kana}</span>
        </div>
      </div>
    </div>
  );
}
