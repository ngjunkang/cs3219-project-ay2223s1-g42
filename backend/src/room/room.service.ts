import { v4 } from "uuid";
import { Injectable } from "@nestjs/common";

import { NAMESPACES } from "../cache/constants";
import { RedisCacheService } from "../cache/redisCache.service";
import { PoolUser } from "../match/match.gateway";
import { Room } from "./room.gateway";

@Injectable()
export class RoomService {
  constructor(private cache: RedisCacheService) {}

  async getRoomFromUserId(userId: string) {
    console.log("checking room from user id...");
    const room = await this.cache.getKeyInNamespace<Room>(
      [NAMESPACES.ROOM, NAMESPACES.USERS],
      userId
    );
    return room;
  }

  async createRoom(users: PoolUser[]) {
    // create room
    const roomId = v4();
    const room: Room = {
      users,
      id: roomId,
    };
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], roomId, room);

    // add user to room users
    const addRoomedUsers = room.users.map(async (user) => {
      await this.cache.setKeyInNamespace(
        [NAMESPACES.ROOM, NAMESPACES.USERS],
        user.id.toString(),
        room
      );
    });
    await Promise.all(addRoomedUsers);
    return room;
  }

  async addUserToRoom(room: Room, user: PoolUser) {
    const newUsers = room.users.concat(user);
    const newRoom: Room = {
      ...room,
      users: newUsers,
    };
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], room.id, newRoom);
    return newRoom;
  }

  async removeUserFromRoom(room: Room, userId: number) {
    const newUsers = room.users.filter((user) => user.id !== userId);
    const newRoom: Room = {
      ...room,
      users: newUsers,
    };
    await this.cache.setKeyInNamespace([NAMESPACES.ROOM], room.id, newRoom);
    return newRoom;
  }

  async deleteRoom(roomId: string) {
    await this.cache.deleteKeyInNamespace([NAMESPACES.ROOM], roomId);
  }
}
