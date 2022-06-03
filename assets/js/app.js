function openPopup() {
  const popup = document.querySelector(".pop-up");
  popup.classList.add("show");
}
openPopup();
function closePopup() {
  const popup = document.querySelector(".pop-up");
  popup.classList.remove("show");
}
closePopup();

//book class,constructor
class Book {
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
  }
}

//ui class
class UI {
  static displayBooks() {
    const books = storage.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `

      <td><span>Title</span>${book.title}</td>
      <td><span>Author</span>${book.author}</td>
      <td><span>Pages</span>${book.pages}</td>
      <td class="td-4"><a href="#" class="delete">Delete</a></td>
    `;

    list.appendChild(row);
  }
  //check if the traget has the class delete in it than remove the parent of the parent ,wiche means removing the tr
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(msg, className) {
    //create a div in the dom
    const message = document.createElement("div");
    //giving the div a class name
    message.className = `alert alert-${className}`;
    //giving the div a child element as text
    message.appendChild(document.createTextNode(msg));
    const container = document.querySelector(".sc-container");
    const popup = document.querySelector(".pop-up");
    //indesrt the div before the popup class the children of the container class
    container.insertBefore(message, popup);
    //vanich in threesecond
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearForm() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#pages").value = "";
  }
}

//local storage
class storage {
  static getBooks() {
    let books;
    //if there is no books in localstorage retuen empty array
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      //parse the input to use it as array of abject
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = storage.getBooks();
    //we push the parsed input into the parametre
    books.push(book);
    //stringify it to save in localstorage
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(pages) {
    const books = storage.getBooks();

    books.forEach((book, index) => {
      if (book.pages === pages) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//add a book
document.querySelector(".pop-up").addEventListener("submit", (e) => {
  //prevent default submit
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;

  //validation
  if (title === "" || author === "" || pages === "") {
    UI.showAlert("Enter fields", "enterfields");
  } else {
    //creatw book from book class
    const book = new Book(title, author, pages);
    //add the book to ui
    UI.addBookToList(book);

    //add book to local storage
    storage.addBook(book);

    //show success msg
    UI.showAlert("Book added", "bookadded");

    //clear the from
    UI.clearForm(book);
  }
});
//remove book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //remove from ui
  UI.deleteBook(e.target);

  //remove from local storage
  storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert("Book removed", "bookremoved");
});
