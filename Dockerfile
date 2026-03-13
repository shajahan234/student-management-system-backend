# Use multi-stage build to keep the final image small
# Stage 1: Build the project using Maven Wrapper
FROM eclipse-temurin:17-jdk AS build

# Set working directory
WORKDIR /app

# Copy Maven wrapper and settings
COPY mvnw .
COPY .mvn ./.mvn

# Copy pom.xml and download dependencies (cache layer)
COPY pom.xml .
RUN chmod +x mvnw \
    && ./mvnw -q -B -ntp dependency:go-offline

# Copy the full project and build
COPY . .
RUN ./mvnw -q -B -ntp clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar ./app.jar

# Expose port expected by the application
EXPOSE 8080

# Set the default command to run the JAR
ENTRYPOINT ["java", "-jar", "./app.jar"]
