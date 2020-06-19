class SimpleChat {
    constructor () {
        if ( this.constructor.instance ) {
            console.warn ( "It's a singleton. You can't create one more instance of this class" )
            return null
        }
        window.addEventListener( "unload", function ( event ) {
            SimpleChat.closeChat ()
        })
        this.constructor.instance = this
        this.users = null
        this.currentUser = null
        this.getAllData ()
        this.chatContainer = this.addElement ( "section" )
        this.chatContainer.id = "chatContainer"
        this.chatContainer.className = "chatContainer"
        this.chatContainer.addEventListener ( "updated", this.updateChat.bind ( this ) )

        this.inputMessage = this.addElement ( "input" )
        this.inputMessage.className = "inputMessage"
        this.inputMessage.onchange = function ( event ) {
            fetch ( "http://localhost:3000/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify ({
                    user: this.currentUser.id,
                    date: new Date().toLocaleString(),
                    body: event.target.value
                })
            })
            fetch ( "http://localhost:3000/lastUpdate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify ({
                    date: new Date().toLocaleString()
                })
            })
            event.target.value = ""
        }.bind ( this )

        this.interval = setInterval (
            function() {
                document.querySelector ( "section#chatContainer" )
                    .dispatchEvent ( new Event ( "updated" ))
            },
            500
        )
    }

    addElement ( tagName, container ) {
        return ( container && container.nodeType === 1 ?
            container : document.body )
            .appendChild (
                document.createElement ( tagName )
            )
    }
    getData ( ref ) {
        return fetch ( `http://localhost:3000/${ref}` )
            .then ( response => response.json() )
    }
    createUserAvatar ( user ) {
        return fetch( `https://api.github.com/users/${user.id}` )
            .then ( response => response.json()
                .then ( response => {
                    let img = new Image ( 40 )
                    img.src = response.avatar_url
                    img.className = "ico"
                    return img
                })
            )
    }

    async updateChat () {
        let updated = await this.getData ( "lastUpdate" )
        if ( updated.date === this.lastUpdate.date || !this.users ) return
        this.lastUpdate.date = updated.date
        this.messages = await this.getData ( "messages" )
        this.initChat()
    }

    async getAllData () {
        this.lastUpdate = await this.getData ( "lastUpdate" )
        let users = await this.getData ( "users" )
        this.currentUser = users.filter ( user => !user.active )[0]
        if ( this.currentUser ) {
            this.currentUser.active = true
            fetch ( `http://localhost:3000/users/${this.currentUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify ( this.currentUser )
            })
        }
        async function mutateUser ( user, callback ) {
            return Object.assign ( {},
                { [ user.id ]: await callback ( user ) }
            )
        }
        let lim = users.length
        let k = 0
        while ( k++ < lim ) {
            users.push (
                await mutateUser ( users.shift(), this.createUserAvatar )
            )
        }
        this.users = Object.assign ( {}, ...users )

        this.messages = await this.getData ( "messages" )
        this.initChat ()
    }

    initChat () {
        this.chatContainer.innerHTML = ""
        this.messages.forEach (
            message => {
                let mess = this.addElement ( "div", this.chatContainer )
                mess.appendChild ( this.users [ message.user ] )
                this.addElement ( "span", mess ).innerText = message.user
                this.addElement ( "span", mess ).innerHTML = `<sup>${message.date}</sup>`
                this.addElement ( "p", mess ).innerText = message.body
            }, this
        )
        this.chatContainer.scrollTop = this.chatContainer.offsetHeight
    }
    static closeChat () {
        this.instance.currentUser.active = false
        fetch ( `http://localhost:3000/users/${this.instance.currentUser.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ( this.instance.currentUser )
        })
    }
}

Object.defineProperty (
    SimpleChat.prototype,
    "messages",
    {
        enumerable: false,
        writable: true,
        value: []
    }
)

let chat = new SimpleChat

const oneMoreChat = new SimpleChat