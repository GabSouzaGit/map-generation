export const entityIDs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => {
    const option = document.createElement("option");
    option.value = letter;
    option.textContent = letter;
    return option;
});

export const tableID = "#matrix";