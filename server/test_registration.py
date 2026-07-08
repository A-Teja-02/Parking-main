import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api/auth"
NEW_EMAIL = "new.user@quadrantitservices.com"
NEW_NAME = "New User"
PASSWORD = "Password123"

def print_result(step_name, res):
    print(f"\n--- {step_name} ---")
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")
    try:
        return res.json()
    except:
        return None

# 1. Activate Account page opens -> This is frontend.
# 2. User enters Full Name, Official Company Email
# 3. Only @quadrantitservices.com emails are accepted.
res = requests.post(f"{BASE_URL}/activate/request", json={"email": "new.user@gmail.com"})
print_result("Invalid Email Domain", res)
assert res.status_code == 400

# 4. A new email that is not already registered:
# Receives OTP
res = requests.post(f"{BASE_URL}/activate/request", json={"email": NEW_EMAIL})
data = print_result("Request Activation for New Email", res)
assert res.status_code == 200
otp = data.get("dev_otp")

if not otp:
    print("FAILED to get OTP")
    exit(1)

# Verifies OTP
res = requests.post(f"{BASE_URL}/activate/verify", json={"email": NEW_EMAIL, "otp": otp})
print_result("Verify OTP", res)
assert res.status_code == 200

# Creates password & Creates a new employee record in Supabase
res = requests.post(f"{BASE_URL}/activate/complete", json={
    "name": NEW_NAME,
    "email": NEW_EMAIL, 
    "otp": otp, 
    "password": PASSWORD, 
    "confirm_password": PASSWORD
})
print_result("Complete Activation", res)
assert res.status_code == 200

# 8. Trying to activate the same email again displays: "This account is already activated. Please log in."
res = requests.post(f"{BASE_URL}/activate/request", json={"email": NEW_EMAIL})
print_result("Re-activate same email", res)
assert res.status_code == 400
assert "already activated" in res.text

# 9. Login works with the newly created account.
res = requests.post(f"{BASE_URL}/login", json={"email": NEW_EMAIL, "password": PASSWORD})
data = print_result("Login with New Account", res)
assert res.status_code == 200
token = data.get("token")
user = data.get("user")

# 5. Full Name is stored exactly as entered.
assert user.get("name") == NEW_NAME

# 7. Account status becomes Active.
assert user.get("account_status") == "active"
assert user.get("role") == "employee"

if not token:
    print("FAILED to get Token")
    exit(1)

# 11. Change Password works.
headers = {"Authorization": f"Bearer {token}"}
res = requests.post(f"{BASE_URL}/change-password", json={
    "current_password": PASSWORD,
    "new_password": "NewPassword123",
    "confirm_password": "NewPassword123"
}, headers=headers)
print_result("Change Password", res)
assert res.status_code == 200

# 10. Forgot Password works.
res = requests.post(f"{BASE_URL}/forgot-password", json={"email": NEW_EMAIL})
data = print_result("Forgot Password", res)
assert res.status_code == 200
reset_otp = data.get("dev_otp")

res = requests.post(f"{BASE_URL}/reset-password", json={
    "email": NEW_EMAIL,
    "otp": reset_otp,
    "new_password": PASSWORD, # change back to original
    "confirm_password": PASSWORD
})
print_result("Reset Password", res)
assert res.status_code == 200

# 12. JWT authentication works.
res = requests.get(f"{BASE_URL}/me", headers=headers)
data = print_result("JWT Auth Check (me)", res)
assert res.status_code == 200
assert data.get("email") == NEW_EMAIL

print("\nALL API TESTS PASSED!")
