# Document Management API

A REST API for managing documents and folders with features like hierarchical organization, search capabilities, and Firebase authentication.

## Features

- 🔐 Firebase Authentication
- 📁 Hierarchical folder structure
- 📄 Document management with file type validation
- 🔍 Full-text search using Elasticsearch
- 🗑️ Soft delete functionality
- 📊 File type detection and validation
- 🔄 Real-time synchronization with Elasticsearch

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Search Engine**: Elasticsearch
- **Authentication**: Firebase
- **Testing**: Jest with Supertest
- **Development**: ts-node-dev for hot reloading

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Elasticsearch
- Firebase project credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
ALLOWED_ORIGINS=

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Elasticsearch
ELASTICSEARCH_HOST="http://localhost:9200"

# Firebase
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="your-client-email"

# Server
PORT=3000
NODE_ENV=development
```

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/terftw/doc-management>
cd packages/document-management-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up Docker containers

Note: you can choose to use Postgres as your database of choice. The application works on Postgres as well

### MySQL Database

Run the following command to create and start a MySQL container:

```bash
docker run \
  --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=your_root_password \
  -e MYSQL_DATABASE=your_db_name \
  -e MYSQL_USER=your_user \
  -e MYSQL_PASSWORD=your_password \
  -p 3306:3306 \
  -d mysql:latest
```

Once the container is running, you need to grant additional privileges for Prisma Migrate:

```bash
# Connect to the MySQL container
docker exec -it mysql-container mysql -uroot -pyour_root_password

# Inside the MySQL prompt, grant additional privileges
mysql> GRANT ALL PRIVILEGES ON *.* TO 'your_user'@'%' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
mysql> EXIT;
```

Update your `.env` file with the MySQL connection details:

```
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_db_name
```

### Elasticsearch

Run the following command to create and start an Elasticsearch 7.17.0 container:

```bash
docker run \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -d elasticsearch:7.17.0
```

Update your `.env` file with the Elasticsearch connection:

```
ELASTICSEARCH_HOST=http://localhost:9200
```

Verify Elasticsearch is running:

```bash
curl http://localhost:9200
```

### Checking Container Status

List all running containers:

```bash
docker ps
```

To stop containers:

```bash
docker stop mysql-container elasticsearch
```

To start containers:

```bash
docker start mysql-container elasticsearch
```

4. Obtain your Firebase admin credentials

Note: Ask Terence for the credentials if you don't want to make one (strongly discouraged)

To authenticate your application with Firebase services, you'll need to set up Firebase Admin SDK credentials. Follow these steps:

### Generate a new Firebase service account

1. Go to the [Firebase Console](https://console.firebase.google.com/) and select your project
2. Navigate to **Project settings** (gear icon in the top left) > **Service accounts** tab
3. Click **Generate new private key** button
4. Save the JSON file securely - it contains sensitive credentials that should not be shared or committed to version control

### Extract credentials for environment variables

Open the downloaded JSON file. It will look similar to this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id-here",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYour long private key here...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "client-id-here",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

### Update your .env file

Add the following environment variables to your `.env` file:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour long private key here...\n-----END PRIVATE KEY-----\n"
```

Important notes:

- The `FIREBASE_PRIVATE_KEY` must include the quotes `"` around the entire key
- Do not modify the newline characters (`\n`) in the private key
- Never commit the `.env` file or the service account JSON file to version control
- For production deployment, use secure environment variable management appropriate for your hosting platform

### Verify credentials setup

You can verify that your credentials are correctly set up by running the initialization script:

```bash
npm run verify-firebase
```

If the connection is successful, you'll see a confirmation message that your application can authenticate with Firebase. 5. Set up the database:

```bash
# First, create the database tables
npx prisma migrate dev

# Then, seed the database with initial data
npx prisma db seed
```

## Development

Start the development server with hot reloading:

```bash
npm run dev
```

## Production

Build and start the production server:

```bash
npm run build
npm run start
```

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

```
src/
├── features/         # Feature modules
│   ├── auth/         # Authentication
│   ├── document/     # Document management
│   └── folder/       # Folder management
│   └── fsentry/      # File System management
│   └── user/         # User management
├── shared/           # Shared utilities
│   ├── db/           # Database configuration
│   ├── errors/       # Custom error classes
│   ├── middleware/   # Express middleware
│   ├── plugins/      # Third-party integrations
│   └── utils/        # Utility functions
└── server.ts         # Application entry point
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Developer Contexts / Side notes

1. Sometimes when we boot up the app via `npm run dev`, you might have to press Enter in the terminal to refresh
2. The "indexing every initial application bootup" decision is made to speed up development.
   a. In the production environment, we should write a cron-job to do the indexing once everyday
   b. You should not deploy this application and deem it production ready if this is not resolved
