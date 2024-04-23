// Homework Questions
// Q1. Implement the color chnage of the icon for the Add Modal button just like we are doing for the remove button
// Q2: Create a function findTaskIdx/findTask that takes in a task ID and returns the task if found


// First step: Select the concerned elements
const addBtn = document.querySelector(".add-btn")
const removeBtn = document.querySelector(".remove-btn")
const modalCont = document.querySelector(".modal-cont")
const mainCont = document.querySelector(".main-cont")
const textArea = document.querySelector(".textArea-cont")
// const ticketCont = document.querySelector("ticket-cont")
const allPriorityColors = document.querySelectorAll(".priority-color")
const allFilterColors = document.querySelectorAll(".color")

let addTaskFlag = false
let removeTaskFlag = false
let modalPriorityColor = "black"

const colorArray = ['lightpink', 'lightgreen', 'lightblue', 'black']
const taskArray = []

addBtn.addEventListener('click', function() {
    // Swap the flag
    addTaskFlag = !addTaskFlag

    if(addTaskFlag) {
        modalCont.style.display = "flex"
    } else {
        modalCont.style.display = "none"
    }
})

removeBtn.addEventListener('click', function() {
        // Swap the flag
        removeTaskFlag = !removeTaskFlag

        if(removeTaskFlag) {
            alert("Delete mode has been activated!")
            removeBtn.style.color = "red"
        } else {
            alert("Delete mode has been de-activated!")
            removeBtn.style.color = "white"
        }
})

// Handle the filtering logic
allFilterColors.forEach(function(colorElem) {
    colorElem.addEventListener('click', function() {
        const selectFilterColor = colorElem.classList[0]

        // Create the filtered array
        const filteredArray = taskArray.filter((currentStepTask) => currentStepTask.ticketColor == selectFilterColor)

        // Remove all tasks from the screen
        mainCont.innerHTML = ""

        // Add back tasks from filteredArray
        filteredArray.forEach((taskElementCurrent) => {
            createTicket(
                taskElementCurrent.ticketColor,
                taskElementCurrent.taskContent,
                taskElementCurrent.taskId,
                false
            )
        })
    })

    colorElem.addEventListener('dblclick', function() {
        // Remove all tasks from the screen
        mainCont.innerHTML = ""
        
        // Add back all tasks from taskArray
        taskArray.forEach((taskElementCurrent) => {
        createTicket(
            taskElementCurrent.ticketColor,
            taskElementCurrent.taskContent,
            taskElementCurrent.taskId,
            false
        )
    })
    })
})


// Function to handle removal
function handleRemoval(ticket, taskId) {
    ticket.addEventListener('click', function() {
        if(removeTaskFlag) {
            ticket.remove()

            // Remove the task from my taskArray
            // Array.splice(idx, 1)
            const currentTaskIdx = taskArray.findIndex((currentStepTask) => currentStepTask.taskId == taskId)
            taskArray.splice(currentTaskIdx, 1)
            console.log({ taskArray })
        }
    })
}

// Function to toggle task/ticket priority
function handleColor(ticket, taskId) {
    // Select the color element
    const colorElem = ticket.querySelector(".ticket-color")

    // Now add in the event listener
    colorElem.addEventListener('click', function(){
        // Get the current color
        const currentColor = colorElem.classList[1]

        // Figure out the index in the Color Array
        let currentColorIdx = colorArray.findIndex((currentStepColor) => currentStepColor == currentColor)

        // Alternative approach in finding index
        // arr.forEach(function (elem, idx) { if(elem == 3) { requiredidx = idx} })

        currentColorIdx++

        const newColorIdx = currentColorIdx % colorArray.length
        const newColor = colorArray[newColorIdx]

        // Update the color
        // Remove the current class
        colorElem.classList.remove(currentColor)

        // Add the new class
        colorElem.classList.add(newColor)

        // Update the taskArray with the updated color
        // Find the exact task that we want
        const currentTask = taskArray.find((currentStepTask) => currentStepTask.taskId == taskId)
        currentTask.ticketColor = newColor
    })
}

// FUnction to handle the locking mechanism

function handleLock(ticket, taskId) {
    // Select the lock container element first
    const ticketLockElement = ticket.querySelector(".ticket-lock")

    // Select the task area
    const ticketTaskElement = ticket.querySelector(".task-area")

    // Select the actual icon element
    const ticketLockIcon = ticketLockElement.children[0]

    ticketLockIcon.addEventListener('click', function() {
        // Check if lock icon conatins fa-lock class
        if(ticketLockIcon.classList.contains("fa-lock")) {
            ticketLockIcon.classList.remove("fa-lock")
            ticketLockIcon.classList.add("fa-lock-open") 
            ticketTaskElement.setAttribute("contenteditable", "true")
        } else {
            ticketLockIcon.classList.remove("fa-lock-open")
            ticketLockIcon.classList.add("fa-lock")
            ticketTaskElement.setAttribute("contenteditable", "false")

            // Find out the current value of the ticketTaskElement and update the taskArray
            const currentTask = taskArray.find((currentStepTask) => currentStepTask.taskId == taskId)
            currentTask.taskContent = ticketTaskElement.innerText
        }
    })



}

// Function to add a new ticket/task
function createTicket(ticketColor, taskContent, taskId, shouldAddToArray) {
    // Create a new ticket container element

    const ticketCont = document.createElement("div")

    // Setting the class
    ticketCont.setAttribute("class", "ticket-cont")

    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${taskId}</div>
        <div class="task-area">${taskContent}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `

    handleRemoval(ticketCont, taskId)
    handleLock(ticketCont, taskId)
    handleColor(ticketCont, taskId)

    // Add the task inside of taskArray
    if(shouldAddToArray) {
        taskArray.push({ taskId, ticketColor, taskContent })
    }

    mainCont.appendChild(ticketCont)
}

modalCont.addEventListener('keydown', function(e) {
    if(e.key == 'Shift') {
        const taskContent = textArea.value
        const taskId = shortid()
        // Pass in the required fields to createTicket
        createTicket(modalPriorityColor, taskContent, taskId, true)

        // Hide the modal
        modalCont.style.display = "none"
        addTaskFlag = !addTaskFlag

        // Clear the textarea field 
        textArea.value = ""
    }
})


// Add event listener on all the priority colors in the modal
allPriorityColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function() {
        // Remove active class from all color containers
        allPriorityColors.forEach(function (colorElemCurrent) {
            colorElemCurrent.classList.remove("active")
        })

        // Add active class to the current containers
        colorElem.classList.add("active")

        // Implement logic to assign the selected color to the task
        modalPriorityColor = colorElem.classList[0]
    })
})