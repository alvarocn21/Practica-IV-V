import { v4 as uuid } from "uuid";
import { UserInputError } from "apollo-server";

export const Mutation = {
  //Permite registrarse con usuario y contraseña.
  signIn: async (parent: any, args: any, context) => {

    const userLength = await context.db.collection("Usuarios").countDocuments();
    let user = await context.db.collection("Usuarios").findOne({ email: args.email});
        
    if(!user){
      const User = {
        id: userLength + 1,
        email: args.email,
        pwd: args.pwd,
        token: null
      }
      await context.db.collection("Usuarios").insertOne(User);
      return "Usuario Registrado correctamente";
    }else{
      return "Usuario ya registrado"
    }
  },

  //Permite a un usuario loggeado borrar su cuenta. Borra todas sus recetas.
  signOut: async (parent: any, args: any, context) => {
    // let user = await context.db.collection("Usuarios").findOne({ email: args.email});
    
    // if(user){
    //   const User = {
    //     email: args.email,
    //     pwd: args.pwd,
    //     token: token
    //     //recipes: [Recipe!]!
    //   }
    //   console.log(User);
    //   return User;
    // }else{
    //   throw new UserInputError("Usuario ya existente");
    // }
  },

  //Permite loggearse con usuario y contraseña.
  logIn: async (parent: any, args: any, context) => {
    const token = uuid();

    let user = await context.db.collection("Usuarios").findOne({ email: args.email, pwd: args.pwd});
    
    if(user){
      await context.db.collection("Usuarios").findOneAndUpdate(user, { '$set': { token: token } });
      return "Usuario Logueado correctamente";
    }else{
      throw new UserInputError("Usuario no existente");
    }
  },

  //Permite desloggearse cuando el usuario tiene la sesión iniciada.
  logOut: async (parent: any, args: any, context) => {
    // let user = await context.db.collection("Usuarios").findOne({ email: args.email, pwd: args.pwd});
    
    // if(user){
    //   await context.db.collection("Usuarios").findOneAndUpdate(user, { '$set': { token: null } });
    //   return "Usuario Deslogueado correctamente";
    // }else{
    //   throw new UserInputError("Usuario no existente");
    // }
  },

  //Añade un ingrediente a la base de datos. Solo usuarios registrados.
  addIngregiente: async (parent: any, args: any, context) => { 
    const ingLength = await context.db.collection("Ingredientes").countDocuments();
    
    let Recipes = [] as any;

    //COMPROBAR 
    const recLength = await context.db.collection("Recetas").countDocuments();  // Cuenta cuantas recetas hay
    const Rec = await context.db.collection("Recetas").find().toArray();               // Rec = [Todas las recetas]
    for(let i = 0; i < recLength; i++){
      const ingRecLength = Rec[i].ingredients.count();
      for(let j = 0; j < ingRecLength; j++){
        const R = await context.db.collection("Recetas").ingredients[j].findOne({name: args.name});
        if(R){
          Recipes.push(R);
        }
      }
    }

    //ESTO SIRVE PARA PEDIR LO DE QUE ESTE LOGUEADO, TAMBIEN SE NECESITA DEVOLVER "req" EN CONTEXT 
    //const token = args.contexte.req.headers.token;

    const Ing = await context.db.collection("Ingredientes").findOne({name: args.name});
    if(!Ing){
      const Ingredient = {
        id: ingLength + 1,
        name: args.name, 
        recipes: Recipes
      }
      await context.db.collection("Ingredientes").insertOne(Ingredient);
      return "Ingrediente añadido correctamente";
    }else{
      return "Ese ingrediente ya existe";
    }
  },

  //Borra un ingrediente de la base de datos y todas las recetas que contengan ese ingrediente. Solo usuarios registrados. 
  //Solo puedes borrar el ingrediente si es tuyo. Se borran todas las recetas, aunque no sean tuyas.
  DeleteIng: async (parent: any, args: any, context) => {
    const ingLength = await context.db.collection("Ingredientes").countDocuments();
    
    //COMPROBAR
    const recLength = await context.db.collection("Recetas").countDocuments();
    const Rec = await context.db.collection("Recetas").find().toArray();
    for(let i = 0; i < recLength; i++){
      const ingRecLength = Rec[i].ingredients.count();
      for(let j = 0; j < ingRecLength; j++){
        const R = await context.db.collection("Recetas").ingredients[j].findOne({id: args.id});
        if(R){
          await context.db.collection("Recetas").deleteOne(R);
        }
      }
    }

    const ing = await context.db.collection("Ingredientes").findOne({id: args.id});
    if(ing){
      for(let i = args.id + 1; i <= ingLength; i ++){
        console.log(i);
        await context.db.collection("Ingredientes").findOneAndUpdate({id: i}, { '$set': { id: i - 1  } });
      }
      
      const author = await context.db.collection("Usuarios").findOne({/*{token: args.context.req.headers.token}*/})
      if(author.email == ing.recipes.author.email){
        await context.db.collection("Ingredientes").deleteOne({id: args.id});
        return "Ingrediente eliminado correctamente";
      }else{
        return "Ese ingrediente no es tuyo";
      }
    }else{
      return "Ese ingrediente no existe";
    }
  },

  //Añade una receta a la base de datos. Solo usuarios registrados
  addReceta: async (parent: any, args: any, context) => {
    const recLength = await context.db.collection("Recetas").countDocuments();

    const Rec = await context.db.collection("Ingredientes").findOne({name: args.name, description: args.description, ingredients: args.ingredients});
    if(!Rec){
      const author = await context.db.collection("Usuarios").findOne({/*{token: args.context.req.headers.token}*/})
      const Recipe = {
        id: recLength + 1,
        name: args.name, 
        description: args.description,
        ingredients: args.ingredients,
        author: author
      }
      await context.db.collection("Ingredientes").insertOne(Recipe);
      return "Receta añadida correctamente";
    }else{
      return "Esa receta ya existe";
    }

  },

  //Actualiza una receta existente en la base de datos. Solo usuarios registrados. Solo puedes actualizar la receta si es tuya.
  updateRec: async (parent: any, args: any, context) => {
    const Recipe = {
      name: args.name, 
      description: args.description,
      ingredients: args.ingredients
    }
    
    const Rec = await context.db.collection("Recetas").findOne({id: args.id});
    if(Rec){
      const author = await context.db.collection("Usuarios").findOne({/*{token: args.context.req.headers.token}*/})
      if(author.email == Rec.author.email){
        await context.db.collection("Usuarios").findOneAndUpdate({id: args.id}, { '$set': { Recipe } });
        return "Receta modificada correctamente";
      }else{
        return "Esa receta no es tuya";
      }
    }else{
      return "Esa receta no existe";
    }
  },

  //Borra una receta de la base de datos. Solo usuarios registrados. Solo puedes borrar la receta si es tuya.
  deleteRec: async (parent: any, args: any, context) => {
    const recLength = await context.db.collection("Recetas").countDocuments();
    
    //COMPROBAR
    const ingLength = await context.db.collection("Ingredientes").countDocuments();
    const Ing = await context.db.collection("Ingredientes").find().toArray();
    for(let i = 0; i < ingLength; i++){
      const recRecLength = Ing[i].ingredients.count();
      for(let j = 0; j < recRecLength; j++){
        const I = await context.db.collection("Ingredientes").recipes[j].findOne({id: args.id});
        if(I){
          await context.db.collection("Ingredientes").deleteOne(I);
        }
      }
    }

    const rec = await context.db.collection("Recetas").findOne({name: args.name});
    if(rec){
      for(let i = args.id + 1; i <= recLength; i ++){
        console.log(i);
        await context.db.collection("Recetas").findOneAndUpdate({id: i}, { '$set': { id: i - 1  } });
      }
      
      const author = await context.db.collection("Usuarios").findOne({/*{token: args.context.req.headers.token}*/})
      if(author.email == rec.author.email){
        await context.db.collection("Recipes").deleteOne({id: args.id});
        return "Receta eliminada correctamente";
      }else{
        return "Esa receta es tuyo";
      }
    }else{
      return "Esa receta no existe";
    }
  },
}


