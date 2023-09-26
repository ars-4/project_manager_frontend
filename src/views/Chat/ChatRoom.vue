<template>
    <div class="chat-room">
        <h1 class="text-light">{{ room_name }}</h1>
        <div class="msg-container" ref="messageContainer">

            <div :class="{ 'msg-box': true, 'current_user': msg.user === data ? true : false }" v-for="msg in messages"
                :key="msg">
                <span class="content">{{ msg.message }}</span>
                <span class="user">{{ msg.user }} - {{ msg.timestamp }}</span>
            </div>

        </div>

        <div class="form-group">
            <div class="form-control">
                <button class="btn icon icon-happy"></button>
                <label>
                    <span class="btn icon icon-attachment"></span>
                    <input class="icon icon-attachment" type="file" hidden>
                </label>
                <input class="message-input" type="text" v-model="message" placeholder="Type a message..."
                    @keypress="check($event)">
                <button class="btn icon icon-send_one" @click="sendMessage"></button>
            </div>
            <!-- <button class="btn btn-primary icon icon-send_one" @click="sendMessage">Send</button> -->
        </div>
    </div>
</template>

<style>
.chat-room .msg-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    height: 60vh;
    width: 100%;
    overflow-y: scroll;
    border: 1px solid #fff;
}

.chat-room .msg-container .msg-box {
    display: flex;
    flex-direction: column;
    margin-right: 49% !important;
    align-items: flex-start;
    justify-content: flex-start;
    width: 50%;
    padding: 10px;
    margin: 10px;
    border: 1px solid #fff;
    border-radius: 5px;
    font-weight: bold;
    color: #fff;
    background: linear-gradient(to bottom right, rgb(44, 144, 144), rgb(44, 144, 44));
}

.chat-room .msg-container .msg-box.current_user {
    background: linear-gradient(to bottom right, var(--bs-primary), var(--bs-indigo));
    margin-right: 1% !important;
}

.chat-room .msg-container .msg-box .content {
    font-size: 18px;
    display: block;
    margin: 10px 15px;
}

.chat-room .msg-container .msg-box .user {
    font-size: 12px;
    display: block;
    margin: 0px 15px;
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

.chat-room .form-group .form-control .message-input {
    width: 85%;
}

.chat-room .form-group .form-control input,
.chat-room .form-group .form-control .btn {
    margin: 0;
    margin-right: 10px;
    padding: 0;
    border: 0;
    outline: none;
}

.chat-room .form-group .icon-send_one {
    margin-right: 0px !important;
    margin-left: 10px !important;
}
</style>

<script>

export default {

    data() {
        return {
            room_name: this.$route.params.room,
            connection: null,
            message: '',
            messages: [],
            data: localStorage.getItem('data') || "null"
        }
    },

    methods: {
        check: function (e) {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        },

        sendMessage: function () {
            if (!this.message) {
                return;
            }
            this.connection.send(JSON.stringify({
                message: this.message,
                user: 'Anonymous',
                token: localStorage.getItem('token')
            }));
            this.message = '';
        },

        init: function () {
            let websocket_host = this.$baseUri.split("//")[1];
            this.connection = new WebSocket(`ws://${websocket_host}/ws/chats/${this.room_name}/`);
            this.connection.onmessage = (e) => {
                this.messages.push(JSON.parse(e.data));
                this.$nextTick(() => {
                    const container = this.$refs.messageContainer;
                    container.scrollTop = container.scrollHeight;
                });
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