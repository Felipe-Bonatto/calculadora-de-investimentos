import { generateReturnArray } from "./src/investmentGoals.js";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table.js";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investment-form");
const clearFormButtom = document.getElementById("clear-form");
let doughnutChartReference = {};
let progesseionChartReference = {};

const columnsArray = [
  { columnLabel: "Mês", accessor: "month" },
  {
    columnLabel: "Total investido",
    accessor: "investedAmound",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: "Rendimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: "Quantia total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrency(numberInfo),
  },
];
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  resetCharts();
  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountperiod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnArray(
    startingAmount,
    timeAmount,
    timeAmountperiod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  // doughnutChartReference = new Chart(finalMoneyChart, {
  //   type: "doughnut",
  //   data: {
  //     labels: ["Total investido", "Rendimento", "Imposto"],
  //     datasets: [
  //       {
  //         data: [
  //           formatCurrency(finalInvestmentObject.investedAmound),
  //           formatCurrency(
  //             finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
  //           ),
  //           formatCurrency(
  //             finalInvestmentObject.totalInterestReturns * (taxRate / 100)
  //           ),
  //         ],
  //         backgroundColor: [
  //           "rgb(255, 99, 132)",
  //           "rgb(54, 162, 235)",
  //           "rgb(255, 205, 86)",
  //         ],
  //         hoverOffset: 4,
  //       },
  //     ],
  //   },
  // });

  // progesseionChartReference = new Chart(progressionChart, {
  //   type: "bar",
  //   data: {
  //     labels: returnsArray.map((investmentObject) => investmentObject.month),
  //     datasets: [
  //       {
  //         label: "Total Investido",
  //         data: returnsArray.map((investmentObject) =>
  //           formatCurrency(investmentObject.investedAmound)
  //         ),
  //         backgroundColor: "rgb(255, 99, 132)",
  //       },
  //       {
  //         label: "Retorno do Investimento",
  //         data: returnsArray.map((investmentObject) =>
  //           formatCurrency(investmentObject.interestReturns)
  //         ),
  //         backgroundColor: "rgb(54, 162, 235)",
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: true,
  //     scales: {
  //       x: {
  //         stacked: true,
  //       },
  //       y: {
  //         stacked: true,
  //       },
  //     },
  //   },
  // });

  createTable(columnsArray, returnsArray, "results-table");
}

// verificar se os graficos estao vazios
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
// Limpar os gráficos
function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progesseionChartReference)
  ) {
    doughnutChartReference.destroy();
    progesseionChartReference.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  resetCharts();

  const errorinputContainers = document.querySelectorAll(".error");

  for (const errorinputContainer of errorinputContainers) {
    errorinputContainer.classList.remove("error");
    errorinputContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(event) {
  if (event.target.value === "") {
    return;
  }
  const { parentElement } = event.target;
  const grandParentElement = event.target.parentElement.parentElement;
  const inputValue = event.target.value.replace(",", ".");
  if (
    (!parentElement.classList.contains("error") && isNaN(inputValue)) ||
    Number(inputValue) < 0
  ) {
    // <p class="text-red-500">Insira um valor númerico e maior que zero</p>
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerText = "Insira um valor númerico e maior que zero";
    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", renderProgression);
clearFormButtom.addEventListener("click", clearForm);
