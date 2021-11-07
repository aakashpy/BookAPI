const Router = require("express").Router();
const PublicationModel = require("../schema/publication");
const BookModel = require("../schema/book");

//TODO: Student Task
/*
Route           /publication
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/Router.get("/publication", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

// Route    - /publication/:id
// Des      - To get a publication based on id
// Access   - Public
// Method   - GET
// Params   - id
// Body     - none
Router.get("/publication/:id", async (req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({
        id: req.params.id,
    });

    if (!getSpecificPublication) {
        return res.json({
            error: `No publication found for the id of ${req.params.id}`,
        });
    }

    return res.json({ publication: getSpecificPublication });
});

// Route    - /publication/p/:book
// Des      - to get a list of publications based on book
// Access   - Public
// Method   - GET
// Params   - book
// Body     - none
Router.get("/publication/p/:book", async (req, res) => {
    const getSpecificPublications = await PublicationModel.find({
        books: req.params.book,
    });

    if (!getSpecificPublications) {
        return res.json({
            error: `No publication found for the book of ${req.params.book}`,
        });
    }

    return res.json({ publications: getSpecificPublications });
});

// Route       /publication/new
// Description add new book
// Access      PUBLIC
// Parameters  NONE
// Method      POST
Router.post("/publication/new", async (req, res) => {
    try {
        const { newPublication } = req.body;

        await PublicationModel.create(newPublication);
        return res.json({ message: "Publication added to the database" });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

// Route       /publication/updateBook/:id
// Description update/add new book
// Access      Public
// Paramteters isbn
// Method      put

Router.put("/publication/updatePublication/:id", async (req, res) => {
    const { newBook } = req.body;
    const { id } = req.params;

    const updatedPublication = await PublicationModel.findOneAndUpdate(
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
        authors: updatedPublication,
        message: "New Publication was added into the database",
    });
});

//TODO: Studen Task
// Route       /author/updateName
// Description Update name of the author
// Access      Public
// Parameters  id
// Method      Put
// Params in the req.body are always in string format
Router.put("/publication/updateName/:id", async (req, res) => {
    const { name } = req.body.name;

    const updateName = await PublicationModel.findOneAndUpdate(
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

    return res.json({ publication: updateName });
});

//TODO: Student Task
/*
Route               /publication/delete
Description         delete an publication
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/publication/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredPub = Database.Publication.filter(
        (pub) => pub.id !== parseInt(id)
    );

    Database.Publication = filteredPub;

    return res.json(Database.Publication);
});

//TODO: Student Task
/*
Route               /publication/delete/book
Description         delete an book from a publication
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
Router.delete("/publication/delete/book/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            book.publication = 0;
            return book;
        }
        return book;
    });

    Database.Publication.forEach((publication) => {
        if (publication.id === parseInt(id)) {
            const filteredBooks = publication.books.filter(
                (book) => book !== isbn
            );
            publication.books = filteredBooks;
            return publication;
        }
        return publication;
    });

    return res.json({ book: Database.Book, publication: Database.Publication });
});

module.exports = Router;
