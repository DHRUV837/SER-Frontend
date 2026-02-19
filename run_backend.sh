#!/bin/bash
# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run Spring Boot with Local H2 Profile
cd SalesIncentiveSystem
./gradlew bootRun --args='--spring.profiles.active=local'
