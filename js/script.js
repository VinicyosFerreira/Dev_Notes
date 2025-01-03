const addNote = document.querySelector('.add-note');
const containerNotes = document.querySelector('.container-notes');
const writeNotes = document.getElementById('write-notes');
const searchNotesBtn = document.querySelector(".bi-search");
const exportNotesBtn = document.querySelector(".file-export");

// Ao carregar página exibe os dados do Local Storage
function showNotes()  {
    cleanNotes();
    reorderNotes();
    getLocalStorage().forEach(element => {
        const noteElement = createElement(element.id , element.content , element.fixed);
        containerNotes.appendChild(noteElement);
    });
}

// Criar uma nota 
function createNote() {
    const notes = getLocalStorage();
    const objectData = {
        id: generateId(),
        content : writeNotes.value,
        fixed: false
    }

    const element = createElement(objectData.id , objectData.content , objectData.fixed);
    containerNotes.appendChild(element);

    notes.push(objectData);
    saveLocalStorage(notes)
    writeNotes.value = "";
}

function generateId () {
    const id = Math.floor(Math.random() * 5000);
    return id;
}

// Cria os elementos no DOM , além de suas classes e eventos
function createElement(id , content , fixed) {
    const notes = document.createElement('div');
    notes.classList.add('notes');
    const classList = ['bi-pin' , 'bi-x' , 'bi-file-earmark-plus'];
    const events = [
        fixedNotes , 
        deleteNotes , 
        copyNotes,
    ];

    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.placeholder = "Adicione algum texto"
    notes.appendChild(textarea);

    classList.forEach((el , index) => {
        const i = document.createElement('i');
        i.classList.add('bi' , el);
        notes.appendChild(i);
        i.addEventListener('click' , () => events[index](id));
    })

    textarea.addEventListener('input' , (e) => updateNote(e , id));

    if(fixed) {
       notes.style.backgroundColor = '#333';
    }

    return notes;
}

function getLocalStorage(notes) {
    const data = localStorage.getItem('notes');

    if(data !== null) {
        return JSON.parse(data);
    } else {
        return [];
    }
}

// Fazer a limpeza das notas presente no DOM
function cleanNotes() {
    containerNotes.replaceChildren([]);
}

function saveLocalStorage(notes) {
   localStorage.setItem('notes' , JSON.stringify(notes))
}

// Reordenar as notas
function reorderNotes() {
    const notes = getLocalStorage();

    notes.sort((a , b) => {
        return b.fixed - a.fixed;
    })
    saveLocalStorage(notes);
}

// Fixar as notas
function fixedNotes(id) {
    const notes = getLocalStorage();

    const targetNote = notes.filter((el) => {
        return id === el.id;
    })[0];

    targetNote.fixed = !targetNote.fixed;
    saveLocalStorage(notes);
    showNotes();
}

// Atualizar as notas
function updateNote(e , id) {
    const notes = getLocalStorage();
    const targetNote = notes.filter((el) => {
        return id === el.id;
    })[0];

    targetNote.content = e.target.value;
    saveLocalStorage(notes);
}   

// Deletar a nota
function deleteNotes(id) {
    const notes = getLocalStorage();

    const deleteNote = notes.filter((el) => {
        return id !== el.id;
    });
  
    saveLocalStorage(deleteNote);
    showNotes();
}

// Duplicar uma nota
function copyNotes(id) {
     const notes = getLocalStorage();
     
     const duplicateNote = notes.filter((note) => {
        return note.id === id;
     })[0];

    const objectData = {
        id : generateId(),
        content: duplicateNote.content,
        fixed: duplicateNote.fixed
    }

    const noteElement = createElement(generateId() , objectData.content , objectData.fixed);
    containerNotes.appendChild(noteElement);
    notes.push(objectData);
    saveLocalStorage(notes);

    showNotes();
   
}

// Pesquisar uma nota
function searchNotes() {
        const notesLocalStorage = getLocalStorage();
        const notes = document.querySelectorAll('.notes');
        const search = document.querySelector('.search-notes input').value;

        const notesFound = notesLocalStorage.filter((note) => {
            return note.content.toLowerCase().includes(search.toLowerCase());
        })

        if(notesFound.length === 0){
            return 
        }

        notes.forEach((note , index) => {
            if(!notesFound.includes(notesLocalStorage[index])) {
                note.style.display = 'none';
            } else {
                note.style.display = 'flex';
            }
        })

}

// Exportar nota em um documento 
function exportNotes() {
    const notes = getLocalStorage();

    const csvString = [
          ["ID" , "CONTÉUDO" , "FIXADO"],
        ...notes.map((note) => [note.id , note.content , note.fixed])
     ].map((element) => element
    .join(",")).join("\n");

    const element = document.createElement('a');
    element.href = "data:text/csv;charset=utf-8, " + encodeURI(csvString);
    element.target = "_blank";
    element.download = "notes/csv";
    element.click();
}

// Eventos
addNote.addEventListener('click' , () => createNote());
exportNotesBtn.addEventListener('click' , () => exportNotes());
searchNotesBtn.addEventListener('click' , () => searchNotes());

// Invocar show notes
showNotes();
