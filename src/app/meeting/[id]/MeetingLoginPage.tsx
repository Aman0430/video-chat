import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignInButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function MeetingLoginPage() {
  return (
    <div className="mx-auto flex h-screen w-fit flex-col items-center justify-center space-y-3">
      <h1 className="text-center text-2xl font-bold">Join meeting</h1>
      <ClerkLoaded>
        <SignInButton>
          <Button className="w-44" variant={"outline"}>
            Sign in
          </Button>
        </SignInButton>
        <Button variant={"outline"} className="ml-1 w-44">
          <Link href="?guest=true">Continue as guest</Link>
        </Button>
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="mx-auto animate-spin" />
      </ClerkLoading>
    </div>
  );
}
