const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const { get } = require('express/lib/response');
const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

//user: dbuser3
//password: LvMIef7WVSTSwo20

const uri = "mongodb+srv://dbuser3:LvMIef7WVSTSwo20@cluster0.1gspj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");

        //get user
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });

        //get specific user
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        //update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        //post/add new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser)
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        });

        //delete user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        });
        // const user = { name: 'sebok das', email: 'sebokdas@gmail.com' };
        // const result = await userCollection.insertOne(user);
        // console.log(`user inserted with id: ${result.insertedId}`)
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('node mongo crud server running');
});

app.listen(port, () => {
    console.log('crud server running');
});



