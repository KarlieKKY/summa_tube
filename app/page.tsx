import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="h-full py-10">
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center">
            Explore the power of SummaTube
          </h2>
          <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
            Chat with the smartest AI - Experience the power of SummaTube AI
          </p>
        </div>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          <div className="h-full relative flex flex-col items-center space-y-4 py-4">
            <h1>Start summarizing!</h1>
            <Link href="dashboard">
              <Button>Click here</Button>
            </Link>
          </div>
          <h3> input youtueb link</h3>

          <h3> start generating</h3>
          <h3>youtube summarization</h3>
          <h3>QA section</h3>
        </div>
      </div>
    </main>
  );
}
