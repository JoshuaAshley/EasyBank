# EasyBank: The Future of Banking is Here
![EasyBank Banner](https://github.com/user-attachments/assets/05f2f742-03e7-4649-b431-8beb4a24e428)

## Table of Contents

1. [Employee](#employee-login)
1. [Features](#features)
4. [Installation](#installation)
1. [Usage](#usage)
2. [Support](#support)
2. [Video Demonstration](#video-demonstartion)
3. [Figma](#figma)
4. [Authors](#authors)

## Employee Login

## Features

### Part 2 Features

- **Register**: Users can Register using their Full Name, Email, ID Number, Account Number and Password.
- **Login**: Users can Login with their Email, Account Number and Password.
- **Home Dashboard**: Users can view the status of all their Transactions.
- **Payment Information**: Users can Enter the Payment Amount, Choose Currency and Choose a Currency Provider (Swift).
- **Account Information**: Users can Enter Their Bank Account Information which includes their Account Holder Name, Bank, Account Number and Swift Code then make their Payment.

### Part 3 Features

- **Employee**: Employees can login and look at all the pending payments and approve or declined them.

## Installation

To install EasyA, follow these simple steps:

1. Open Visual Studio Code and Select Clone Repository
2. Clone the repository: https://github.com/JoshuaAshley/EasyBank.git
3. Create a BACKEND folder called `keys`
4. Generate your own BACKEND `privatekey.pem` and `certificate.pem` files to add to the folder.
5. Add a BACKEND `.env` file with the following code:
   ```
   ATLAS_URI="mongodb+srv://teamproactive255:lqISbs6eYA7QAtz8@easybank.mpud5.mongodb.net/?retryWrites=true&w=majority&appName=EasyBank"
   ```
6. In a new terminal run the following commands:
   ```
   cd BACKEND/
   npm install
   npm run dev
   ```
7. In a new terminal run the following commands:
   ```
   cd FRONTEND/client
   npm install
   npm run dev
   ```

## Usage

After installing the app,

**User Portal**
- **Sign Up**: Sign up or Log in using an Email, Account Number, Password.
- **Home Dashboard**: Once logged in you'll be greeted with your Home Dashboard showing you all previous Transactions.
- **Payment Information**: You can now enter your Payment Information with Payment Amount, Choose Currency of your choice and Choose a Currency Provider (Swift).
- **Account Information**: You can now enter your Bank Account Information which includes your Account Holder Name, Bank, Account Number and Swift Code then make your Payment.

**Employee Portal**
- **Login**: Log in using an Email, Account Number, Password.
- **Home Dashboard**: Once logged in you'll be greeted with your Home Dashboard showing you all pending Transactions you can also search for users..
- **Transaction Information**: Once you select a transaction you view all the details and choose to approve or decline their transaction.
  
## Support

For support, please email TeamProActive225@gmail.com

## Video Demonstration

[Part 3](https://youtu.be/y99lI4dydNw)

## Figma

[Figma Prototype Link](https://www.figma.com/design/eI1s7gijrcDyq7rXr9v3j5/OPSC?node-id=952-2559&t=4thINdvopTTsU1Vs-1)

## Authors

- **Fullstack** - Dane Govender - [INDWG](https://github.com/INDWG)
- **Fullstack** - Gerard Govender - [st10245621](https://github.com/st10245621)
- **Fullstack** - Keagan Thorp - [ST10038569](https://github.com/ST10038569)
- **Fullstack** - Joshua Ashley - [JoshuaAhsley](https://github.com/JoshuaAshley)
