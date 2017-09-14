<?php
    include "../include/db.php";
    session_destroy();
    echo "<script>alert('로그아웃 되었습니다.')</script>";
    header("Location: index.php");
 ?>
