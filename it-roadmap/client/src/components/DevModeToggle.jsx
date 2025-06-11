import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export default function DevModeToggle() {
  const { devMode, toggleDevMode } = useAuth();

  // Only render in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleToggleDevMode = () => {
    console.log(`Toggling dev mode from ${devMode} to ${!devMode}`);
    toggleDevMode();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-cyberpunk-darker border border-purple-500/30 rounded-md p-2 shadow-lg">
        <div className="text-xs text-gray-400 font-mono-cyber mb-1">
          Development Mode: {devMode ? "ON" : "OFF"}
        </div>
        <Button
          onClick={handleToggleDevMode}
          size="sm"
          variant={devMode ? "destructive" : "outline"}
          className={devMode ? "bg-red-600" : "border-purple-500/30"}
        >
          {devMode ? "Disable Dev Mode" : "Enable Dev Mode"}
        </Button>
      </div>
    </div>
  );
}
