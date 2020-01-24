const users=[]
const addUsers=(id,username,room)=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username || !room){
        return {
            error:"Username does not exist"
        }
    }

const existingUser=users.find((user)=>{
        return user.username==username && user.room==room
    })


    if(existingUser){
        return{
            error:"Username already exist"
        }
    }

    const user={id,username,room}
    users.push(user)

    return {
        user
    }

}

const removeUser=(id)=>{

    const checkUserIndex=users.findIndex((user)=>{

        return user.id==id

    })

    if(checkUserIndex!=-1){
        return users.splice(checkUserIndex,1)[0]
    }

  
}

const getCurrentUser=(id)=>{

   const user= users.find((user)=>{
        return user.id==id
    })

    return user
}

module.exports={
    addUsers,
    removeUser,
    getCurrentUser
}

