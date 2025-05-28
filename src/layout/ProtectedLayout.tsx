import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import LLM from "../components/LLM";
import { useAuth } from "../auth/AuthContext";

const ProtectedLayout = () => {
      const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex bg-black flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
     {isAuthenticated && <LLM/>}
    </div>
  );
};

export default ProtectedLayout;
