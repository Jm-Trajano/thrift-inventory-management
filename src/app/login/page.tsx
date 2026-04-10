import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthSplitLayout
      title="Welcome back"
      description="Sign in to manage stock, record sales, and keep the shop floor in sync with what is actually available."
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
