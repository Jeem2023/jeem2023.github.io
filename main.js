var counter = 1
var counterpersecondbuys = 0
var points = 1
var lastupdate = Date.now()
var deltatime = 0.0 // temporary value
var progress = 0.0
var rewardforallbuys = 0
var rewardforevenbuys = 0
var rewardforoddbuys = 0
var rewardforprimebuys = 0

function element(name) {
    return document.getElementById(name)
}

function setbuyable(elem, bool) {
    if (bool && elem.classList.contains("upgradenotbuyable")) {
        elem.classList.remove("upgradenotbuyable")
        elem.classList.add("upgradebuyable")
    }
    if (!bool && elem.classList.contains("upgradebuyable")) {
        elem.classList.remove("upgradebuyable")
        elem.classList.add("upgradenotbuyable")
    }
}

function update() {
    element("counter").textContent = format(counter)
    element("points").textContent = format(points)
    element("cps").textContent = format(counterpersecondbuys * 0.1)
    element("proggybarstart").style.width = Math.floor(progress * 240).toString() + "px"
    element("proggybarend").style.width = (240 - Math.floor(progress * 240)).toString() + "px"
    element("cpsupgrade").innerHTML = "Increase counter per second<br>" + format(counterpersecondbuys * 0.1) + " → " + format((counterpersecondbuys + 1) * 0.1) + "<br>Cost: " + format(1.5 ** counterpersecondbuys)
    setbuyable(element("cpsupgrade"), points >= 1.5 ** counterpersecondbuys)
    element("rewardforallupgrade").innerHTML   = "Multiply reward for all numbers<br>×"   + format(1 + 0.5 * rewardforallbuys)          + " → ×" + format(1 + 0.5 * (rewardforallbuys + 1))          + "<br>Cost: " + format(30 * 1.5 ** rewardforallbuys)
    setbuyable(element("rewardforallupgrade"), points >= 30 * 1.5 ** rewardforallbuys)
    element("rewardforevenupgrade").innerHTML  = "Multiply reward for even numbers<br>×"  + format(1 + rewardforevenbuys)               + " → ×" + format(1 + (rewardforevenbuys + 1))               + "<br>Cost: " + format(30 * 1.5 ** rewardforevenbuys)
    setbuyable(element("rewardforevenupgrade"), points >= 30 * 1.5 ** rewardforevenbuys)
    element("rewardforoddupgrade").innerHTML   = "Multiply reward for odd numbers<br>×"   + format(1 + rewardforoddbuys)                + " → ×" + format(1 + (rewardforoddbuys + 1))                + "<br>Cost: " + format(30 * 1.5 ** rewardforoddbuys)
    setbuyable(element("rewardforoddupgrade"), points >= 30 * 1.5 ** rewardforoddbuys)
    element("rewardforprimeupgrade").innerHTML = "Multiply reward for prime numbers<br>×" + format((1 + 0.5 * rewardforprimebuys) ** 2) + " → ×" + format((1 + 0.5 * (rewardforprimebuys + 1)) ** 2) + "<br>Cost: " + format(120 * 1.5 ** rewardforprimebuys)
    setbuyable(element("rewardforprimeupgrade"), points >= 120 * 1.5 ** rewardforprimebuys)
}

function isprime(n) {
    if (n < 2) {
        return false
    }
    for (var i = 2; i <= Math.floor(n ** 0.5); i++) {
        if (n % i == 0) {
            return false
        }
    }
    return true
}

function increment() {
    counter += 1
    points += 1
    update()
}

function pointsfor(number) {
    output = 1
    output *= 1 + 0.5 * rewardforallbuys
    if (number % 2 == 0) {
        output *= 1 + rewardforevenbuys
    }
    if (number % 2 == 1) {
        output *= 1 + rewardforoddbuys
    }
    if (isprime(number)) {
        output *= (1 + 0.5 * rewardforprimebuys) ** 2
    }
    return output
}

function mainloop() {
    deltatime = (Date.now() - lastupdate) * 0.001
    lastupdate = Date.now()
    progress += deltatime * counterpersecondbuys * 0.1
    while (progress >= 1) {
        progress -= 1
        points += pointsfor(counter)
        counter += 1
    }
    update()
}

function cpsupgrade() {
    if (points >= 1.5 ** counterpersecondbuys) {
        points -= 1.5 ** counterpersecondbuys
        counterpersecondbuys += 1
        element("rewardforallupgrade").style.display = "inline"
    }
}

function rewardforallupgrade() {
    if (points >= 30 * 1.5 ** rewardforallbuys) {
        points -= 30 * 1.5 ** rewardforallbuys
        rewardforallbuys += 1
        element("rewardforevenupgrade").style.display = "inline"
    }
}

function rewardforevenupgrade() {
    if (points >= 30 * 1.5 ** rewardforevenbuys) {
        points -= 30 * 1.5 ** rewardforevenbuys
        rewardforevenbuys += 1
        element("rewardforoddupgrade").style.display = "inline"
    }
}

function rewardforoddupgrade() {
    if (points >= 30 * 1.5 ** rewardforoddbuys) {
        points -= 30 * 1.5 ** rewardforoddbuys
        rewardforoddbuys += 1
        element("rewardforprimeupgrade").style.display = "inline"
    }
}

function rewardforprimeupgrade() {
    if (points >= 120 * 1.5 ** rewardforprimebuys) {
        points -= 120 * 1.5 ** rewardforprimebuys
        rewardforprimebuys += 1
    }
}

function format(number) {
    if (number == Infinity) {
        return "∞"
    }
    if (number < 0) {
        return "-" + format(number)
    }
    if (number < 10) {
        return (+number.toFixed(2)).toString()
    }
    if (number < 100) {
        return (+number.toFixed(1)).toString()
    }
    if (number < 10000) {
        return (Math.floor(number)).toString()
    }
    if (number < 1e6) {
        return format(number / 1000) + "K"
    }
    if (number < 1e9) {
        return format(number / 1e6) + "M"
    }
    if (number < 1e12) {
        return format(number / 1e9) + "B"
    }
    if (number < 1e48) {
        return format(number / 1e12) + "T"
    }
    var trillions = Math.floor(Math.log10(number) / 12)
    return format(number / (10 ** trillions)) + "T^" + trillions.toString()
}

function resetcounterandpoints() {
    //if (counterpersecondbuys > 0) {
    //    if (confirm("Are you sure?")) {
    //        counter = 1
    //        points = 0.0
    //        progress = 0.0
    //        lastupdate = Date.now()
    //    }
    //} else {
    //    window.alert("You can't reset without passive point gain. That would softlock you!")
    //}
    if (confirm("Are you sure?")) {
        counter = 1
        points = 1.0
        progress = 0.0
        lastupdate = Date.now()
    }
}

setInterval(mainloop, 50)

element("rewardforallupgrade").style.display = "none"
element("rewardforevenupgrade").style.display = "none"
element("rewardforoddupgrade").style.display = "none"
element("rewardforprimeupgrade").style.display = "none"

element("cpsupgrade").classList.remove("upgrade")
element("cpsupgrade").classList.add("upgradebuyable")