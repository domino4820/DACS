// Simple placeholder for the toast hook
export const useToast = () => {
  const toast = ({ title, description, variant }) => {
    console.log("Toast:", { title, description, variant });
    // In a real implementation, this would show a toast notification
  };

  return { toast };
};
