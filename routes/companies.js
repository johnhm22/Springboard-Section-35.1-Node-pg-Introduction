const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
const slugify = require('slugify');


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
'SELECT c.name, c.description, i.industry FROM companies AS c JOIN industries_companies AS ic ON c.code = ic.companies_code JOIN industries AS i ON i.code = ic.industries_code WHERE c.code=$1', [code]);
        // 'SELECT * FROM companies WHERE code=$1', [code]);
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
        console.log(code);
        console.log(name);
        console.log(description);
        // if(!name || !description){
        //     throw new ExpressError("Missing required data", 400);
        // }
        console.log("Here is the req.body", req.body);
        // const code = slugify(name, {
        //     strict: true,
        //     lower: true,
        //     locale: 'en'
        // });
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



router.post('/industries', async function addIndustry(req, res, next){
    console.log("In the POST route");
    try{
        const { industries_code, companies_code } = req.body;
        console.log("Here is the req.body", req.body);
        const results = await db.query(
        `INSERT INTO industries_companies (industries_code, companies_code) VALUES ($1, $2) RETURNING industries_code, companies_code`, [industries_code, companies_code]);
    return res.status(201).json({ industry_company: results.rows[0] });
    } catch(err) {
    return next(err);
    }
});

// {
//     "industries_code": "ACCT",
//     "companies_code": "Acorn"
// }


module.exports = router;