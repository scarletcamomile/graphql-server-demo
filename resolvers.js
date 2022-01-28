const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { PubSub } = require("graphql-subscriptions");
const cats = require("./mock_data/cats.json");
const breeds = require("./mock_data/breeds.json");
const messages = require("./mock_data/messages.json");
const { GraphQLScalarType, Kind } = require("graphql");
const { UserInputError } = require('apollo-server');

const pubsub = new PubSub();

const dateScalar = new GraphQLScalarType({
   name: "Date",
   description: "Custom date",
   serialize(value) {
      return new Date(value).toString()
   },
   parseValue(value) {
      return new Date(value)
   },
   parseLiteral(ast) {
      if(ast.kind === Kind.STRING) {
         return new Date(ast.value);
      }
      throw new UserInputError("Provided value is not correct")
   }
});

const resolvers = {
  Query: {
    cats: () => cats,
    cat(parent, args, context, info) {
      return cats.find((cat) => cat.id === args.id);
    },
    messages: () => messages,
  },
  Cat: {
    breed(parent) {
      return breeds.find((breed) => breed.id === parent.breedId);
    },
  },
  Mutation: {
    addCat: (_, { cat: { name, description, age, vaccinated, breedId } }) => {
      const newCat = {
        id: uuidv4(),
        name,
        description,
        age,
        vaccinated,
        breedId,
      };
      cats.push(newCat);
      fs.readFile(
        "mock_data/cats.json",
        "utf8",
        function readFileCallback(err, data) {
          if (err) {
            console.log(error);
          } else {
            catsArr = JSON.parse(data);
            catsArr.push(newCat);
            json = JSON.stringify(catsArr);
            fs.writeFile("mock_data/cats.json", json, "utf8", () => newCat);
          }
        }
      );
      return newCat;
    },
    addMessage: (_, { author, body, date }) => {
      const newMessage = {
        id: uuidv4(),
        author,
        body,
        date,
      };
      messages.push(newMessage);
      fs.readFile(
        "mock_data/messages.json",
        "utf8",
        function readFileCallback(err, data) {
          if (err) {
            console.log(error);
          } else {
            catsArr = JSON.parse(data);
            catsArr.push(newMessage);
            json = JSON.stringify(catsArr);
            fs.writeFile(
              "mock_data/messages.json",
              json,
              "utf8",
              () => newMessage
            );
          }
        }
      );
      pubsub.publish("MESSAGE_CREATED", {
        messageCreated: {
          ...newMessage,
        },
      });
      return newMessage;
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator("MESSAGE_CREATED"),
    },
  },
  Date: dateScalar,
};

module.exports = resolvers;
