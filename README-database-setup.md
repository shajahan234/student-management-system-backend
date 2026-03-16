# Database Configuration Setup

This project now supports separate database configurations for local development and production environments.

## Configuration Overview

### Production Environment (Default)
- **Database**: PostgreSQL
- **Profile**: `prod` (default)
- **Configuration**: `application-prod.properties`

### Local Development Environment
- **Database**: MySQL
- **Profile**: `local`
- **Configuration**: `application-local.properties`

## How to Use

### For Local Development with MySQL

1. **Set up MySQL locally**:
   - Install MySQL on your machine
   - Create a database named `student_management`
   - Create a user with appropriate permissions

2. **Update MySQL credentials** in `src/main/resources/application-local.properties`:
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. **Run the application with local profile**:
   ```bash
   # Option 1: Using JVM argument
   java -jar -Dspring.profiles.active=local your-app.jar
   
   # Option 2: Using environment variable
   export SPRING_PROFILES_ACTIVE=local
   java -jar your-app.jar
   
   # Option 3: Using Maven
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   
   # Option 4: Using Gradle
   ./gradlew bootRun --args='--spring.profiles.active=local'
   ```

### For Production with PostgreSQL

The application will automatically use PostgreSQL configuration when:
- No profile is specified (defaults to `prod`)
- Running on Render or other production environments
- The `SPRING_PROFILES_ACTIVE` environment variable is not set to `local`

## Database Dependencies

The project includes drivers for both databases:
- **PostgreSQL**: `org.postgresql:postgresql`
- **MySQL**: `com.mysql:mysql-connector-j`

## Notes

- The H2 database dependency is included for testing purposes
- Local development configuration includes H2 console access at `/h2-console`
- Production configuration uses `validate` for Hibernate DDL to prevent schema changes
- Local development uses `update` for Hibernate DDL to allow automatic schema updates during development