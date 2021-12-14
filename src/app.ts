import {ApolloServer, gql} from "apollo-server"
import { connectDB } from "./connectmongo"
import {typeDefs} from "./schema"
import { Query, Ingredient, Recipe} from "./resolvers/query"
import { Mutation } from "./resolvers/mutation"

const resolvers = {
  Query,
  Mutation,
  Ingredient,
  Recipe
}

const run = async () =>{
  
  const db = await connectDB();
  const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: async ({req,res}) => {
      // db.collection("Usuarios").insertOne({token: "123"});
      // const user = await db.collection("Usuarios").findOne({token: ""});
      return {
        db,
        req
      }
    }
  });

  server.listen(3000).then(() => {
    console.log("Server escuchando en el puerto 3000");
  });
}

try {
  run();
} catch (e) {
  console.error(e);
}