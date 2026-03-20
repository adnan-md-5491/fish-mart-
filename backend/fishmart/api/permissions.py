# permissions.py

from rest_framework.permissions import BasePermission

class IsVendor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == "vendor" and
            hasattr(request.user, "vendor_profile") and
            request.user.vendor_profile.status == "approved"
        )

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == "admin"
        )

class IsDeliveryBoy(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == "delivery" and
            hasattr(request.user, "delivery_profile")
            # ← is_active check bilkul mat karo
            # pending state mein bhi dashboard dikhna chahiye
        )