from fastapi import HTTPException


class DatabaseError(HTTPException):
    """Base exception for database-related errors"""
    pass


class RecordNotFoundError(DatabaseError):
    def __init__(self, record_type: str, record_id=None):
        message = f"{record_type} not found" if record_id is None else f"{record_type} with id {record_id} not found"
        super().__init__(status_code=404, detail=message)


class RecordCreationError(DatabaseError):
    def __init__(self, record_type: str, error: str):
        super().__init__(status_code=500, detail=f"Failed to create {record_type}: {error}")


class UserError(HTTPException):
    """Base exception for user-related errors"""
    pass


class UserNotFoundError(UserError):
    def __init__(self, user_id=None):
        message = "User not found" if user_id is None else f"User with id {user_id} not found"
        super().__init__(status_code=404, detail=message)


class PasswordMismatchError(UserError):
    def __init__(self):
        super().__init__(status_code=400, detail="New passwords do not match")


class InvalidPasswordError(UserError):
    def __init__(self):
        super().__init__(status_code=401, detail="Current password is incorrect")


class AuthenticationError(HTTPException):
    def __init__(self, message: str = "Could not validate user"):
        super().__init__(status_code=401, detail=message)
