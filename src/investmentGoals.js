function convertToMonthlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

export function generateReturnArray(
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = "monthly",
  monthlyContribution = 0,
  returnRate = 0,
  returnTimeFrame = "monthly"
) {
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      "Investimento inicial e prazo devem ser preenchidos com valores positivos"
    );
  }
  const finalReturnRate =
    returnTimeFrame === "monthly"
      ? 1 + returnRate / 100
      : convertToMonthlyReturnRate(returnRate / 100);

  const finalTimeHorizon =
    timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

  const referenceInvestmentObject = {
    investedAmound: startingAmount,
    interestReturns: 0, // rendimento do ultimo mês
    totalInterestReturn: 0, // rendimento total
    month: 0,
    totalAmount: startingAmount,
  };

  const returnsArray = [referenceInvestmentObject];
  for (
    let timeReference = 1;
    timeReference <= finalTimeHorizon;
    timeReference++
  ) {
    const totalAmount =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate +
      monthlyContribution;
    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);
    const investedAmound = startingAmount + monthlyContribution * timeReference;
    const totalInterestReturns = totalAmount - investedAmound;

    returnsArray.push({
      investedAmound,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
  }

  return returnsArray;
}
