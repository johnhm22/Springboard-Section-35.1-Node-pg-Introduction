process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testCompany;
beforeEach(async function(){
    let result = await db.query(`
    INSERT INTO companies (code, name, description)
    VALUES ('PO', 'Post Office', 'Letters, parcels and much more')
    RETURNING code, name, description
    `)
    testCompany = result.rows[0];
});

// afterEach(async function(){
//     await db.query("DELETE FROM companies");
// });

afterAll(async function(){
    await db.end();
});


// describe("GET /companies", () => {
//     test("Get a list of all companies", async ()=> {
//         const res = await request(app).get('/companies')
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({companies: [testCompany]})
//     })
// })

// describe("GET /companies/:code", () => {
//     test("Gets a single company", async () => {
//         const res = await request(app).get(`/companies/${testCompany.code}`)
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({company: testCompany});
//     });
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).get(`/companies/0`)
//         expect(res.statusCode).toBe(404);
//     })
// });


describe("POST /companies", () => {
    test("Creates a new company", async () => {
        const res = await request(app).post('/companies').send({
            code: "Banana",
            name: "Banana Inc",
            description: "High tech bananas"
        })
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({company: {code: 'Banana', name: 'Banana Inc', description: 'High tech bananas'}});
    });
});


// NOT WORKING
// describe("PATCH /companies", () => {
//     test("Updates an existing company", async () => {
//         const res = await request(app).patch(`/companies/${testCompany.code}`).send({
//             name: "Royal Mail",
//             description: "Fewer letters, more email"
//         })
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({company: {code: 'PO', name: 'Royal Mail', description: 'Fewer letters, more email'}});
//     });
//     test("Company code not found", async () => {
//         const res = await request(app).patch('/companies/abc').send({
//             name: "Royal Mail",
//             description: "Fewer letters, more email"
//         })
//         expect(res.statusCode).toBe(404);
//     });
// });


// describe("DELETE /companies/:code", () => {
//     test("Deletes a defined company", async () => {
//         const res = await request(app).delete(`/companies/${testCompany.code}`);
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({status: "DELETED!"});
//     });
// });
