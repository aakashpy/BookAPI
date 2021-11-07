const Router = require("express").Router();
const AuthorModel = require("../schema/author");
const BookModel = require("../schema/book");

// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

// Route    - /author/:auth
// Des      - to get specific author
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/author/:auth",async (req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({
        id: req.params.auth,
    });

    if (!getSpecificAuthor) {
        return res.json({
            error: `No author found ${req.params.auth}`,
        });
    }

    return res.json({ authors: getSpecificAuthor });
});

// Route    - /author/b/:book
// Des      - to get a list of authors based on book
// Access   - Public
// Method   - GET
// Params   - book
// Body     - none
Router.get("/author/b/:book", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.find({
        books: req.params.book,
    });

    if (!getSpecificAuthors) {
        return res.json({
            error: `No authors found for the book  ${req.params.book}`,
        });
    }

    return res.json({ authors: getSpecificAuthors });
});


// Route     /author/new
// Description add new author
// Access PUBLIC
// Parameters NONE
// METHOD POST
Router.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: "Author added to the database" });
});

// Route       /author/updateBook/:id
// Description update/add new book
// Access      Public
// Paramteters isbn
// Method      put

Router.put("/book/updateAuthor/:id", async (req, res) => {
    const { newBook } = req.body;
    const { id } = req.params;

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: id,
        },
        {
            $addToSet: {
                books: newBook,
            },
        },
        {
            new: true,
        }
    );

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: newBook,
        },
        {
            $addToSet: {
                authors: id,
            },
        },
        {
            new: true,
        }
    );

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added into the database",
    });
});

//TODO: Studen Task
// Route       /author/updateName
// Description Update name of the author
// Access      Public
// Parameters  id
// Method      Put
// Params in the req.body are always in string format
Router.put("/author/updateName/:id", async (req, res) => {
    const { name } = req.body.name;

    const updateName = await AuthorModel.findOneAndUpdate(
        {
            id: req.params.id,
        },
        {
            name:name,
        },
        {
            new: true,
        }
    );

    return res.json({ author: updateName });
});

//TODO: Student Task
/*
Route               /author/delete
Description         delete an author
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/author/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredAuthors = Database.Author.filter(
        (author) => author.id !== parseInt(id)
    );

    Database.Author = filteredAuthors;

    return res.json(Database.Author);
});

module.exports = Router;
