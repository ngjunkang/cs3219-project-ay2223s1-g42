import { StateCreator } from "zustand";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

import { User } from "src/login";
import type { Status, GlobalStore } from "./useGlobalStore";
import { PoolUser, QuestionDifficulty } from "./createMatchSlice";
import { ROOM_EVENTS, StatusType } from "./enums";

export type RoomUser = PoolUser & {
  socketId: string;
  timeJoined: Date;
};

export type Room = {
  id: string;
  users: RoomUser[];
  difficulty?: QuestionDifficulty;
};

export type RoomSlice = {
  // room data
  roomSocket: Socket | undefined;
  roomStatus: Status | undefined;
  room: Room | undefined;
  newRoomUser: User | undefined;
  oldRoomUser: User | undefined;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
};

const createRoomSlice: StateCreator<GlobalStore, [], [], RoomSlice> = (
  setState,
  getState
) => {
  const roomSocket = io(`${import.meta.env.VITE_API_URL}/room`, {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
    forceNew: true,
  });

  roomSocket.on("connect", () => {
    console.log("connected to /room ws server :)");
  });

  roomSocket.on("disconnect", () => {
    console.log("disconnected from /room ws server :(");
  });

  roomSocket.on(ROOM_EVENTS.JOIN_ROOM_SUCCESS, (data) => {
    const { room }: { room: Room } = JSON.parse(data);
    console.log("successfully joined room: ", { room });
    const roomStatusMsg = `Successfully joined room ${room.id}.`;
    const roomStatus: Status = {
      status: StatusType.SUCCESS,
      event: ROOM_EVENTS.JOIN_ROOM_SUCCESS,
      message: roomStatusMsg,
    };
    setState({ room, roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.JOIN_ROOM_ERROR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Error occurred while joining room.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.JOIN_ROOM_ERROR,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.LEAVE_ROOM_SUCCESS, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Successfully left room.`;
    const roomStatus: Status = {
      status: StatusType.SUCCESS,
      event: ROOM_EVENTS.LEAVE_ROOM_SUCCESS,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({
      room: undefined,
      queueRoomId: undefined,
      roomStatus,
    });
  });

  roomSocket.on(ROOM_EVENTS.LEAVE_ROOM_ERR, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Error occurred while leaving room.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.LEAVE_ROOM_ERR,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.INVALID_ROOM, (data) => {
    const { message }: { message: string } = JSON.parse(data);
    const roomStatusMsg = `Room provided is invalid. Please try searching for another match.`;
    const roomStatus: Status = {
      status: StatusType.ERROR,
      event: ROOM_EVENTS.INVALID_ROOM,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.NEW_USER_JOINED, (data) => {
    const { room, newUser }: { room: Room; newUser: User } = JSON.parse(data);
    const roomStatusMsg = `${newUser.username} has joined the room.`;
    const roomStatus: Status = {
      status: StatusType.INFO,
      event: ROOM_EVENTS.NEW_USER_JOINED,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ room, newRoomUser: newUser, roomStatus });
  });

  roomSocket.on(ROOM_EVENTS.OLD_USER_LEFT, (data) => {
    const { room, oldUser }: { room: Room; oldUser: User } = JSON.parse(data);
    const roomStatusMsg = `${oldUser.username} has left the room.`;
    const roomStatus: Status = {
      status: StatusType.INFO,
      event: ROOM_EVENTS.OLD_USER_LEFT,
      message: roomStatusMsg,
    };
    toast(roomStatusMsg);
    setState({ room, oldRoomUser: oldUser, roomStatus });
  });

  const joinRoom = (roomId: string) => {
    const user = getState().user;
    if (!user) {
      ("failed to emit JOIN_ROOM event, user not logged in!");
      return;
    }
    if (!roomSocket.connected) {
      roomSocket.connect();
    }
    // roomSocket.connect();
    const payload = JSON.stringify({ ...user, roomId });
    console.log("joining room: ", { payload });
    roomSocket.emit(ROOM_EVENTS.JOIN_ROOM, payload);
  };

  const leaveRoom = () => {
    const user = getState().user;
    if (!user) {
      ("failed to leave room, user not logged in!");
      return;
    }
    const room = getState().room;
    if (!room) {
      console.error("failed to leave room, user not in a room!");
      return;
    }
    if (!roomSocket.connected) {
      console.error("failed to leave room, room socket not connected");
      return;
    }
    const roomId = room.id;
    const payload = JSON.stringify({ ...user, roomId });
    console.log("leave room payload: ", payload);
    roomSocket.emit(ROOM_EVENTS.LEAVE_ROOM, payload);
    // kill room socket
    // roomSocket.disconnect();
  };

  return {
    // room data
    roomSocket,
    roomStatus: undefined,
    room: undefined,
    newRoomUser: undefined,
    oldRoomUser: undefined,
    joinRoom,
    leaveRoom,
  };
};

export { createRoomSlice };