from django.db import models

class CurrencyRateRUB(models.Model):
    rate_TRY = models.FloatField()
    rate_MXN = models.FloatField()
    rate_KES = models.FloatField()
    timestamp = models.IntegerField()

    def __unicode__(self):
        return '1 RUB is: ' + str(self.rate_TRY) + ' TRY, ' + \
        str(self.rate_MXN) + ' MXN, ' + str(self.rate_KES) + ' KES.'

    def get_info(self):
    	return '1 RUB is: ' + str(self.rate_TRY) + ' TRY, ' + \
        str(self.rate_MXN) + ' MXN, ' + str(self.rate_KES) + ' KES.'
