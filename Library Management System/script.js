const form = document.getElementById("bookForm");
const tableBody = document.getElementById("bookTableBody");

form.addEventListener("submit", function(event) {

    event.preventDefault(); // stop page refresh

    const name = document.getElementById("bookName").value;
    const author = document.getElementById("author").value;
    const id = document.getElementById("bookId").value;
    const category = document.getElementById("category").value;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${author}</td>
        <td>${category}</td>
    `;

    tableBody.appendChild(row);

    form.reset(); // clear inputs
});
