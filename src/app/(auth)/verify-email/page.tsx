import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage(): React.ReactElement {
  return (
    <Card className="w-full max-w-md border-0 shadow-xl lg:border">
      <CardHeader className="space-y-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 mb-2">
          <Mail className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold lg:text-3xl">Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent you a confirmation link. Click it to verify your account and sign in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          If you don&apos;t see the email, check your spam folder or try signing in again.
        </p>
        <Button asChild className="w-full" variant="default">
          <Link href="/sign-in">Go to Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
