import React, { useState } from "react";
import { AsideHeader } from "@gravity-ui/navigation";
import { ThemeProvider, Icon, Box } from "@gravity-ui/uikit";
import MathOperations from "@gravity-ui/icons/MathOperations";
import File from "@gravity-ui/icons/File";
import BarsPlay from "@gravity-ui/icons/BarsPlay";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

const menuItems = [
  {
    id: "calculator",
    title: "Калькулятор ЗП",
    icon: <Icon data={MathOperations} size={20} />,
    link: "/calculator",
  },
  {
    id: "job_generator",
    title: "Генератор вакансий",
    icon: <Icon data={File} size={20} />,
    link: "/job_generator",
  },
  {
    id: "summary",
    title: "Генератор summary",
    icon: <Icon data={BarsPlay} size={20} />,
    link: "/summary",
    rightAdornment: (
      <span style={{ color: "#16b573", fontWeight: 500, fontSize: 12 }}>
        PRO
      </span>
    ),
  },
];

const footerItems = [
  { id: "settings", title: "Настройки", link: "/settings" },
  { id: "account", title: "Аккаунт", link: "/account" },
];

export default function Layout({ activeId, children }) {
  const [compact, setCompact] = useState(false);

  return (
    <ThemeProvider theme="light">
      <Box style={{ display: "flex", minHeight: "100vh" }}>
        <AsideHeader
          logo={
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <img src="/logo.svg" alt="Logo" width={32} height={32} />
              ии_эйчар
            </Box>
          }
          compact={compact}
          onChangeCompact={setCompact}
          menuItems={menuItems.map((item) => ({
            ...item,
            current: item.id === activeId,
          }))}
          renderFooter={() => (
            <Box padding="20px 12px" style={{ width: "100%" }}>
              <a
                href="#"
                style={{
                  background: "#FFB74D",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "10px 24px",
                  display: "block",
                  textAlign: "center",
                  fontWeight: 600,
                  boxShadow: "0 2px 10px rgba(255,183,77,0.18)",
                  marginBottom: 18,
                }}
              >
                Подписка PRO
              </a>
              {footerItems.map((footerItem) => (
                <a
                  key={footerItem.id}
                  href={footerItem.link}
                  style={{
                    display: "block",
                    marginTop: 8,
                    color: "#555",
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  {footerItem.title}
                </a>
              ))}
            </Box>
          )}
        />
        <Box flex={1} backgroundColor="#fff" padding={24}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
