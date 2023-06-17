import { io } from "socket.io-client";

const createSocket = (userId) => {
    const socket = io("http://localhost:8000", { query: { userId } });

    socket.on("notification", (notification) => {
        // console.log("Received notification:", notification);
        // Do something with the notification, e.g., display it in the UI
    });

    return socket;
};

export { createSocket };
