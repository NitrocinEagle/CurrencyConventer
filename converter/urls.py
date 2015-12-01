from django.conf.urls import url, include

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'currency_rate_RUB', views.CurrencyRateRUBViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^api/sync_rates/$', views.sync_rates, name='sync_rates'),
	url(r'^api/currencies_list/', views.currencies_list),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

