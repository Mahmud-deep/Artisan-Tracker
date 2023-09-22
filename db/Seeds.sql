USE employee_db;

INSERT INTO department (name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Lead", 65000, 1),
("Sales Manager", 100000, 1),
("Software Engineer", 125000, 2),
("Egnineering Manager", 175000, 2),
("Accountant", 130000, 3),
("Paralegal", 50000, 4),
("Lawyer", 250000, 4),
("President", 375000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("George", "Washington", 1, 2),
("John", "Addams", 2, 10),
("Thomas", "Jefferson", 3, 5),
("James", "Madison", 3, 5),
("James", "Monroe", 4, 10),
("Andrew", "Jackson", 5, 10),
("Martin", "Van Buren", 6, 9),
("William", "Harrison", 6, 9),
("John", "Tyler", 7, 10),
("Theodore", "Roosevelt", 8, 10);
