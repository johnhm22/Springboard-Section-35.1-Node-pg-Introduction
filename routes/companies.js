const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


router.get('/', async function getAllCompanies(req, res, next){
    try{
        const results = await db.query(
        `SELECT * FROM companies`);
    return res.json({ companies: results.rows });
    } catch(err) {
    return next(err);
    }
});


router.get('/:code', async function getCompany(req, res, next){
    try{
        const {code} = req.params;
        const results = await db.query(
        'SELECT * FROM companies WHERE code=$1', [code]);
        if(results.rows.length === 0){
            throw new ExpressError(`Company with code ${code} could not be found`, 404);
        }
    return res.json({ company: results.rows[0] });
    } catch(err) {
    return next(err);
    }
});



router.post('/', async function addCompany(req, res, next){
    console.log("In the POST route");
    try{
        const { code, name, description } = req.body;
        console.log("Here is the req.body", req.body);
        const results = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
    return res.status(201).json({ company: results.rows[0] });
    } catch(err) {
    return next(err);
    }
});

// to be pasted into insomnia when testing
// {
// 	"code": "Banana",
// 	"name": "Banana Inc",
// 	"description": "High tech bananas"
// }

router.put('/:code', async function updateCompany(req, res, next){
    try{
        const { code } = req.params;
        console.log("Code is: ", code);
        const { name, description } = req.body;
        console.log(req.body);
        const results = await db.query(
        'UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code]);
        if(results.rows.length === 0){
            throw new ExpressError(`Company with code ${code} could not be found`, 404);
        }
    return res.status(200).json({ company: results.rows[0] });
    } catch(err) {
    return next(err);
    }
});


// {
//     "code": "apple",
//     "name": "Banana Computer",
//     "description": "Maker of yellow fruit."
//   },


router.delete('/:code', async function deleteCompany(req, res, next){
    try{
        const results = await db.query(
        "DELETE FROM companies WHERE code = $1", [req.params.code]);
        // if(results.rows.length === 0){
        //     throw new ExpressError(`Company with id ${code} could not be found`, 404);
        // }
    return res.send({status: "DELETED!"});
    } catch(err) {
    return next(err);
    }
});






module.exports = router;