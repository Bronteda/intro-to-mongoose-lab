const prompt = require('prompt-sync')();
//initializing dotenv
const dotenv = require('dotenv');
dotenv.config();
//import
const Customer = require("./models/customer");
const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const createCustomer = async () => {
    const name = prompt("Name of the customer: ");
    const age = prompt("how old is the customer: ");

    const customerData = await Customer.create({
        name: name,
        age: age,
    });

    console.log("New Customer: ", customerData);
};

const viewCustomers = async () => {

    const customers = await Customer.find({});

    if (customers.length === 0) {
        console.log("No customers found.");
        return;
    }

    console.log("📋 Customers:");
    customers.forEach((c, i) => {
        console.log(`${i + 1}. ID: ${c._id} | Name: ${c.name}, Age: ${c.age}`);
    });

};

const updateCustomer = async () => {
    await viewCustomers();

    const id = prompt("Copy and paste the id of the customer you would like to update here: ")
    const name = prompt("Name of the customer: ");
    const age = prompt("how old is the customer: ");

    const newCustomer = await Customer.findById(id);

    if (!newCustomer) {
        console.log("Customer not found.");
        return;
    }

    newCustomer.name = name;
    newCustomer.age = age;

    await newCustomer.save();

    console.log("Updated Customer: ", newCustomer);
};

const deleteCustomer = async () => {

    await viewCustomers();
    const id = prompt("Copy and paste the id of the customer you would like to delete here: ");
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (deletedCustomer) {
        console.log("Deleted Customer:", deletedCustomer);
    } else {
        console.log("Customer not found.");
    }
};


const main = async () => {
    await connect();

    let keepGoing = true;
    while (keepGoing) {
        console.log("Welcome to the CRM\n");

        console.log("What would you like to do?\n");
        console.log("  1. Create a customer");
        console.log("  2. View all customers");
        console.log("  3. Update a customer");
        console.log("  4. Delete a customer");
        console.log("  5. Quit\n");

        const choice = prompt("Number of action to run: ");

        switch (choice) {
            case '1':
                console.log("You chose to create a customer.");
                await createCustomer();
                break;
            case '2':
                console.log("You chose to view all customers.");
                console.log("Following Customers Exist in your DB: ")
                await viewCustomers();
                break;
            case '3':
                console.log("Choose a customer to update.");
                await updateCustomer();
                break;
            case '4':
                console.log("Choose a customer to delete.");
                await deleteCustomer();
                break;
            case '5':
                console.log("Goodbye!");
                keepGoing = false;
                break;
            default:
                console.log("Invalid choice.");
        };

    }
    // Disconnect our app from MongoDB after our queries run.
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    // Close our app, bringing us back to the command line.
    process.exit();

};

main();