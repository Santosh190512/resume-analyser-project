import { Outlet } from "react-router-dom";

import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

import CareerChatbot from "../components/CareerChatbot";


export default function MainLayout() {

  return (
    <div className="min-h-screen text-white">

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <CareerChatbot />



    </div>
  );
}
