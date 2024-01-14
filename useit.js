
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.post("/example/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    res.send("Hi");
    // const { question, opta, optb, optc, optd } = req.body;

    // // Assuming uploadDB is a model or database connection
    // try {
    //     const newUpload = await uploadDB.create({
    //         question: question,
    //         options: [opta, optb, optc, optd],
    //         teacherID: id, // Assuming you want to associate the teacher ID
    //     });

    //     res.json({
    //         message: "Upload created successfully",
    //         newUpload,
    //     });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: "Internal Server Error" });
    // }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});








