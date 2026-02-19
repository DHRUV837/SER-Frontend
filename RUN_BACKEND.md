# Run Backend Locally with Environment Variables

## Prerequisites
- Maven
- Java 17+
- MySQL (Running)

## Setup
1. Copy `.env.example` to `.env`
2. Update `.env` with your local credentials

## Running
Use the helper script:
```bash
./run_backend.sh
```

Or manually:
```bash
export $(grep -v '^#' .env | xargs)
cd SalesIncentiveSystem
./gradlew bootRun
```
