import { useEffect } from "react";
import { io } from "socket.io-client";
console.log("process env= ",process.env.NEXT_PUBLIC_API_URL )
export default function useJobImportSocket({
  onStarted,
  onCompleted,
  onFailed,
}: {
  onStarted?: (data: any) => void;
  onCompleted?: (data: any) => void;
  onFailed?: (data: any) => void;
}) {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL as string);

    if (onStarted) socket.on("import:started", onStarted);
    if (onCompleted) socket.on("import:completed", onCompleted);
    if (onFailed) socket.on("import:failed", onFailed);

    return () => {
      socket.disconnect();
    };
  }, []);
}
