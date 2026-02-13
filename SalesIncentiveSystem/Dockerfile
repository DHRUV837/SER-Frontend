FROM gradle:8.5-jdk21 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
# Ensure gradlew has execute permissions
RUN chmod +x gradlew
RUN ./gradlew build --no-daemon -x test

FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
