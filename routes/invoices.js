const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


router.get('/', async function getAllInvoices(req, res, next){
    try{
        const results = await db.query(
        `SELECT * FROM invoices`);
    return res.json({ invoices: results.rows });
    } catch(err) {
    return next(err);
    }
})


router.get('/:id', async function getCompany(req, res, next){
    try{
        const {id} = req.params;
        const results = await db.query(
        'SELECT * FROM invoices WHERE id=$1', [id]);
    return res.json({ invoice: results.rows[0] });
    } catch(err) {
    return next(err);
    }
})


router.post('/', async function addInvoice(req, res, next){
    try{
        const { name, description } = req.body;
        console.log(req.body);
        const results = await db.query(
        'INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt, paid, add_date, paid_date]);
    return res.status(201).json({ invoice: results.rows[0] });
    } catch(err) {
    return next(err);
    }
})

// {
//     "comp_code": "Acorn",
//     "amt": 2000,
//     "paid": true,
//     "add_date": "2021-02-18T00:00:00.000Z",
//     "paid_date": "018-01-01T00:00:00.000Z"
// }



router.patch('/:id', async function updateInvoice(req, res, next){
    try{
        const { id } = req.params;
        const { comp_code, amt, paid, add_date, paid_date } = req.body;
        const results = await db.query(
        'UPDATE companies SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5 WHERE id=$6 RETURNING comp_code, amt, paid, add_date, paid_date', [comp_code, amt, paid, add_date, paid_date]);
        if(!id){
            throw new ExpressError(`Invoice with id ${id} could not be found`, 404);
        }
    return res.status(200).json({ invoice: results.rows[0] });
    } catch(err) {
    return next(err);
    }
})

router.delete('/:id', async function deleteInvoice(req, res, next){
    try{
        const { id } = req.params;
        const results = await db.query(
        'DELETE invoices WHERE id=$1', [id]);
        if(!id){
            throw new ExpressError(`Invoice with id ${id} could not be found`, 404);
        }
    return res.send({status: "DELETED!"});
    } catch(err) {
    return next(err);
    }
})


router.get('/companies/:code', async function getCompanyAndInvoices(req, res, next){
    try{
        const {code} = req.params;
        const results = await db.query(
        'SELECT * FROM invoices JOIN companies ON invoices.comp_code = companies.code WHERE companies.code = $1', [code]);
        if(results.rows.length === 0){
            throw new ExpressError(`Company with id ${code} could not be found`, 404);
        }
    return res.json({ company: {code, name, description, invoices: [{id, comp_code, amt, paid, add_date, paid_date}]} });
    } catch(err) {
    return next(err);
    }
});



module.exports = router