import React, { useEffect, useState, useRef } from "react";
import Canvas from "./components/Canvas";
import SocketIO from "socket.io-client";

function App() {
  const [room, setRoom] = useState("");
  const socketRef = useRef(null);
  const [drawOperation, setDrawOperation] = useState(null);

  useEffect(() => {
    socketRef.current = SocketIO("http://localhost:8080");

    function handleDrawOperation(drawOperation) {
      setDrawOperation(drawOperation);
    }

    socketRef.current.on("draw operation", handleDrawOperation);

    return () => {
      socketRef.current.off(handleDrawOperation);
    };
  }, []);

  function handleCanvasChange(drawOperation) {
    socketRef.current.emit("draw operation", drawOperation);
  }

  return (
    <div>
      <label>
        Room
        <input value={room} onChange={(event) => setRoom(event.target.value)} />
      </label>
      <Canvas onChange={handleCanvasChange} drawOperation={drawOperation} />
    </div>
  );
}

export default App;
