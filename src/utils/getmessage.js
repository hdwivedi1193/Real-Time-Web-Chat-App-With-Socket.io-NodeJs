const getMessage=(username,text)=>{

    return {
        text,
        username,
        time:new Date().getTime()
    }
}

module.exports={
    getMessage
}