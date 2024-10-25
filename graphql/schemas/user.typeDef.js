const UserTypeDef = `#graphql
   type User {
        _id: ID!
        name: String!
        userName: String!
        password: String!
        profilePicture: String
        gender: String!
        transactions: [Transaction!]
   }

   type Query{
        authUser: User
        user(userId: ID!) : User
   }

   type Mutation{
        signUp(input: signUpInput!): User
        login(input: loginInput!): User
        logout: LogoutResponse
   }

    input signUpInput {
        name: String!
        userName: String!
        password: String!
        gender: String!
    }
    input loginInput {
        userName: String!
        password: String!
    }

    type LogoutResponse {
        message: String!
    }
`

export default UserTypeDef;