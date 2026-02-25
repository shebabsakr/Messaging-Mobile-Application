
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
    databaseURL: "https://champs-d3e85-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsmentListInDB = ref(database, "Endorsments-List")

const endorsmentInput = document.getElementById('write-endorsment-el')
const toUser = document.getElementById('To-endorsment-el')
const fromUser = document.getElementById('From-endorsment-el')
const endorsmentList = document.getElementById("endorsement-list")
const publishButton = document.getElementById("publish-button")
let endoList = []
const main = document.getElementById('main')



function displayData() {
     endorsmentList.innerHTML = ""
    for (let i = 0; i < endoList.length; i++) {
        let endo = endoList[i]
        let newEndo = 
            `<li class='endo-ob' data-id='${endo.key}'>
                <p class='to'>To ${endo.To}</p>
                <p class='message'>${endo.Message}</p>
                <p class='from'>From ${endo.From}</p>
            </li>`
        endorsmentList.innerHTML += newEndo
    }
    if (2 < endoList.length) {
        main.classList.add('content-fit')
    }
    else {
        main.classList.remove('content-fit')
    }
}


function addObjectToDatabase(obj) {
    push(endorsmentListInDB, obj)
}

publishButton.addEventListener('click', function() {
    let endorsmentObject = {
        'To': toUser.value,
        'From': fromUser.value,
        'Message': endorsmentInput.value
    }
    endoList.push(endorsmentObject)
    addObjectToDatabase(endorsmentObject)
    toUser.value = ""
    fromUser.value = ""
    endorsmentInput.value = ""
    displayData()

    li.dataset.id = obj.id; 

})

onValue(endorsmentListInDB, function(snapshot) {
    endorsmentList.innerHTML = "" // always clear first
    endorsmentList.classList.add('no-endo')

    if (snapshot.exists()) {
        endoList = []
        const data = snapshot.val()
        for (let key in data) {
            endoList.push({
                key: key,       // store Firebase key
                ...data[key]    // merge the actual object
            })
        }
        displayData()
    } else {
        endoList = []               // clear local array
        endorsmentList.innerHTML = "No endorsements yet"
        main.classList.remove('content-fit') // reset container if needed
    }
})

endorsmentList.addEventListener('click', (e) => {
    const clickedListItems = e.target
    const clickedItem = e.target
    if (!clickedItem.dataset.id) return

    const itemId = clickedItem.dataset.id
    const dbRef = ref(database, `Endorsments-List/${itemId}`)

    remove(dbRef)
    .then(() => {
        clickedItem.remove()  // remove from DOM after DB success
    })
    .catch(error => console.error("Error removing item:", error))
    displayData()
})


