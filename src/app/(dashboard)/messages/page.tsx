import { ChatMain } from "@/components/chat/chat-main";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

export default function Page() {
  return (
    <div className="flex h-[calc(100vh-50px)] lg:px-4 -mt-3 justify-center">
      <ChatSidebar />
      <ChatMain />
    </div>
  );
}
