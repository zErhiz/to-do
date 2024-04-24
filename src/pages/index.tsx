import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  return (
    <main className="flex h-full justify-center items-center min-h-screen flex-col">
      <div className="flex flex-col items-center justify-center gap-4">
        <Button onClick={() => void router.push("/sign-in")}>Sign in</Button>
        <Button onClick={() => void router.push("/sign-up")}>Sign up</Button>
      </div>
    </main>
  );
}
