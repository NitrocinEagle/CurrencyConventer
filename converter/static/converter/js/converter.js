function syncRates() {
    $.ajax({
        url: 'api/sync_rates/',
        type: "GET",
        data: null,
        contentType: "application/json",
    });
}
setTimeout(syncRates, 5000);

// Thank to Shurik_ for the function
function roundPlus(x, n) { //x - number, n - sign's count after '.'
    if(isNaN(x) || isNaN(n)) return false;
    var m = Math.pow(10,n);
    return Math.round(x*m)/m;
}

var CURRENCIES = {
    "RUB": {
        "name": "Российский рубль(RUB)",
        "sym": "Р"//₽"
    }, 
    "TRY": {
        "name": "Турецкая лира(TRY)", 
        "sym": "₺"
    }, 
    "MXN": { 
        "name": "Мексиканская песо(MXN)",
        "sym": "MXN$"
    }, 
    "KES": {
        "name": "Кенийский шилленг(KES)",
        "sym": "KSh"
    }
}
    
$(document).ready(function(){
var ViewModel = function() {
    this.currentRatesRUB = ko.observable([
        {   currency: CURRENCIES.TRY.name,
            rate: 0,},
        {   currency: CURRENCIES.MXN.name,
            rate: 0,},
        {   currency: CURRENCIES.KES.name,
            rate: 0,},
    ]);
    
    var currRatesRUB = this.currentRatesRUB;
    $.ajax({
            url: 'api/currencies_list/',
            type: "GET",
            data: null,
            contentType: "application/json",
            success: function (rates){
                rates = rates[0]; 
                //rates = rates[rates.length-1]; 
                    currRatesRUB([
                        {   currency: CURRENCIES.TRY.name,
                            rate: rates.rate_TRY,},
                        {   currency: CURRENCIES.MXN.name,
                            rate: rates.rate_MXN,},
                        {   currency: CURRENCIES.KES.name,
                            rate: rates.rate_KES,}
                    ]);
                }
    });
    this.currencySymbol = ko.observable(CURRENCIES.RUB.sym);
    this.optionValues = ko.observableArray([CURRENCIES.RUB.name, CURRENCIES.TRY.name, CURRENCIES.MXN.name, CURRENCIES.KES.name]);
    this.selectedCurrencyForSell = ko.observable(CURRENCIES.RUB.name);
    this.changedOptionValue = function() {
        curr = this.selectedCurrencyForSell()[0];
        if (curr == CURRENCIES.RUB.name) 
            this.currencySymbol(CURRENCIES.RUB.sym);
        if (curr == CURRENCIES.MXN.name) 
            this.currencySymbol(CURRENCIES.MXN.sym);
        if (curr == CURRENCIES.TRY.name) 
            this.currencySymbol(CURRENCIES.TRY.sym);
        if (curr == CURRENCIES.KES.name) 
            this.currencySymbol(CURRENCIES.KES.sym);
    };
    this.moneyForSell = ko.observable(0);
    
    this.exchangedCurrencies = ko.observable([
        {   currency: CURRENCIES.TRY.name,
            sum: 0,},
        {   currency: CURRENCIES.MXN.name,
            sum: 0,},
        {   currency: CURRENCIES.KES.name,
            sum: 0,},
    ]);
    
    
    this.sellClicked = function() {
        var selectedCurr = this.selectedCurrencyForSell();
        var exchangeSum = this.moneyForSell();
        var exchangeResult = this.exchangedCurrencies;
        
        $.ajax({
            url: 'api/currencies_list/',
            type: "GET",
            data: null,
            contentType: "application/json",
            success: function (rates){
                rates = rates[0];
                if (selectedCurr == CURRENCIES.RUB.name) {
                    exchangeResult([
                        {   currency: CURRENCIES.TRY.name,
                            sum: roundPlus(exchangeSum*rates.rate_TRY, 2),},
                        {   currency: CURRENCIES.MXN.name,
                            sum: roundPlus(exchangeSum*rates.rate_MXN, 2),},
                        {   currency: CURRENCIES.KES.name,
                            sum: roundPlus(exchangeSum*rates.rate_KES, 2),}
                    ]);
                }
                
                if (selectedCurr == CURRENCIES.TRY.name) {
                    exchangeResult([
                        {   currency: CURRENCIES.RUB.name,
                            sum: roundPlus(exchangeSum*1/rates.rate_TRY, 2),},
                        {   currency: CURRENCIES.MXN.name,
                            sum: roundPlus(exchangeSum*rates.rate_MXN/rates.rate_TRY, 2),},
                        {   currency: CURRENCIES.KES.name,
                            sum: roundPlus(exchangeSum*rates.rate_KES/rates.rate_TRY, 2),}
                    ]);
                }
                
                if (selectedCurr == CURRENCIES.MXN.name) {
                    exchangeResult([
                        {   currency: CURRENCIES.TRY.name,
                            sum: roundPlus(exchangeSum*rates.rate_TRY/rates.rate_MXN, 2),},
                        {   currency: CURRENCIES.MXN.name,
                            sum: roundPlus(exchangeSum*1/rates.rate_MXN, 2),},
                        {   currency: CURRENCIES.KES.name,
                            sum: roundPlus(exchangeSum*rates.rate_KES/rates.rate_MXN, 2),}
                    ]);
                }
                
                if (selectedCurr == CURRENCIES.KES.name) {
                    exchangeResult([
                        {   currency: CURRENCIES.TRY.name,
                            sum: roundPlus(exchangeSum*rates.rate_TRY/rates.rate_KES, 2),},
                        {   currency: CURRENCIES.MXN.name,
                            sum: roundPlus(exchangeSum*rates.rate_MXN/rates.rate_KES, 2),},
                        {   currency: CURRENCIES.RUB.name,
                            sum: roundPlus(exchangeSum*1/rates.rate_KES, 2),}
                    ]);
                }
            }
        });
    }
};
 
ko.applyBindings(new ViewModel());
});