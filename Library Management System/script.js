let books = []

const form = document.getElementById("bookForm")
const tableBody = document.getElementById("bookTableBody")
const searchInput = document.getElementById("searchInput")

const savedBooks = localStorage.getItem("books")

if(savedBooks){
books = JSON.parse(savedBooks)
renderTable()
}

form.addEventListener("submit", function(e){

e.preventDefault()

const book = {
id:document.getElementById("bookId").value,
name:document.getElementById("bookName").value,
author:document.getElementById("author").value,
category:document.getElementById("category").value,
status:"Available"
}

books.push(book)

localStorage.setItem("books", JSON.stringify(books))

renderTable()

form.reset()

})

function renderTable(filteredBooks = books){

tableBody.innerHTML=""

filteredBooks.forEach((book,index)=>{

const row = document.createElement("tr")

row.innerHTML = `
<td>${book.id}</td>
<td>${book.name}</td>
<td>${book.author}</td>
<td>${book.category}</td>

<td class="${book.status === "Available" ? "available" : "issued"}">
${book.status}
</td>

<td>

<button class="action-btn issue" onclick="toggleStatus(${index})">
Issue
</button>

<button class="action-btn delete" onclick="deleteBook(${index})">
Delete
</button>

</td>
`

tableBody.appendChild(row)

})

}

function toggleStatus(index){

if(books[index].status === "Available"){
books[index].status = "Issued"
}else{
books[index].status = "Available"
}

localStorage.setItem("books", JSON.stringify(books))

renderTable()

}

function deleteBook(index){

books.splice(index,1)

localStorage.setItem("books", JSON.stringify(books))

renderTable()

}

searchInput.addEventListener("input", function(){

const keyword = this.value.toLowerCase()

const filtered = books.filter(book =>
book.name.toLowerCase().includes(keyword) ||
book.author.toLowerCase().includes(keyword) ||
book.category.toLowerCase().includes(keyword)
)

renderTable(filtered)

})