# How to run the app

The app has **two parts** that must both be running for login to work:

1. **Backend** (Spring Boot) – runs on **port 8082**, handles auth and data.
2. **Frontend** (Next.js) – runs on **port 3000**, serves the UI and proxies `/api/auth/*` to the backend.

## Why you see 503 (Service Unavailable)

When you click **Sign In**, the frontend sends the request to itself (`http://localhost:3000/api/auth/login`).  
A Next.js API route then forwards that request to the backend at **http://127.0.0.1:8082/api/auth/login**.

- If the **backend is not running**, the connection to port 8082 fails and the frontend responds with **503** and the message *"Cannot reach backend"*.

So: **503 = backend is not running or not reachable on port 8082.**

## Step 1: Start the backend

Open a terminal in the **project root** (`office` folder, where `pom.xml` is):

```bash
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

- Wait until you see: **"Started OfficeApplication"** and **"Tomcat started on port 8082"**.
- Keep this terminal open. (Uses MySQL with database `office_db` – see `application-local.properties`.)

## Step 2: Start the frontend

Open **another** terminal, go to the frontend folder, and run:

```bash
cd frontend
npm run dev
```

- Wait until you see: **"Ready"** and **"Local: http://localhost:3000"**.

## Step 3: Open the app

1. Go to **http://localhost:3000**
2. You should be redirected to the login page.
3. Log in with **admin** / **admin123** (or register a new user).

If you still see 503, the backend is not running or not on 8082 – check the backend terminal for errors and that it says port 8082.
