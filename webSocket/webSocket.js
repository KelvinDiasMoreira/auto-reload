import { createHash } from "crypto";

/**
 *
 * @param {Server<typeof IncomingMessage, typeof ServerResponse>} server
 */
const socketManager = (server) => {
  const generateAcceptValue = (acceptKey) => {
    return createHash("sha1")
      .update(acceptKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")
      .digest("base64");
  };

  server.on("upgrade", (req, socket) => {
    const key = req.headers["sec-websocket-key"];
    if (key) {
      const acceptKey = generateAcceptValue(key);

      const responseHeaders = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptKey}`,
      ];

      socket.write(responseHeaders.join("\r\n") + "\r\n\r\n");

      socket.on("data", (chunk) => {
        const k = [8, 14][chunk[1] ^ 255] ^ 6;
        const res =
          chunk.slice(k).map((n, i) => n ^ chunk[k - 4 + (i % 4)]) + "";
        if (res === "[object Object]") {
          console.log("this crap its a object");
        }

        console.log("received from client: ", res);
      });
    }
  });
};

export { socketManager };
