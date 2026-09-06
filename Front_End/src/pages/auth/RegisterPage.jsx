import React, { useState } from 'react';
import { C } from '../../theme/colors';
import { GlobalStyle } from '../../theme/globalStyles';
import Icon from '../../components/ui/Icon';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function RegisterPage({  onNavigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    name: "", company: "", role: "", email: "", password: "", confirm: "", agree: false 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const v1 = () => { 
    const e = {}; 
    if (!form.name) e.name = "Required"; 
    if (!form.company) e.company = "Required"; 
    if (!form.role) e.role = "Required"; 
    return e; 
  };
  
  const v2 = () => { 
    const e = {}; 
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required"; 
    if (form.password.length < 8) e.password = "Min 8 characters"; 
    if (form.password !== form.confirm) e.confirm = "Mismatch"; 
    if (!form.agree) e.agree = "Required"; 
    return e; 
  };

  const next = () => { 
    const e = v1(); 
    if (Object.keys(e).length) { setErrors(e); return; } 
    setErrors({}); 
    setStep(2); 
  };
  
  const submit = async () => {
    const e = v2();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('https://finalyear-project-main.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          role: form.role,
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || "Registration failed" });
        return;
      }

      alert("Account created! Please sign in.");
      onNavigate("login");

    } catch (error) {
      console.error(error);
      setErrors({ submit: "Cannot reach server. Is it running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
     <div
  style={{
    minHeight: "100vh",
    display: "flex",
    fontFamily: "'DM Sans', sans-serif",

    backgroundImage: `
      linear-gradient(
        rgba(8,12,20,0.75),
        rgba(8,12,20,0.75)
      ),
      url("/images/business.jpg")
    `,

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
      <GlobalStyle />
      {/* <div 
        style={{
          width: "45%", 
          background: "#111", 
          display: "flex", 
          flexDirection: "column", 
          padding: "48px 44px", 
          borderRight: "1px solid #1e1e1e"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
          <svg width="38" height="38" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill={C.accent}/>
            <rect x="10" y="10" width="10" height="10" rx="2" fill="#0a0a0a"/>
            <rect x="24" y="10" width="10" height="10" rx="2" fill="#0a0a0a"/>
            <rect x="10" y="24" width="10" height="10" rx="2" fill="#0a0a0a"/>
            <rect x="24" y="24" width="10" height="10" rx="2" fill="#0a0a0a" opacity="0.4"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>BizCore</span>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2.2rem", color: "#fff", lineHeight: 1.2, letterSpacing: "-1px", marginBottom: 18 }}>
            Join thousands of businesses.
          </h2>
          <p style={{ color: "#666", lineHeight: 1.8, fontSize: "0.9rem", marginBottom: 48 }}>
            Set up your account in under 2 minutes and take control of your business.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { n: 1, t: "Business Info", d: "Name, company & role" },
              { n: 2, t: "Credentials", d: "Email & password" }
            ].map(s => (
              <div 
                key={s.n} 
                style={{
                  display: "flex", 
                  alignItems: "center", 
                  gap: 14, 
                  padding: "14px 16px", 
                  borderRadius: 10, 
                  background: step === s.n ? "#C8F04A18" : step > s.n ? "#ffffff08" : "transparent", 
                  border: `1px solid ${step === s.n ? "#C8F04A40" : step > s.n ? "#2a2a2a" : "#1e1e1e"}`
                }}
              >
                <div 
                  style={{
                    width: 28, 
                    height: 28, 
                    borderRadius: "50%", 
                    background: step > s.n ? C.accent : step === s.n ? "#C8F04A30" : "#1e1e1e", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    flexShrink: 0
                  }}
                >
                  {step > s.n 
                    ? <Icon name="check" size={14} color="#0a0a0a"/> 
                    : <span style={{ fontWeight: 700, fontSize: "0.8rem", color: step === s.n ? C.accent : "#555" }}>{s.n}</span>
                  }
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.88rem", color: step >= s.n ? "#ddd" : "#444" }}>{s.t}</p>
                  <p style={{ fontSize: "0.75rem", color: "#555" }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", marginBottom: 4, letterSpacing: "-0.5px", color: C.text }}>
            {step === 1 ? "Business Details" : "Account Setup"}
          </h2>
          <p style={{ color: C.textMuted, marginBottom: 28, fontSize: "0.88rem" }}>
            {step === 1 ? "Tell us about your organization" : "Set up your login credentials"}
          </p>

          {/* SUBMIT ERROR */}
          {errors.submit && (
            <div style={{ background: "#ef444418", padding: 10, borderRadius: 8, marginBottom: 16, color: "red", fontSize: "0.88rem" }}>
              <Icon name="warning" size={16} color="red" /> {errors.submit}
            </div>
          )}
          
          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Raju Pradhan" error={errors.name}/>
              <Input label="Company" value={form.company} onChange={v => setForm({ ...form, company: v })} placeholder="Nihareeka Store" error={errors.company}/>
              <Select 
                label="Your Role" 
                value={form.role} 
                onChange={v => setForm({ ...form, role: v })} 
                options={[
                  { value: "", label: "Select role..." },
                  { value: "CEO/Founder", label: "CEO / Founder" },
                  { value: "Manager", label: "Manager" },
                  { value: "Accountant", label: "Accountant" },
                  { value: "HR", label: "HR Officer" },
                  { value: "Operations", label: "Operations" },
                  { value: "Other", label: "Other" }
                ]}
              />
              {errors.role && <span style={{ fontSize: "0.73rem", color: C.danger }}>{errors.role}</span>}
              <button 
                onClick={next} 
                style={{
                  padding: "12px", 
                  background: C.accent, 
                  color: "#0a0a0a", 
                  border: "none", 
                  borderRadius: 10, 
                  fontWeight: 700, 
                  marginTop: 8, 
                  cursor: "pointer", 
                  fontFamily: "'DM Sans', sans-serif", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 8
                }}
              >
                Continue <Icon name="logout" size={15} color="#0a0a0a"/>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Work Email" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="abc@gmail.com" error={errors.email}/>
              <Input label="Password" value={form.password} onChange={v => setForm({ ...form, password: v })} type="password" placeholder="Min 8 characters" error={errors.password}/>
              <Input label="Confirm Password" value={form.confirm} onChange={v => setForm({ ...form, confirm: v })} type="password" placeholder="Repeat password" error={errors.confirm}/>
              <label style={{ display: "flex", gap: 9, alignItems: "center", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={form.agree} 
                  onChange={e => setForm({ ...form, agree: e.target.checked })} 
                  style={{ accentColor: C.accent, width: 15, height: 15 }}
                />
                <span style={{ fontSize: "0.82rem", color: C.textMuted }}>
                  I agree to <a href="#" style={{ color: C.accent }} onClick={e => e.preventDefault()}>Terms</a> & <a href="#" style={{ color: C.accent }} onClick={e => e.preventDefault()}>Privacy Policy</a>
                </span>
              </label>
              {errors.agree && <span style={{ fontSize: "0.73rem", color: C.danger }}>{errors.agree}</span>}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button 
                  onClick={() => { setStep(1); setErrors({}); }} 
                  style={{ 
                    padding: "12px 18px", 
                    background: "#2a2a2a", 
                    color: C.textMuted, 
                    border: "none", 
                    borderRadius: 10, 
                    fontWeight: 600, 
                    cursor: "pointer", 
                    fontFamily: "'DM Sans', sans-serif" 
                  }}
                >
                  Back
                </button>
                <button 
                  onClick={submit} 
                  disabled={loading}
                  style={{ 
                    flex: 1, 
                    padding: "12px", 
                    background: C.accent, 
                    color: "#0a0a0a", 
                    border: "none", 
                    borderRadius: 10, 
                    fontWeight: 700, 
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    fontFamily: "'DM Sans', sans-serif" 
                  }}
                >
                  {loading ? (
                    <span 
                      style={{
                        width: 16, 
                        height: 16, 
                        border: "2px solid #0a0a0a40", 
                        borderTop: "2px solid #0a0a0a", 
                        borderRadius: "50%", 
                        animation: "spin 0.8s linear infinite", 
                        display: "inline-block"
                      }}
                    />
                  ) : "Create Account"}
                </button>
              </div>
            </div>
          )}
          
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>Already registered? </span>
            <button 
              onClick={() => onNavigate("login")} 
              style={{
                background: "none", 
                border: "none", 
                color: C.accent, 
                fontWeight: 700, 
                fontSize: "0.85rem", 
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}