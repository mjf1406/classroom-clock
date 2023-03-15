let timerActive
function setupListeners(){
    let buttonFiveMinutes = document.getElementById('button-5-mins')
    buttonFiveMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        setTimer(300000)
    })

    let buttonTenMinutes = document.getElementById('button-10-mins')
    buttonTenMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        setTimer(600000)
    })

    let buttonFifteenMinutes = document.getElementById('button-15-mins')
    buttonFifteenMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        setTimer(900000)
    })

    let buttonTwentyMinutes = document.getElementById('button-20-mins')
    buttonTwentyMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        setTimer(1200000)
    })

    let buttonTwentyFiveMinutes = document.getElementById('button-25-mins')
    buttonTwentyFiveMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        setTimer(1500000)
    })

    let buttonThirtyMinutes = document.getElementById('button-30-mins')
    buttonThirtyMinutes.addEventListener('click', function(){
        document.documentElement.className = 'theme-timer'
        setTimer(1800000)
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
    let timerActive = localStorage.getItem('timer-active')
    // TODO: This still does not work. Must be able to change timers with one active.
    if (timerActive == 'true') clearInterval() 
    let containerTimer = document.getElementById('container-timer')
    let divTime = document.getElementById('div-time')
    containerTimer.style.display = 'block'
    divTime.style.fontSize = '4vw'
    let divTimer = document.getElementById('div-timer')
    divTimer.innerHTML = convertMsToTime(durationMilliseconds)
    divTimer.name = durationMilliseconds
    divTimer.style.fontSize = '10vw'

    function timer() {
        localStorage.setItem('timer-active', true)
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        if (milliseconds <= 1500) {
            let audioTimesUp = new Audio('data/oversimplified-alarm-clock-10s.mp3')
            audioTimesUp.loop = false
            audioTimesUp.play() 
            audioVolumeOut(audioTimesUp)
        }
        if (milliseconds <= 1000) {
            console.log("Timer done!")
            clearInterval(timerInterval)
            localStorage.setItem('timer-active', false)
            containerTimer.style.display = 'none'
            divTime.style.fontSize = '10vw'
            document.documentElement.className = 'theme-counting'
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
    // TODO: This still does not work completely. Currently can pause once and resume once
    buttonPlayPause.addEventListener('click', function() { 
        clearInterval(timerInterval)
        let timerActive = localStorage.getItem('timer-active')
        timerInterval = setInterval(timer, 1000)
        if (timerActive == 'false') { 
            localStorage.setItem('timer-active', true)
            let divTimer = document.getElementById('div-timer')
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
    let buttonCancel = document.getElementById('cancel')
    buttonCancel.addEventListener('click', function(){
        divTimer.innerHTML = ''
        clearInterval(timerInterval)
        localStorage.setItem('timer-active', false)
        containerTimer.style.display = 'none'
        divTime.style.fontSize = '10vw'
        document.documentElement.className = 'theme-counting'
    })
    let buttonReset = document.getElementById('reset')
    buttonReset.addEventListener('click', function(){
        milliseconds = durationMilliseconds
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonPlusMinute = document.getElementById('plus-one-minute')
    buttonPlusMinute.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds + 60000
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonMinusMinute = document.getElementById('minus-one-minute')
    buttonMinusMinute.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds - 60000
        if (milliseconds <= 0) return
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonPlusTenSeconds = document.getElementById('plus-10-seconds')
    buttonPlusTenSeconds.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds + 10000
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
    let buttonMinusTenSeconds = document.getElementById('minus-10-seconds')
    buttonMinusTenSeconds.addEventListener('click', function(){
        let divTimer = document.getElementById('div-timer')
        let milliseconds = parseInt(divTimer.name)
        milliseconds = milliseconds - 10000
        if (milliseconds <= 0) return
        divTimer.innerHTML = convertMsToTime(milliseconds)
        divTimer.name = milliseconds
    })
}
// <i class="fa-solid fa-pause"></i>
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