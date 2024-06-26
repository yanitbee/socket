const io = require("socket.io")(4100, {
  cors: {
      origin: "http://localhost:5173",
  },
});

<<<<<<< HEAD
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
=======
let user = [];

const addUser = (userId, socketId) => {
  !user.some((user) => user.userId === userId) &&
    user.push({ userId, socketId });
};

const getUser = (userId) => {
  return user.find((user) => user.userId === userId);
>>>>>>> d11ec0bb77d7c5d59180a7e9ee303d44d50705e7
};

const removeUser = (socketId) => {
  user = user.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit('me', socket.id);

  socket.on("addUser", (userId) => {
<<<<<<< HEAD
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
=======
    addUser(userId, socket.id);
    io.emit("getUsers", user);
  });

     socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId)
        io.to(user.socketId).emit("getMessage", {
            senderId, text
        })
    })

  socket.on("addUserV", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", user);
  });


  socket.emit('me', socket.id);

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
    console.log(data.userToCall)
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
    console.log(data.to)
  });

  socket.on("disconnect-video", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", user);
>>>>>>> d11ec0bb77d7c5d59180a7e9ee303d44d50705e7
  });
});