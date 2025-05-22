import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export default function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-700">{message}</AlertDescription>
    </Alert>
  );
}
