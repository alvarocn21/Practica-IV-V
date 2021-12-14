export const Query = {
    //Devuelve todas las recetas.
    //Tiene author y ingrediente como parametros opcionales (se pueden pasar ambos, uno, o ninguno)
    getRecetas: async (parent: any, args: any, context) => {
        if(args.author && args.ingredients){
            const R = await context.db.collection("Recetas").find({author: args.author, ingredients: args.ingredients});
            return R;
        }else if(args.author){
            const R = await context.db.collection("Recetas").find({author: args.author});
            return R;
        }else if(args.ingredients){
            const R = await context.db.collection("Recetas").find({ingredients: args.ingredients});
            return R;
        }else{
            const R = await context.db.collection("Recetas").find().toArray();
            return R;
        }
    },

    //Devuelve la receta pedida por id
    getReceta: async (parent: any, args: any, context) => {
        const R = await context.db.collection("Recetas").findOne({id: args.id});
        return R;
    },

    //Devuelve un usuario pedido por id
    getUser: async (parent: any, args: any, context) => {
        const R = await context.db.collection("Usuarios").findOne({id: args.id});
        return R;
    },

    //Devuelve todos los usuarios
    getUsers: async (parent: any, args: any, context) => {
        const R = await context.db.collection("Usuarios").find().toArray();
        return R;
    },
}

export const Recipe = {
    ingredients: async (parent: any, args: any, context) => {
        
        const ingredients = await context.db.collection("Ingredientes").find().toArray();

        return ingredients.map((elem) => ({
            id: elem.id,
            name: elem.name,
        }))
    }
}

export const Ingredient = {
    recipes: async (parent: any, args: any, context) => {

        const recipes = await context.db.collection("Recetas").find().toArray();

        return recipes.map((elem) => ({
            id: elem.id,
            name: elem.name,
            description: elem.description,
            author: elem.author
        }))
    } 
}
