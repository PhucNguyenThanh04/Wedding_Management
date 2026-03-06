# def require_role(allowed_roles: List[StaffRole]):
#     async def role_checker(current_user: model.Staff = Depends(get_current_user)):
#         if current_user.role not in allowed_roles:
#             raise HTTPException(status_code=403, detail="Permission denied")
#         return current_user
#
#     return role_checker