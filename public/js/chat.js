const socket=io()
// Please reder to `https://github.com/ljharb/qs` to know about query parser 
const search=Qs.parse(location.search,{ ignoreQueryPrefix: true })

//Creating chat room event
socket.emit("chatRoom",search,(error)=>{

    if(error){
        $.notify(error,"warn");
        setTimeout(()=>{
            location.href="/"

        },1000)
    }
})

// Client-Server Communication-Receiving message from server and rendering it using Mustache js
// Please refer to this link https://github.com/janl/mustache.js/ to know about template system in JavaScript.
// Please refer to this link https://momentjs.com/docs/#/displaying/ to know date time parsing


const messageTemplate=document.querySelector("#message-template").innerHTML
socket.on("message",(getMessage)=>{
    const rendered=Mustache.render(messageTemplate,{
        message:getMessage.text,
        username:getMessage.username,
        time:moment(getMessage.time).format("h:mm a")
    })
document.querySelector(".p-0").insertAdjacentHTML("beforeend",rendered)
autoscroll()
})

// Client-Server Communication-Sending message from client to server

const $messageForm=document.querySelector("#message-form")
const $messageSendButton=$messageForm.querySelector("button")
const $messageText=$messageForm.querySelector("input")

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    const messageText=e.target.elements.message.value

    socket.emit("sendMessage",messageText,(error,data)=>{
        $messageText.value=""
        if(error){
            return $.notify(error,"warn");


        }

    })

})

// Sharing location

document.querySelector('.fa-map-marker').addEventListener("click",(e)=>{

    if (!navigator.geolocation) {
        $.notify("Geolocation is not supported by your browser","warn");

      } else {
        navigator.geolocation.getCurrentPosition((position)=>{
            const latitude  = position.coords.latitude;
            const longitude = position.coords.longitude;
            const data={
                latitude,
                longitude
            }
            socket.emit("sendLocation",data)

        });
      }


})

// Rendering location view

$sendLocationTemplate=document.querySelector("#location-template").innerHTML
$sendLocationDiv=document.querySelector(".p-0")
socket.on("shareLocation",(locationData)=>{
    const rendered=Mustache.render($sendLocationTemplate,{
        location:locationData.text,
        username:locationData.username,
        time:moment(locationData.time).format("h:mm a")
    })

    $sendLocationDiv.insertAdjacentHTML("beforeend",rendered)
    autoscroll()
})

const autoscroll=()=>{
    var container = document.querySelector('.p-0')
    container.maxScrollTop = container.scrollHeight - container.offsetHeight


    if (container.maxScrollTop - container.scrollTop <= container.offsetHeight) {
      
      container.scrollTop = container.scrollHeight

    } else {
        $.notify("New Message Received","success");

    }



}


