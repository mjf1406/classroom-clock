let timerActive

const SECOND = 1000
const MINUTE = 60000
const TEN_SECONDS = 10000
const TRANSITION_DURATION = 30000
const TIMER_DONE_AUDIO = 10000
const divSchedule = document.getElementById('schedule')
const classEndTImes = {"ACI 2+":1700, "ACI 4+":1900}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds,)}`;
}
function setupListeners(){
    let buttonFiveMinutes = document.getElementById('button-5-mins')
    buttonFiveMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        let timerDuration = MINUTE * 5
        setEndTime(timerDuration)
        setTimer(timerDuration)
    })

    let buttonTenMinutes = document.getElementById('button-10-mins')
    buttonTenMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        let timerDuration = MINUTE * 10
        setEndTime(timerDuration)
        setTimer(timerDuration)
    })

    let buttonFifteenMinutes = document.getElementById('button-15-mins')
    buttonFifteenMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        let timerDuration = MINUTE * 15
        setEndTime(timerDuration)
        setTimer(timerDuration)
    })

    let buttonTwentyMinutes = document.getElementById('button-20-mins')
    buttonTwentyMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        let timerDuration = MINUTE * 20
        setEndTime(timerDuration)
        setTimer(timerDuration)
    })

    let buttonTwentyFiveMinutes = document.getElementById('button-25-mins')
    buttonTwentyFiveMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        let timerDuration = MINUTE * 25
        setEndTime(timerDuration)
        setTimer(timerDuration)
    })

    let buttonThirtyMinutes = document.getElementById('button-30-mins')
    buttonThirtyMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        let timerDuration = MINUTE * 30
        setEndTime(timerDuration)
        setTimer(timerDuration)
    })

    // let buttonCustomTimer = document.getElementById('button-custom-timer')
    // buttonCustomTimer.addEventListener('click', function(){
        // TODO: Set this whole thing up.
    // })
}
function setTime(){
    let locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
    let time = new Date().toLocaleTimeString(locale, undefined)
    let divTime = document.getElementById('div-time')
    divTime.innerHTML = time
}
function setEndTime(timerDuration){
    let locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
    let time = new Date();
    let newTime = new Date(time.getTime() + timerDuration); // Adds the timerDuration to the current date
    let divTimerEnd = document.getElementById('div-time-end');
    divTimerEnd.innerHTML = newTime.toLocaleTimeString(locale, undefined);
}
function setDate(){
    let locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
    let dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }
    let date = new Date().toLocaleDateString(locale, dateOptions)
    let divDate = document.getElementById('div-date')
    divDate.innerHTML = date
}
function setTimer(durationMilliseconds){
    localStorage.setItem('repeated', false)
    let transitionTrack = new Audio('data/transition.mp3')
    transitionTrack.loop = false
    let audioTenSecondCountdown = new Audio('data/oversimplified-alarm-clock-10s.mp3')
    audioTenSecondCountdown.loop = false
    let audioTimesUp = new Audio('data/the-magical-surprise-141291.mp3')
    audioTimesUp.loop = false

    localStorage.setItem('duration', durationMilliseconds)
    let breakButtonGroup = document.getElementById('break-button-group')
    breakButtonGroup.style.display = 'none'
    let spanRepeatQuantity = document.getElementById('repeat-quantity')
    let repeatQuantity = parseInt(spanRepeatQuantity.innerText)
    let timerActive = localStorage.getItem('timer-active')
    // TODO: This still does not work. Must be able to change timers with one active. 
        // "Solved" by removing the break buttons while a timer is active.
    if (timerActive == 'true') clearInterval() 
    let containerTimer = document.getElementById('container-timer')
    let divTime = document.getElementById('div-time')
    containerTimer.style.display = 'block'
    divTime.style.fontSize = '4rem'
    let divTimer = document.getElementById('div-timer')
    divTimer.innerHTML = convertMsToTime(durationMilliseconds)
    divTimer.name = durationMilliseconds
    divTimer.style.fontSize = '15rem'

    async function timer(transition) {
        let repeated = localStorage.getItem('repeated')
        localStorage.setItem('timer-active', true)
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        if (!transition && milliseconds <= 12500 && milliseconds >= 11500) {
            audioTenSecondCountdown.play() 
        }
        if (!transition && milliseconds <= 2500 && milliseconds >= 1500) {
            audioTimesUp.play() 
        }
        if (milliseconds <= 1000) {
            clearInterval(timerInterval)
            localStorage.setItem('timer-active', false)
            containerTimer.style.display = 'none'
            divTime.style.fontSize = '15rem'
            document.documentElement.className = 'theme-counting'
            if (repeated == 'false') breakButtonGroup.style.display = 'inline-flex'
        }
        milliseconds = milliseconds - 1000
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    }

    var timerInterval = setInterval(timer, 1000)

    let buttonGroupTimer = document.getElementById('timer-button-group')
    var new_element = buttonGroupTimer.cloneNode(true);
    buttonGroupTimer.parentNode.replaceChild(new_element, buttonGroupTimer);

    let buttonPlayPause = document.getElementById('play-pause')
    buttonPlayPause.addEventListener('click', function() { 
        // TODO: This won't work within the while loop just yet.
        clearInterval(timerInterval)
        let timerActive = localStorage.getItem('timer-active')
        timerInterval = setInterval(timer, 1000)
        if (timerActive == 'false') { 
            localStorage.setItem('timer-active', true)
            let divTimer = document.getElementById('div-timer')
            let milliseconds = parseInt(divTimer.name)
            setEndTime(milliseconds)
            divTimer.style.opacity = '100%'
            this.innerHTML = ``
            this.innerHTML = `<i class="fa-solid fa-pause"></i>`
        } else if (timerActive == 'true') {
            clearInterval(timerInterval)
            localStorage.setItem('timer-active', false)
            let divTimer = document.getElementById('div-timer')
            divTimer.style.opacity = '25%'
            this.innerHTML = ``
            this.innerHTML = `<i class="fa-solid fa-play"></i>`
        }
        timerActive = localStorage.getItem('timer-active')
    })   
    let buttonPlusMinute = document.getElementById('plus-one-minute')
    buttonPlusMinute.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds + MINUTE
        let duration = parseInt(parseInt(localStorage.getItem('duration')))
        duration += MINUTE
        localStorage.setItem('duration', duration)
        setEndTime(milliseconds)
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonMinusMinute = document.getElementById('minus-one-minute')
    buttonMinusMinute.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds - MINUTE
        if (milliseconds <= 0) return
        let duration = parseInt(localStorage.getItem('duration'))
        duration -= MINUTE
        localStorage.setItem('duration', duration)
        setEndTime(milliseconds)
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonPlusTenSeconds = document.getElementById('plus-10-seconds')
    buttonPlusTenSeconds.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds + TEN_SECONDS
        let duration = parseInt(localStorage.getItem('duration'))
        duration += TEN_SECONDS
        localStorage.setItem('duration', duration)
        setEndTime(milliseconds)
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonMinusTenSeconds = document.getElementById('minus-10-seconds')
    buttonMinusTenSeconds.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds - TEN_SECONDS
        if (milliseconds <= 0) return
        let duration = parseInt(localStorage.getItem('duration'))
        duration -= TEN_SECONDS
        localStorage.setItem('duration', duration)
        setEndTime(milliseconds)
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonPlusOneSeconds = document.getElementById('plus-1-seconds')
    buttonPlusOneSeconds.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds + SECOND
        let duration = parseInt(localStorage.getItem('duration'))
        duration += TEN_SECONDS
        localStorage.setItem('duration', duration)
        setEndTime(milliseconds)
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonMinusOneSeconds = document.getElementById('minus-1-seconds')
    buttonMinusOneSeconds.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds - SECOND
        if (milliseconds <= 0) return
        let duration = parseInt(localStorage.getItem('duration'))
        duration -= TEN_SECONDS
        localStorage.setItem('duration', duration)
        setEndTime(milliseconds)
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonReset = document.getElementById('reset')
    buttonReset.addEventListener('click', function(){
        milliseconds = durationMilliseconds
        setEndTime(milliseconds)
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonRepeatMinus = document.getElementById('repeat-minus')
    buttonRepeatMinus.addEventListener('click', function(){
        let spanRepeatQuantity = document.getElementById('repeat-quantity')
        let repeatQuantity = parseInt(spanRepeatQuantity.innerText)
        repeatQuantity -= 1
        spanRepeatQuantity.innerHTML = `${repeatQuantity}`
    })
    let buttonRepeat = document.getElementById('repeat')
    buttonRepeat.addEventListener('click', function(){
        let spanRepeatQuantity = document.getElementById('repeat-quantity')
        let repeatQuantity = parseInt(spanRepeatQuantity.innerText)
        repeatQuantity += 1
        spanRepeatQuantity.innerHTML = `${repeatQuantity}`
    })
    let buttonCancel = document.getElementById('cancel')
    buttonCancel.addEventListener('click', function(){
        // TODO: Find a better way to do this
        window.location.reload()
    })
    let buttonSetRepeatCycle = document.getElementById('set-repeat')
    buttonSetRepeatCycle.addEventListener('click', function(){
        let buttonRepeat = document.getElementById('repeat')
        let buttonRepeatMinus = document.getElementById('repeat-minus')
        let buttonReset = document.getElementById('reset')

        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        let duration = parseInt(localStorage.getItem('duration'))
        let repeatQuantity = parseInt(document.getElementById('repeat-quantity').innerHTML)
        if (repeatQuantity <= 0) return document.documentElement.className = 'theme-timer'
        document.documentElement.className = 'theme-timer-repeated'
        setRepeatedTimer(timer, milliseconds, repeatQuantity, duration)

        applyNotAllowed()
    })
    async function setRepeatedTimer(timer, milliseconds, quantity, duration){
        localStorage.setItem('repeated', true)
        let transitionInterval
        let containerTimer = document.getElementById('container-timer')
        let divTime = document.getElementById('div-time')
        let divTimer = document.getElementById('div-timer')
        let spanRepeatQuantity = document.getElementById('repeat-quantity')
        let breakButtonGroup = document.getElementById('break-button-group')
        let buttonSetRepeatCycle = document.getElementById('set-repeat')
        let buttonRepeat = document.getElementById('repeat')
        let buttonRepeatMinus = document.getElementById('repeat-minus')
        let buttonReset = document.getElementById('reset')
        breakButtonGroup.style.display = 'none'
        await sleep(milliseconds)
        while (quantity > 0) {
            quantity -= 1

            clearInterval(timerInterval)
            clearInterval(transitionInterval)

            divTimer.name = TRANSITION_DURATION
            document.documentElement.className = 'theme-timer-transition'
            containerTimer.style.display = 'block'
            divTime.style.fontSize = '4rem'
            divTimer.innerHTML = convertMsToTime(TRANSITION_DURATION)
            divTimer.style.fontSize = '15rem'
            transitionTrack.play() 
            
            // applyNotAllowed()

            transitionInterval = setInterval( function(){
                localStorage.setItem('timer-active', true)
                let divTimer = document.getElementById('div-timer')
                let milliseconds = parseInt(divTimer.name)
                if (milliseconds <= 1000) {
                    clearInterval(timerInterval)
                    localStorage.setItem('timer-active', false)
                    containerTimer.style.display = 'none'
                    divTime.style.fontSize = '15rem'
                    document.documentElement.className = 'theme-counting'
                }
                milliseconds = milliseconds - 1000
                divTimer.innerHTML = convertMsToTime(milliseconds)
                divTimer.name = milliseconds
            }, 1000)

            await sleep(TRANSITION_DURATION)

            clearInterval(transitionInterval)

            // removeNotAllowed()

            document.documentElement.className = 'theme-timer-repeated'
            containerTimer.style.display = 'block'
            divTime.style.fontSize = '4rem'
            divTimer.innerHTML = convertMsToTime(duration)
            divTimer.name = duration
            divTimer.style.fontSize = '15rem'

            spanRepeatQuantity.innerHTML = quantity
            timerInterval = setInterval(timer, 1000)   

            await sleep(duration) 
        }
        breakButtonGroup.style.display = 'inline-flex'
        removeNotAllowed()
    }
    function applyNotAllowed(){
        let buttonRepeatMinus = document.getElementById('repeat-minus')
        let buttonRepeat = document.getElementById('repeat')
        let buttonMinusTenSeconds = document.getElementById('minus-10-seconds')
        let buttonPlusTenSeconds = document.getElementById('plus-10-seconds')
        let buttonMinusMinute = document.getElementById('minus-one-minute')
        let buttonPlusMinute = document.getElementById('plus-one-minute')
        let buttonPlayPause = document.getElementById('play-pause')
        let buttonReset = document.getElementById('reset')
        let buttonSetRepeatCycle = document.getElementById('set-repeat')

        buttonRepeatMinus.classList.add('not-allowed')
        buttonRepeat.classList.add('not-allowed')
        buttonMinusMinute.classList.add('not-allowed')
        buttonMinusTenSeconds.classList.add('not-allowed')
        buttonPlayPause.classList.add('not-allowed')
        buttonPlusMinute.classList.add('not-allowed')
        buttonPlusTenSeconds.classList.add('not-allowed')
        buttonReset.classList.add('not-allowed')
        buttonSetRepeatCycle.classList.add('not-allowed')

        buttonRepeatMinus.disabled = true
        buttonRepeat.disabled = true
        buttonMinusMinute.disabled = true
        buttonMinusTenSeconds.disabled = true
        buttonPlayPause.disabled = true
        buttonPlusMinute.disabled = true
        buttonPlusTenSeconds.disabled = true
        buttonReset.disabled = true
        buttonSetRepeatCycle.disabled = 'true'
    }
    function removeNotAllowed(){
        let buttonRepeatMinus = document.getElementById('repeat-minus')
        let buttonRepeat = document.getElementById('repeat')
        let buttonMinusTenSeconds = document.getElementById('minus-10-seconds')
        let buttonPlusTenSeconds = document.getElementById('plus-10-seconds')
        let buttonMinusMinute = document.getElementById('minus-one-minute')
        let buttonPlusMinute = document.getElementById('plus-one-minute')
        let buttonPlayPause = document.getElementById('play-pause')
        let buttonReset = document.getElementById('reset')
        let buttonSetRepeatCycle = document.getElementById('set-repeat')

        buttonRepeatMinus.classList.remove('not-allowed')
        buttonRepeat.classList.remove('not-allowed')
        buttonMinusMinute.classList.remove('not-allowed')
        buttonMinusTenSeconds.classList.remove('not-allowed')
        buttonPlayPause.classList.remove('not-allowed')
        buttonPlusMinute.classList.remove('not-allowed')
        buttonPlusTenSeconds.classList.remove('not-allowed')
        buttonReset.classList.remove('not-allowed')
        buttonSetRepeatCycle.classList.remove('not-allowed')

        buttonRepeatMinus.disabled = false
        buttonRepeat.disabled = false
        buttonMinusMinute.disabled = false
        buttonMinusTenSeconds.disabled = false
        buttonPlayPause.disabled = false
        buttonPlusMinute.disabled = false
        buttonPlusTenSeconds.disabled = false
        buttonReset.disabled = false
        buttonSetRepeatCycle.disabled = false
    }
}
async function populateSchedule(){
    let locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
    fetch('SCHEDULE.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            // if(typeof require !== 'undefined') XLSX = require('xlsx');
            let workbook = XLSX.read(new Uint8Array(data), {type:'array'});
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            let transformedData = jsonData.map(convertToDates)

            let scheduledDate = transformedData[1][2]
            scheduledDate.setHours(0,0,0,0)
            let todayDate = new Date()
            todayDate.setHours(0,0,0,0)

            if (scheduledDate.getTime() === todayDate.getTime()) {
                const table = document.createElement('table')
                table.classList.add('styled-table')
                const thead = document.createElement('thead')
                const tbody = document.createElement('tbody')
                const thClass = document.createElement('th')
                const thStart = document.createElement('th')
                const thEnd = document.createElement('th')
                const thActivity = document.createElement('th')

                thClass.innerText = 'Class'
                thStart.innerText = 'Start Time'
                thEnd.innerText = 'End Time'
                thActivity.innerText = 'Activity'

                thead.appendChild(thClass)
                thead.appendChild(thStart)
                thead.appendChild(thEnd)
                thead.appendChild(thActivity)
                table.appendChild(thead)

                divSchedule.appendChild(table)

                for (let index = 0; index < transformedData.length; index++) {
                    const element = transformedData[index];
                    if (element[0] == 'CLASS') continue
                    let className = element[0]
                    let startTime = new Date(element[2]).toLocaleTimeString(locale, undefined)
                    let endTime = new Date(element[3]).toLocaleTimeString(locale, undefined)
                    let activity = element[4]

                    const tr = document.createElement('tr')
                    const tdClass = document.createElement('td')
                    const tdStart = document.createElement('td')
                    const tdEnd = document.createElement('td')
                    const tdActivity = document.createElement('td')

                    tdClass.innerText = className 
                    tdStart.innerText = startTime
                    tdEnd.innerText = endTime
                    tdActivity.innerText = activity

                    tr.appendChild(tdClass)
                    tr.appendChild(tdStart)
                    tr.appendChild(tdEnd)
                    tr.appendChild(tdActivity)
                                 
                    tbody.appendChild(tr)
                }

                table.appendChild(tbody)
            }
        })
        .catch(err => console.error('An error occurred', err));
}
function convertToDates(arr) {
    if (arr[0] != 'CLASS' || arr[1].length == 0) {
        let dateParts = arr[5].split("/");
        let year = dateParts[2].length === 2 ? "20" + dateParts[2] : dateParts[2]; // If year is in 2 digits, prepend '20'
        // Start Time
        let startHours = parseInt(arr[2].substr(0, 2), 10);
        let startMinutes = parseInt(arr[2].substr(2, 2), 10);
        let startDate = new Date(year, dateParts[0] - 1, dateParts[1], startHours, startMinutes);
        arr[2] = startDate;
        // End Time
        let endHours = parseInt(arr[3].substr(0, 2), 10);
        let endMinutes = parseInt(arr[3].substr(2, 2), 10);
        let endDate = new Date(year, dateParts[0] - 1, dateParts[1], endHours, endMinutes);
        arr[3] = endDate; 
    }
    return arr;
}