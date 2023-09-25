<template>
    <div class="chat-room">
        <h1 class="text-light">{{ room_name }}</h1>
        <div class="msg-container">
            <div class="msg-box" v-for="msg in messages" :key="msg">
                <span class="content">{{ msg.message }}</span>
                <span class="user">{{ msg.user }}</span>
            </div>
        </div>

        <div class="form-group">
            <input type="text" class="form-control" v-model="message">
            <button class="btn btn-primary" @click="sendMessage">Send</button>
        </div>
    </div>
</template>

<style>
.chat-room .msg-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 60vh;
    width: 100%;
    overflow-y: scroll;
    border: 1px solid #fff;
}
.chat-room .msg-container .msg-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 60%;
    padding: 10px;
    margin: 10px;
    border: 1px solid #fff;
    border-radius: 5px;
    font-weight: bold;
    color: #fff;
    background: linear-gradient(to bottom right, var(--bs-primary), var(--bs-indigo));
}
.chat-room .msg-container .msg-box .content {
    font-size: 18px;
    display: block;
    margin: 10px 15px;
}
.chat-room .msg-container .msg-box .user {
    font-size: 12px;
    display: block;
}
.chat-room .form-group {
    position: fixed;
    bottom: 10px;
    right: 20%;
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>

<script>

export default {

    data() {
        return {
            room_name: this.$route.params.room,
            connection: null,
            message: 'Hello',
            messages: []
        }
    },

    methods: {
        sendMessage: function () {
            this.connection.send(JSON.stringify({
                message: this.message,
                user: 'Anonymous',
                token: localStorage.getItem('token')
            }));
        },

        init: function () {
            let websocket_host = this.$baseUri.split("//")[1];
            this.connection = new WebSocket(`ws://${websocket_host}/ws/chats/${this.room_name}/`);
            this.connection.onmessage = (e) => {
                this.messages.push(JSON.parse(e.data));
            }
            this.connection.onopen = () => {
                console.log('connected');
            }
        }

    },

    beforeMount() {
        this.init();
    },


    created() {
        this.$watch(() => this.$route.params, () => {
            this.room_name = this.$route.params.room;
        })
        this.$watch(() => this.messages, () => {
            console.log("connected");
        })
    }

}

</script>