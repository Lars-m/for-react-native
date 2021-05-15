import FriendFacade from '../facades/friendFacade';
import PositionFacade from '../facades/positionFacade';
import { IFriend } from '../interfaces/IFriend';
import { ApiError } from '../errors/errors';
import { Request } from "express";
import IPosition from '../interfaces/IPosition'

interface IPositionInput {
  email: string
  longitude: number
  latitude: number
}

interface INearbyFriendsInput {
  email: string
  password: string
  latitude: number
  longitude: number
  distance: number
}


let friendFacade: FriendFacade
let positionFacade: PositionFacade

/*
We don't have access to app or the Router so we need to set up the facade in another way
In www.ts IMPORT and CALL the method below, like so: 
      setupFacade(db);
Just before the line where you start the server
*/
export function setupFacade(db: any) {
  if (!friendFacade) {
    friendFacade = new FriendFacade(db)
  }
  if (!positionFacade) {
    positionFacade = new PositionFacade(db)
  }
}

// resolver map
export const resolvers = {
  Query: {

    getAllFriends: (root: any, _: any, context: any) => {

      if (!context.credentials || !context.credentials.role || context.credentials.role !== "admin") {
        throw new ApiError("Not Authorized", 401)
      }
      return friendFacade.getAllFriendsV2()
    },
    getAllPositions: (root: any, _: any) => {
      return positionFacade.getAllPositions()
    }

    // getAllFriendsProxy: async (root: object, _: any, context: Request) => {
    //   let options: any = { method: "GET" }
    //   //This part only required if authentication is required
    //   const auth = context.get("authorization");
    //   if (auth) {
    //     options.headers = { 'authorization': auth }
    //   }
    //   return fetch(`http://localhost:${process.env.PORT}/api/friends/all`, options).then(r => {
    //     if (r.status >= 400) { throw new Error(r.statusText) }
    //     return r.json()
    //   })
    // }
  },

  Mutation: {
    createFriend: async (_: object, { input }: { input: IFriend }) => {
      return friendFacade.addFriendV2(input)
    },
    addPosition: async (_: any, { input }: { input: IPositionInput }) => {
      try {
        const res = await positionFacade.addOrUpdatePosition(input.email, input.longitude, input.latitude)
        return true
      } catch (e) {
        return false
      }
    },
    getNearbyFriends: (_: any, { input }: { input: INearbyFriendsInput }) => {
      const { email, password, latitude, longitude, distance } = input
      return positionFacade.findNearbyFriends(email, password, latitude, longitude, distance)
    },

    getNearbyFriendLocations: async (_: any, { input }: { input: INearbyFriendsInput })=>{
      const { email, password, latitude, longitude, distance } = input
      const friends = await positionFacade.findNearbyFriends(email, password, latitude, longitude, distance)
      const friendsToReturn = friends.map((f:IPosition)=> {
        return {email:f.email, name:f.name,longitude:f.location.coordinates[0],latitude:f.location.coordinates[1]}
      })
      return friendsToReturn
    }
  }
}
