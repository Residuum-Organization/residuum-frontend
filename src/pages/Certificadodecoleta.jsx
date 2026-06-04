import React,{ useState } from "react";
import {
  Eye,
  Download,
  Home,
  Briefcase,
  MapPin,
  User,
  Check,
  FileText,
  QrCode,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";

export default function Certificadodecoleta() {
  const [status, setStatus] = useState("inicial");
  const [modal, setModal] = useState(false);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#dfe7f0",
      display: "flex",
      justifyContent: "center",
      padding: 16,
      fontFamily: "Arial, sans-serif",
    },
    phone: {
      position: "relative",
      width: 390,
      minHeight: 720,
      background: "#f8fbff",
      borderRadius: 32,
      padding: 24,
      overflow: "hidden",
      boxSizing: "border-box",
    },
    title: {
      color: "#0b2a78",
      fontSize: 38,
      fontWeight: 800,
      lineHeight: 1.05,
      marginTop: 20,
    },
    subtitle: {
      color: "#94a3b8",
      fontSize: 13,
      marginTop: 6,
    },
    logo: {
      fontSize: 34,
      color: "#047857",
      fontWeight: 900,
    },
    card: {
      background: "#fff",
      borderRadius: 24,
      padding: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      border: "1px solid #e5e7eb",
      marginTop: 24,
    },
    section: {
      color: "#0b2a78",
      fontSize: 20,
      fontWeight: 800,
      marginTop: 26,
      marginBottom: 12,
    },
    btnGreen: {
      background: "#047857",
      color: "#fff",
      border: 0,
      borderRadius: 16,
      padding: 14,
      fontWeight: 800,
      width: "100%",
      cursor: "pointer",
    },
    btnWhite: {
      background: "#fff",
      color: "#0b3b66",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 13,
      fontWeight: 800,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: "100%",
    },
    nav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 56,
      background: "#2f6b9a",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
    },
  };

  function Info({ label, value }) {
    return (
      <div>
        <p style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 800 }}>{label}</p>
        <p style={{ fontSize: 16, color: "#17324d", fontWeight: 800 }}>{value}</p>
      </div>
    );
  }

  function Box({ label, value }) {
    return (
      <div
        style={{
          background: "#ecfdf5",
          borderRadius: 16,
          padding: 12,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 11, color: "#047857", fontWeight: 800 }}>{label}</p>
        <p style={{ fontSize: 24, color: "#047857", fontWeight: 900 }}>{value}</p>
      </div>
    );
  }

  function Menu() {
    return (
      <div style={styles.nav}>
        <Home />
        <Briefcase />
        <MapPin />
        <User />
      </div>
    );
  }

  function Logo() {
    return <div style={styles.logo}>♻</div>;
  }

  function TelaVisualizar() {
    return (
      <div style={styles.page}>
        <div style={styles.phone}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setStatus("gerado")}
              style={{ background: "none", border: 0, cursor: "pointer" }}
            >
              <ArrowLeft color="#0b2a78" />
            </button>

            <h2 style={{ color: "#0b2a78", fontWeight: 800, flex: 1 }}>
              Visualizar certificado
            </h2>

            <Logo />
          </div>

          <div
            style={{
              marginTop: 36,
              background: "#fff",
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ height: 28, background: "#047857" }}></div>

            <div style={{ padding: 28, textAlign: "center" }}>
              <p style={{ color: "#047857", fontWeight: 900, fontSize: 13 }}>
                CERTIFICADO AMBIENTAL
              </p>

              <h1 style={{ color: "#17324d", fontSize: 26 }}>
                Morador Residuum
              </h1>

              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                Este certificado comprova a destinação correta de resíduos
                recicláveis registrados na plataforma Residuum.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 26 }}>
                <Info label="COLETA" value="02/06/2026" />
                <Info label="PONTO" value="Norte - Manaus" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
                <Box label="PESO TOTAL" value="18,5 kg" />
                <Box label="PONTOS" value="+740" />
              </div>

              <div style={{ marginTop: 28 }}>
                <QrCode size={80} color="#047857" />
              </div>

              <p style={{ color: "#cbd5e1", fontSize: 11, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                Assinatura digital Residuum
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
            <button style={styles.btnWhite} onClick={() => setStatus("gerado")}>
              Voltar
            </button>
            <button style={styles.btnGreen} onClick={() => setModal(true)}>
              Baixar PDF
            </button>
          </div>

          <Menu />
        </div>
      </div>
    );
  }

  if (status === "visualizar") return <TelaVisualizar />;

  return (
    <div style={styles.page}>
      <div style={styles.phone}>
        <p style={{ fontSize: 11, color: "#17415f", fontWeight: 800 }}>RESIDUUM</p>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1 style={styles.title}>
              Certificado <br /> de coleta
            </h1>
            <p style={styles.subtitle}>Gere, visualize e baixe sua nota ambiental.</p>
          </div>
          <Logo />
        </div>

        <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "#dcfce7", borderRadius: 16, padding: 10 }}>
            <Check color="#047857" size={34} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, color: "#17324d" }}>
              {status === "gerado"
                ? "Certificado gerado com sucesso"
                : "Coleta pronta para certificado"}
            </h3>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 13 }}>
              {status === "gerado" ? "Visualize ou baixe agora." : "PET, papelão e alumínio."}
            </p>
          </div>

          <span
            style={{
              background: "#dcfce7",
              color: "#047857",
              fontSize: 11,
              fontWeight: 800,
              padding: "8px 12px",
              borderRadius: 20,
            }}
          >
            {status === "gerado" ? "PDF" : "VALIDADO"}
          </span>
        </div>

        <h2 style={styles.section}>Dados da coleta</h2>

        <div style={styles.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Info label="DATA" value="02/06/2026" />
            <Info label="PONTO DE COLETA" value="Norte - Manaus" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
            <Box label="PESO TOTAL" value="18,5 kg" />
            <Box label="PONTOS" value="+740" />
          </div>
        </div>

        <h2 style={styles.section}>Prévia do certificado</h2>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ height: 18, background: "#047857" }}></div>

          <div style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <FileText color="#047857" />

            <div style={{ flex: 1 }}>
              <p style={{ color: "#047857", fontSize: 11, fontWeight: 900, margin: 0 }}>
                CERTIFICADO AMBIENTAL
              </p>
              <h3 style={{ margin: "4px 0", color: "#17324d" }}>
                Morador Residuum
              </h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 13 }}>
                Destinação correta de 18,5 kg
              </p>
            </div>

            <QrCode color="#047857" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
          <button style={styles.btnWhite} onClick={() => setStatus("visualizar")}>
            <Eye size={20} /> Visualizar
          </button>

          <button style={styles.btnWhite} onClick={() => setModal(true)}>
            <Download size={20} /> Baixar PDF
          </button>
        </div>

        <button
          style={{
            ...styles.btnGreen,
            marginTop: 12,
            background: status === "gerado" ? "#ecfdf5" : "#047857",
            color: status === "gerado" ? "#047857" : "#fff",
            border: status === "gerado" ? "1px solid #bbf7d0" : "none",
          }}
          onClick={() => setStatus("gerado")}
        >
          {status === "gerado" ? "Gerar novamente" : "Gerar certificado"}
        </button>

        <Navbar />

        {modal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 28,
                padding: 32,
                maxWidth: 320,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  background: "#dcfce7",
                  borderRadius: 24,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check color="#047857" size={56} />
              </div>

              <h2 style={{ color: "#0b2a78", marginTop: 24 }}>
                Download concluído
              </h2>

              <p style={{ color: "#94a3b8", fontSize: 14 }}>
                O certificado foi salvo em PDF e está pronto para compartilhar.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
                <button style={styles.btnWhite} onClick={() => setModal(false)}>
                  Voltar
                </button>
                <button style={styles.btnGreen} onClick={() => setModal(false)}>
                  Abrir PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}