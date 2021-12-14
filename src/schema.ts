import {gql} from "apollo-server"

export const typeDefs = gql`
    type Ingredient{
        id: ID!
        name: String!
        recipes: [Recipe!]!
    }
    input IngredientInput{
        name: String!
        recipes: [ID!]!
    }

    type Recipe{
        id: ID!
        name: String!
        description: String!
        ingredients: [Ingredient!]!
        author: User!
    } 
    input RecipeInput{
        name: String!
        description: String!
        ingredients: [ID!]!
        author: String!
    }

    type User{
        id: ID!
        email: String!
        pwd: String!
        token: String
        recipes: [Recipe!]!
    }
    input UserInput{
        email: String!
        pwd: String!
    }


    type Query{
        getRecetas(author: UserInput,ingredients: IngredientInput): [Recipe!]! #Preguntar
        getReceta(id: ID!): Recipe! #Bien creo
        
        getUser(id: ID!): User!
        getUsers: [User!]!
    }

    type Mutation{
        #Hecho
        signIn(email: String!,pwd: String!): String
        #No Hecho
        signOut(pwd: String!): String
        #Hecho
        logIn(email: String!,pwd: String!): String
        #No Hecho
        logOut(pwd: String!): String

        #No Hecho (Falta comprobar lo de las recetas y header.token)
        addIngregiente(name: String!): String
        #No Hecho (Falta comprobar lo de las recetas y header.token)
        DeleteIng(id: ID!): String

        #No Hecho (Falta comprobar lo de los ingredientes y header.token), 
        addReceta(name: String!, description: String!, ingredients: [ID!]): String
        #No Hecho (Falta header.token)
        updateRec(id: ID,name: String!, description: String!, ingredients: [ID!]): String
        #No Hecho (Falta comprobar lo de los ingredientes y header.token)
        deleteRec(id: ID!): String
    }


`
