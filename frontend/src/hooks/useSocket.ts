import React from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import create from "zustand";

import { Axios } from "src/services/auth";
import { User } from "src/login";

type Call = {
  from?: User;
  signal?: Peer.SignalData;
};

type SocketStore = {
  socket: Socket | undefined;
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | undefined;
  name: string;
  call: Call;
  myVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  otherVideo: React.MutableRefObject<HTMLMediaElement | undefined> | undefined;
  connectionRef: React.MutableRefObject<Peer.Instance | undefined> | undefined;
  answerCall: () => void;
  callUser: (from: User, id: number) => void;
  leaveCall: () => void;
  sendChat: () => void;
};

type SocketValues = Omit<
  SocketStore,
  "answerCall" | "callUser" | "leaveCall" | "sendChat"
>;

const SocketMutations = (
  setState: (values: Partial<SocketValues>) => void,
  getState: () => SocketValues
): SocketStore => {
  const answerCall = () => {
    setState({ callAccepted: true });
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: getState().stream,
    });
    peer.on("signal", (data) => {
      getState().socket?.emit("answerCall", {
        signal: data,
        to: getState().call.from,
      });
    });
    peer.on("stream", (currentStream) => {
      if (
        !getState() ||
        !getState().otherVideo ||
        !getState().otherVideo?.current
      ) {
        return;
      }
      getState().otherVideo!.current!.srcObject = currentStream;
    });
    peer.signal(getState().call.signal!);
    getState().connectionRef!.current = peer;
  };

  const callUser = (from: User, id: number) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: getState().stream,
    });
    peer.on("signal", (data) => {
      getState().socket?.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: from,
      });
    });
    peer.on("stream", (currentStream) => {
      if (
        !getState().otherVideo ||
        getState().otherVideo === undefined ||
        getState().otherVideo?.current === undefined
      ) {
        return;
      }
      getState().otherVideo!.current!.srcObject = currentStream;
    });
    getState().socket?.on("callAccepted", (signal) => {
      setState({ callAccepted: true });
      peer.signal(signal);
    });
    getState().connectionRef!.current = peer;
  };

  return {
    socket: undefined,
    answerCall: answerCall,
    callUser: callUser,
    signin: signinMutation,
    signup: signupMutation,
    signout: signoutMutation,
  };
};

export const useAuthStore = create<SocketStore>(SocketMutations);
