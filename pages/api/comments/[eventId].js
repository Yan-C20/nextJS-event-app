import { connectDatabase, insertDocument, getAllDocuments } from "@/helpers/db-util";

async function handler(req, res) {
    const eventId = req.query.eventId;

    // Database Error Handling

    let client;

    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(500).json({message: 'Failed connecting to database!'});
        return;
    }

    if (req.method === 'POST') {
        const { email, name, text } = req.body;

        if (
            !email.includes('@') ||
            !name ||
            name.trim() === '' ||
            !text ||
            text.trim() === ''
            ) {
            res.status(422).json({ message: 'Invalid input.' });
            client.close();
            return;
        }
        

        // Adding or storing comment on MongoDB Database
        const newComment = {
            email,
            name,
            text,
            eventId,
        };

        // Handling error on comments

        let result;

        try {
            result = await insertDocument(client, 'comments', newComment);
            newComment._id = result.insertedId;
            res.status(201).json({ message: 'Comment added.', comment: newComment });
        } catch (error) {
            res.status(500).json({message: 'Failed storing comment to database!'});
        }
    }

    // getting stored comment on MongoDB Database
    if (req.method === 'GET') {

        try {
            const documents = await getAllDocuments(
                client,
                'comments',
                { _id: -1 },
                { eventId: eventId } // this was added!
            );
            res.status(200).json({ comments: documents });
        } catch (error) {
            res.status(500).json({message: 'Failed getting comments from database!'});
        }
    }

    client.close();
}

// mongoDB pass: Master@Coding
// MongoDB database username: DMCollarga
// MongoDB database user-password: XOOiJkPOZwECBLo3
// mongodb+srv://DMCollarga:XOOiJkPOZwECBLo3@cluster0.tebzgjt.mongodb.net/test

export default handler;