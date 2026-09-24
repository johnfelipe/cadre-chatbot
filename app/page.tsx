import Chat from "@/components/Chat";
import { CONFIG } from "@/lib/config";

export default function Home() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-2xl flex-col">
      <header className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h1 className="font-semibold">Cadre AI Assistant</h1>
        <p className="text-sm text-neutral-500">
          Answers come from Cadre&apos;s published information. For anything else, the team can follow up.
        </p>
      </header>
      <Chat maxMessageChars={CONFIG.limits.maxMessageChars} />
    </main>
  );
}
