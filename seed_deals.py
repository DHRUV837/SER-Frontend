import requests
import json

BASE_URL = "http://localhost:8080/api/deals"

def create_and_approve(user_id, deal_name, amount, client, date):
    # 1. Create Deal
    payload = {
        "dealName": deal_name,
        "clientName": client,
        "amount": amount,
        "user": {"id": user_id},
        "date": date,
        "status": "Submitted"  # Initial status
    }
    
    try:
        print(f"Creating deal: {deal_name} for User {user_id}...")
        resp = requests.post(BASE_URL, json=payload)
        resp.raise_for_status()
        deal = resp.json()
        deal_id = deal['id']
        print(f" -> Created Deal ID: {deal_id}")
        
        # 2. Approve Deal
        print(f" -> Approving Deal {deal_id}...")
        approve_resp = requests.patch(f"{BASE_URL}/{deal_id}/status", json={
            "status": "Approved",
            "comment": "Historical Data Restoration"
        })
        approve_resp.raise_for_status()
        print(f" -> Approved!")
        
    except Exception as e:
        print(f"Error: {e}")

# Deals for Ankit (ID 74)
create_and_approve(74, "Alpha Corp Renewals", 120000, "Alpha Corp", "2026-01-15")
create_and_approve(74, "Beta Systems Q4", 85000, "Beta Systems", "2025-12-20")
create_and_approve(74, "Gamma Logistics", 210000, "Gamma", "2026-02-10")

# Deals for Dhruv (ID 75)
create_and_approve(75, "Delta Force Contract", 195000, "Delta Force", "2026-01-25")
create_and_approve(75, "Epsilon Energy", 160000, "Epsilon", "2025-11-15")
create_and_approve(75, "Zeta Phama", 95000, "Zeta", "2026-02-05")
