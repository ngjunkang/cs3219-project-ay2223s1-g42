import { useNavigate } from "react-router";

import { RedButton } from "src/components";
import { User } from "src/login";
import { RoomTabs } from "src/room";
import { useGlobalStore } from "src/store";
import { RoomEditor } from "./RoomEditor";
import { RoomListBox } from "./RoomListBox";

const LeaveRoomButton = () => {
  const navigate = useNavigate();
  const { user, leaveRoom } = useGlobalStore((state) => {
    return {
      user: state.user,
      leaveRoom: state.leaveRoom,
    };
  });
  return (
    <RedButton
      className="py-2.5 text-sm md:py-2"
      onClick={() => {
        if (!user) {
          console.error("user not logged in, cannot leave room");
          return;
        }
        leaveRoom();
        navigate("/");
      }}
    >
      disconnect
    </RedButton>
  );
};

type LoadedRoomProps = {
  roomId: string;
  user: User;
};

const LoadedRoom = ({ roomId, user }: LoadedRoomProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-3 py-3 lg:flex-row">
      <div className="h-full max-h-full w-full border-[1px] border-neutral-800">
        <RoomTabs />
      </div>
      <div className="flex h-full w-full flex-col border-[1px] border-neutral-900">
        <div className="flex w-full flex-row items-center justify-between">
          <RoomListBox />
          <LeaveRoomButton />
        </div>
        <RoomEditor roomId={roomId} user={user} />
      </div>
    </div>
  );
};

export { LoadedRoom };
