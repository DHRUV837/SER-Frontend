#!/bin/bash
# Restore deals for users 4, 9, 13, 14, 15

create_deal() {
  USER_ID=$1
  echo "Creating deal for User $USER_ID..."
  curl -X POST "http://localhost:8080/admin/deals" \
       -H "Content-Type: application/json" \
       -d "{
         \"dealName\": \"Restored Deal for User $USER_ID\",
         \"organizationName\": \"Org $USER_ID Corp\",
         \"clientName\": \"Client of User $USER_ID\",
         \"amount\": $((150000 + USER_ID * 1000)),
         \"assignedUserId\": $USER_ID,
         \"expectedCloseDate\": \"2026-12-31\",
         \"priority\": \"HIGH\",
         \"dealType\": \"NEW\",
         \"industry\": \"Technology\",
         \"region\": \"APAC\",
         \"currency\": \"₹\",
         \"createdBy\": 1,
         \"dealNotes\": \"Automatically restored deal.\"
       }"
  echo ""
}

create_deal 4
create_deal 9
create_deal 13
create_deal 14
create_deal 15
