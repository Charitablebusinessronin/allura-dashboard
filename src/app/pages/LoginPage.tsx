import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate("/dreams");
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="size-12 rounded-xl bg-allura-blue flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <div className="text-2xl font-semibold">allura</div>
            <div className="text-sm text-muted-foreground">Memory Dashboard</div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="size-6 text-primary" />
            <h1 className="text-xl font-semibold">Sign In</h1>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 text-destructive rounded-xl text-sm">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium mb-2 block">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@allura.ai"
                required
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-lg transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Default: admin@allura.ai / admin
          </p>
        </div>
      </div>
    </div>
  );
}
