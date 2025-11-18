import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">IA Hackathon Peru 2025</h1>
          <p className="text-muted-foreground">
            Inicia sesión para completar tu registro
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card shadow-lg border",
            },
          }}
        />
      </div>
    </div>
  );
}
