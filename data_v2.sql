\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
	code TEXT PRIMARY KEY,
	industry TEXT NOT NULL
);

CREATE TABLE industries_companies (
	industries_code TEXT NOT NULL REFERENCES industries,
	companies_code TEXT NOT NULL REFERENCES companies,
	PRIMARY KEY(industries_code, companies_code)
);


INSERT INTO industries (code, industry)
	VALUES ('ACCT', 'accounting'),
	('IT', 'information technology'),
	('MAN', 'manufacturing'),
	('FIN', 'finance'),
	('MEDIA', 'media'),
	('FOOD', 'food production'),
	('DIST', 'distribution');


INSERT INTO industries_companies (industries_code, companies_code)
	VALUES ('IT', 'apple'),
	('MAN', 'apple'),
	('MEDIA', 'apple');


INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);
