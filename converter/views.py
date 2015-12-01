import time
import json
import urllib2

from django.template import RequestContext, loader
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from converter.serializers import CurrencyRateRUBSerializer
from converter.models import CurrencyRateRUB

class CurrencyRateRUBViewSet(viewsets.ModelViewSet):
    queryset = CurrencyRateRUB.objects.all().order_by('-timestamp')
    serializer_class = CurrencyRateRUBSerializer

@api_view(['GET'])
def sync_rates(request):
    app_id = "c3168589c8c34228bfd818b2ae2dad91"
    url = "https://openexchangerates.org/api/latest.json?app_id=" + app_id
    rates_count = CurrencyRateRUB.objects.count()
    if rates_count != 0:
        time_now = int(time.time())
        last_upd_time = int(CurrencyRateRUB.objects.all()[rates_count-1].timestamp)
        if time_now - last_upd_time < 3600:
            return Response({'status': 'err'}, \
                status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        rates_data = json.load(urllib2.urlopen(url))
        rub_rate = rates_data['rates']['RUB']
        try_rate = rates_data['rates']['TRY']
        mxn_rate = rates_data['rates']['MXN']
        kes_rate = rates_data['rates']['KES']

        rates_rub = {'TRY': try_rate/rub_rate, \
                     'MXN': mxn_rate/rub_rate, \
                     'KES': kes_rate/rub_rate, \
                     'timestamp': rates_data['timestamp']
        }

        new_currency_rate = CurrencyRateRUB(rate_TRY = try_rate/rub_rate, \
                                            rate_MXN = mxn_rate/rub_rate, \
                                            rate_KES = kes_rate/rub_rate, \
                                            timestamp = rates_data['timestamp']
        )
        new_currency_rate.save()
        return Response(rates_rub, status=status.HTTP_201_CREATED)
    return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def currencies_list(request):
    """List all currencies, or create a new snippet.

    """
    if request.method == 'GET':
        currencies = CurrencyRateRUB.objects.all().order_by('-timestamp')
        serializer = CurrencyRateRUBSerializer(currencies, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CurrencyRateRUBSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def index(request):
    template = loader.get_template('converter/index.html')
    return render(request, 'converter/index.html')
