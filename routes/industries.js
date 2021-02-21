const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");



router.get('/', async function showAllIndustries(req, res, next){
    try{
        const results = await db.query(
        `SELECT * FROM industries`);
    return res.json({ indusries: results.rows });
    } catch(err) {
    return next(err);
    }
});



router.post('/', async function addIndustry(req, res, next){
    console.log("In the POST route");
    try{
        const { code, industry } = req.body;
        console.log("Here is the req.body", req.body);
        const results = await db.query(
        `INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]);
    return res.status(201).json({ industry: results.rows[0] });
    } catch(err) {
    return next(err);
    }
});

// {
//     "code": "TELCO",
//     "industry": "Telecommunications"
// }

router.post('/companies', async function addIndustry(req, res, next){
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