import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default function Page({ params: { id } }: PageProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-bold">You left this meeting.</p>
      <Button variant={"default"}>
        <Link href={`/meeting/${id}`} className="bg-gray-500 hover:bg-gray-600">
          Rejoin
        </Link>
      </Button>
    </div>
  );
}
