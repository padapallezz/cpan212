//total revenue calculation
function calcRevenue(sales){
    return sales.reduce((sum, r)=> sum+ r.amount, 0);
}



//forecast average revenue
function avgForecast(forecasts){
    if(!forecasts.lenght) return 0;
    const total = forecasts. reduce((sum, f) => sum + f.expectedAmount, 0);
    return total/ forecasts.length;
}
//what-if scenario

function whatifAnalysis(revenues, percentageChange){
    return revenues.map((r) => ({
        ...r, 
        simulatedAmount: Math.round(r.amount * (1 + percentageChange / 100)),
    }));
}

module.exports = {calcRevenue, avgForecast, whatifAnalysis};