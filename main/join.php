<?php include "header.php" ?>
  <body>
    <div class="login join">
        {{ckOk}}
        <h1 class="tit1">JOIN</h1>
        <form class="" action="../include/process.php?mode=join" method="post"  @submit="submitData">
            <div class="wrapper" :class="{ok:values.id.ok, nope:values.id.nope}">
                <input type="text" name="id" value="" placeholder="ID" @focusout="ckId">
                <div class="alert" v-if="values.id.nope && values.id.val != ''">아이디가 존재합니다</div>
                <div class="alert" v-if="values.id.val == ''">아이디를 입력하세요</div>
            </div>
            <div class="wrapper">
                <input type="password" name="pw" value="" placeholder="PW" v-model="values.pw.val" @focusout="ckPw">
            </div>
            <div class="wrapper" :class="{ok: values.pw.ok, nope: values.pw.nope}">
                <input type="password" name="pw2" value="" placeholder="PW comfirm" v-model="values.pw.val2" @focusout="ckPw">
                <div class="alert" v-if="values.pw.nope">비밀번호가 일치하지 않습니다</div>
            </div>
            <div class="wrapper" :class="{ok:values.nick.ok, nope:values.nick.nope}" @focusout="ckNick">
              <input type="text" name="nick" value="" placeholder="NICK">
              <div class="alert" v-if="values.nick.nope && values.nick.val != ''">닉네임이 존재합니다</div>
              <div class="alert" v-if="values.nick.val == ''">닉네임을 입력하세요</div>
            </div>
            <div class="wrapper">
                <input type="text" name="name" value="" placeholder="NAME">
            </div>
            <input type="submit" name="" value="SUBMIT" class="submit" :class={on:submit}>
        </form>
    </div>
  </body>
  <script src="../bin/app.bundle.js"></script>
</html>
