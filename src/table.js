const isNonEmptyArray = (arrayElement) => {
  return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
  if (
    !isNonEmptyArray(columnsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId
  ) {
    console.log(isNonEmptyArray(columnsArray));
    console.log(isNonEmptyArray(dataArray));
    throw new Error(
      "Para correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o ID do elemento tabela selecionado."
    );
  }
  const tableElement = document.getElementById(tableId);

  if (!tableElement || tableElement.nodeName !== "TABLE") {
    throw new Error("Id informado não corresponde a nenhum elemento table");
  }

  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
  function createTheadElement(tableReference) {
    const thead = document.createElement("thead");
    tableReference.appendChild(thead);
    return thead;
  }
  const tableHeadReference =
    tableReference.querySelector("thead") ?? createTheadElement(tableReference);
  const headeRow = document.createElement("tr");
  ["bg-blue-900", "text-slate-200", "sticky", "top-0"].forEach((cssClass) =>
    headeRow.classList.add(cssClass)
  );
  for (const tableColumnObject of columnsArray) {
    const headerElement = `<th class="text-center">${tableColumnObject.columnLabel}</th>`;
    headeRow.innerHTML += headerElement;
  }
  tableHeadReference.appendChild(headeRow);
}

function createTableBody(tableReference, tableItems, columnsArray) {
  function createTbodyElement(tableReference) {
    const tbody = document.createElement("tbody");
    tableReference.appendChild(tbody);
    return tbody;
  }
  const tableTbodyReference =
    tableReference.querySelector("tbody") ?? createTbodyElement(tableReference);

  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement("tr");
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add("bg-blue-200");
    }

    for (const tableColumn of columnsArray) {
      const formatFn = tableColumn.format ?? ((info) => info);
      tableRow.innerHTML += `<td class="text-center">${formatFn(
        tableItem[tableColumn.accessor]
      )}</td>`;
    }
    tableReference.appendChild(tableRow);
  }
}
