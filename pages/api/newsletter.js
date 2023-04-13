import { connectDatabase, insertDocument } from "@/helpers/db-util";

async function handler(req, res) {
    if (req.method === 'POST') {
        const userEmail = req.body.email;

        if (!userEmail || !userEmail.includes('@')) {
            res.status(442).json({ message: 'Invalid email address.' });
            return;
        }

        // Database Error Handling

        let client;

        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(500).json({ message: 'Failed connecting to database!' });
            return;
        }

        try {
            await insertDocument(client, 'newsletter', { email: userEmail });
            client.close();
        } catch (error) {
            res.status(500).json({ message: 'Failed inserting data to database!' });
            return;
        }

        res.status(201).json({ message: 'Signed Up!' });
    }
}

export default handler;