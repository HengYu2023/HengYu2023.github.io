const currentYM = document.querySelector(".current-yy-mm")
const dateArea = document.querySelector(".date-area.row")
const lastMonthBtn = document.querySelector('.btn-last-month')
const nextMonthBtn = document.querySelector('.btn-next-month')
const thisMonthBtn = document.querySelector('.btn-this-month')
const noSlctedDateAddBtn = document.getElementById('no-slcted-date-add')

const addModal = new bootstrap.Modal('#add-todo', { keyboard: false })
const addDatetimeIpt = document.getElementById('add-datetime')
const addLocationIpt = document.getElementById('add-location')
const addEventIpt = document.getElementById('add-event')
const addBtn = document.getElementById('add-add')
const storageKey = 'clandar-demo'
let demoObj = {}

const editModal = new bootstrap.Modal('#edit-todo', { keyboard: false })
const editDatetimeIpt = document.getElementById('edit-datetime')
const editLocationIpt = document.getElementById('edit-location')
const editEventIpt = document.getElementById('edit-event')
const editBtn = document.getElementById('edit-edit')
const DeleteBtn = document.getElementById('edit-delete')
let currentObjIdx


let currentDatetime, currentYear, currentMonth




window.onload = () => {
    initial()
}

lastMonthBtn.addEventListener('click', () => {
    currentMonth--
    if (currentMonth < 1) {
        currentMonth = 12
        currentYear--
    }
    updateTitleYM(currentYear, currentMonth)
    renderingCalendar()
})

nextMonthBtn.addEventListener('click', () => {
    currentMonth++
    if (currentMonth > 12) {
        currentMonth = 1
        currentYear++
    }
    updateTitleYM(currentYear, currentMonth)
    renderingCalendar()
})

thisMonthBtn.addEventListener('click', () => {
    getTodayYYMM()
    updateTitleYM(currentYear, currentMonth)
    renderingCalendar()
})


noSlctedDateAddBtn.addEventListener("click",()=>{
    setModalInput(addDatetimeIpt,'',addLocationIpt,'',addEventIpt,'')
    addModal.show()
})

addBtn.addEventListener("click", () => {    
    if (addLocationIpt.value.trim() != "" || addEventIpt.value.trim() != "") {
        let objKey = addDatetimeIpt.value
        if (demoObj[objKey] == undefined) {
            demoObj[objKey] = []
        }
        demoObj[objKey].push(
            {
                Location: addLocationIpt.value,
                Event: addEventIpt.value
            }
        )
        setLocalStorage(demoObj)
        renderingCalendar()
    }
    addModal.hide()
})

editBtn.addEventListener("click", () => {
    let objKey = editDatetimeIpt.value    
    if (editLocationIpt.value.trim() != "" || editEventIpt.value.trim() != "") {
        demoObj[objKey][currentObjIdx] =
        {
            Location: editLocationIpt.value,
            Event: editEventIpt.value
        }
    }
    else{
        demoObj[objKey].splice(currentObjIdx, 1)
    }
    setLocalStorage()
    renderingCalendar()
    editModal.hide()
})

DeleteBtn.addEventListener("click", () => {

    let objKey = editDatetimeIpt.value
    demoObj[objKey].splice(currentObjIdx, 1)
    setLocalStorage()
    renderingCalendar()
    editModal.hide()
})

function initial() {
    getLocalStorage()
    getTodayYYMM()
    updateTitleYM(currentYear, currentMonth)
    renderingCalendar()
}


function getTodayYYMM() {
    currentDatetime = new Date()
    currentYear = currentDatetime.getFullYear()
    currentMonth = currentDatetime.getMonth() + 1
}

function updateTitleYM(year, month) {
    currentYM.innerHTML = `${year} / ${month}`
}

function renderingCalendar() {
    dateArea.innerHTML = ""
    const firstDateOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDateOfCurrentMonth = new Date(currentYear, currentMonth, 0)
    let start = 1 - firstDateOfCurrentMonth.getDay()
    const end = lastDateOfCurrentMonth.getDate() + (6 - lastDateOfCurrentMonth.getDay())

    for (start; start <= end; start++) {
        const loopCurrDT = new Date(currentYear, currentMonth - 1, start)
        const loopCurrY = loopCurrDT.getFullYear()
        const loopCurrM = loopCurrDT.getMonth()
        const loopCurrD = loopCurrDT.getDate()
        const loopCurrDTStr = getDateStr(loopCurrDT)


        let dateElmt = document.createElement("div")
        dateElmt.classList.add("date", "col", "text-light", "border", "overflow-hidden")
        if (start >= 1 && start <= lastDateOfCurrentMonth.getDate()) {
            dateElmt.classList.add("bg-dark")
        }
        dateElmt.addEventListener("click", ()=>{
            setModalInput(addDatetimeIpt,loopCurrDTStr,addLocationIpt,'',addEventIpt,'')
            addModal.show()
        })

        let dateElmtTitle = document.createElement("div")
        dateElmtTitle.classList.add("date-title", "text-light", "border-bottom", "border-light", "mt-1")
        if (loopCurrY === currentDatetime.getFullYear() &&
            loopCurrM === currentDatetime.getMonth() &&
            loopCurrD === currentDatetime.getDate()) {
            dateElmtTitle.classList.add("border-0", "text-black", "bg-white", "rounded")
        }
        dateElmtTitle.innerText = `${loopCurrDT.getDate()}`
        dateElmt.append(dateElmtTitle)


        let todoItems = demoObj[loopCurrDTStr]
        if (todoItems != undefined) {
            todoItems.forEach((item, idx) => {
                let todo = document.createElement("div")
                todo.innerText = `${item.Location}:${item.Event}`
                todo.classList.add("text-start", "fs-7", "m-1", "px-1")
                todo.setAttribute("idx", idx)
                todo.addEventListener("click", () => {
                    setModalInput(editDatetimeIpt,loopCurrDTStr,editLocationIpt,item.Location,editEventIpt,item.Event)
                    currentObjIdx = todo.getAttribute("idx")
                    editModal.show()
                    event.stopPropagation()
                })
                dateElmt.append(todo)
            });
        }
        dateArea.append(dateElmt)
    }
}

function setModalInput(iptDt,datetime,iptLct,location,iptEvt,event) {
    iptDt.value = datetime
    iptLct.value = location
    iptEvt.value = event    
}

function getLocalStorage() {
    if (localStorage.getItem(storageKey)) {
        demoObj = JSON.parse(localStorage.getItem(storageKey))
    }
}

function setLocalStorage() {
    localStorage.setItem(storageKey, JSON.stringify(demoObj))
}

function getDateStr(dt) {
    return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`
}