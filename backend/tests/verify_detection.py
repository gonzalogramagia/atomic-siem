import asyncio
import httpx
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"

async def verify():
    # 1. Create a Rule
    rule_payload = {
        "name": "Detect Failed Login",
        "description": "Alerts when a failed login occurs",
        "severity": "high",
        "logic": {
            "field": "event_type",
            "operator": "eq",
            "value": "failed_login"
        },
        "enabled": True
    }
    
    # We assume the server is running. If not, this script will fail.
    # Since I cannot start the server in background easily here, 
    # I will rely on unit tests or assume the user runs it.
    # BUT, I can use TestClient if I import the app.
    
    from fastapi.testclient import TestClient
    from backend.main import app
    
    with TestClient(app) as client:
        print("1. Creating Rule...")
        response = client.post("/api/v1/rules/", json=rule_payload)
        if response.status_code != 200:
            print(f"Failed to create rule: {response.text}")
            return
        rule = response.json()
        print(f"Rule created: {rule['id']}")
        
        # 2. Ingest a matching Log
        log_payload = {
            "source": "auth_service",
            "event_type": "failed_login",
            "severity": "info",
            "payload": {"user": "admin", "ip": "1.2.3.4"}
        }
        
        print("2. Ingesting Log...")
        response = client.post("/api/v1/logs/ingest", json=log_payload)
        if response.status_code != 200:
            print(f"Failed to ingest log: {response.text}")
            return
        log = response.json()
        print(f"Log ingested: {log['id']}")
        
        # 3. Check for Alerts
        # Background tasks might not run immediately in TestClient?
        # TestClient runs background tasks synchronously after the response is sent.
        
        print("3. Checking for Alerts...")
        response = client.get("/api/v1/alerts/")
        alerts = response.json()
        
        found = False
        for alert in alerts:
            if alert['log_id'] == log['id'] and alert['rule_id'] == rule['id']:
                print(f"SUCCESS: Alert found! ID: {alert['id']}")
                found = True
                break
                
        if not found:
            print("FAILURE: No alert found for the ingested log.")
            print(f"Total alerts: {len(alerts)}")
            import sys
            sys.exit(1)

if __name__ == "__main__":
    asyncio.run(verify())
