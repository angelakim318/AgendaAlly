# Use the official Maven image to build the application
FROM maven:3.8.4-openjdk-11 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven Wrapper files and the .mvn directory
COPY mvnw mvnw
COPY mvnw.cmd mvnw.cmd
COPY .mvn .mvn

# Copy the pom.xml file
COPY pom.xml .

# Copy the source code
COPY src ./src

# Package the application
RUN chmod +x mvnw
RUN ./mvnw package -DskipTests

# Use the official OpenJDK image to run the application
FROM openjdk:11-jre-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged JAR file from the build stage
COPY --from=build /app/target/webapp-0.0.1-SNAPSHOT.jar ./webapp.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "webapp.jar"]
