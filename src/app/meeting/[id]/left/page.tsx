import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export const Page = ({ params: { id } }: PageProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <p className="font-bold">You left this meeting.</p>
      <Button variant={"default"}>
        <Link href={`/meeting/${id}`}>Rejoin</Link>
      </Button>
    </div>
  );
};

export default Page;
