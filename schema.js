const { gql } = require("apollo-server-express");

const typeDefs = gql`
   scalar Date

   type Cat {
      id: ID
      name: String
      description: String
      age: Int
      vaccited: Boolean
      breedId: ID
      breed: Breed
   }

   type Breed {
      id: ID
      name: String
      vocalness: String
      temperament: [String]
      colors: [String]
   }

   type Query {
      cats: [Cat]
      cat(id: ID!): Cat
      messages: [Message]
   }

   type Mutation {
      addCat(cat: CatInput): Cat
      addMessage(author: String!, body: String!, date: Date!): Message
   }

   input CatInput {
      name: String
      description: String
      age: Int
      vaccited: Boolean
      breedId: ID
   }

   type Message {
      id: ID
      author: String
      body: String
      date: Date
   }

   input MessageInput {
      author: String!
      body: String!
      date: Date!
   }

   type Subscription {
      messageCreated: Message
   }
`;

module.exports = typeDefs;
