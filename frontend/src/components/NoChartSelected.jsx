import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">

        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Chart</h2>
        <p className="text-base-content/60">
          Select a conversation and start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;