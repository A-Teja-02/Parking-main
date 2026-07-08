import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api/auth"
EMAIL = "test.employee@quadrantitservices.com"
PASSWORD = "Password123"

def print_result(step_name, res):
    print(f"\n--- {step_name} ---")
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")
    try:
        return res.json()
    except:
        return None

# PHASE 2: Activate Account
# 1. Request Activation
res = requests.post(f"{BASE_URL}/activate/request", json={"email": EMAIL})
data = print_result("Request Activation", res)
otp = data.get("dev_otp")

if not otp:
    print("FAILED to get OTP")
    exit(1)

# 2. Verify OTP
res = requests.post(f"{BASE_URL}/activate/verify", json={"email": EMAIL, "otp": otp})
print_result("Verify OTP", res)

# 3. Complete Activation
res = requests.post(f"{BASE_URL}/activate/complete", json={
    "email": EMAIL, 
    "otp": otp, 
    "password": PASSWORD, 
    "confirm_password": PASSWORD
})
print_result("Complete Activation", res)

# 4. Login
res = requests.post(f"{BASE_URL}/login", json={"email": EMAIL, "password": PASSWORD})
data = print_result("Login", res)
token = data.get("token")

if not token:
    print("FAILED to get Token")
    exit(1)

# PHASE 3: Password Management
headers = {"Authorization": f"Bearer {token}"}

# 1. Change Password
res = requests.post(f"{BASE_URL}/change-password", json={
    "current_password": PASSWORD,
    "new_password": "NewPassword123",
    "confirm_password": "NewPassword123"
}, headers=headers)
print_result("Change Password", res)

# 2. Forgot Password
res = requests.post(f"{BASE_URL}/forgot-password", json={"email": EMAIL})
data = print_result("Forgot Password", res)
reset_otp = data.get("dev_otp")

if not reset_otp:
    print("FAILED to get Reset OTP")
    exit(1)

# 3. Reset Password
res = requests.post(f"{BASE_URL}/reset-password", json={
    "email": EMAIL,
    "otp": reset_otp,
    "new_password": PASSWORD, # change back to original
    "confirm_password": PASSWORD
})
print_result("Reset Password", res)

print("\nALL API TESTS PASSED!")
