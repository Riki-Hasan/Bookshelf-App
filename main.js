let books = [];
const render_event = 'render-book';
const storage_key = 'data_buku';
(function(){
    if(typeof Storage === 'undefined'){
        console.log('tidak support storage')
    }else{
        if(localStorage.getItem(storage_key)===null){
            localStorage.setItem(storage_key,'')
        }else{
            saveDataLoad()
            dataConsole()
            ditampilkan()
        }
    }
})()
document.getElementById('bookForm').addEventListener('submit',(event)=>{
    event.preventDefault()
    const judul = document.getElementById('bookFormTitle').value;
    const penulis = document.getElementById('bookFormAuthor').value;
    const tahun = document.getElementById('bookFormYear').value;
    const cekbox = document.getElementById('bookFormIsComplete').checked;
    const ID = generateId();
    const dataBuku = generateBookObj(ID,judul,penulis,tahun,cekbox);
    books.push(dataBuku)
    saveData()
    document.dispatchEvent(new Event(render_event))
})

document.addEventListener(render_event,()=>{
    ditampilkan()
    dataConsole()
})

document.getElementById('searchBook').addEventListener('submit',(event)=>{
    event.preventDefault();
    const judul = document.getElementById('searchBookTitle').value;
    const dataBuku = findID(judul)
    const script = makeBook(dataBuku);
    if(!dataBuku){
        document.getElementById('tampilkanPencarian').innerHTML = 'data buku tidak ditemukan';
    }else{

        document.getElementById('tampilkanPencarian').innerHTML = script;
    }
    
})
// Menggunakan event delegation untuk menangani klik pada tombol hapus buku
document.getElementById('incompleteBookList').addEventListener('click', function(event) {
    if (event.target.matches('button[data-testid="bookItemDeleteButton"]')) {
        let idFormCard = event.target.closest('[data-bookid]').getAttribute('data-bookid');
        removeData(idFormCard);
        saveData();
        document.dispatchEvent(new Event(render_event));
    }else if(event.target.matches('button[data-testid="bookItemIsCompleteButton"]')){
        let idFormCard = event.target.closest('[data-bookid]').getAttribute('data-bookid');
        ubahKeComplete(idFormCard)
        saveData()
        document.dispatchEvent(new Event(render_event));
    }else if(event.target.matches('button[data-testid="bookItemEditButton"]')){
        let idFormCard = event.target.closest('[data-bookid]').getAttribute('data-bookid');
        const index = findIndexID(idFormCard);
        tampilkanFormEdit(idFormCard)
        document.querySelector(`#editForm`).addEventListener('submit',(event)=>{
            const judul = document.getElementById('editTitle').value;
            const penulis = document.getElementById('editAuthor').value;
            const tahun = document.getElementById('editYear').value;
            if(judul != ''){
                books[index].title = judul;
            }
            if(penulis != ''){
                books[index].author = penulis;
            }
            if(tahun != ''){
                books[index].year = tahun;
            }
            saveData();
            document.dispatchEvent(new Event(render_event));
            event.preventDefault()
        })
    }
    
});

document.getElementById('completeBookList').addEventListener('click', function(event) {
    if (event.target.matches('button[data-testid="bookItemDeleteButton"]')) {
        let idFormCard = event.target.closest('[data-bookid]').getAttribute('data-bookid');
        removeData(idFormCard);
        saveData();
        document.dispatchEvent(new Event(render_event));
    }else if(event.target.matches('button[data-testid="bookItemEditButton"]')){
        let idFormCard = event.target.closest('[data-bookid]').getAttribute('data-bookid');
        const index = findIndexID(idFormCard);
        tampilkanFormEdit(idFormCard)
        document.querySelector(`#editForm`).addEventListener('submit',(event)=>{
            const judul = document.getElementById('editTitle').value;
            const penulis = document.getElementById('editAuthor').value;
            const tahun = document.getElementById('editYear').value;
            if(judul != ''){
                books[index].title = judul;
            }
            if(penulis != ''){
                books[index].author = penulis;
            }
            if(tahun != ''){
                books[index].year = tahun;
            }
            saveData();
            document.dispatchEvent(new Event(render_event));
            event.preventDefault()
        })
    }else if(event.target.matches('button[data-testid="bookItemIsCompleteButton"]')){
        let idFormCard = event.target.closest('[data-bookid]').getAttribute('data-bookid');
        ubahKeInComplete(idFormCard)
        saveData()
        document.dispatchEvent(new Event(render_event));
    }
});

//kumpulan fungsi
function tampilkanFormEdit(id){
    const formEdit = `<form id="editForm">
  <div>
    <label for="editTitle">Judul</label>
    <input id="editTitle" type="text"  data-testid="bookFormTitleInput" />
  </div>
  <div>
    <label for="editAuthor">Penulis</label>
    <input id="editAuthor" type="text"  data-testid="bookFormAuthorInput" />
  </div>
  <div>
    <label for="editYear">Tahun</label>
    <input id="editYear" type="number"  data-testid="bookFormYearInput" />
  </div>
  <button id="editSubmit" type="submit" data-testid="bookFormSubmitButton">
    submit
  </button>
</form>`;
    document.querySelector(`div [data-bookid="${id}"]`).innerHTML = formEdit;
}

function ubahDataButton(idBook){
    const indexnya = findIndexID(idBook);

}
function removeData(idBook){
    const indexnya = findIndexID(idBook)
    books.splice(indexnya,1)
}
function ubahKeComplete(id){
    const indexnya = findIndexID(id)
    books[indexnya].isComplete = true;
}
function ubahKeInComplete(id){
    const indexnya = findIndexID(id)
    books[indexnya].isComplete = false;
}
function dataConsole(){
    console.table(books);
    console.table(localStorage.getItem(storage_key));
}
//fungsi mencari id
function findID(data){
    const lokalBuku = localStorage.getItem(storage_key);
    const lokalBukuParse = JSON.parse(lokalBuku);
    for (const index of lokalBukuParse) {
        if(index.title === data){
            return index
        }
    }
    return false;
}

function findIndexID(Id){
    const lokalBuku = localStorage.getItem(storage_key);
    const lokalBukuParse = JSON.parse(lokalBuku);
    let index = ''
    lokalBukuParse.map((e,i) => {
        if(e.id == Id){
            index = i
        }
    });
    return index;
}

function ditampilkan(){
    document.getElementById('incompleteBookList').innerHTML = '';
    document.getElementById('completeBookList').innerHTML = '';
    const lokalBuku = localStorage.getItem(storage_key);
    const lokalBukuParse = JSON.parse(lokalBuku);
    for (const key of lokalBukuParse) {
     if(!key.isComplete){
         document.getElementById('incompleteBookList').innerHTML += makeBook(key);
     }else{
         document.getElementById('completeBookList').innerHTML += makeBook(key);
     }
 }
}
//fungsi ambil data load
function saveDataLoad(){
    const lokalBuku = localStorage.getItem(storage_key);
    const lokalBukuParse = JSON.parse(lokalBuku);
    for (const element of lokalBukuParse) {
        books.push(element)
    }
}
// fungsi save data
function saveData(){
    const parsed = JSON.stringify(books);
    localStorage.setItem(storage_key,parsed)
}

//fungsi generate objek
function generateBookObj(id,title,author,year,isComplete){
    return {
        id,title,author,year : Number(year),
        isComplete
    }
}

//fungsi generate id
function generateId(){
    return +new Date();
}

//fungsi membuat buku
function makeBook({id,title,author,year,isComplete}){
    return `<div ${(!isComplete)?`style="background-color: antiquewhite;"`:`style="background-color: green;"`} data-bookid="${id}" data-testid="bookItem">
            <h3 data-testid="bookItemTitle">${title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${author}</p>
            <p data-testid="bookItemYear">Tahun: ${year}</p>
            <div>
            ${(!isComplete)?`<button data-testid="bookItemIsCompleteButton">Selesai dibaca</button>`:`<button data-testid="bookItemIsCompleteButton">Belum dibaca</button>`}
              <button data-testid="bookItemDeleteButton" >Hapus Buku</button>
              <button data-testid="bookItemEditButton">Edit Buku</button>
            </div>
          </div>`
}

// event

//saat cekbox di klik
document.getElementById('bookFormIsComplete').addEventListener('change',()=>{
    const cek = document.getElementById('bookFormIsComplete');
    const ubahButton = document.querySelector('button>span')
    if(!cek.checked){
        ubahButton.innerText = 'Belum selesai dibaca';
    }else{
        ubahButton.innerText = 'selesai dibaca';
    }
})