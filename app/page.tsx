import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="h-full relative flex flex-col items-center space-y-4 py-4">
        <h1>Start summarizing!</h1>
        <Link href="dashboard">
          <Button>Click here</Button>
        </Link>
      </div>
    </main>
  );
}
