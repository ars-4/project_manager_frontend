<template>
  <div class="view" v-if="logged_in">
    <nav>
      <div class="navbar">
        <div class="navbar-brand">
          <h2 @click="get_projects">The Incrop</h2>
        </div>
        <div class="navbar-links">
          <span class="nav-links">
            <a href="#">Home</a>
          </span>
          <span class="nav-links">
            <a href="#">Support</a>
          </span>
          <span class="nav-links">
            <a href="#" @click="logout">Logout</a>
          </span>
        </div>
      </div>
    </nav>
    <div class="row">
      <div class="col-md-2 side-nav">
        <br>
        <div class="main">
          <span class="nav-links" v-if="data === 'admin'">
            <a href="#">Dashboard</a>
          </span>
          <span class="nav-links">
            <a :href="'/#/profile?user=' + token">Profile</a>
          </span>
          <span class="nav-links" v-if="data === 'admin'">
            <a href="/#/employee/attendance/">Employee</a>
          </span>
          <span class="nav-links">
            <a href="#">Ticket</a>
          </span>
        </div>
        <br><br>
        <div class="projects">
          <h4>Projects <span><router-link to="/project/create"
                style="color:#fff;text-decoration:none">+</router-link></span></h4>
          <hr>
          <div class="projects-list">
            <span class="nav-links" v-for="project in projects" :key="project">
              <span class="project-cube">{{ project.name[0].toUpperCase() }}{{ project.name[1].toUpperCase() }}</span>
              <a :href="'/#/project?pro=' + project.id">{{ project.name.slice(0, 1).toUpperCase() }}{{
                project.name.slice(1) }}</a>
            </span>
          </div>
        </div>
      </div>
      <div class="col-md-9 main-view">
        <router-view />
      </div>
    </div>
  </div>
  <div class="auth row" v-else>
    <div class="col-md-4"></div>
    <div class="col-md-4">
      <div class="login">
        <h1>Login</h1>
        <hr>
        <input type="text" class="form-control" placeholder="Username" v-model="user.user">
        <br>
        <input type="text" class="form-control" placeholder="Password" v-model="user.pass">
        <br>
        <button class="btn btn-primary" @click="login">Login</button>
        <br>
        <div id="flash" v-if="msg.length != 0">{{ msg }}</div>
      </div>
    </div>
    <div class="col-md-4"></div>
  </div>
</template>



<style>
.main-view {
  margin-left: 18%;
  margin-top: 7% !important;
}

.side-nav {
  border-right: 2px solid #1a1a1a;
  height: 100%;
  position: fixed;
  left: 0;
  top: 13%;
}

.side-nav .nav-links {
  display: block;
  padding: 5px 10px;
  margin: 3px 0px;
  border-radius: 4px;
  background-color: #1a1a1a;
}

.side-nav .nav-links a {
  color: #fff;
  text-decoration: none;
}

.side-nav hr {
  color: #fff;
}

.side-nav .projects .projects-list {
  height: 300px;
  background-color: #1a1a1a;
  overflow-y: scroll;
}

.side-nav .projects .projects-list .nav-links {
  background-color: #242424;
  margin: 4px 5px;
}

.side-nav .projects .projects-list .nav-links .project-cube {
  background: linear-gradient(to bottom right, purple, pink);
  padding: 3px;
  border-radius: 4px;
  width: 30px;
  aspect-ratio: 1 / 1;
  font-weight: bold;
}

.side-nav .projects .projects-list a {
  margin-left: 10px;
}

.side-nav .projects h4 {
  color: #c3c3c3;
}

.side-nav .projects h4 span {
  font-size: 25px;
  float: right;
  background-color: var(--bs-primary);
  color: #fff;
  padding: 2px 10px 2px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>

<style>
.auth {
  margin-top: 7% !important;
}

.auth .login {
  background-color: #1a1a1a;
  padding: 20px 40px 40px;
  border-radius: 4px;
}

.auth h1 {
  font-size: 60px;
  color: #fff;
}

.auth .login hr {
  color: #fff;
}

.auth .btn {
  width: 100%;
}

.auth #flash {
  background-color: #242424;
  color: #fff;
  margin-top: 10px;
  padding: 5px 20px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}
</style>



<script>

import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      logged_in: false,
      token: "Snake",
      user: {
        user: '',
        pass: ''
      },
      msg: '',
      data: localStorage.getItem('data') || "null",
      projects: [
        { 'name': 'terraform', 'id': '1' }
      ]
    }
  },

  methods: {

    check_login: function () {
      if (localStorage.getItem('token')) {
        this.logged_in = true;
        this.get_projects()
      } else {
        this.logged_in = false;
      }
    },

    flash: function (string_msg) {
      this.msg = string_msg;
    },

    logout: function () {
      if (this.logged_in) {
        this.logged_in = false;
        localStorage.removeItem('token');
      } else {
        this.logged_in = true;
      }
    },

    login: async function () {
      await fetch(`${this.$api}/login/`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.user)
      }).then(
        res => { return res.json() }).then(
          data => {
            console.log(data)
            if (data['error'] && data['error'] === 'false') {
              this.flash(data['msg'])
              localStorage.setItem('token', data['token'])
              localStorage.setItem('data', data['data'])
              localStorage.setItem('id', data['id'])
              this.check_login();
            } else if (data['error'] && data['error'] === 'true') {
              this.flash(data['msg'])
            } else {
              this.flash('An Unexpected Error Occured')
            }
          }).catch(
            error => { this.flash(error); }
          )
    },

    get_projects: async function () {
      this.projects = []
      let url_to_fetch = `${this.$api}/projects/?employees=${localStorage.getItem('id')}`
      this.data === 'admin' ? url_to_fetch = `${this.$api}/projects/` : url_to_fetch = `${this.$api}/projects/?employees=${localStorage.getItem('id')}`
      await fetch(`${url_to_fetch}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${localStorage.getItem('token')}` },
      }).then(
        res => { return res.json() }).then(
          data => {
            for (let i = 0; i < data.length; i++) {
              this.projects.push({
                'name': data[i]['title'],
                'id': data[i]['id']
              })
            }
          }).catch(
            error => { this.flash(error); }
          )
    },

  },

  beforeMount() {
    this.check_login();
  }

})

</script>

