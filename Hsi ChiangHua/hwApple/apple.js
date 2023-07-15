
let appleUrl = "apple1.json"
let initialData, setPageUrl, setPageData, currentPGName
const page = document.querySelector(".page")
const navBar = document.querySelector(".bar")
const container = document.querySelector(".container")

window.onload = function () {
    setFrontPage(appleUrl)
}

function setFrontPage(url) {
    fetch(url)
        .then(resp => resp.json())
        .then(result => {
            initialData = result
        })
        .then(() => {

            createNavBarItem(initialData)
            createCardGroup(initialData)
        })
        .then(() => {
            //設定品牌按鍵
            let brandData = initialData.find(data =>
                data.type == "brand"
            )
            let allProductData = initialData.filter(data =>
                data.type == "product"
            )


            let headTitle = document.querySelector("head title")
            headTitle.innerHTML = brandData.name

            let brandPageSlcts = document.querySelectorAll(`.page-selector[pgName="${brandData.name}"]`)
            brandPageSlcts.forEach(brandPageSlct => {

                brandPageSlct.addEventListener("click", () => {
                    document.querySelector("head title").innerText = brandPageSlct.getAttribute("pgName")
                    currentPGName = brandPageSlct.getAttribute("pgName")

                    document.querySelector(".container .card-group").style.display = "flex"
                    navBar.classList.remove("product-page")

                    //關閉其他DOM
                    allProductData.forEach(productData => {
                        let chkDOMcreated = (document.querySelector(`.${productData.name}.item-list`) != undefined)
                        if (chkDOMcreated) {
                            document.querySelector(`.${productData.name}.highlight`).style.display = "none"
                            document.querySelector(`.${productData.name}.title`).style.display = "none"
                            document.querySelector(`.${productData.name}.item-list`).style.display = "none"
                        }
                    })


                })
            })

            //設定產品按鍵

            allProductData.forEach(productData => {
                let productPageSlcts = document.querySelectorAll(`.page-selector[pgName="${productData.name}"]`)

                productPageSlcts.forEach(productPageSlct => {
                    productPageSlct.addEventListener("click", () => {
                        document.querySelector("head title").innerText = productPageSlct.getAttribute("pgName")
                        currentPGName = productPageSlct.getAttribute("pgName")
                        //關閉初始DOM
                        document.querySelector(".container .card-group").style.display = "none"
                        navBar.classList.add("product-page")


                        //關閉其他DOM
                        allProductData.filter(data => data != productData).forEach(otherPrdData => {

                            let chkOtherDOMcreated = (document.querySelector(`.${otherPrdData.name}.item-list`) != undefined)
                            if (chkOtherDOMcreated) {
                                document.querySelector(`.${otherPrdData.name}.highlight`).style.display = "none"
                                document.querySelector(`.${otherPrdData.name}.title`).style.display = "none"
                                document.querySelector(`.${otherPrdData.name}.item-list`).style.display = "none"
                            }
                        })


                        let orderArr = []
                        setPageUrl = productData.url
                        fetch(setPageUrl)
                            .then(resp => resp.json())
                            .then(result => {
                                setPageData = result

                                //開啟點擊DOM
                                let chkDOMcreated = (document.querySelector(`.${productData.name}.item-list`) != undefined)
                                if (chkDOMcreated) {
                                    document.querySelector(`.${productData.name}.highlight`).style.display = "flex"
                                    document.querySelector(`.${productData.name}.title`).style.display = "block"
                                    document.querySelector(`.${productData.name}.item-list`).style.display = "flex"
                                }
                                else {
                                    container.append(createTitle(setPageData), createHighlight(setPageData), createItemList(setPageData))

                                    //設定按鈕
                                    //標示當前選擇
                                    setPageData.optional.forEach(optional => {
                                        let slcts = document.querySelectorAll(`.${setPageData.name} .${optional.name} .selector`)
                                        slcts.forEach(currentSlct => {
                                            currentSlct.addEventListener("click", () => {
                                                slcts.forEach(eachSlct => eachSlct.setAttribute("slct", "-1"))
                                                currentSlct.setAttribute("slct", "1")
                                            })
                                        })
                                    })

                                    //highlight當前選擇
                                    //如果slct有highlightImg，塞連結，如果沒有highlightImg，塞顏色選擇器的圖，再沒有，塞產品圖 
                                    let items = document.querySelectorAll(`.${setPageData.name} .item`)
                                    let hLImg = document.querySelector(`.${setPageData.name}.highlight img`)

                                    items.forEach(item => {
                                        let slcts = item.querySelectorAll(".selector")
                                        let nameMacth = false
                                        setPageData.highlight.condition.forEach(condition => {
                                            if (item.className.includes(condition.name)) {
                                                nameMacth = true
                                                slcts.forEach(slct => {
                                                    let typeMatch = false
                                                    condition.data.forEach(data => {
                                                        if (slct.getAttribute("value") == data.type) {
                                                            typeMatch = true
                                                            slct.addEventListener("click", () => {
                                                                hLImg.src = data.highlightImg
                                                            })
                                                        }
                                                    })
                                                    if (typeMatch == false) {
                                                        slct.addEventListener("click", () => {
                                                            let clrSlcted = document.querySelector(`.${setPageData.name} .color [slct="1"]`)
                                                            if (clrSlcted != undefined) {
                                                                hLImg.src =
                                                                    setPageData.highlight.condition.find(condition => condition.name == "color").data.find(data => data.type == clrSlcted.getAttribute("value")).highlightImg
                                                            }
                                                            else {
                                                                hLImg.src = setPageData.img
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                            if (nameMacth == false) {
                                                slcts.forEach(slct => {
                                                    slct.addEventListener("click", () => {
                                                        let clrSlcted = document.querySelector(`.${setPageData.name} .color [slct="1"]`)
                                                        if (clrSlcted != undefined) {
                                                            hLImg.src =
                                                                setPageData.highlight.condition.find(condition => condition.name == "color").data.find(data => data.type == clrSlcted.getAttribute("value")).highlightImg
                                                        }
                                                        else {
                                                            hLImg.src = setPageData.img
                                                        }
                                                    })
                                                })
                                            }
                                        })
                                    })


                                    //移除次層選擇器屏蔽
                                    document.querySelectorAll(`.${setPageData.name} .item`).forEach(item => {
                                        let order = window.getComputedStyle(item).order
                                        orderArr.push({ order, item })
                                        orderArr.sort((a, b) => {
                                            return parseInt(a.order) - parseInt(b.order)
                                        })
                                    })
                                    orderArr.forEach((element, index) => {

                                        if (index == 0) {
                                            element.item.style.zIndex = "2"//要改，取的屏蔽層zIndex，再用這個zIndex加1，才能避免寫死
                                        }
                                        if (index != orderArr.length - 1) {
                                            element.item.querySelectorAll(".selector").forEach(slct => {
                                                slct.addEventListener("click", () => {
                                                    orderArr[index + 1].item.style.zIndex = "2"
                                                })
                                            })
                                        }
                                    })

                                    //價格
                                    //加入初始價格
                                    let allPrice = document.querySelectorAll(`.${setPageData.name} [class*="-price"]`)

                                    allPrice.forEach(price => {


                                        price.innerText = `${setPageData.price.unit} ${new Intl.NumberFormat().format(setPageData.price.base)} 起`
                                    })
                                    //加入調整機制

                                    setPageData.price.condition.forEach(condition => {
                                        condition.data.forEach(data => {

                                            let cdtPrice = document.querySelector(`.${setPageData.name} [value="${data.type}"] [class*="price"]`)
                                            cdtPrice.innerText = `${setPageData.price.unit} ${new Intl.NumberFormat().format(parseInt(setPageData.price.base) + parseInt(data.increase))} 起`
                                        })
                                    })
                                    //按鈕判斷價格

                                    /* 挑出有調價機制按鈕                                     
                                    設計一個陣列放入目前選擇條件，依陣列內容調整價格
                                    陣列照item的order排序，以包含自己以前的條件，調整之後item的價格 */

                                    let orderPriceArr = orderArr.filter(element => {
                                        return element.item.querySelector(`.min-price`) != undefined
                                    })


                                    orderPriceArr.forEach((element, index) => {
                                        element.item.querySelectorAll(`.selector`).forEach(slct => {
                                            //每個按鈕設定click事件
                                            slct.addEventListener("click", () => {
                                                //orderPriceArr中標示當前點選者
                                                element.currentSlct = slct.getAttribute("value")

                                                //選取當前按鍵區之後的每個按鍵區
                                                for (i = index + 1; i < orderPriceArr.length; i++) {

                                                    //每個按鍵區的所有slct更新價格
                                                    orderPriceArr[i].item.querySelectorAll(".selector").forEach(slct => {


                                                        //取得條件陣列
                                                        let cdtArr = [...orderPriceArr].filter((element, index) => { return index < i }).map(element => element.currentSlct)

                                                        cdtArr.push(slct.getAttribute("value"))

                                                        //用條件陣列與當前json轉換資料取得價格陣列
                                                        let priceArr = []
                                                        //先用name過濾，效能會更好，再改進
                                                        priceArr.push(setPageData.price.base)
                                                        cdtArr.forEach(cdt => {

                                                            setPageData.price.condition.forEach(condition => {

                                                                condition.data.forEach(data => {
                                                                    if (data.type == cdt) {
                                                                        priceArr.push(data.increase)
                                                                    }
                                                                })

                                                            })
                                                        })

                                                        //取得價格
                                                        let price = priceArr.reduce((acmlt, crVal) => {
                                                            return acmlt + parseInt(crVal)
                                                        }, 0)

                                                        //更新價格
                                                        let cdtPrice = slct.querySelector('[class*="min-price"]')
                                                        cdtPrice.innerText = `${setPageData.price.unit} ${new Intl.NumberFormat().format(price)}`


                                                        if (i != orderPriceArr.length - 1) {
                                                            cdtPrice.innerText += " 起"
                                                        }
                                                    })

                                                }

                                                //所有按鈕更新完價格後，更新summary-price

                                                //找出已點擊選項
                                                let slctedArr = [...document.querySelectorAll(`.${setPageData.name} [slct="1"]`)]

                                                //反向排序已點擊選項
                                                slctedArr.sort((a, b) => {
                                                    return window.getComputedStyle(b.parentNode.parentNode).order - window.getComputedStyle(a.parentNode.parentNode).order
                                                })

                                                //如果現在slct沒有價格，往前找到最接近的一個選擇價格
                                                let lastPriceSlcted = slctedArr.find(slcted => {
                                                    return slcted.querySelector(`[class*='min-price']`) != null
                                                })

                                                //如果現在lastPriceSlcted有價格則更新值，沒有價格，則不動價格(一開始已初始化為base值)
                                                document.querySelectorAll(`.${setPageData.name} .summary-price`).forEach(smrPrice => {
                                                    if (lastPriceSlcted != undefined) {
                                                        smrPrice.innerText = lastPriceSlcted.querySelector('[class*="min-price"]').innerText
                                                    }
                                                })
                                            })
                                        })
                                    })

                                    //如果每個選取區塊都有選到，更新產品規格
                                    document.querySelectorAll(`.${setPageData.name} .selector`).forEach(slct => {
                                        slct.addEventListener("click", () => {
                                            let slctGroupNum = [...document.querySelectorAll(`.${setPageData.name} .selector-group`)].length
                                            let smrSpec = document.querySelector(`.${setPageData.name} .summary-spec`)
                                            let slctedArr = [...document.querySelectorAll(`.${setPageData.name} [slct="1"]`)]
                                            let slctSpec = []
                                            if (slctGroupNum == slctedArr.length) {
                                                slctSpec.push(setPageData.name)
                                                slctedArr.forEach(slcted => {
                                                    slctSpec.push(slcted.querySelector("label").innerText)
                                                })
                                                smrSpec.innerHTML = `Product : ${slctSpec}`
                                            }
                                        })
                                    })
                                }


                            })

                    })
                })

            })

        })

}

//frontPage
function createNavBarItem(allData) {
    navBar.classList.add("page-selector-list")
    allData.forEach(data => {
        let barItem = document.createElement("div")
        barItem.classList.add("bar-item", "page-selector", data.type)
        barItem.setAttribute("pgName", data.name)
        barItem.innerHTML = data.label
        navBar.append(barItem)
    })
}

function createCardGroup(allData) {
    let cardAllData = allData.filter(data =>
        data.type == "product"
    )

    let cardGroup = document.createElement("div")
    cardGroup.classList.add("card-group", "page-selector-list")

    cardAllData.forEach(cardData => {
        let card = document.createElement("div")
        card.classList.add("card", "page-selector", cardData.type)
        card.setAttribute("pgName", cardData.name)
        let cardTitle = document.createElement("h3")
        cardTitle.innerHTML = cardData.name
        let cardImg = document.createElement("img")
        cardImg.src = cardData.img
        cardImg.alt = cardData.name

        card.append(cardTitle, cardImg)
        cardGroup.append(card)

    })
    container.append(cardGroup)

}

//productPage
function createTitle(pageData) {
    let title = document.createElement("div")
    title.classList.add(pageData.name, "title")

    let product = document.createElement("h3")
    product.innerHTML = `購買 ${pageData.name}`

    let summaryPrice = document.createElement("div")
    summaryPrice.className = "summary-price"

    title.append(product, summaryPrice)

    return title

}

function createHighlight(pageData) {
    let highlight = document.createElement("div")
    highlight.classList.add(pageData.name, "highlight")
    let img = document.createElement("img")
    img.src = pageData.img
    img.alt = pageData.name
    highlight.append(img)
    return highlight
}

function createItemList(pageData) {
    let itemList = document.createElement("div")
    itemList.classList.add(pageData.name, "item-list")
    itemList.append(createSlctCover())
    pageData.optional.forEach(optional => {

        itemList.append(createOptionalItem(optional))
    })
    itemList.append(createSummary())
    return itemList
}

function createSlctCover() {
    let selectorCover = document.createElement("div")
    selectorCover.classList = "selector-cover"
    return selectorCover
}

function createOptionalItem(optional) {
    let optionalItem = document.createElement("div")
    optionalItem.classList.add("item", optional.name)
    optionalItem.append(
        createText(optional.text),
        createSlctGroup(optional)
    )
    return optionalItem
}

function createText(optionalText) {
    let text = document.createElement("h4")
    let title = document.createElement("span")
    let detail = document.createElement("span")
    title.innerText = optionalText.title
    detail.innerText = optionalText.detail
    text.append(title, detail)
    return text
}

function createSlctGroup(optional) {
    let slctGroup = document.createElement("div")
    slctGroup.classList = "selector-group"
    optional.data.forEach(data => {
        let slct = document.createElement("div")
        slct.classList.add("selector")
        slct.setAttribute("slct", "-1")
        slct.setAttribute("value", data.type)
        //如果有標籤圖，加入
        if (Object.keys(data).includes("labelImg")) {
            let labelImg = document.createElement("img")
            labelImg.src = data.labelImg
            labelImg.alt = data.type
            slct.append(labelImg)
        }

        let label = document.createElement("label")
        label.innerText = data.label
        slct.append(label)

        //如果是調整價格機制，加入價格區塊
        if (setPageData.price.condition.map(x => x.name).includes(optional.name)) {
            let minPrice = document.createElement("span")
            minPrice.className = "min-price"
            slct.append(minPrice)
        }

        slctGroup.append(slct)
    })
    return slctGroup
}

function createSummary() {
    let summary = document.createElement("div")
    summary.classList.add("item", "summary")
    let summerPrice = document.createElement("div")
    summerPrice.classList = "summary-price"
    let summerSpec = document.createElement("div")
    summerSpec.classList = "summary-spec"
    summary.append(summerPrice, summerSpec)
    return summary
}
