import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import userImg from "../assets/user.png";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
  getOnceSenderUsername,
  isLastMessage,
  isPreviousDiff,
  isSameSender,
} from "../config/chaLogics";
import { setFetchAgain, setMessages } from "../store/slices/chatSlice";

const ScrollableChat = ({ messages, istyping, socket }) => {
  const { selectedChat, fetchAgain } = useSelector((state) => state.chatData);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (messages.length) {
      const latestMessage = messages[messages.length - 1];
      const latestMsgFromUser = latestMessage.sender._id !== userData._id;
      console.log("latest message from other user ", latestMsgFromUser);
      if (latestMsgFromUser && !latestMessage.isSeen) {
        console.log("latest message will change of the user");
        socket.emit("markMessagesAsSeen", {
          chatId: selectedChat._id,
          userId: latestMessage.sender._id,
        });
      }

      socket.on("messagesSeen", (chatId) => {
        console.log("user has seen your message of chat id ", chatId);
        const updatedMessages = messages.map((message) => {
          if (!message.isSeen) {
            const updatedMessage = { ...message, isSeen: true };
            return updatedMessage;
          }
          return message;
        });
        // alert("messages updated");
        dispatch(setMessages(updatedMessages));
        // dispatch(setFetchAgain(!fetchAgain));
      });
    }
    return () => {
      socket.off("messagesSeen");
    };
  }, [messages, selectedChat, userData]);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.user.userData);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const convertTime = (createdTime) => {
    const utcTimestamp = "2023-11-29T08:43:53.274Z";
    const date = new Date(createdTime);

    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedTime;
  };

  return (
    <div className="px-2 sm:px-3 py-4 relative">
      {messages &&
        messages.map((message, i) => {
          return (
            <div key={i}>
              <div
                className={`flex gap-2  relative ${
                  message.sender._id === user._id ? "justify-end" : ""
                }`}
              >
                {(isSameSender(messages, message, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <div className="absolute bottom-0">
                    <img
                      src={message.sender.profilePic || userImg}
                      className="w-8 h-8 rounded-full "
                      alt=""
                    />
                  </div>
                )}

                <div
                  className={`ms-9 md:ms-10 ${
                    isPreviousDiff(messages, message, i, user._id)
                      ? "mt-4"
                      : "mt-[3.5px]"
                  }  `}
                >
                  {getOnceSenderUsername(messages, message, i, user._id) && (
                    <p className="text-xs font-semibold bg-white rounded-tl-lg rounded-tr-lg px-1 pt-[2px] mb-[2.5px] w-fit">
                      {message.sender.username}
                    </p>
                  )}
                  <div
                    className={`${
                      message.sender._id === user._id
                        ? "bg-color6 text-white rounded-tr-[2px]"
                        : "bg-white rounded-tl-[2px]"
                    } rounded-[10px] px-4 py-1 pb-2 relative`}
                  >
                    <p className="break-all">
                      {" "}
                      {message.content} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      &nbsp;
                    </p>
                    {/* <p className="pr-16 pt-1"> */}
                    <span className="text-[10px] absolute bottom-[1px] right-3 text-[#dfdfdf]">
                      <span
                        className={
                          message.sender._id === user._id ? "" : "text-gray-700"
                        }
                      >
                        {message?.createdTime}
                      </span>
                      {message.sender._id === user._id && (
                        <span>
                          {message.isSeen ? (
                            <DoneAllIcon style={{ fontSize: "14px" }} />
                          ) : (
                            <DoneIcon style={{ fontSize: "14px" }} />
                          )}
                        </span>
                      )}
                    </span>
                    {/* </p> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {istyping && (
        <span className="absolute bottom-1 left-3">
          <ThreeDots
            height="40"
            width="40"
            radius="9"
            color="#fff"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </span>
      )}
      <div className="pt-8"></div>
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ScrollableChat;
