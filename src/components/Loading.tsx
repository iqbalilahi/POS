import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/10 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black dark:border-white border-solid"></div>
        <span className="text-black dark:text-white text-[10px] font-black uppercase tracking-[0.2em]">Processing ...</span>
      </div>
    </div>
  );
};

export default Loading;
