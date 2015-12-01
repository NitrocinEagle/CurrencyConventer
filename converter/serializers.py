from converter.models import CurrencyRateRUB
from rest_framework import serializers

class CurrencyRateRUBSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CurrencyRateRUB
        fields = ('rate_TRY', 'rate_MXN', 'rate_KES', 'timestamp')