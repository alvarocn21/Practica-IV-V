import { Db, MongoClient } from "mongodb";

export const connectDB = async (): Promise<Db> => {
  
  const dbName: string = "Comida";
  const collection: string = "Recetas";
  const usr = "Alvaro";
  const pwd = "Naciones2";

  const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ulh10.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info("MongoDB connected");
    const docs = await client
      .db(dbName)
      .collection(collection)
      .countDocuments();
    if (docs > 0) {
      console.info("Hay reservas hechas");
      return client.db(dbName);
    }
    console.info("No hay ninguna reserva todavia");
    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};