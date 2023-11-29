import React from "react";
import CreateGroupChat from "@components/Modals/CreateGroupChat";
import { useDispatch, useSelector } from "react-redux";
import UpdateGroupChat from "@components/Modals/UpdateGroupChat";
import GroupAbout from "@components/Modals/GroupAbout";
import UpdateProfile from "@components/Modals/UpdateProfile";
import { setModalType } from "@store/slices/modalSlice";
import About from "@components/Modals/About";
import UserProfile from "@components/Modals/UserProfile";
import LoggedProfile from "@components/Modals/LoggedProfile";
import Wallpaper from "@components/Modals/wallpaper";
import SideMenu from "@components/SideMenu";
const Modal = ({ socket }) => {
  const modalType = useSelector((state) => state.modalType);
  const dispatch = useDispatch();

  return (
    <div className="z-20">
      <div
        className="bg-[rgba(0,0,0,0.4)] w-full h-screen fixed left-0 top-0"
        onClick={() => dispatch(setModalType(""))}
      ></div>
      {modalType === "createGroup" && <CreateGroupChat />}
      {modalType === "updateGroup" && <UpdateGroupChat />}
      {modalType === "groupAbout" && <GroupAbout />}
      {modalType === "Profile" && <UpdateProfile />}
      {modalType === "About" && <About />}
      {modalType === "userProfile" && <UserProfile />}
      {modalType === "LoggedUserProfile" && <LoggedProfile />}
      {modalType === "wallpaper" && <Wallpaper socket={socket} />}
      {modalType === "mobileSideMenu" && <SideMenu />}
    </div>
  );
};

export default Modal;
