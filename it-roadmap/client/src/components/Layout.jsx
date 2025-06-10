import React from "react";
import { MainNav } from "./MainNav";
import { Footer } from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
