import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthSplitLayout
      title="Create your shop account"
      description="Set up an email and password for the inventory workspace. If your Supabase project requires email confirmation, verify the address before signing in."
    >
      <SignUpForm />
    </AuthSplitLayout>
  );
}
