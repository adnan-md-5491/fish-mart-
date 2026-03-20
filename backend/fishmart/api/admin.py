from django.contrib import admin
<<<<<<< HEAD
from django.contrib.auth import get_user_model
from .models import (
    Category, Product, Cart, CartItem, Order, OrderItem,
    EmailOTP, Wallet, MembershipPlan, UserMembership, MembershipForm,
    WalletTransaction, VendorProfile, DeliveryBoy, OrderTracking, DeliverySettings
)

User = get_user_model()  # ← yeh add karo

# ── User Admin ──────────────────────────────────────────────
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display  = ["username", "phone", "role", "is_member", "date_joined"]
    list_filter   = ["role", "is_member"]
    search_fields = ["username", "phone"]

# ── Baaki sab register ──────────────────────────────────────
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(EmailOTP)
admin.site.register(Wallet)
admin.site.register(WalletTransaction)
admin.site.register(MembershipPlan)
admin.site.register(UserMembership)
admin.site.register(MembershipForm)
admin.site.register(VendorProfile)
admin.site.register(DeliveryBoy)
admin.site.register(OrderTracking)
admin.site.register(DeliverySettings)

# ── Order Admin ─────────────────────────────────────────────
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ["id", "user", "status", "total_amount", "delivery_charge", "created_at"]
    list_editable = ["status"]
    list_filter   = ["status"]
    inlines       = [OrderItemInline]
=======
from .models import Category, Product, Cart, CartItem, Order, OrderItem, EmailOTP

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'stock', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name']
    list_editable = ['price', 'stock']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_at']
    readonly_fields = ['created_at']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'quantity']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'quantity', 'price']

@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ['email', 'otp', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'created_at']
    readonly_fields = ['created_at']
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
