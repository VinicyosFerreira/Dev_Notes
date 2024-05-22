const addNote = document.querySelector('.add-note');
const containerNotes = document.querySelector('.container-notes');
const writeNotes = document.getElementById('write-notes');

// Ao usar 3 pontinhos no parametro , a gente pode e deve receber mais de um argumento
// Em formato de array voce usa apenas os indices desejados

function createNote(el , parent , content , ...className) {
    el = document.createElement(el);
    parent.appendChild(el);
    el.classList.add(...className);
    el.textContent = content;
    return el;
}

function classList() {
    return ['notes', 'bi' ,'bi-pin' , 'bi-x' , 'bi-file-earmark-plus']
}

function notesLocalStorage() {
    const classList = ['notes', 'bi' ,'bi-pin' , 'bi-x' , 'bi-file-earmark-plus'];
    const data = saveStorage('notes');

    for(let i = 0 ; i < data.length ; i++) {
        createNote('div' , containerNotes , '' ,  classList[0]);
        createNote('textarea' , containerNotes.children[i] , data[i].content , 'textarea');
        createNote('i' , containerNotes.children[i], '' ,  classList[1] , classList[2])
        createNote('i' , containerNotes.children[i] , '' , classList[1] , classList[3])
        createNote('i' , containerNotes.children[i] , '' , classList[1] , classList[4])
    }

    deleteNote(containerNotes.children);
    fixedNote(containerNotes.children);
    updateNote(containerNotes.children);
    searchNotes(data);
}

notesLocalStorage();

function handleNote() {
    const classList = ['notes', 'bi' ,'bi-pin' , 'bi-x' , 'bi-file-earmark-plus'];
    createNote('div' , containerNotes , '' ,  classList[0]);
    const notes = document.querySelectorAll('.notes');
    const data = saveStorage('notes');
    console.log('teste')

    for(let i = 0 ; i < data.length ; i++) {

        console.log(generateId());
        console.log(data[i].id);
    }

    notes.forEach(element => {
        if(element.childElementCount < 4) {
            createNote('textarea' , element , writeNotes.value, 'textarea')
            createNote('i' , element , '' ,  classList[1] , classList[2])
            createNote('i' , element , '' , classList[1] , classList[3])
            createNote('i' , element , '' , classList[1] , classList[4])
            saveStorage('notes');
            dataSaveStorage('notes' ,  generateId() , writeNotes.value);
        }
    })

    deleteNote(notes);
    fixedNote(notes);
    updateNote(notes);
    searchNotes();
}

function updateNote(notes , data) {
    data = saveStorage('notes')
    notes = [...notes];

    notes.forEach((element , index) => {
        element.children[0].addEventListener('input' , (e) => {
            data[index].content = e.target.value;
            localStorage.setItem('notes' , JSON.stringify(data))
        })
    })
}

function saveStorage(key) {
    let data = localStorage.getItem(key);

    if(data !== null) {
        return JSON.parse(data);
    } else {
        return data = [];
    }
}


function searchNotes(data) {
    data = saveStorage('notes');
    const searchNotes = document.querySelector(".search-notes");
   
    searchNotes.children[0].addEventListener('click' , (e) => {
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

function dataSaveStorage(key ,  id , content) {
    const notesData = saveStorage('notes');

    const object = {
        id : id , 
        content : content ,
        fixed : false
    }
    
    notesData.push(object)
    return localStorage.setItem(key , JSON.stringify(notesData));
}

function generateId () {
    const id = Math.floor(Math.random() * (5 - 1) + 1);
    return id;
}

function deleteNote(notes , data) {
    data = saveStorage('notes');
    notes = [...notes]
    notes.forEach((element , index) => {
        element.children[2].addEventListener('click', () => {
            element.remove();
            data.splice(index , 1)
            localStorage.setItem('notes' , JSON.stringify(data));
        })
    })
}

function fixedNote(notes , data) {
    data = saveStorage('notes');
    notes = [...notes];
 
    notes.forEach((element , index) => {
        let fixed = (data[index].fixed);

        if(fixed) {
            element.style.backgroundColor = '#333';
            containerNotes.insertBefore(element , containerNotes.firstChild)
        }

        element.children[1].addEventListener('click' , () => {
           if(!fixed) {
                element.style.backgroundColor = '#333';
                containerNotes.insertBefore(element , containerNotes.firstChild)
                fixed = true;
                data[index].fixed = fixed;
                localStorage.setItem('notes' , JSON.stringify(data));
                console.log('fixada')
           } else {
                element.style.backgroundColor = '#202124';
                fixed = false;
                data[index].fixed = fixed
                localStorage.setItem('notes' , JSON.stringify(data));
                console.log('desfixada')
           }
        })    
    })
}

addNote.addEventListener('click' , handleNote);