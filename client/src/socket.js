import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// Since we use Vite proxy, relative path works fine or we can point to server port
const URL = import.meta.env.PROD ? undefined : 'http://localhost:3000';

export const socket = io(URL, {
    autoConnect: true,
    reconnection: true,
});
