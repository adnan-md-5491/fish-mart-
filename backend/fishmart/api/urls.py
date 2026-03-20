from django.urls import path
<<<<<<< HEAD
from django.conf import settings
from django.conf.urls.static import static
=======
from .views import update_cart_item
from .views import remove_cart_item
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
<<<<<<< HEAD

from .views import *

urlpatterns = [


    # Categories & Products
    path("categories/", category_list),
    path("products/", product_list),

    # Cart
    path("cart/add/", add_to_cart),
    path("cart/", view_cart),
    path("cart/update/", update_cart_item),
    path("cart/remove/", remove_cart_item),

    # Orders
    path("order/create/", create_order),
    path("orders/", order_list),
    path("delivery/register/", delivery_register),
    path("admin/delivery-boys/<int:boy_id>/toggle/", admin_toggle_delivery_boy),

    # Auth
    path("signup/", signup),
    path("login/", CustomTokenView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("verify-otp/", verify_otp),

    # Wallet
    path("wallet/", WalletDetailView.as_view()),
    path("wallet/create-order/", WalletCreateOrder.as_view()),
    path("wallet/verify-payment/", WalletVerifyPayment.as_view()),

    # Membership
    path("membership/create-order/", CreateMembershipOrder.as_view()),
    path("membership/verify-payment/", VerifyMembershipPayment.as_view()),
    # urls.py mein add karo

# Vendor
    path("vendor/register/", vendor_register),
    path("vendor/dashboard/", vendor_dashboard),
    path("vendor/products/", vendor_products),
    path("vendor/products/<int:pk>/", vendor_product_detail),
    path("vendor/orders/", vendor_orders),

# Admin
    path("admin/vendors/", admin_all_vendors),
    path("admin/vendors/<int:vendor_id>/approve/", admin_approve_vendor),
    path("admin/vendors/<int:vendor_id>/commission/", admin_set_commission),
    path("admin/orders/", admin_all_orders),
# Delivery Boy — Admin
    path("admin/delivery-boys/",              admin_all_delivery_boys),
    path("admin/delivery-boys/add/",          admin_add_delivery_boy),
    path("admin/delivery-boys/<int:boy_id>/remove/", admin_remove_delivery_boy),
    path("admin/orders/<int:order_id>/assign/",      admin_assign_delivery),
    path("admin/orders/unassigned/",          admin_unassigned_orders),

# Delivery Boy — Own Panel
    path("delivery/dashboard/",              delivery_dashboard),
    path("delivery/orders/",                 delivery_my_orders),
    path("delivery/orders/<int:tracking_id>/status/", delivery_update_status),
    path("delivery/location/",               delivery_update_location),

# Customer Tracking
    path("orders/<int:order_id>/track/",     customer_track_order),
    path("delivery-settings/",              get_delivery_settings),
    path("admin/delivery-settings/update/", admin_update_delivery_settings),
    

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
=======
from .views import signup,verify_otp
from .views import (
    category_list,
    product_list,
    add_to_cart,
    view_cart,
    create_order,
    order_list,
)

urlpatterns = [
    path("categories/", category_list),
    path("products/", product_list),
    path("cart/add/", add_to_cart),
    path("cart/", view_cart),
    path("order/create/", create_order),
    path("orders/", order_list),
    path("cart/update/", update_cart_item),
    path("cart/remove/", remove_cart_item),
    path("signup/", signup),
    path("login/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("verify-otp/", verify_otp),
]
>>>>>>> 6be25334d9c8bb8dbb6252b2202710f68d09f422
