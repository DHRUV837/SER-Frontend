import requests
import json

BASE_URL = "http://localhost:8080/api"

def diagnose():
    try:
        # 1. Check Admin User (ID 1)
        print("--- Admin (ID 1) ---")
        try:
            resp = requests.get(f"{BASE_URL}/users/1", timeout=5)
            admin = resp.json()
            print(f"Email: {admin.get('email')}")
            print(f"Role: {admin.get('role')}")
            print(f"Org: {admin.get('organizationName')}")
        except Exception as e:
            print(f"Error fetching admin: {e}")

        # 2. Check Sales Users (73, 74, 75)
        print("\n--- Sales Users ---")
        for uid in [73, 74, 75]:
            try:
                resp = requests.get(f"{BASE_URL}/users/{uid}", timeout=5)
                user = resp.json()
                print(f"ID {uid}: {user.get('name')} | Org: {user.get('organizationName')}")
            except:
                print(f"ID {uid}: Error or Not Found")

        # 3. Check Deals visible to Admin (ID 1)
        print("\n--- Deals visible to Admin (ID 1) ---")
        try:
            resp = requests.get(f"{BASE_URL}/deals?requestorId=1", timeout=5)
            deals = resp.json()
            print(f"Total Deals: {len(deals)}")
            # Print sample deal orgs
            for d in deals[:5]:
                print(f"Deal {d.get('id')} User: {d.get('user', {}).get('name')} | Deal Org: {d.get('organizationName')} | Status: {d.get('status')}")
        except Exception as e:
            print(f"Error fetching deals for admin: {e}")

        # 4. Check All Deals (Raw) - if possible (using empty requestorId should return empty list usually, but let's try)
        # Actually, let's try fetching as User 73
        print("\n--- Deals visible to User 73 ---")
        try:
            resp = requests.get(f"{BASE_URL}/deals?requestorId=73", timeout=5)
            deals = resp.json()
            print(f"Total Deals: {len(deals)}")
        except Exception as e:
            print(f"Error fetching deals for user 73: {e}")

    except Exception as e:
        print(f"Global Error: {e}")

if __name__ == "__main__":
    diagnose()
