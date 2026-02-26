import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const UserMenu = () => {
  const { user, signOut, loading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");

  if (loading) return null;

  const openLogin = () => { setModalMode("login"); setModalOpen(true); };
  const openSignup = () => { setModalMode("signup"); setModalOpen(true); };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm text-foreground">
          <User className="h-3.5 w-3.5 text-accent" />
          <span className="hidden sm:inline max-w-[120px] truncate">{user.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log Out</span>
        </Button>
        <AuthModal open={modalOpen} onOpenChange={setModalOpen} defaultMode={modalMode} />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={openLogin} className="text-sm">
          Log In
        </Button>
        <Button size="sm" onClick={openSignup} className="text-sm">
          Sign Up
        </Button>
      </div>
      <AuthModal open={modalOpen} onOpenChange={setModalOpen} defaultMode={modalMode} />
    </>
  );
};

export default UserMenu;
