const { prompt } = require('inquirer');
const logo = require('asciiart-logo');
require('console.table');
const db = require('./config');

init();

// Display logo text, load main prompts
function init() {
    const logoText = logo({
        name: 'Employee Tracker',
        lineChars: 10,
        padding: 2,
        margin: 3,     
        borderColor: 'green',
        logoColor: 'green'
    }).render();
    
    console.log(logoText);

    // function call to employeePromts
    employeePromts();
}

// ask promts to employees
async function employeePromts() {
  const { choice } = await prompt([
        {
            name: 'choice',
            type: 'list',
            message: 'What would you like do?',
            choices: [
                {
                    name: 'View All Employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View All Employees By Department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
                },
                {
                    name: 'View All Employees By Manager',
                    value: 'VIEW_EMPLOYEES_BY_MANAGER'
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'Update Employee Manager',
                    value: 'UPDATE_EMPLOYEE_MANAGER'
                },
                {
                    name: 'View All Role',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Remove Role',
                    value: 'REMOVE_ROLE'
                },
                {
                    name: 'View All Departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Remove Department',
                    value: 'REMOVE_DEPARTMENT'
                },
                {
                    name: 'Quit',
                    value: 'QUIT'
                }
            ]
        }
    ]);
    
    switch(choice) {

        case 'VIEW_EMPLOYEES':
            return viewEmployees();

        case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
            return viewEmployeesByDepartment();

        case 'VIEW_EMPLOYEES_BY_MANAGER':
            return viewEmployeesByManager();

        case 'ADD_EMPLOYEE':
            return addEmployee();

        case 'REMOVE_EMPLOYEE':
            return removeEmployee();

        case 'UPDATE_EMPLOYEE_ROLE':
            return updateEmployeeRole();

        case 'UPDATE_EMPLOYEE_MANAGER':
            return updateEmployeeManager();
    
        case 'VIEW_ROLES':
            return viewRoles();

        case 'ADD_ROLE':
            return addRole();

        case 'REMOVE_ROLE':
            return removeRole();

        case 'VIEW_DEPARTMENTS':
            return viewDepartments();

        case 'ADD_DEPARTMENT':
            return addDepartment();

        case 'REMOVE_DEPARTMENT':
            return removeDepartment();

        default:
            return quit();
    }
}

// function to view all the employees
async function viewEmployees() {

    const employees = await db.viewAllEmployees();

    console.log("\n");
    console.table(employees);
    employeePromts();
}

// function to view all the employees of selected department
async function viewEmployeesByDepartment() {

    const departments = await db.viewAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department would ypu like to see employees for?',
            choices: departmentChoices
        }
    ]);

    const employees = await db.viewAllEmployeesByDepartment(departmentId);
    console.log('\n');
    console.table(employees);

    employeePromts();
}

// function to view all the emplyees of selected managers
async function viewEmployeesByManager() {

    const employees = await db.viewAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which manager would you like to see employees for?',
            choices: employeeChoices
        }
    ]);
    
    const managers = await db.viewAllEmployeesByManager(employeeId);

    console.log('\n');
    console.table(managers);    
    
    employeePromts();
}

// function to add new employee
async function addEmployee() {

    const roles = await db.viewAllRoles();
    const employees = await db.viewAllEmployees();

    const employee = await prompt([
        {
            name: 'first_name',
            message: 'What is the employee\'s first name?'
        },
        {
            name: 'last_name',
            message: 'What is the employee\'s last name?'
        }
    ]);

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    
    const { roleId } = await prompt({
        type: 'list',
        name: 'roleId',
        message: 'What is the employee\'s role?',
        choices: roleChoices
    });

    employee.role_id = roleId;

    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id
    }));

    managerChoices.unshift({ name: 'None', value: null });

    const { managerId } = await prompt({
        type: 'list',
        name: 'managerId',
        message: 'Who is the employee\'s manager?',
        choices: managerChoices
    });

    employee.manager_id = managerId;

    await db.createEmployee(employee);

    console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
    );
    
    employeePromts();
}

// function to remove selected employee
async function removeEmployee() {

    const employees = await db.viewAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee would you like to delete?',
            choices: employeeChoices
        }
    ]);

    await db.removeEmployee(employeeId);

    console.log(`Removed employee successfully!`);
    
    employeePromts();
}

// function to update selected employee's role
async function updateEmployeeRole() {

    const employees = await db.viewAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id
      }));
    
      const { employeeId } = await prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Which employee\'s role do you want to update?',
          choices: employeeChoices
        }
      ]);
    
      const roles = await db.viewAllRoles();
    
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));
    
      const { roleId } = await prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Which role do you want to assign the selected employee?',
          choices: roleChoices
        }
      ]);
    
      await db.updateEmployeeRole(employeeId, roleId);
    
      console.log("Updated employee's role");    
    
    employeePromts();
}

// function to update selected employee's manager
async function updateEmployeeManager() {

    const employees = await db.viewAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee\'s manager do you want to update?',
            choices: employeeChoices
        }
    ]);

    const managers = await db.viewAllEmployees();

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: 'list',
            name: 'managerId',
            message: 'Which manager do you want to assign the selected employee?',
            choices: managerChoices
        }
    ]);

    await db.updateEmployeeManager(employeeId, managerId);

    console.log("Updated employee's manager!");    

    employeePromts();
}

// function to view all the roles
async function viewRoles() {

    const roles = await db.viewAllRoles();
    console.log('\n');
    console.table(roles);
    
    employeePromts();
}

// function to to add new role
async function addRole() {

    const departments = await db.viewAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id
    }));
  
    const role = await prompt([
      {
        name: "title",
        message: "What is the name of the role?"
      },
      {
        name: "salary",
        message: "What is the salary of the role?"
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departmentChoices
      }
    ]);
  
    await db.createRole(role);
  
    console.log(`Added ${role.title} to the database`);
  
    employeePromts();
}

// function to remove selected role
async function removeRole() {

    const roles = await db.viewAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role would you like to delete?',
            choices: roleChoices
        }
    ]);

    await db.removeRole(roleId);

    console.log(`Removed role successfully!`);

    employeePromts();
}

// function to view all the departments
async function viewDepartments() {

    const departments = await db.viewAllDepartments();
    console.log('\n');
    console.table(departments);

    employeePromts();
}

// function to add new department
async function addDepartment() {
  
    const department = await prompt([
      {
        name: 'name',
        message: 'What is the name of the department?'
      }
    ]);
  
    await db.createDepartment(department);
  
    console.log(`Added ${department.name} to the database`);

    employeePromts();
}

// function to remove selected department
async function removeDepartment() {

    const departments = await db.viewAllDepartments();

    const departmentsChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department would you like to delete?',
            choices: departmentsChoices
        }
    ]);

    await db.removeDepartment(departmentId);

    console.log(`Removed department successfully!`);

    employeePromts();
}

// function to quit the prompts
function quit() {
    console.log("Goodbye!");
    process.exit();
}