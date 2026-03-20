from rest_framework import serializers
<<<<<<< HEAD
from .models import Category, Product, Cart, CartItem, Order, OrderItem, Wallet


from .models import Category, Product, Cart, CartItem, Order, OrderItem, Wallet, WalletTransaction,VendorProfile,DeliveryBoy,OrderTracking

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ["id", "amount", "transaction_type", "description", "created_at"]

class WalletSerializer(serializers.ModelSerializer):
    transactions = WalletTransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ["balance", "transactions"]


class CategorySerializer(serializers.ModelSerializer):

=======
from .models import Category, Product, Cart, CartItem, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
    price = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True) 
    image = serializers.ImageField(use_url=True)  # <-- ADD THIS

    class Meta:
        model = Product
        fields = ["id", "name", "image", "price", "category_name"]   # <-- ADD category_name HERE

    def get_price(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated and request.user.is_member:
            return obj.member_price

        return obj.normal_price
class CartItemSerializer(serializers.ModelSerializer):

=======
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
<<<<<<< HEAD

=======
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
<<<<<<< HEAD

=======
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
<<<<<<< HEAD
        fields = [
            "id", "total_amount",
            "delivery_charge",      # ← yeh add karo
            "status", "created_at",
            "delivery_address", "phone", "instructions", "items"
        ]
class VendorProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = VendorProfile
        fields = [
            "id", "username", "email", "shop_name",
            "phone", "address", "commission_rate",
            "status", "total_earnings", "created_at"
        ]

class VendorProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.ImageField(use_url=True)
    normal_price = serializers.DecimalField(max_digits=10, decimal_places=2)  # ← add
    member_price = serializers.DecimalField(max_digits=10, decimal_places=2)  # ← add

    class Meta:
        model = Product
        fields = [
            "id", "name", "image",
            "normal_price", "member_price",   # ← dono price fields
            "stock", "category", "category_name", "is_active"
        ]
class DeliveryBoySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email    = serializers.CharField(source="user.email",    read_only=True)

    class Meta:
        model  = DeliveryBoy
        fields = [
            "id", "username", "email", "phone",
            "vehicle_number", "status", "is_active",
            "current_lat", "current_lng",
            "total_deliveries", "created_at"
        ]


class OrderTrackingSerializer(serializers.ModelSerializer):
    delivery_boy_name = serializers.CharField(
        source="delivery_boy.user.username", read_only=True
    )
    delivery_boy_phone = serializers.CharField(
        source="delivery_boy.phone", read_only=True
    )

    class Meta:
        model  = OrderTracking
        fields = [
            "id", "status",
            "delivery_boy_name", "delivery_boy_phone",
            "current_lat", "current_lng",
            "assigned_at", "picked_up_at", "delivered_at", "updated_at"
        ]
=======
        fields = "__all__"
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
