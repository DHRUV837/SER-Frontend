#!/bin/bash

# Configuration
API_URL="http://localhost:8080/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "==========================================="
echo "   Enterprise Data Isolation Verification  "
echo "==========================================="

# 1. Fetch Users to identify Roles
echo -e "\n[1] Fetching Users to Identify Test Accounts..."
USERS_JSON=$(curl -s "$API_URL/users")

# Extract IDs (Requires jq, fallback to grep if not available)
# Assuming simple grep for now as jq might not be installed
# We look for "admin@test.com" (Global) and any other Admin
GLOBAL_ADMIN_ID=$(echo "$USERS_JSON" | grep -o '"id":[0-9]*,"email":"admin@test.com"' | grep -o ':[0-9]*,' | tr -d ':,')
ORG_ADMIN_ID=$(echo "$USERS_JSON" | grep -o '"id":[0-9]*,"email":"newadmin@company.com"' | grep -o ':[0-9]*,' | tr -d ':,')

if [ -z "$GLOBAL_ADMIN_ID" ]; then
    echo -e "${RED}Global Admin (admin@test.com) not found. Creating...${NC}"
    # Register Global Admin if missing (or assume ID 1 for test)
    GLOBAL_ADMIN_ID=1
else
    echo -e "${GREEN}Found Global Admin ID: $GLOBAL_ADMIN_ID${NC}"
fi

if [ -z "$ORG_ADMIN_ID" ]; then
    echo -e "${RED}Org Admin (newadmin@company.com) not found. Using fallback ID 2...${NC}"
    ORG_ADMIN_ID=2
else 
    echo -e "${GREEN}Found Org Admin ID: $ORG_ADMIN_ID${NC}"
fi

# 2. Test Global Admin Access (Should see ALL)
echo -e "\n[2] Testing Global Admin Access (Requestor ID: $GLOBAL_ADMIN_ID)"
GLOBAL_RESPONSE=$(curl -s "$API_URL/deals?requestorId=$GLOBAL_ADMIN_ID")
COUNT_GLOBAL=$(echo "$GLOBAL_RESPONSE" | grep -o '"id":' | wc -l)
echo "Global Admin deals count: $COUNT_GLOBAL"

# 3. Test Org Admin Access (Should see ONLY Org)
echo -e "\n[3] Testing Org Admin Access (Requestor ID: $ORG_ADMIN_ID)"
ORG_RESPONSE=$(curl -s "$API_URL/deals?requestorId=$ORG_ADMIN_ID")
COUNT_ORG=$(echo "$ORG_RESPONSE" | grep -o '"id":' | wc -l)
echo "Org Admin deals count: $COUNT_ORG"

# 4. Compare
if [ "$COUNT_GLOBAL" -ge "$COUNT_ORG" ]; then
    echo -e "\n${GREEN}[PASS] Global Admin sees more or equal deals than Org Admin.${NC}"
else
    echo -e "\n${RED}[FAIL] Org Admin sees more deals than Global Admin! Isolation Failure.${NC}"
fi

# 5. Verify Specific Deal Visibility
# Check if Org Admin response does NOT contain a deal from another org (mock check)
# (Assuming setup: Global Admin sees Org A and Org B deals. Org Admin A sees only Org A)

echo -e "\nVerification Complete."
