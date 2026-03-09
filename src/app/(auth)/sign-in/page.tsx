import { AuthForm } from '@/components/forms/auth-form';
import { loginAction } from '../actions/login';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SignInPageProps {
  searchParams?: Promise<{ redirect?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps): Promise<React.ReactElement> {
  const params = searchParams ? await searchParams : {};
  const redirect = typeof params.redirect === 'string' ? params.redirect : undefined;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Sign in to your MedUni account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm action={loginAction} mode="signin" redirect={redirect} />
      </CardContent>
    </Card>
  );
}

