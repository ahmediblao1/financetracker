# Sales Tracking Application

This is a full-stack sales tracking application built with React, Node.js, and PostgreSQL.

## Running the Application Locally

To run the application locally, you will need to have Node.js and PostgreSQL installed on your machine.

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
```

### 2. Install Dependencies

Install the dependencies for the client and server:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set Up the Database

You will need to create a PostgreSQL database for the application. You can use the following command to create a database:

```bash
createdb sales-tracking
```

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
```

Replace `<user>`, `<password>`, `<host>`, `<port>`, and `<database>` with your PostgreSQL connection details.

### 5. Run the Application

You can run the application with the following command:

```bash
# Run the server
cd server
npm run dev

# Run the client
cd ../client
npm run dev
```

The application will be available at `http://localhost:3000`.
