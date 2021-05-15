import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';


const typeDefs = `#graphql

    type Friend {
        id: ID
        firstName: String
        lastName: String
        email: String
        role: String
    }

    type Point {
        """Will ALWAYS have the value Point"""
        type: String

        """Array with longitude followed by latitude [lon,lat]"""
        coordinates: [Float]
    }
    
    type FoundFriend {
        email: String
        name: String
        #longitude: Float
        #latitude:Float
        location: Point
    }
   
    type FriendLocation {
        email: String
        name: String
        longitude: Float
        latitude:Float
    }

    """
    Queries available for Friends
    """
     type Query {
        """
        Returns all details for all Friends
        (Should probably require 'admin' rights if your are using authentication)
        """
        getAllFriends: [Friend]!

        """
        Only required if you ALSO wan't to try a version where the result is fetched from the existing endpoint
        """
        getAllFriendsProxy: [Friend]!

        #Geo Related Queries
        getAllPositions: [FoundFriend]!
    }

    input FriendInput {
        firstName: String!
        lastName: String!
        password: String!
        email: String!
    }

    input FriendEditInput {
        firstName: String
        lastName: String
        password: String
        email: String!
    }

    input PositionInput {
      email:String!
      longitude: Float!
      latitude: Float!
    }

    input NearbyFriendsInput {
      email: String !
      password: String!
      latitude: Float!
      longitude: Float!
      distance: Int
    }

    type Mutation {
        """
        Allows anyone (non authenticated users) to create a new friend
        """
        createFriend(input: FriendInput): Friend

       # Location Related Parts of the API 

        """Add current position for this user"""
        addPosition(input: PositionInput):Boolean 

        getNearbyFriends(input : NearbyFriendsInput) : [FoundFriend]!
        getNearbyFriendLocations(input : NearbyFriendsInput) : [FriendLocation]!

    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
