const addNote = document.querySelector('.add-note');
const containerNotes = document.querySelector('.container-notes');
const writeNotes = document.getElementById('write-notes');

// Em formato de array voce usa apenas os indices desejados

// Uma função como molde para criar elementos do DOM
function createNote(el , parent , content , ...className) {
    el = document.createElement(el);
    parent.appendChild(el);
    el.classList.add(...className);
    el.textContent = content;
    return el;
}

/* 
    Função que pega notas do LocalStorage, onde é feito um loop para carregar notas
    salvas, além de invocar as funções das funcionalidades da aplicação
*/
function notesLocalStorage() {
    const classList = ['notes', 'bi' ,'bi-pin' , 'bi-x'];
    const data = saveLocalStorage('notes');

    for(let i = 0 ; i < data.length ; i++) {
        createNote('div' , containerNotes , '' ,  classList[0]);
        createNote('textarea' , containerNotes.children[i] , data[i].content , 'textarea');
        createNote('i' , containerNotes.children[i], '' ,  classList[1] , classList[2]);
        createNote('i' , containerNotes.children[i] , '' , classList[1] , classList[3]);
    }

    deleteNote(containerNotes.children);
    fixedNote(containerNotes.children);
    updateNote(containerNotes.children);
    searchNotes(data);
    reorderNotes(data);
}

notesLocalStorage();

/*
 Essa função realiza a manipulação e criação de notas e os elementos contidos dentro, além
 de invocar as devidas funções quando uma nova nota é inserida no Document Object Model e
 persistida no local storage
*/
function handleNote() {
    const classList = ['notes', 'bi' ,'bi-pin' , 'bi-x'];

    createNote('div' , containerNotes , '' ,  classList[0]);
    const notes = document.querySelectorAll('.notes');

    notes.forEach(element => {
        if(element.childElementCount < 3) {
            createNote('textarea' , element , writeNotes.value, 'textarea');
            createNote('i' , element , '' ,  classList[1] , classList[2]);
            createNote('i' , element , '' , classList[1] , classList[3]);
            saveLocalStorage('notes');
            dataSaveLocalStorage('notes' ,  generateId() , writeNotes.value);
        }
    })

    deleteNote(notes);
    fixedNote(notes);
    updateNote(notes);
    searchNotes();
}

/* Essa função atualiza o valor dos input das notas do localStorage e faz a devida alteração no localStorage
sincronizado com o DOM
*/

function updateNote(notes , data) {
    data = saveLocalStorage('notes')
    notes = [...notes];

    notes.forEach((element , index) => {
        element.children[0].addEventListener('input' , (e) => {
            data[index].content = e.target.value;
            localStorage.setItem('notes' , JSON.stringify(data));
        })
    })
}

/* Função do LocalStorage que cria o array e chave que salvará os dados */
function saveLocalStorage(key) {
    let data = localStorage.getItem(key);

    if(data !== null) {
        return JSON.parse(data);
    } else {
        return data = [];
    }
}

// Função que reordena as notas fixas e não fixas permitindo uma prioridade nas notas fixadas
function reorderNotes(data) {
    data = saveLocalStorage('notes');
    data = data.sort((a , b) => {
        console.log('ta ordenando')
        return b.fixed - a.fixed
    })
    
    localStorage.setItem('notes' , JSON.stringify(data))
}

function searchNotes(data) {
    data = saveLocalStorage('notes');
    const searchNotes = document.querySelector(".search-notes");
   
    searchNotes.children[0].addEventListener('click' , () => {
        const search = searchNotes.children[1].value;
        const notesFound = data.filter((element) => {
            return element.content.toLowerCase().includes(search.toLowerCase());
        })

        const notes = [...containerNotes.children];

        if(notesFound.length === 0) {
            return;
        } 

        notes.forEach((element , index) => {
            if(!notesFound.includes(data[index])) {
                element.style.display = 'none';
            } else {
                element.style.display = 'flex';
            }
        })
        
    })
}
function dataSaveLocalStorage(key , id , content) {
    const notesData = saveLocalStorage('notes');

    const objectData = {
        id : id, 
        content : content ,
        fixed : false
    }
    
    notesData.push(objectData);
    return localStorage.setItem(key , JSON.stringify(notesData));
}

function generateId () {
    const id = Math.floor(Math.random() * 5000);
    return id;
}

function deleteNote(notes , data) {
    data = saveLocalStorage('notes');
    notes = [...notes];
 
     notes.forEach((element , index) => {
        element.dataset.id = data[index].id;
        const dataId = parseInt(element.dataset.id);

        element.children[2].addEventListener('click', () => {
            element.remove(); 
            data = data.filter((note) => {
                return note.id !== dataId;
            })
    
            localStorage.setItem('notes' , JSON.stringify(data));
            })
        })
   
}

function fixedNote(notes , data) {
    data = saveLocalStorage('notes');
    notes = [...notes];

    notes.forEach((element , index) => {
        const filterNote = notes.filter((note) => {
            return parseInt(note.dataset.id) === data[index].id;
        })[0]

        if(data[index].fixed) {
            filterNote.style.backgroundColor = '#333';
            containerNotes.insertBefore(filterNote , containerNotes.firstChild)
        }

        element.children[1].addEventListener('click' , () => {
         
            data[index].fixed = !data[index].fixed;
            console.log(data[index].fixed)
            if(data[index].fixed) {
                filterNote.style.backgroundColor = '#333';
                containerNotes.insertBefore(filterNote , containerNotes.firstChild);
            } else {
                filterNote.style.backgroundColor = '#202124';
                containerNotes.appendChild(filterNote)
            }

            reorderNotes(notes)
            localStorage.setItem('notes' , JSON.stringify(data))
        })    
    })
}

function exportNotes(data) {
    data = saveLocalStorage('notes');
    const fileExport = document.querySelector('.file-export');
    fileExport.addEventListener('click' , () => {
        const csvString = [
          ["ID" , "Conteúdo" , "Fixado"] ,
          ...data.map((note) => [note.id , note.content , note.fixed])
        ]
        .map((element) => element
        .join(",")).join("\n") 
        const element = document.createElement('a');
        element.href = "data:text/csv;charset=utf-8, " + encodeURI(csvString);
        element.target = "_blank";
        element.download = "notes_csv";
        element.click();
    })
}
exportNotes();

addNote.addEventListener('click' , handleNote);

