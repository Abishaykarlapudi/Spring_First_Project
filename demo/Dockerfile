FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render sets $PORT dynamically)
EXPOSE 5000

ENV PORT=5000

# Start Spring Boot
ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT} app.jar"]
