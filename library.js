//all books will be stored in an array
let library = []

//book constructor
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

//update read property on the book object and change color of button
function toggleRead(e) {
    let i = e.target.parentElement.id
    library[i].read = !library[i].read
    if (library[i].read == false) {
        e.target.className = 'readButton red'
        e.target.textContent = 'Status: Unread'
    } else {
        e.target.className = 'readButton green'
        e.target.textContent = 'Status: Read'
    }
}

//show and hide the form section
function toggleForm() {
    const formContainer = document.querySelector('#formContainer')
    if (formContainer.style.display === 'block') {
        formContainer.style.display = 'none'
      } else {
        formContainer.style.display = 'block'
      }
}

//clear all input from form fields
function resetForm() {
    const formTitle = document.querySelector('#title-input')
    formTitle.value = ''
    const formAuthor = document.querySelector('#author-input')
    formAuthor.value = ''
    const formPages = document.querySelector('#pages-input')
    formPages.value = ''
    const formRead = document.querySelector('#read-input')
    formRead.checked = false
    const formUnread = document.querySelector('#unread-input')
    formUnread.checked = false
}

//build card elements for each book and add to grid
function renderLibrary() {
    const grid = document.querySelector('#grid')
    grid.innerHTML = ''
    library.forEach(function buildCard(book) {
        const bookIndex = library.indexOf(book)
        const newCard = document.createElement('div')
        newCard.className = 'card'
        newCard.id = bookIndex
        let color = ''
        let text = ''
        if (book.read == true) {
            color = 'green'
            text = 'Read'
        } else {
            color = 'red'
            text = 'Unread'
        }
        newCard.innerHTML = `<p class='bookTitle'>${book.title} </p><p class='author'> Author: ${book.author} </p><p class='pages'> Pages: ${book.pages} </p><button class='readButton ${color}' id=${bookIndex}>Status: ${text}</button><button class='removeButton' id=${bookIndex}>Remove</button>`
        grid.appendChild(newCard)
    })
    saveLibrary()//save array to localStorage
}

//create new book object based on values of input fields, add to library
function addBookToLibrary() {
    let title = document.querySelector('#title-input').value
    let author = document.querySelector('#author-input').value
    let pages = document.querySelector('#pages-input').value
    let read = ''
    let readBox = document.querySelector('#read-input')
    if (readBox.checked == true) {
        read = true
    } else {
        read = false
    }
    if (title) {
        library.push(new Book(title, author, pages, read))
        resetForm()
        renderLibrary()
        addListeners()
    } else {
        document.querySelector('#title-input').focus()
    }
}

//remove book object from array then re-render library
function removeBook(e) {
    let i = e.target.parentElement.id
    library.splice(i, 1)
    renderLibrary()
    addListeners()
}

//add all button event listeners
function addListeners() {
    document.querySelector('#addABookButton').addEventListener('click', toggleForm)
    document.querySelector('#submit').addEventListener('click', addBookToLibrary)
    document.querySelectorAll('.readButton').forEach(function(elem) {
        elem.addEventListener('click', toggleRead)
    })
    document.querySelectorAll('.removeButton').forEach(function(elem) {
        elem.addEventListener('click', removeBook)
    })
}
addListeners()

//check if localStorage is available and supported
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            (storage && storage.length !== 0);
    }
}

//save library array to localStorage
function saveLibrary() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('library', JSON.stringify(library))
    }
}

//use library from localStorage or create placeholders on page load
function loadLibrary() {
    if (storageAvailable('localStorage')) {
        const savedLibraryString = localStorage.getItem('library')
        const savedLibraryParsed = JSON.parse(savedLibraryString)
        if (savedLibraryParsed == []) {
            library = []
            // console.log('we made it to option 1 (localStorage available and we have an empty saved library')
        } else if (savedLibraryParsed == null) {
            const example1 = new Book('One Flew Over the Cuckoo\'s Nest', 'Ken Kesey', 320, true)
            const example2 = new Book('The Fifth Season', 'N.K. Jemisin', 512, true)
            const example3 = new Book('Lonesome Dove', 'Larry McMurtry', 843, false)
            const example4 = new Book('American Gods', 'Neil Gaiman', 592, true)
            library.push(example1, example2, example3, example4)
            // console.log('we made it to option 2 (localStorage available but we have no saved library')
        } else {
            library = savedLibraryParsed
            // console.log('we made it to option 3 (localStorage available and we have something in our saved library')
        }
    } else {
        const example1 = new Book('One Flew Over the Cuckoo\'s Nest', 'Ken Kesey', 320, true)
        const example2 = new Book('The Fifth Season', 'N.K. Jemisin', 512, true)
        const example3 = new Book('Lonesome Dove', 'Larry McMurtry', 843, false)
        const example4 = new Book('American Gods', 'Neil Gaiman', 592, true)
        library.push(example1, example2, example3, example4)
        // console.log('we made it to option 4 (no localStorage available at all')
    }
    renderLibrary()
    addListeners()
}
window.onload = loadLibrary