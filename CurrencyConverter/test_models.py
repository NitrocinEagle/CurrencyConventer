from django.test import TestCase
from converter.models import CurrencyRateRUB

class CurrencyRateRUBTestCase(TestCase):
    def setUp(self):
        CurrencyRateRUB.objects.create(rate_TRY=1.1, rate_MXN=2.2, rate_KES=3.3, timestamp=1448719211)
        CurrencyRateRUB.objects.create(rate_TRY=1.2, rate_MXN=2.3, rate_KES=3.4, timestamp=1448722811)

    def test_1(self):
        rate_one = CurrencyRateRUB.objects.get(timestamp=1448719211) 
        self.assertEqual(rate_one.get_info(), '1 RUB is: 1.1 TRY, 2.2 MXN, 3.3 KES.')

    def test_2(self):
        rate_two = CurrencyRateRUB.objects.get(timestamp=1448722811)
        self.assertEqual(rate_two.get_info(), '1 RUB is: 1.2 TRY, 2.3 MXN, 3.4 KES.')