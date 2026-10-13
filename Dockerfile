# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY demo-frontend/package*.json ./
RUN npm install
COPY demo-frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot backend with React static assets embedded
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY demo/pom.xml .
COPY demo/src ./src

# Copy built React files directly into Spring Boot's static resources folder
COPY --from=frontend-build /frontend/dist/ ./src/main/resources/static/

# Package Spring Boot into a single runnable JAR containing both UI & API
RUN mvn clean package -DskipTests

# Stage 3: Run the combined application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 5000
ENV PORT=5000

ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT} app.jar"]
