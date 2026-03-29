import { AuthForm } from '@/components/forms/auth-form';
import { loginAction } from '../actions/login';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SignInPageProps {
  searchParams?: Promise<{ redirect?: string; verified?: string; error?: string }>;
}

const VERIFY_ERROR_MESSAGES: Record<string, string> = {
  missing_token: 'Verification link is invalid.',
  invalid_or_expired: 'This verification link is invalid or has expired. Please sign up again or request a new link.',
  verification_failed: 'Verification could not be completed. Please try again.',
};

export default async function SignInPage({ searchParams }: SignInPageProps): Promise<React.ReactElement> {
  const params = searchParams ? await searchParams : {};
  const redirect = typeof params.redirect === 'string' ? params.redirect : undefined;
  const verified = params.verified === '1';
  const verifyError = typeof params.error === 'string' ? VERIFY_ERROR_MESSAGES[params.error] ?? 'Something went wrong.' : null;

  return (
    <div className="w-full max-w-md space-y-4">
      {verified && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2" role="status">
          <p className="text-sm font-medium text-green-800">Your email is verified. You can sign in now.</p>
        </div>
      )}
      {verifyError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2" role="alert">
          <p className="text-sm font-medium text-red-600">{verifyError}</p>
        </div>
      )}
      <Card className="w-full border-0 shadow-xl lg:border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold lg:text-3xl">Sign In</CardTitle>
          <CardDescription>
            Sign in to your MedUni account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm action={loginAction} mode="signin" redirect={redirect} />
        </CardContent>
      </Card>
    </div>
  );
}

