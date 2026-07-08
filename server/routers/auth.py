"""
Authentication router — handles login, activation, password reset, password change.
"""
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional
from sqlalchemy.orm import Session

from models.schemas import (
    LoginRequest, LoginResponse, User,
    ActivateRequestSchema, ActivateVerifySchema, ActivateCompleteSchema,
    ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest,
)
from services import auth_service
from services.user_service import get_user_by_id
from db import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ─── Dependencies ─────────────────────────────────────────────────────────────

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """Extract and validate the JWT token, return the current user."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split(" ")[1]
    payload = auth_service.verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_id(db, payload.sub)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    return user


def get_hr_user(user: User = Depends(get_current_user)) -> User:
    """Require HR role."""
    if user.role != "hr":
        raise HTTPException(status_code=403, detail="HR access required")
    return user


# ─── Login ────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password, or account not activated.",
        )

    token = auth_service.create_access_token(user)
    return LoginResponse(token=token, user=user)


@router.get("/me", response_model=User)
def get_me(user: User = Depends(get_current_user)):
    return user


# ─── Account Activation (First-Time Signup) ──────────────────────────────────

@router.post("/activate/request")
def activate_request(request: ActivateRequestSchema, db: Session = Depends(get_db)):
    """
    Step 1: Employee enters their company email.
    Validates domain, checks employee exists, sends OTP.
    """
    try:
        result = auth_service.request_activation(db, request.email)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/activate/verify")
def activate_verify(request: ActivateVerifySchema, db: Session = Depends(get_db)):
    """
    Step 2: Employee enters the 6-digit OTP to verify.
    """
    try:
        result = auth_service.verify_activation_otp(db, request.email, request.otp)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/activate/complete")
def activate_complete(request: ActivateCompleteSchema, db: Session = Depends(get_db)):
    """
    Step 3: Employee sets their password. Account becomes active.
    """
    # Validate password match
    if request.password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    # Validate password strength
    if len(request.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long.",
        )

    has_upper = any(c.isupper() for c in request.password)
    has_lower = any(c.islower() for c in request.password)
    has_digit = any(c.isdigit() for c in request.password)
    if not (has_upper and has_lower and has_digit):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        )

    try:
        result = auth_service.complete_activation(
            db, request.name, request.email, request.otp, request.password
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ─── Forgot Password ─────────────────────────────────────────────────────────

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request a password reset OTP."""
    try:
        result = auth_service.request_password_reset(db, request.email)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using a valid OTP."""
    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long.",
        )

    try:
        result = auth_service.reset_password(
            db, request.email, request.otp, request.new_password
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ─── Change Password ─────────────────────────────────────────────────────────

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change password for the currently logged-in user."""
    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long.",
        )

    if request.current_password == request.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password must be different from the current password.",
        )

    try:
        result = auth_service.change_password(
            db, user.id, request.current_password, request.new_password
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
