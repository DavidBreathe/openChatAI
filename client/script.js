import bot from './assets/BreatheBot.png'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')


let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `<div class="wrapper ${isAi && 'ai'}">
            <div class="chat">            
                <div class="profile">
                    <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>                
                <div class="message" id=${uniqueId}>${value}
                </div>
                <button class="copy-button" style="${isAi ? 'display:block;' : 'display:none;'}" data-clipboard-text=${uniqueId}>
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" 
                stroke-linecap="round" stroke-linejoin="round" 
                class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2">
                </path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                Copy</button>
            </div>
        </div>
       
    `
    )
}


   

/*
function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">            
                <div class="profile">
                    <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>                
                <div class="message" id=${uniqueId}>${value}
                </div>                
                <button class="copy-button" data-clipboard-target="${uniqueId}">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" 
                stroke-linecap="round" stroke-linejoin="round" 
                class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2">
                </path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                Copy</button>
            </div>
        </div>
       
    `
    )
}

*/


const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)


    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    
    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData);       
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

form.addEventListener('keyup', (e) => {
    var characterCount = document.getElementById("chatai_input").value.length;
   var  current = document.getElementById("current");
    current.innerHTML=characterCount;
})


 
  
function copyMessageContent(id,message){
    console.log(message);
}  
      
