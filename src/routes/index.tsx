import { createFileRoute } from "@tanstack/react-router";
import { CapabilityPage } from "@/components/canon/capability-page";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CapabilityPage />;
}

