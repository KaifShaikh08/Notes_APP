const popUpBox = document.querySelector(".popup-box");
const title = document.querySelector("form input");
const description = document.querySelector("form textarea");
const addBtn = document.querySelector("form button");
const addBox = document.querySelector(".add-box");

let editIndex = null;

const showMenu = (elem) => {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
};

const showPopUp = () => {
    popUpBox.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("popup-box") || e.target.classList.contains("uil", "uil-times")) {
            popUpBox.classList.remove("show");
        }
    });
};

const getNotes = () => {
    return JSON.parse(localStorage.getItem("NotesArr")) || [];
};

let notesVal = getNotes();

const loadNoteToDOM = (curr) => {
    const li = document.createElement("li");
    li.classList.add("note");
    li.innerHTML = `
        <div class="details">
            <p>${curr.title}</p>
            <span>${curr.desc}</span>
        </div>
        <div class="bottom-content">
            <span>${curr.date}</span>
            <div class="settings">
                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="menu">
                    <li onclick="editNoteHandler(this)"><i class="uil uil-pen"></i>Edit</li>
                    <li onclick="deleteNoteHandler(this)"><i class="uil uil-trash"></i>Delete</li>
                </ul>
            </div>
        </div>`;
    addBox.insertAdjacentElement("afterend", li);
};

const showNotes = () => {
    document.querySelectorAll(".note").forEach(note => note.remove()); 
    notesVal.forEach(loadNoteToDOM); 
};

const editNoteHandler = (e) => {
    showPopUp();
    const notesElem = e.closest(".settings").closest("li");
    const titleVal = notesElem.querySelector(".details p").innerText;
    const descVal = notesElem.querySelector(".details span").innerText;
    const titlePop = popUpBox.querySelector("input");
    const descPop = popUpBox.querySelector("textarea");

    titlePop.value = titleVal;
    descPop.value = descVal;
    addBtn.innerText = "Update Note";

    editIndex = notesVal.findIndex(note => note.title === titleVal && note.desc === descVal);
};

const addOrUpdateNote = (e) => {
    e.preventDefault();
    const TitleValue = title.value.replace(/\n/g, '').trim();
    const descValue = description.value.replace(/\n/g, '').trim();

    if (TitleValue && descValue) {
        let month = new Date().getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        let date = new Date().getDate();
        let year = new Date().getFullYear();
        let formatedDate = `${monthNames[month]}-${date}-${year}`;

        if (editIndex !== null) { 
            notesVal[editIndex] = { title: TitleValue, desc: descValue, date: formatedDate };
            showNotes();
            editIndex = null;
            addBtn.innerText = "Add Note";
        }
        
        else { 
            let newNote = { title: TitleValue, desc: descValue, date: formatedDate };
            notesVal.push(newNote);
            loadNoteToDOM(newNote); 
        }

        localStorage.setItem("NotesArr", JSON.stringify(notesVal)); 
        title.value = "";
        description.value = "";
        popUpBox.classList.remove("show");
    }
};

// Delete note
const deleteNoteHandler = (e) => {
    const noteElement = e.closest(".settings").closest("li");
    const title = noteElement.querySelector(".details p").innerText.trim();
    const desc = noteElement.querySelector(".details span").innerText.trim();
    const date = noteElement.querySelector(".bottom-content span").innerText.trim();

    const noteIndex = notesVal.findIndex(note => 
        note.title === title && 
        note.desc === desc && 
        note.date === date
    );

    if (noteIndex > -1) {
        notesVal.splice(noteIndex, 1);
        localStorage.setItem("NotesArr", JSON.stringify(notesVal)); 
        noteElement.remove(); 
    }
};

showNotes(); 

addBtn.addEventListener("click", addOrUpdateNote);
