import { AuthForm } from '@/components/forms/auth-form';
import { registerAction } from '../actions/register';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SignUpPageProps {
  searchParams?: Promise<{ redirect?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps): Promise<React.ReactElement> {
  const params = searchParams ? await searchParams : {};
  const redirect = typeof params.redirect === 'string' ? params.redirect : undefined;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
        <CardDescription>
          Create your MedUni account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm action={registerAction} mode="signup" redirect={redirect} />
      </CardContent>
    </Card>
  );
}

