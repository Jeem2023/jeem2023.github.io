var counter = 1
var tickspersecondbuys = 0
var points = 1.0
var lastupdate = Date.now()
var deltatime = 0.0 // temporary value
var progress = 0.0
var rewardforallbuys = 0
var rewardforevenbuys = 0
var rewardforoddbuys = 0
var rewardforprimebuys = 0
var milestonechoices = [0, 0, 0, 0]
var pointsreset = 0

function element(name) {
    return document.getElementById(name)
}

function setbuyable(elem, int) {
    if ((int == 1) && elem.classList.contains("upgradenotbuyable")) {
        elem.classList.remove("upgradenotbuyable")
        elem.classList.add("upgradebuyable")
    }
    if ((int == 0) && elem.classList.contains("upgradebuyable")) {
        elem.classList.remove("upgradebuyable")
        elem.classList.add("upgradenotbuyable")
    }
    if ((int == 2) && elem.classList.contains("upgradebuyable")) {
        elem.classList.remove("upgradebuyable")
        elem.classList.add("upgrademaxed")
    }
}

function update() {
    element("counter").textContent = format(counter)
    element("points").textContent = format(points)
    element("tps").textContent = format(tickspersecondbuys * 0.1)
    element("proggybarstart").style.width = Math.floor(progress * 240).toString() + "px"
    element("proggybarend").style.width = (240 - Math.floor(progress * 240)).toString() + "px"
    element("tpsupgrade").innerHTML = "Increase counter per second<br>" + format(tickspersecondbuys * 0.1) + " → " + format((tickspersecondbuys + 1) * 0.1) + "<br>Cost: " + format(1.5 ** tickspersecondbuys)
    setbuyable(element("tpsupgrade"), +(points >= 1.5 ** tickspersecondbuys))
    element("rewardforallupgrade").innerHTML   = "Multiply reward for all numbers<br>×"   + format(1 + 0.5 * rewardforallbuys)          + " → ×" + format(1 + 0.5 * (rewardforallbuys + 1))          + "<br>Cost: " + format(30 * 1.5 ** rewardforallbuys)
    setbuyable(element("rewardforallupgrade"), +(points >= 30 * 1.5 ** rewardforallbuys))
    element("rewardforevenupgrade").innerHTML  = "Multiply reward for even numbers<br>×"  + format(1 + rewardforevenbuys)               + " → ×" + format(1 + (rewardforevenbuys + 1))               + "<br>Cost: " + format(30 * 1.5 ** rewardforevenbuys)
    setbuyable(element("rewardforevenupgrade"), +(points >= 30 * 1.5 ** rewardforevenbuys))
    element("rewardforoddupgrade").innerHTML   = "Multiply reward for odd numbers<br>×"   + format(1 + rewardforoddbuys)                + " → ×" + format(1 + (rewardforoddbuys + 1))                + "<br>Cost: " + format(30 * 1.5 ** rewardforoddbuys)
    setbuyable(element("rewardforoddupgrade"), +(points >= 30 * 1.5 ** rewardforoddbuys))
    element("rewardforprimeupgrade").innerHTML = "Multiply reward for prime numbers<br>×" + format((1 + 0.5 * rewardforprimebuys) ** 2) + " → ×" + format((1 + 0.5 * (rewardforprimebuys + 1)) ** 2) + "<br>Cost: " + format(120 * 1.5 ** rewardforprimebuys)
    setbuyable(element("rewardforprimeupgrade"), +(points >= 120 * 1.5 ** rewardforprimebuys))
    setbuyable(element("earlymilestone0"), (milestonechoices[0] == -1) ? 2 : (+(points >= 10e6 && milestonechoices[0] == 0)))
    setbuyable(element("earlymilestone1"), (milestonechoices[1] == -1) ? 2 : (+(points >= 100e6 && milestonechoices[1] == 0)))
    setbuyable(element("latemilestone0"), (milestonechoices[0] == 1) ? 2 : (+(points >= 10e6 && milestonechoices[0] == 0)))
    setbuyable(element("latemilestone1"), (milestonechoices[1] == 1) ? 2 : (+(points >= 100e6 && milestonechoices[1] == 0)))
    element("latemilestone1").innerHTML = "Gain a boost based on how many points you have reset<br>×" + format(1) + " → ×" + format(Math.log10(pointsreset ** 0.04 + 10) ** 2) + "<br>Cost: " + format(100e6)
    setbuyable(element("rewardforprimeupgrade"), +(points >= 120 * 1.5 ** rewardforprimebuys))
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
    if (milestonechoices[0] == -1 && isprime(number)) {
        output += tickspersecondbuys + rewardforallbuys + rewardforevenbuys + rewardforoddbuys + rewardforprimebuys
    }
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
    if (milestonechoices[0] == 1) {
        output *= 1 + (tickspersecondbuys + rewardforallbuys + rewardforevenbuys + rewardforoddbuys + rewardforprimebuys) * 0.01
    }
    if (milestonechoices[1] == 1) {
        output *= Math.log10(pointsreset ** 0.04 + 10) ** 2
    }
    return output
}

function mainloop() {
    deltatime = (Date.now() - lastupdate) * 0.001
    lastupdate = Date.now()
    progress += deltatime * tickspersecondbuys * 0.1
    while (progress >= 1) {
        progress -= 1
        points += pointsfor(counter)
        counter += 1
    }
    update()
}

function tpsupgrade() {
    if (points >= 1.5 ** tickspersecondbuys) {
        points -= 1.5 ** tickspersecondbuys
        tickspersecondbuys += 1
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
        element("earlycontainer").style.display = ""
        element("latecontainer").style.display = ""
    }
}

function earlymilestone(num) {
    if (milestonechoices[num] == 0 && points >= 10 ** (7 + num)) {
        points -= 10 ** (7 + num)
        milestonechoices[num] = -1
        if (num < 1) {
            element("earlymilestone" + (num + 1).toString()).style.display = "inline"
            element("latemilestone" + (num + 1).toString()).style.display = "inline"
        }
    }
}

function latemilestone(num) {
    if (milestonechoices[num] == 0 && points >= 10 ** (7 + num)) {
        points -= 10 ** (7 + num)
        milestonechoices[num] = 1
        if (num < 1) {
            element("earlymilestone" + (num + 1).toString()).style.display = "inline"
            element("latemilestone" + (num + 1).toString()).style.display = "inline"
        }
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
    if (confirm("Are you sure?")) {
        counter = 1
        pointsreset += Math.max((milestonechoices[1] == -1) ? (points - Math.max(points * 0.5, 1)) : (points - 1.0), 0)
        points = (milestonechoices[1] == -1) ? (Math.max(points * 0.5, 1)) : 1.0
        progress = 0.0
        lastupdate = Date.now()
    }
}

setInterval(mainloop, 50)

element("rewardforallupgrade").style.display = "none"
element("rewardforevenupgrade").style.display = "none"
element("rewardforoddupgrade").style.display = "none"
element("rewardforprimeupgrade").style.display = "none"
element("earlycontainer").style.display = "none"
element("latecontainer").style.display = "none"
element("earlymilestone1").style.display = "none"
element("latemilestone1").style.display = "none"