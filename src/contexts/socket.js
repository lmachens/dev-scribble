import React, { useContext, useEffect, useState } from "react";
import SocketIO from "socket.io-client";

export const SocketContext = React.createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("New socket");
    setSocket(SocketIO());
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
