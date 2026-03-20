from django.db import models
<<<<<<< HEAD
from django.contrib.auth.models import AbstractUser
import random


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin",    "Admin"),
        ("vendor",   "Vendor"),
        ("customer", "Customer"),
        ("delivery", "Delivery Boy"),
    ]
    is_member = models.BooleanField(default=False)
    role      = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")
    phone     = models.CharField(max_length=15, blank=True, default="")  # ← add

    def __str__(self):
        return f"{self.username} ({self.role})"


    def __str__(self):
        return f"{self.username} ({self.role})"


class VendorProfile(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor_profile")
    shop_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)  # % admin lega
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.shop_name} - {self.status}"

class Category(models.Model):

=======
from django.contrib.auth.models import User
from django.utils import timezone
import random

# CATEGORY (like Fish, Accessories)
class Category(models.Model):
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


<<<<<<< HEAD
class Product(models.Model):
    vendor = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name="products",
        null=True, blank=True  # null=True taaki purane products break na ho
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to="products/")
    stock = models.IntegerField(default=0)
    normal_price = models.DecimalField(max_digits=10, decimal_places=2)
    member_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)  # admin deactivate kar sake
=======
# PRODUCT (Fish / Items)
from PIL import Image

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.FloatField()
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            img = Image.open(self.image.path)

            # 🔥 resize only if image is large
            if img.width > 800 or img.height > 800:
                img.thumbnail((800, 800))
                img.save(self.image.path, quality=70, optimize=True)
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422

    def __str__(self):
        return self.name

<<<<<<< HEAD
class Cart(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
=======
# CART
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)  # ✅ Added
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422

    def __str__(self):
        return self.user.username


<<<<<<< HEAD
class CartItem(models.Model):

    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)

    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.FloatField()
    delivery_charge  = models.FloatField(default=0)   # ← add

    delivery_address = models.TextField(default="")
    phone = models.CharField(max_length=15, default="")
    instructions = models.TextField(blank=True, default="")
    razorpay_payment_id = models.CharField(max_length=100, blank=True, default="")
    status = models.CharField(
        max_length=30,
        choices=[
            ("PLACED",           "Placed"),
            ("CONFIRMED",        "Confirmed"),
            ("ASSIGNED",         "Assigned"),
            ("PICKED_UP",        "Picked Up"),
            ("OUT_FOR_DELIVERY", "Out for Delivery"),
            ("DELIVERED",        "Delivered"),
            ("CANCELLED",        "Cancelled"),
        ],
        default="PLACED"
    )
    created_at = models.DateTimeField(auto_now_add=True)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    vendor = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, related_name="vendor_order_items"
    )
    quantity = models.PositiveIntegerField()
    price = models.FloatField()
    vendor_earning = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    admin_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
class EmailOTP(models.Model):

    email = models.EmailField()

    otp = models.CharField(max_length=6)

    created_at = models.DateTimeField(auto_now_add=True)

    is_verified = models.BooleanField(default=False)

    def generate_otp(self):

        self.otp = str(random.randint(100000, 999999))

        self.save()


class Wallet(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wallet")

    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class MembershipPlan(models.Model):

    name = models.CharField(max_length=100)

    price = models.DecimalField(max_digits=8, decimal_places=2)

    duration_days = models.IntegerField()

    def __str__(self):
        return self.name


class UserMembership(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    plan = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE)

    start_date = models.DateTimeField(auto_now_add=True)

    expiry_date = models.DateTimeField()

    active = models.BooleanField(default=True)


class MembershipForm(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)

    email = models.EmailField()

    phone = models.CharField(max_length=15)

    created_at = models.DateTimeField(auto_now_add=True)

class WalletTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("credit", "Credit"),
        ("debit", "Debit"),
    ]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - ₹{self.amount}"
class DeliveryBoy(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("busy",      "Busy"),
        ("offline",   "Offline"),
    ]
    user = models.OneToOneField(
        User, on_delete=models.CASCADE,
        related_name="delivery_profile"
    )
    phone          = models.CharField(max_length=15)
    vehicle_number = models.CharField(max_length=20, blank=True)
    is_active      = models.BooleanField(default=True)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default="offline")
    current_lat    = models.FloatField(null=True, blank=True)
    current_lng    = models.FloatField(null=True, blank=True)
    total_deliveries = models.IntegerField(default=0)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.status}"


class OrderTracking(models.Model):
    STATUS_CHOICES = [
        ("PLACED",           "Order Placed"),
        ("CONFIRMED",        "Confirmed"),
        ("ASSIGNED",         "Delivery Boy Assigned"),
        ("PICKED_UP",        "Picked Up"),
        ("OUT_FOR_DELIVERY", "Out for Delivery"),
        ("DELIVERED",        "Delivered"),
        ("CANCELLED",        "Cancelled"),
    ]
    order        = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="tracking")
    delivery_boy = models.ForeignKey(
        DeliveryBoy, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="assigned_orders"
    )
    status       = models.CharField(max_length=30, choices=STATUS_CHOICES, default="PLACED")
    current_lat  = models.FloatField(null=True, blank=True)
    current_lng  = models.FloatField(null=True, blank=True)
    assigned_at  = models.DateTimeField(null=True, blank=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.order.id} - {self.status}"

class DeliverySettings(models.Model):
    delivery_charge    = models.DecimalField(max_digits=6, decimal_places=2, default=40)
    free_delivery_above = models.DecimalField(max_digits=8, decimal_places=2, default=500)
    is_active          = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Delivery Settings"

    def __str__(self):
        return f"Delivery ₹{self.delivery_charge} | Free above ₹{self.free_delivery_above}"
=======
# CART ITEM
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


# ORDER
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.FloatField()
    status = models.CharField(
        max_length=20,
        choices=[
            ("PENDING", "Pending"),
            ("CONFIRMED", "Confirmed"),
            ("CANCELLED", "Cancelled"),
        ],
        default="PENDING"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"


# ORDER ITEM
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


# EMAIL OTP (for signup verification)
class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.save()

    def __str__(self):
        return self.email
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
