const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

//POST
//Add Contact List
router.route('/add').post( async (req,res) => {
    const id = uuidv4(); 
    const {name, phone_number, email} = req.body; 

    try {
        const request = new db.Request();
        const query = `
            INSERT INTO Contacts (id, name, phone_number, email)
            VALUES (@id, @name, @phone_number, @email);
        `;
        
        request.input('id', db.NVarChar, id);
        request.input('name', db.NVarChar, name);
        request.input('phone_number', db.NVarChar, phone_number);
        request.input('email', db.NVarChar, email);

        await request.query(query);

        res.status(201).send({message: "Contact Added Successfully", success: true, id})

    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Failed to add contact"});
    }
})

//GET
//Read Contact List
router.route('/list').get(async(req,res) => {
    try {
        const request = new db.Request();

        const query = `
            SELECT * FROM Contacts;
        `;

        const result = await request.query(query);
        
        //use recordset because expecting a single result set
        //if use the recordsets, we're expecting a multiple result sets
        res.send(JSON.stringify(result.recordset));

    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Failed to read list contact"});
    }
})

//UPDATE
//Update List Contact
router.route('/update/:id').patch(async (req, res) => {
    const { id } = req.params;
    const { name, phone_number, email } = req.body;

    try {
        const request = new db.Request();

        // Query to fetch the existing contact
        const existingContactQuery = `
            SELECT *
            FROM Contacts
            WHERE id = @id;
        `;

        // Fetch the existing contact
        const existingContactResult = await request
            .input('id', db.NVarChar, id)
            .query(existingContactQuery);

        if (existingContactResult.recordset.length === 0) {
            return res.status(404).send({ error: "Contact not found" });
        }

        const existingContact = existingContactResult.recordset[0];

        // Prepare the update query
        const updateQuery = `
            UPDATE Contacts
            SET 
                name = @name,
                phone_number = @phone_number,
                email = @email
            WHERE id = @id;
        `;

        // Update the contact with either the provided values or the existing values
        const updateRequest = new db.Request()
            .input('id', db.NVarChar, id)
            .input('name', db.NVarChar, name || existingContact.name)
            .input('phone_number', db.NVarChar, phone_number || existingContact.phone_number)
            .input('email', db.NVarChar, email || existingContact.email);

        await updateRequest.query(updateQuery);

        res.status(200).send({ message: "Contact Updated Successfully", success: true });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to update contact" });
    }   
});


//DELETE 
//Delete List Contact
router.route('/remove/:id').delete(async (req, res) => {

    const { id } = req.params;

    try {
        const request = new db.Request();
        
        const query = `
            DELETE FROM Contacts WHERE id = @id;
        `;

        const result = await request.input('id', db.NVarChar, id).query(query);

        if(result.rowsAffected[0] === 0) {
            return res.status(404).send({error : "Contact not found"});
        }

        res.status(200).send({ message: "Contact Deleted Successfully", success: true })

    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Failed to delete list contact"});
    }
})

router.route('/').get((req, res) => { 
  res.send('Hello, Azure! This is a Node.js application.'); 
}); 

module.exports = router