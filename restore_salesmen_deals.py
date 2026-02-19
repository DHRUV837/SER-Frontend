import requests
import json
import datetime

# Configuration
API_URL = "http://localhost:8080/admin/deals"
USER_IDS = [4, 9, 13, 14, 15]
ADMIN_ID = 1

def create_deal(user_id):
    today = datetime.date.today()
    close_date = today + datetime.timedelta(days=30)
    
    payload = {
        "dealName": f"Restored Deal for User {user_id}",
        "organizationName": f"Org {user_id} Corp",
        "clientName": f"Client of User {user_id}",
        "amount": 150000 + (user_id * 1000),
        "assignedUserId": user_id,
        "expectedCloseDate": close_date.isoformat(),
        "priority": "HIGH",
        "dealType": "NEW",
        "industry": "Technology",
        "region": "APAC",
        "currency": "₹",
        "createdBy": ADMIN_ID,
        "dealNotes": "Automatically restored deal to fix missing data."
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print(f"✅ Successfully created deal for User {user_id}")
            print(f"   Deal ID: {response.json().get('id', 'Unknown')}")
        else:
            print(f"❌ Failed to create deal for User {user_id}")
            print(f"   Status Code: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"⚠️ Error creating deal for User {user_id}: {str(e)}")

print("Starting deal restoration process...")
for user_id in USER_IDS:
    create_deal(user_id)
print("Deal restoration process complete.")
