const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");
const Employee = require("./lib/Employee");



// array to pass in all employee objects.
const membersInfoArray = []; 

// manager prompt ==================================================
const addNewManager = () => {
    return inquirer.prompt ([
        {
            type: 'input',
            name: 'name',
            message: "Who is the manager's team?",
            
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the manager's ID.",
            
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the manager's email.",
           
        },
        {
            type: 'input',
            name: 'officeNumber',
            message: "Please enter the manager's office number",
           
        },
       
    ])
    .then(managerInput => {
        
        const manager = new Manager(
          managerInput.name,
          managerInput.id,
          managerInput.email,
          managerInput.officeNumber
        );
         
        membersInfoArray.push(manager); 
        console.log(manager); 
    })
};

// employee prompt ==================================================
const addNewEmployee = () => {
   
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'role',
            message: "what is your employee's role?",
            choices: ['Engineer', 'Intern']
        },
        {
            type: 'input',
            name: 'name',
            message: "What is the name of the employee?", 
            
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the employee's ID.",
            
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the employee's email.",
           
        },
        
      //  inquirer's when method, can work as a Boolean and should return true or false.
        {
          when: input => {
              return input.role === "Engineer"
          },
          type: "input",
          name: "github",
          message: "Pleas enter your github username:",
        },
        {
          when: input => {
              return input.role === "Intern"
          },
          type: "input",
          name: "school",
          message: "What's the school you enrolled in ?",
        },

      // confirmation question
        {
            type: 'confirm',
            name: 'EmployeeConfirmation',
            message: 'Would you like to add more team members?',
            default: false
        }
    ])
    .then(employeeData => {
         
        // employee data needed to make new object for engineer and intern. 
         const name = employeeData.name;
         const id = employeeData.id;
         const email = employeeData.email;
         const role = employeeData.role;
         const github = employeeData.github;
         const school = employeeData.school;
         const EmployeeConfirmation = employeeData.EmployeeConfirmation;


       // new method can generate new object 
        if (role === "Engineer") {

          const engineer = new Engineer (name, id, email, github);
          membersInfoArray.push(engineer);  
            console.log(engineer);

        } else if (role === "Intern") {

          const intern = new Intern (name, id, email, school);
            membersInfoArray.push(intern); 
            console.log(intern);
        }

       
      // confirmation generator
        if (EmployeeConfirmation) {
            return addNewEmployee(membersInfoArray); 
        } else {
            return membersInfoArray;
        }
    })

};


// function to generate new team and store it into an html file.
function generateTeam () {
 
  fs.writeFileSync(
    "./output/team.html", 
    render(membersInfoArray), 
  );
  console.log("Your team profile has been generated :)");
}



  addNewManager()

  .then(addNewEmployee)

  .then(membersInfoArray => {
    return render(membersInfoArray);
  })
 
  .then(team => {
    return generateTeam(team);
  })

        





