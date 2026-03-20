<<<<<<< HEAD
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import datetime, timedelta
from .permissions import IsAdmin, IsVendor
from .models import VendorProfile
from .serializers import VendorProfileSerializer, VendorProductSerializer
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from twilio.rest import Client as TwilioClient

import random
import razorpay

from .models import (
    Category, Product, Cart, CartItem, Order, OrderItem,
    EmailOTP, Wallet, MembershipForm, UserMembership, MembershipPlan,
    WalletTransaction, DeliveryBoy, OrderTracking, DeliverySettings
)

=======
# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from django.contrib.auth.models import User
# # from rest_framework.permissions import IsAuthenticated
# # from rest_framework.decorators import permission_classes

# # from .models import Category, Product, Cart, CartItem, Order, OrderItem
# # from .serializers import (
# #     CategorySerializer,
# #     ProductSerializer,
# #     CartSerializer,
# #     OrderSerializer
# # )

# # # TEMP USER (for testing like Blinkit guest)
# # def get_user():
# #     return User.objects.first()


# # # CATEGORY LIST
# # @api_view(["GET"])
# # def category_list(request):
# #     categories = Category.objects.all()
# #     return Response(CategorySerializer(categories, many=True).data)


# # # PRODUCT LIST
# # @api_view(["GET"])
# # def product_list(request):
# #     products = Product.objects.all()
# #     return Response(ProductSerializer(products, many=True).data)


# # # ADD TO CART
# # @api_view(["POST"])
# # def add_to_cart(request):
# #     user = get_user()
# #     product_id = request.data.get("product_id")
# #     quantity = int(request.data.get("quantity", 1))

# #     cart, _ = Cart.objects.get_or_create(user=user)
# #     product = Product.objects.get(id=product_id)

# #     item, created = CartItem.objects.get_or_create(
# #         cart=cart,
# #         product=product
# #     )

# #     if not created:
# #         item.quantity += quantity
# #     item.save()

# #     return Response({"message": "Item added to cart"})


# # # VIEW CART
# # @api_view(["GET"])
# # def view_cart(request):
# #     user = get_user()
# #     cart, _ = Cart.objects.get_or_create(user=user)
# #     return Response(CartSerializer(cart).data)


# # # CREATE ORDER (Checkout)
# # @api_view(["POST"])
# # def create_order(request):
# #     user = get_user()
# #     cart = Cart.objects.get(user=user)

# #     total = 0
# #     for item in cart.items.all():
# #         total += item.quantity * item.product.price

# #     order = Order.objects.create(
# #         user=user,
# #         total_amount=total
# #     )

# #     for item in cart.items.all():
# #         OrderItem.objects.create(
# #             order=order,
# #             product=item.product,
# #             quantity=item.quantity,
# #             price=item.product.price
# #         )

# #     cart.items.all().delete()

# #     return Response({
# #         "message": "Order placed successfully",
# #         "order_id": order.id
# #     })


# # # ORDER HISTORY
# # @api_view(["GET"])
# # def order_list(request):
# #     user = get_user()
# #     orders = Order.objects.filter(user=user)
# #     return Response(OrderSerializer(orders, many=True).data)


# # @api_view(["POST"])
# # def update_cart_item(request):
# #     user = get_user()
# #     product_id = request.data.get("product_id")
# #     action = request.data.get("action")  # increase | decrease

# #     cart = Cart.objects.get(user=user)
# #     item = CartItem.objects.get(cart=cart, product_id=product_id)

# #     if action == "increase":
# #         item.quantity += 1
# #         item.save()

# #     elif action == "decrease":
# #         item.quantity -= 1
# #         if item.quantity <= 0:
# #             item.delete()
# #         else:
# #             item.save()

# #     return Response({"message": "Cart updated"})
# # @api_view(["POST"])
# # def remove_cart_item(request):
# #     user = get_user()
# #     product_id = request.data.get("product_id")

# #     cart = Cart.objects.get(user=user)
# #     CartItem.objects.filter(
# #         cart=cart,
# #         product_id=product_id
# #     ).delete()

# #     return Response({"message": "Item removed from cart"})
# # from django.contrib.auth.models import User
# # from rest_framework import status

# # @api_view(["POST"])
# # def signup(request):
# #     username = request.data.get("username")
# #     email = request.data.get("email")
# #     password = request.data.get("password")

# #     if User.objects.filter(username=username).exists():
# #         return Response(
# #             {"error": "Username already exists"},
# #             status=status.HTTP_400_BAD_REQUEST
# #         )

# #     user = User.objects.create_user(
# #         username=username,
# #         email=email,
# #         password=password
# #     )

# #     return Response({"message": "User created successfully"})
# # @api_view(["GET"])
# # @permission_classes([IsAuthenticated])
# # def view_cart(request):
# #     cart, _ = Cart.objects.get_or_create(user=request.user)
# #     return Response(CartSerializer(cart).data)

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth.models import User
# from django.core.mail import send_mail
# from django.utils import timezone
# from .models import EmailOTP

# from .models import Category, Product, Cart, CartItem, Order, OrderItem
# from .serializers import (
#     CategorySerializer,
#     ProductSerializer,
#     CartSerializer,
#     OrderSerializer
# )

# # -----------------------
# # CATEGORY & PRODUCTS
# # -----------------------

# @api_view(["GET"])
# def category_list(request):
#     categories = Category.objects.all()
#     return Response(CategorySerializer(categories, many=True).data)


# @api_view(["GET"])
# def product_list(request):
#     products = Product.objects.all()
#     return Response(ProductSerializer(products, many=True).data)

# # -----------------------
# # CART
# # -----------------------

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def add_to_cart(request):
#     product_id = request.data.get("product_id")
#     quantity = int(request.data.get("quantity", 1))

#     cart, _ = Cart.objects.get_or_create(user=request.user)
#     product = Product.objects.get(id=product_id)

#     item, created = CartItem.objects.get_or_create(
#         cart=cart,
#         product=product
#     )

#     if not created:
#         item.quantity += quantity
#     item.save()

#     return Response({"message": "Item added to cart"})


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def view_cart(request):
#     cart, _ = Cart.objects.get_or_create(user=request.user)
#     return Response(CartSerializer(cart).data)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def update_cart_item(request):
#     product_id = request.data.get("product_id")
#     action = request.data.get("action")

#     cart = Cart.objects.get(user=request.user)
#     item = CartItem.objects.get(cart=cart, product_id=product_id)

#     if action == "increase":
#         item.quantity += 1
#         item.save()
#     elif action == "decrease":
#         item.quantity -= 1
#         if item.quantity <= 0:
#             item.delete()
#         else:
#             item.save()

#     return Response({"message": "Cart updated"})


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def remove_cart_item(request):
#     product_id = request.data.get("product_id")

#     cart = Cart.objects.get(user=request.user)
#     CartItem.objects.filter(
#         cart=cart,
#         product_id=product_id
#     ).delete()

#     return Response({"message": "Item removed from cart"})

# # -----------------------
# # ORDER
# # -----------------------

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def create_order(request):
#     cart = Cart.objects.get(user=request.user)

#     total = 0
#     for item in cart.items.all():
#         total += item.quantity * item.product.price

#     order = Order.objects.create(
#         user=request.user,
#         total_amount=total
#     )

#     for item in cart.items.all():
#         OrderItem.objects.create(
#             order=order,
#             product=item.product,
#             quantity=item.quantity,
#             price=item.product.price
#         )

#     cart.items.all().delete()

#     return Response({
#         "message": "Order placed successfully",
#         "order_id": order.id
#     })


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def order_list(request):
#     orders = Order.objects.filter(user=request.user)
#     return Response(OrderSerializer(orders, many=True).data)

# # -----------------------
# # AUTH
# # -----------------------

# # @api_view(["POST"])
# # def signup(request):
# #     username = request.data.get("username")
# #     email = request.data.get("email")
# #     password = request.data.get("password")

# #     if User.objects.filter(username=username).exists():
# #         return Response(
# #             {"error": "Username already exists"},
# #             status=status.HTTP_400_BAD_REQUEST
# #         )

# #     User.objects.create_user(
# #         username=username,
# #         email=email,
# #         password=password
# #     )

# #     return Response({"message": "User created successfully"})
# @api_view(["POST"])
# def signup(request):
#     email = request.data.get("email")
#     username = request.data.get("username")
#     password = request.data.get("password")

#     if User.objects.filter(email=email).exists():
#         return Response({"error": "Email already registered"}, status=400)

#     otp_obj, _ = EmailOTP.objects.get_or_create(email=email)
#     otp_obj.generate_otp()

#     send_mail(
#         subject="FishMart OTP Verification",
#         message=f"Your OTP is {otp_obj.otp}",
#         from_email=None,
#         recipient_list=[email],
#     )

#     return Response({"message": "OTP sent to email"})
# @api_view(["POST"])
# def verify_otp(request):
#     email = request.data.get("email")
#     otp = request.data.get("otp")
#     username = request.data.get("username")
#     password = request.data.get("password")

#     try:
#         otp_obj = EmailOTP.objects.get(email=email, otp=otp, is_verified=False)
#     except EmailOTP.DoesNotExist:
#         return Response({"error": "Invalid OTP"}, status=400)

#     # OTP valid → create user
#     User.objects.create_user(
#         username=username,
#         email=email,
#         password=password
#     )

#     otp_obj.is_verified = True
#     otp_obj.save()

#     return Response({"message": "Account verified successfully"})
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import random

from .models import (
    Category, Product, Cart, CartItem,
    Order, OrderItem, EmailOTP
)
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
<<<<<<< HEAD
    OrderSerializer,
    WalletSerializer,
    DeliveryBoySerializer,
    OrderTrackingSerializer,
)

from .permissions import IsDeliveryBoy

User = get_user_model()

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)
client.set_app_details({"title": "NammaFreshMart", "version": "1.0"})


# =========================
# CUSTOM LOGIN — role return
# =========================

class CustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"]      = self.user.role
        data["is_member"] = self.user.is_member
        data["phone"]     = self.user.phone
        data["username"]  = self.user.username
        return data

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


# =========================
# SEND WHATSAPP OTP
# =========================
from twilio.rest import Client

def send_sms_otp(phone, otp):
    try:
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )

        message = client.messages.create(
            body=f"🔥 Your OTP is {otp}",
            from_="whatsapp:+14155238886",
            to=f"whatsapp:+91{phone}"
        )

        print("SID:", message.sid)
        return True

    except Exception as e:
        print("ERROR:", e)
        return False 
=======
    OrderSerializer
)

# =========================
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
# CATEGORY & PRODUCTS
# =========================

@api_view(["GET"])
def category_list(request):
    categories = Category.objects.all()
<<<<<<< HEAD
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
=======
    return Response(CategorySerializer(categories, many=True).data)
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422


@api_view(["GET"])
def product_list(request):
<<<<<<< HEAD
    products = Product.objects.filter(
        is_active=True
    ).filter(
        models.Q(vendor__isnull=True) |
        models.Q(vendor__vendor_profile__status="approved")
    ).select_related("vendor__vendor_profile", "category")

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request}
    )
    return Response(serializer.data)

=======
    products = Product.objects.all()
    return Response(ProductSerializer(products, many=True).data)
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422

# =========================
# CART
# =========================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
<<<<<<< HEAD
    quantity   = int(request.data.get("quantity", 1))

    cart, _   = Cart.objects.get_or_create(user=request.user)
    product   = Product.objects.get(id=product_id)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
=======
    quantity = int(request.data.get("quantity", 1))

    if not product_id:
        return Response({"error": "product_id required"}, status=400)

    cart, _ = Cart.objects.get_or_create(user=request.user)
    product = Product.objects.get(id=product_id)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422

    if not created:
        item.quantity += quantity
    item.save()
<<<<<<< HEAD
=======

>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    return Response({"message": "Item added to cart"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_cart(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
<<<<<<< HEAD
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data)
=======
    return Response(CartSerializer(cart).data)
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_cart_item(request):
    product_id = request.data.get("product_id")
<<<<<<< HEAD
    action     = request.data.get("action")
=======
    action = request.data.get("action")
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422

    cart = Cart.objects.get(user=request.user)
    item = CartItem.objects.get(cart=cart, product_id=product_id)

    if action == "increase":
        item.quantity += 1
<<<<<<< HEAD
=======
        item.save()
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    elif action == "decrease":
        item.quantity -= 1
        if item.quantity <= 0:
            item.delete()
<<<<<<< HEAD
            return Response({"message": "Item removed"})
    item.save()
=======
        else:
            item.save()

>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    return Response({"message": "Cart updated"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_cart_item(request):
    product_id = request.data.get("product_id")
<<<<<<< HEAD
    cart = Cart.objects.get(user=request.user)
    CartItem.objects.filter(cart=cart, product_id=product_id).delete()
    return Response({"message": "Item removed from cart"})


# =========================
# DELIVERY CHARGE HELPER
# =========================

def get_delivery_charge(user, total):
    try:
        setting = DeliverySettings.objects.first()
        if not setting:
            charge     = 40
            free_above = 500
        else:
            if not setting.is_active:
                return 0
            charge     = float(setting.delivery_charge)
            free_above = float(setting.free_delivery_above)

        if user.is_authenticated and user.is_member:
            return 0
        if float(total) >= free_above:
            return 0
        return charge
    except Exception as e:
        print("Delivery charge error:", e)
        return 40


=======

    cart = Cart.objects.get(user=request.user)
    CartItem.objects.filter(
        cart=cart,
        product_id=product_id
    ).delete()

    return Response({"message": "Item removed from cart"})

>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
# =========================
# ORDER
# =========================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
<<<<<<< HEAD
    print("REQUEST DATA:", request.data)

    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=404)

    cart_items = cart.items.select_related(
        "product__vendor__vendor_profile"
    ).all()

    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    def get_price(product):
        if request.user.is_authenticated and request.user.is_member:
            return product.member_price
        return product.normal_price

    subtotal        = sum(item.quantity * get_price(item.product) for item in cart_items)
    delivery_charge = get_delivery_charge(request.user, subtotal)
    total           = float(subtotal) + delivery_charge

    payment_method = request.data.get("payment_method", "cod")

    if payment_method == "wallet":
        try:
            wallet = Wallet.objects.get(user=request.user)
        except Wallet.DoesNotExist:
            return Response({"error": "Wallet not found"}, status=404)
        if wallet.balance < total:
            return Response({"error": "Insufficient wallet balance"}, status=400)

    order = Order.objects.create(
        user=request.user,
        total_amount=total,
        delivery_charge=delivery_charge,
        delivery_address=request.data.get("address", ""),
        phone=request.data.get("phone", ""),
        instructions=request.data.get("instructions", ""),
        razorpay_payment_id=request.data.get("razorpay_payment_id", "")
    )

    order_items_response = []

    for item in cart_items:
        product    = item.product
        vendor     = product.vendor
        item_price = get_price(product)
        item_total = item.quantity * item_price

        commission_rate  = vendor.vendor_profile.commission_rate if vendor and hasattr(vendor, "vendor_profile") else 0
        admin_commission = (item_total * commission_rate) / 100
        vendor_earning   = item_total - admin_commission

        OrderItem.objects.create(
            order=order,
            product=product,
            vendor=vendor,
            quantity=item.quantity,
            price=item_price,
            vendor_earning=vendor_earning,
            admin_commission=admin_commission
        )

        if vendor and hasattr(vendor, "vendor_profile"):
            vendor.vendor_profile.total_earnings += vendor_earning
            vendor.vendor_profile.save()

        order_items_response.append({
            "name":     product.name,
            "quantity": item.quantity,
            "price":    float(item_price),
            "subtotal": float(item_total),
            "vendor":   vendor.vendor_profile.shop_name if vendor and hasattr(vendor, "vendor_profile") else "NammaFreshMart",
        })

    cart_items.delete()

    if payment_method == "wallet":
        wallet.balance -= total
        wallet.save()
        WalletTransaction.objects.create(
            wallet=wallet,
            amount=total,
            transaction_type="debit",
            description=f"Order #{order.id} payment"
        )

    estimated_delivery = (datetime.now() + timedelta(minutes=30)).strftime("%I:%M %p")

    return Response({
        "message":            "Order placed successfully",
        "order_id":           order.id,
        "items":              order_items_response,
        "subtotal":           float(subtotal),
        "delivery_charge":    delivery_charge,
        "total_amount":       float(total),
        "payment_method":     payment_method,
        "delivery_address":   request.data.get("address", ""),
        "estimated_delivery": f"Today by {estimated_delivery}",
        "free_delivery":      delivery_charge == 0,
=======
    cart = Cart.objects.get(user=request.user)

    total = sum(
        item.quantity * item.product.price
        for item in cart.items.all()
    )

    order = Order.objects.create(
        user=request.user,
        total_amount=total
    )

    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    cart.items.all().delete()

    return Response({
        "message": "Order placed successfully",
        "order_id": order.id
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_list(request):
<<<<<<< HEAD
    orders = Order.objects.filter(user=request.user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# =========================
# AUTH – MOBILE OTP
=======
    orders = Order.objects.filter(user=request.user)
    return Response(OrderSerializer(orders, many=True).data)

# =========================
# AUTH – EMAIL OTP SIGNUP
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
# =========================

@api_view(["POST"])
def signup(request):
<<<<<<< HEAD
    phone    = request.data.get("phone")
    username = request.data.get("username")
    password = request.data.get("password")

    if not phone or len(str(phone)) != 10:
        return Response({"error": "Valid 10 digit phone number required"}, status=400)

    if not username:
        return Response({"error": "Username required"}, status=400)

    if not password or len(password) < 6:
        return Response({"error": "Password must be at least 6 characters"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    if User.objects.filter(phone=phone).exists():
        return Response({"error": "Phone number already registered"}, status=400)

    otp = str(random.randint(100000, 999999))

    EmailOTP.objects.update_or_create(
        email=phone,
        defaults={"otp": otp, "created_at": timezone.now()}
    )

    send_sms_otp(phone, otp)

    return Response({"message": "OTP sent to WhatsApp"})


@api_view(["POST"])
def verify_otp(request):
    phone    = request.data.get("phone")
    otp      = request.data.get("otp")
    username = request.data.get("username")
    password = request.data.get("password")

    otp_obj = EmailOTP.objects.filter(email=phone, otp=otp).first()

    if not otp_obj:
        return Response({"error": "Invalid OTP"}, status=400)

    if timezone.now() - otp_obj.created_at > timedelta(minutes=5):
        otp_obj.delete()
        return Response({"error": "OTP expired. Request a new one."}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    if User.objects.filter(phone=phone).exists():
        return Response({"error": "Phone already registered"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=f"{phone}@nammafreshmart.com",
        password=password,
        role="customer",
        phone=phone
    )

    Wallet.objects.get_or_create(user=user)
    otp_obj.delete()

    print(f"✅ New user: {username} | Phone: {phone}")

    return Response({"message": "Account created successfully!"})


# =========================
# WALLET
# =========================

class WalletDetailView(generics.RetrieveAPIView):
    serializer_class   = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        wallet, _ = Wallet.objects.get_or_create(user=self.request.user)
        return wallet


# =========================
# MEMBERSHIP ORDER
# =========================

class CreateMembershipOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name  = request.data.get("name")
        email = request.data.get("email")
        phone = request.data.get("phone")
        plan  = request.data.get("plan")

        if plan == "yearly":
            amount   = 600
            duration = 365
        else:
            amount   = 100
            duration = 30

        MembershipForm.objects.create(user=request.user, name=name, email=email, phone=phone)

        order = client.order.create({
            "amount":          amount * 100,
            "currency":        "INR",
            "payment_capture": 1
        })

        return Response({"order_id": order["id"], "amount": amount, "duration": duration})


# =========================
# VERIFY MEMBERSHIP PAYMENT
# =========================

class VerifyMembershipPayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("razorpay_payment_id")
        order_id   = request.data.get("razorpay_order_id")
        signature  = request.data.get("razorpay_signature")
        amount     = request.data.get("amount")

        if not amount:
            return Response({"error": "Amount missing"}, status=400)

        amount = int(amount)

        try:
            client.utility.verify_payment_signature({
                "razorpay_payment_id": payment_id,
                "razorpay_order_id":   order_id,
                "razorpay_signature":  signature
            })
        except:
            return Response({"error": "Payment verification failed"}, status=400)

        plan_name = request.data.get("plan")
        duration  = 365 if plan_name == "yearly" else 30
        expiry    = timezone.now() + timedelta(days=duration)

        try:
            plan = MembershipPlan.objects.get(name=plan_name)
        except MembershipPlan.DoesNotExist:
            return Response({"error": "Invalid plan"}, status=400)

        UserMembership.objects.create(
            user=request.user,
            plan=plan,
            expiry_date=expiry,
            active=True
        )

        request.user.is_member = True
        request.user.save()

        return Response({"message": "Membership Activated"})


# =========================
# WALLET RAZORPAY
# =========================

class WalletCreateOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = int(request.data.get("amount"))
        order  = client.order.create({
            "amount":          amount * 100,
            "currency":        "INR",
            "payment_capture": 1
        })
        return Response({"id": order["id"], "amount": amount})


class WalletVerifyPayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("razorpay_payment_id")
        order_id   = request.data.get("razorpay_order_id")
        signature  = request.data.get("razorpay_signature")
        amount     = int(request.data.get("amount"))

        try:
            client.utility.verify_payment_signature({
                "razorpay_payment_id": payment_id,
                "razorpay_order_id":   order_id,
                "razorpay_signature":  signature
            })
        except:
            return Response({"error": "Payment verification failed"}, status=400)

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        wallet.balance += amount
        wallet.save()

        WalletTransaction.objects.create(
            wallet=wallet,
            amount=amount,
            transaction_type="credit",
            description="Money added via Razorpay"
        )

        return Response({"message": "Money added to wallet", "balance": wallet.balance})


# =========================
# VENDOR AUTH
# =========================

@api_view(["POST"])
def vendor_register(request):
    email     = request.data.get("email")
    username  = request.data.get("username")
    password  = request.data.get("password")
    shop_name = request.data.get("shop_name")
    phone     = request.data.get("phone")
    address   = request.data.get("address")

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    if not shop_name:
        return Response({"error": "Shop name zaroori hai"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role="vendor",
        phone=phone or ""
    )

    VendorProfile.objects.create(
        user=user,
        shop_name=shop_name,
        phone=phone,
        address=address,
        status="pending"
    )

    return Response({"message": "Registration successful. Wait for admin approval."})


# =========================
# VENDOR DASHBOARD
# =========================

@api_view(["GET"])
@permission_classes([IsVendor])
def vendor_dashboard(request):
    vendor   = request.user.vendor_profile
    products = Product.objects.filter(vendor=request.user)
    orders   = OrderItem.objects.filter(vendor=request.user)

    return Response({
        "shop_name":       vendor.shop_name,
        "total_products":  products.count(),
        "total_orders":    orders.count(),
        "total_earnings":  vendor.total_earnings,
        "commission_rate": vendor.commission_rate,
        "status":          vendor.status
    })


# =========================
# VENDOR PRODUCTS (CRUD)
# =========================

@api_view(["GET", "POST"])
@permission_classes([IsVendor])
def vendor_products(request):
    if request.method == "GET":
        products   = Product.objects.filter(vendor=request.user)
        serializer = VendorProductSerializer(products, many=True, context={"request": request})
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = VendorProductSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(vendor=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["PUT", "DELETE"])
@permission_classes([IsVendor])
def vendor_product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk, vendor=request.user)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    if request.method == "PUT":
        serializer = VendorProductSerializer(
            product, data=request.data,
            partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == "DELETE":
        product.delete()
        return Response({"message": "Product deleted"})


# =========================
# VENDOR ORDERS
# =========================

@api_view(["GET"])
@permission_classes([IsVendor])
def vendor_orders(request):
    items = OrderItem.objects.filter(
        vendor=request.user
    ).select_related("order", "product", "order__user")

    data = []
    for item in items:
        data.append({
            "order_id":         item.order.id,
            "customer":         item.order.user.username,
            "product":          item.product.name,
            "quantity":         item.quantity,
            "price":            item.price,
            "vendor_earning":   float(item.vendor_earning),
            "admin_commission": float(item.admin_commission),
            "status":           item.order.status,
            "date":             item.order.created_at
        })

    return Response(data)


# =========================
# ADMIN APIs
# =========================

@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_all_vendors(request):
    vendors    = VendorProfile.objects.select_related("user").all()
    serializer = VendorProfileSerializer(vendors, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_approve_vendor(request, vendor_id):
    try:
        vendor = VendorProfile.objects.get(id=vendor_id)
    except VendorProfile.DoesNotExist:
        return Response({"error": "Vendor not found"}, status=404)

    action = request.data.get("action")

    if action == "approve":
        vendor.status = "approved"
        vendor.save()
        return Response({"message": f"{vendor.shop_name} approved!"})
    elif action == "reject":
        vendor.status = "rejected"
        vendor.save()
        return Response({"message": f"{vendor.shop_name} rejected."})

    return Response({"error": "Invalid action"}, status=400)


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_set_commission(request, vendor_id):
    try:
        vendor = VendorProfile.objects.get(id=vendor_id)
    except VendorProfile.DoesNotExist:
        return Response({"error": "Vendor not found"}, status=404)

    commission = request.data.get("commission_rate")
    vendor.commission_rate = commission
    vendor.save()
    return Response({"message": f"Commission set to {commission}% for {vendor.shop_name}"})


@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_all_orders(request):
    orders = Order.objects.all().select_related("user").prefetch_related("items__product")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# =========================
# ADMIN — DELIVERY BOY
# =========================

@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_add_delivery_boy(request):
    username       = request.data.get("username")
    email          = request.data.get("email")
    password       = request.data.get("password")
    phone          = request.data.get("phone")
    vehicle_number = request.data.get("vehicle_number", "")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role="delivery",
        phone=phone or ""
    )

    DeliveryBoy.objects.create(
        user=user,
        phone=phone,
        vehicle_number=vehicle_number,
        is_active=True,
        status="available"
    )

    return Response({"message": f"Delivery boy {username} added successfully!"})


@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_all_delivery_boys(request):
    boys       = DeliveryBoy.objects.select_related("user").all()
    serializer = DeliveryBoySerializer(boys, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_remove_delivery_boy(request, boy_id):
    try:
        boy = DeliveryBoy.objects.get(id=boy_id)
    except DeliveryBoy.DoesNotExist:
        return Response({"error": "Delivery boy not found"}, status=404)

    boy.is_active      = False
    boy.user.is_active = False
    boy.user.save()
    boy.save()
    return Response({"message": "Delivery boy removed"})


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_toggle_delivery_boy(request, boy_id):
    try:
        boy = DeliveryBoy.objects.get(id=boy_id)
    except DeliveryBoy.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    action = request.data.get("action")

    if action == "approve":
        boy.is_active      = True
        boy.status         = "available"
        boy.user.is_active = True
        boy.user.save()
        boy.save()
        return Response({"message": f"{boy.user.username} approved!"})
    elif action == "remove":
        boy.is_active      = False
        boy.status         = "offline"
        boy.user.is_active = False
        boy.user.save()
        boy.save()
        return Response({"message": f"{boy.user.username} removed."})

    return Response({"error": "Invalid action"}, status=400)


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_assign_delivery(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    boy_id = request.data.get("delivery_boy_id")
    try:
        boy = DeliveryBoy.objects.get(id=boy_id, is_active=True)
    except DeliveryBoy.DoesNotExist:
        return Response({"error": "Delivery boy not found"}, status=404)

    tracking, _ = OrderTracking.objects.get_or_create(order=order)
    tracking.delivery_boy = boy
    tracking.status       = "ASSIGNED"
    tracking.assigned_at  = timezone.now()
    tracking.save()

    order.status = "ASSIGNED"
    order.save()

    boy.status = "busy"
    boy.save()

    return Response({"message": f"Order #{order_id} assigned to {boy.user.username}"})


@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_unassigned_orders(request):
    orders = Order.objects.filter(
        status="PLACED"
    ).exclude(
        tracking__status__in=["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"]
    ).select_related("user")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# =========================
# DELIVERY BOY APIs
# =========================

@api_view(["POST"])
def delivery_register(request):
    username       = request.data.get("username")
    email          = request.data.get("email")
    password       = request.data.get("password")
    phone          = request.data.get("phone")
    vehicle_number = request.data.get("vehicle_number", "")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role="delivery",
        phone=phone or ""
    )

    DeliveryBoy.objects.create(
        user=user,
        phone=phone,
        vehicle_number=vehicle_number,
        is_active=False,
        status="offline"
    )

    return Response({"message": "Registration successful. Wait for admin approval."})


@api_view(["GET"])
@permission_classes([IsDeliveryBoy])
def delivery_dashboard(request):
    boy = request.user.delivery_profile
    active_orders = OrderTracking.objects.filter(
        delivery_boy=boy,
        status__in=["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"]
    ).count()

    return Response({
        "username":         request.user.username,
        "status":           boy.status,
        "is_active":        boy.is_active,
        "total_deliveries": boy.total_deliveries,
        "active_orders":    active_orders,
        "current_lat":      boy.current_lat,
        "current_lng":      boy.current_lng,
    })


@api_view(["GET"])
@permission_classes([IsDeliveryBoy])
def delivery_my_orders(request):
    boy = request.user.delivery_profile
    trackings = OrderTracking.objects.filter(
        delivery_boy=boy
    ).exclude(
        status__in=["DELIVERED", "CANCELLED"]
    ).select_related("order__user", "order")

    data = []
    for t in trackings:
        data.append({
            "tracking_id":      t.id,
            "order_id":         t.order.id,
            "customer_name":    t.order.user.username,
            "customer_phone":   t.order.phone,
            "delivery_address": t.order.delivery_address,
            "total_amount":     t.order.total_amount,
            "status":           t.status,
            "instructions":     t.order.instructions,
            "assigned_at":      t.assigned_at,
        })

    return Response(data)


@api_view(["POST"])
@permission_classes([IsDeliveryBoy])
def delivery_update_status(request, tracking_id):
    try:
        tracking = OrderTracking.objects.get(
            id=tracking_id,
            delivery_boy=request.user.delivery_profile
        )
    except OrderTracking.DoesNotExist:
        return Response({"error": "Tracking not found"}, status=404)

    new_status = request.data.get("status")
    allowed    = ["PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]

    if new_status not in allowed:
        return Response({"error": f"Invalid status. Allowed: {allowed}"}, status=400)

    tracking.status       = new_status
    tracking.order.status = new_status

    if new_status == "PICKED_UP":
        tracking.picked_up_at = timezone.now()
    elif new_status == "DELIVERED":
        tracking.delivered_at = timezone.now()
        request.user.delivery_profile.status = "available"
        request.user.delivery_profile.total_deliveries += 1
        request.user.delivery_profile.save()
    elif new_status == "CANCELLED":
        request.user.delivery_profile.status = "available"
        request.user.delivery_profile.save()

    tracking.save()
    tracking.order.save()

    return Response({"message": f"Status updated to {new_status}"})


@api_view(["POST"])
@permission_classes([IsDeliveryBoy])
def delivery_update_location(request):
    lat = request.data.get("lat")
    lng = request.data.get("lng")

    boy             = request.user.delivery_profile
    boy.current_lat = lat
    boy.current_lng = lng
    boy.save()

    OrderTracking.objects.filter(
        delivery_boy=boy,
        status__in=["PICKED_UP", "OUT_FOR_DELIVERY"]
    ).update(current_lat=lat, current_lng=lng)

    return Response({"message": "Location updated"})


# =========================
# CUSTOMER — ORDER TRACKING
# =========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def customer_track_order(request, order_id):
    try:
        order    = Order.objects.get(id=order_id, user=request.user)
        tracking = OrderTracking.objects.get(order=order)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)
    except OrderTracking.DoesNotExist:
        return Response({
            "order_id":     order.id,
            "status":       order.status,
            "delivery_boy": None,
            "location":     None
        })

    return Response({
        "order_id":           order.id,
        "status":             tracking.status,
        "delivery_boy_name":  tracking.delivery_boy.user.username if tracking.delivery_boy else None,
        "delivery_boy_phone": tracking.delivery_boy.phone if tracking.delivery_boy else None,
        "current_lat":        tracking.current_lat,
        "current_lng":        tracking.current_lng,
        "assigned_at":        tracking.assigned_at,
        "picked_up_at":       tracking.picked_up_at,
        "delivered_at":       tracking.delivered_at,
    })


# =========================
# DELIVERY SETTINGS
# =========================

@api_view(["GET"])
def get_delivery_settings(request):
    setting = DeliverySettings.objects.first()
    if not setting:
        return Response({"delivery_charge": 40, "free_delivery_above": 500})
    return Response({
        "delivery_charge":     float(setting.delivery_charge),
        "free_delivery_above": float(setting.free_delivery_above),
    })


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_update_delivery_settings(request):
    setting, _ = DeliverySettings.objects.get_or_create(id=1)
    charge     = request.data.get("delivery_charge")
    free_above = request.data.get("free_delivery_above")

    if charge is not None:
        setting.delivery_charge = charge
    if free_above is not None:
        setting.free_delivery_above = free_above

    setting.save()
    return Response({
        "message":             "Delivery settings updated!",
        "delivery_charge":     float(setting.delivery_charge),
        "free_delivery_above": float(setting.free_delivery_above),
    })
=======
    email = request.data.get("email")
    username = request.data.get("username")
    password = request.data.get("password")

    # Validation
    if not email or not username or not password:
        return Response(
            {"error": "Email, username and password are required"},
            status=400
        )

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    # Generate OTP
    otp = str(random.randint(100000, 999999))

    EmailOTP.objects.update_or_create(
        email=email,
        defaults={
            "otp": otp,
            "is_verified": False,
            "created_at": timezone.now()
        }
    )

    send_mail(
        subject="FishMart OTP Verification",
        message=f"Your OTP is {otp}",
        from_email=None,
        recipient_list=[email],
        fail_silently=False
    )

    return Response({"message": "OTP sent to email"})


# @api_view(["POST"])
# def verify_otp(request):
#     email = request.data.get("email")
#     otp = request.data.get("otp")
#     username = request.data.get("username")
#     password = request.data.get("password")

#     if not all([email, otp, username, password]):
#         return Response({"error": "All fields required"}, status=400)

#     try:
#         otp_obj = EmailOTP.objects.get(
#             email=email,
#             otp=otp,
#             is_verified=False
#         )
#     except EmailOTP.DoesNotExist:
#         return Response({"error": "Invalid OTP"}, status=400)

#     # OTP expiry check (5 minutes)
#     if timezone.now() > otp_obj.created_at + timedelta(minutes=5):
#         return Response({"error": "OTP expired"}, status=400)

#     # Create user
#     User.objects.create_user(
#         username=username,
#         email=email,
#         password=password
#     )

#     otp_obj.is_verified = True
#     otp_obj.save()

#     return Response({"message": "Account verified successfully"})

@api_view(["POST"])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    username = request.data.get("username")
    password = request.data.get("password")

    if not all([email, otp, username, password]):
        return Response(
            {"error": "All fields are required"},
            status=400
        )

    try:
        otp_obj = EmailOTP.objects.get(
            email=email,
            otp=otp,
            is_verified=False
        )
    except EmailOTP.DoesNotExist:
        return Response({"error": "Invalid OTP"}, status=400)

    # OTP expiry (5 min)
    from django.utils import timezone
    from datetime import timedelta

    if timezone.now() > otp_obj.created_at + timedelta(minutes=5):
        return Response({"error": "OTP expired"}, status=400)

    # 🔴 IMPORTANT CHECKS
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=400
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already registered"},
            status=400
        )

    # ✅ Create user safely
    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    otp_obj.is_verified = True
    otp_obj.save()

    return Response({"message": "Account verified successfully"})

@api_view(["GET"])
def product_list(request):
    category = request.GET.get('category')  # Get category from query params
    
    if category and category != 'all':
        # Filter products by category name
        products = Product.objects.filter(category__name__iexact=category)
    else:
        # Return all products
        products = Product.objects.all()
    
    return Response(ProductSerializer(products, many=True).data)
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
