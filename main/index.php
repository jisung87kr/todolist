<?php include "header.php" ?>
  <body>
      <div class="header">
          <?php
          if($_SESSION['isLogin']){
              echo '<a href="logout.php" class="login_icon" title="logout"><i class="material-icons">&#xE87C;</i></a>';
              echo '<div class="message"><div class="wrapper"><div class="txt greet">HI!<br>'.htmlspecialchars($_SESSION["nick"]).'!</div><div class="txt logout">Do you want to<br> sign out?</div></div></div>';
          } else {
              header("Location: login.php");
          }
          ?>
      </div>
    <div id="app" >
        <h1>TO DO LIST</h1>
        <div class="input_wrap" >
            <input type="text" @keyup.enter="addList" placeholder="일정을 입력하세요" class="input_item">
        </div>
        <div class="func">
            <input type="button" name="" value="all" class="all" @click="filter">
            <input type="button" name="" value="active" class="active" @click="filter">
            <input type="button" name="" value="complete" class="complete" @click="filter">
            <input type="button" name="" value="clear" class="clear" @click="clearComplete">
            <span class="remain">{{watchAddItem}} items left</span>
        </div>
        <ul class="item_list" :class="classObj">
            <my-list :items="val" :index="idx" v-for="(val, idx) in list" :key="idx" @tg-complete="toggleComplete" @tg-del="deleteItem" @tg-update="update" :class="{rubberBand : val.animate, animated : val.animate, opacity : val.animate}"></my-list>
        </ul>
    </div>
  </body>
  <script src="../bin/app.bundle.js"></script>
</html>
