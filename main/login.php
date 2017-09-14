<?php include "header.php" ?>
  <body>
    <div class="login">
        <h1 class="tit1">LOGIN</h1>
        <form class="" action="../include/process.php?mode=login" method="post">
            <div class="wrapper">
                <input type="text" name="id" value="" placeholder="ID">
            </div>
            <div class="wrapper">
                <input type="text" name="pw" value="" placeholder="PW">
            </div>
            <input type="submit" name="" value="LOGIN" class="submit">
        </form>
        <a href="join.php" class="join">JOIN</a>
    </div>
  </body>
  <script src="../bin/app.bundle.js"></script>
</html>
