import React, { ReactNode } from "react";
import Footer from "./Footer.comp/Footer.comp";
import Header from "./Header.comp/Header.comp";

interface TemplateProps {
  children: ReactNode; // Правильный тип для `children`
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Template;
