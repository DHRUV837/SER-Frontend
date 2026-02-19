#!/bin/bash

# Delete all test users and keep only real salesmen
# KEEP: IDs 3, 4, 7, 9, 13, 14, 15
# DELETE: Everything else except ID 1 (admin@test.com - main admin)

# Users to DELETE (all except 1, 3, 4, 7, 9, 13, 14, 15)
DELETE_IDS=(2 5 6 8 10 11 12 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76)

echo "Deleting ${#DELETE_IDS[@]} test users..."
echo "Keeping only: admin@test.com (ID 1) and 7 real salesmen (IDs 3, 4, 7, 9, 13, 14, 15)"

for user_id in "${DELETE_IDS[@]}"; do
  echo "Deleting user ID: $user_id"
  curl -X DELETE "http://localhost:8080/api/users/$user_id" -s
  sleep 0.1
done

echo ""
echo "Cleanup complete!"
echo ""
echo "Remaining users:"
curl -s 'http://localhost:8080/api/users?currentUserId=1' | python3 -c "import sys, json; users = json.load(sys.stdin); print(f'Total: {len(users)} users'); [print(f\"  {u['role']}: {u['name']} ({u['email']})\") for u in users]"
