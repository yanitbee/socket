const io = require("socket.io")(4100, {
  cors: {
      origin: "http://localhost:5173",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit('me', socket.id);

  socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
          io.to(user.socketId).emit("getMessage", {
              senderId, text
          });
      }
  });

  socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", {
          signal: data.signalData,
          from: data.from,
          name: data.name,
      });
  });

  socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnect-video", () => {
      socket.broadcast.emit("callEnded");
  });

  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
  });
});
