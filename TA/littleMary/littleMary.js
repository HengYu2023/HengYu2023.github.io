let steps = 0
let allSteps = 0
let currentIndex = 0
let speed, bricksdata
let msg = document.getElementById("msg")
const url = "littleMary.json"
const bricks =
    [...document.querySelectorAll("[box-id]")]
        .sort((a, b) => {
            return parseInt(a.getAttribute("box-id")) - parseInt(b.getAttribute("box-id"))
        })
const btn = document.getElementById("start-btn")


window.onload = () => {
    initialPage()
}


async function initialPage() {
    try {
        let rsp = await fetch(url)
        if (rsp.ok) {
            bricksdata = await rsp.json()
            await renderingBricks(bricksdata)
            await btn.addEventListener("click", getAnimal)
        }
        else {
            let err = new Error(`找不到資源，請確認json檔。`)
            err.rsp = rsp
            throw err
        }
    } catch (ex) {
        alert(ex.message)
    }

}

function renderingBricks(allData) {
    bricks.forEach((brick, idx) => {
        let id = idx + 1
        let data = allData.find(data => data.id == id)
        let icon = document.createElement("i")
        icon.setAttribute("class", data.icon)
        icon.style.color = data.color
        brick.append(icon)
    })
}

function getAnimal() {
    speed = 50
    let random = Math.floor(Math.random() * bricks.length) + 1
    steps = random + 3 * bricks.length
    allSteps = steps
    turnAround()
}

function turnAround() {
    bricks[currentIndex].classList.remove("active")
    currentIndex++

    if (currentIndex >= bricks.length) currentIndex = 0

    bricks[currentIndex].classList.add("active")
    steps--

    if (steps > 0) {
        setTimeout(turnAround, speed)
        if (steps < Math.floor(allSteps / 3)) speed += 7;
    } else {
        if (bricksdata[currentIndex].target.type == "function") {
            let getText = function () {
                return bricksdata[currentIndex].target.logic
            }
            msg.innerText = `Get:${getText()}`
        }
    }
}