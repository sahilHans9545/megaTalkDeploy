import React, { useEffect, useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import { io } from "socket.io-client";
import MyChats from "../../components/MyChats";
import ChatBox from "../../components/ChatBox";
import Header from "../../components/Header";
import "./style.css";
import SideMenu from "../../components/SideMenu";
import Modal from "../../components/Modals";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications } from "../../store/slices/notificationSlice";
import {
  setChats,
  setFetchAgain,
  setMessages,
  setSelectedChat,
} from "../../store/slices/chatSlice";
import { getUser } from "../../ApiCalls/api";
import { setUser } from "../../store/slices/userSlice";
import { getSenderIndex } from "../../config/chaLogics";
let socketInstance;
const ChatPage = () => {
  const { chats, selectedChat } = useSelector((state) => state.chatData);
  const [socketConnected, setSocketConnected] = useState(false);
  const { fetchAgain, messages } = useSelector((state) => state.chatData);
  const notification = useSelector((state) => state.notification);

  const [ShowSideDrawer, setShowSideDrawer] = useState(false);
  const modalType = useSelector((state) => state.modalType);
  const { userInfo, userData } = useSelector((state) => state.user);
  const [socket, setSocket] = useState({});
  const dispatch = useDispatch();

  const updateOnlineStatus = (userId, status) => {
    if (chats && chats.length > 0) {
      const updatedChats = chats.map((chat) => {
        if (chat?.isGroupChat) return chat;
        const users = chat.users.map((user) => ({ ...user }));
        // console.log("USERS ARE ", users);
        const index = getSenderIndex(userData, users);
        // console.log("INDEX IS ", index);

        if (index !== -1 && users[index]._id === userId) {
          // Create a new user object with the updated 'isOnline' property
          const updatedUser = { ...users[index], isOnline: status };
          // Create a new copy of the 'users' array with the updated user
          const updatedUsers = [...users];

          updatedUsers[index] = updatedUser;
          // Update the 'chat' with the new 'users' array

          return { ...chat, users: updatedUsers };
        }

        return chat; // Return unchanged chat if user is not in our chats
      });
      // console.log("UPDATED CHATS", updatedChats);

      dispatch(setChats(updatedChats));
      if (selectedChat) {
        console.log("SELECTED CHAT");
        const updatedSelectedChat = updatedChats.find(
          (chat) => chat._id === selectedChat._id
        );
        dispatch(setSelectedChat(updatedSelectedChat));
      }
    }
  };

  useEffect(() => {
    const userD = getUser(userInfo.username);

    userD
      .then((userData) => {
        dispatch(setUser({ userData }));
        console.log("AGAINA  AGAGAG");
        // https://megatalk-h4yu.onrender.com/
        socketInstance = io("https://megatalk-h4yu.onrender.com/", {
          // transports: ["websocket", "polling", "flashsocket"],
          auth: { token: userData._id },
        });

        socketInstance.emit("setup", userData);
        socketInstance.on("connected", () => {
          setSocketConnected(true);
        });
        setSocket(socketInstance);
      })
      .catch((error) => {
        console.error("Error:", error.response);
        dispatch(setUser(""));
      });

    return () => {
      socketInstance.off("setup");
      socketInstance.disconnect();
      console.log("disconnect");
    };
  }, []);

  useEffect(() => {
    if (socketConnected && socket) {
      socket.on("getOnlineUser", ({ userId }) => {
        updateOnlineStatus(userId, true);
      });

      socket.on("getOfflineUser", ({ userId }) => {
        updateOnlineStatus(userId, false);
      });

      return () => {
        socket.off("getOnlineUser");
        socket.off("getOfflineUser");
      };
    }
  }, [socketConnected, socket]);

  useEffect(() => {
    if (socketConnected && socket) {
      socket.on("message recieved", (newMessageRecieved) => {
        // console.log("NEW NOTIFICATION");

        if (
          selectedChat === "" ||
          selectedChat._id !== newMessageRecieved.chat._id
        ) {
          const existingUser = notification.find(
            (N) => N.chatId === newMessageRecieved.chat._id
          );

          if (existingUser) {
            const updatedNotification = { ...existingUser };
            updatedNotification.count += 1;
            const index = notification.findIndex(
              (N) => N.chatId === newMessageRecieved.chat._id
            );

            const updatedNotificationArray = [...notification];
            updatedNotificationArray[index] = updatedNotification;
            updatedNotificationArray.sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );

            dispatch(setNotifications(updatedNotificationArray));
          } else {
            dispatch(
              setNotifications([
                {
                  username: newMessageRecieved.sender.username,
                  chat: newMessageRecieved.chat,
                  chatId: newMessageRecieved.chat._id,
                  count: 1,
                  updatedAt: newMessageRecieved.chat.updatedAt,
                },
                ...notification,
              ])
            );
          }

          dispatch(setFetchAgain(!fetchAgain));
        } else {
          // setMessages([...messages, newMessageRecieved]);
          dispatch(setMessages([...messages, newMessageRecieved]));

          // console.log("YE TO DIRECT HAI");
        }
      });

      return () => socket.off("message recieved");
    }
  });

  useEffect(() => {
    if (socketConnected && socket) {
      socket.on("wallpaper changed", (chat) => {
        // alert("wallpaper");
        const newChats = [...chats];

        const chatToUpdate = newChats.find((c) => c._id === chat._id);
        if (chatToUpdate) {
          const updatedChat = {
            ...chatToUpdate,
            wallpaper: chat.wallpaper,
          };
          const chatIndex = newChats.findIndex((c) => c._id === chat._id);

          newChats.splice(chatIndex, 1, chat);
        }
        // console.log(newChats);

        dispatch(setChats(newChats));
        if (selectedChat && selectedChat._id === chat._id) {
          dispatch(setSelectedChat(chat));
        }
      });
      return () => {
        socket.off("wallpaper changed");
      };
    }
  }, [selectedChat, chats, socket, socketConnected]);

  return (
    <div
      id="chatPage"
      className="flex flex-col  w-full"
      style={{ userSelect: "revert-layer" }}
    >
      <Header setShowSideDrawer={setShowSideDrawer} />
      <SideDrawer
        setShowSideDrawer={setShowSideDrawer}
        ShowSideDrawer={ShowSideDrawer}
      />

      <div className="flex flex-1 h-[60vh] ">
        <div className="hidden sm:flex">
          <SideMenu />
        </div>

        <div
          className={`md:[380px] lg:w-[400px] flex-1 md:flex-initial w-auto ${
            selectedChat ? "hidden md:block" : "block"
          }`}
        >
          <MyChats />
        </div>
        <div
          className={`w-full md:w-auto flex-1 ${
            selectedChat ? "block" : "hidden md:block"
          }`}
          //  fixed sm:static top-0 bottom-0 left-0 right-0 h-[100vh] sm:h-auto
        >
          <ChatBox socket={socket} />
        </div>
      </div>
      {modalType && <Modal socket={socket} />}
    </div>
  );
};

export default ChatPage;
