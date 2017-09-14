<?php
include "../include/db.php";

class QueryACtion{
    function sql_getResult($sql){
        $result = mysql_query($sql);
        if($result != true){
          echo mysql_error();
            die("질의 에러");
        }
        return $result;
    }

    function sql_getRow($sql){
        $result = mysql_query($sql);
        if($result == true){
            $row = mysql_fetch_array($result);
            return  $row;
        } else {
            die("질의 에러");
        }
    }
}


//
switch ($_GET["mode"]) {
    case 'login':
        login();
    break;
    case 'join':
        memberJoin();
    break;
    case 'join':
        memberJoin();
    break;
    case 'updateItem':
        updateItem();
    break;
    case 'init':
        listInit();
    break;
    case 'clearcompleted':
        clearcompleted();
    break;
    case 'validation':
        validation();
    break;
}


function login(){
    $postArr = [
        "id" => mysql_real_escape_string($_POST["id"]),
        "pw" => mysql_real_escape_string($_POST["pw"]),
    ];
    $sql = "SELECT * FROM user WHERE id = '$postArr[id]'";
    $obj = new QueryAction();
    $data = $obj->sql_getRow($sql);
    if($data['id'] == $postArr['id'] && $data['pw'] == $postArr['pw']){
        session_start();
        $_SESSION['isLogin'] = 1;
        $_SESSION['id'] = $data['id'];
        $_SESSION['name'] = $data['name'];
        $_SESSION['nick'] = $data['nick'];
        $_SESSION['uid'] = $data['idx'];
        header("Location: ../main");
    } else {
        die("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
}

function memberjoin(){
    $postArr = [
        "id" => mysql_real_escape_string($_POST["id"]),
        "name" => mysql_real_escape_string($_POST["name"]),
        "nick" => mysql_real_escape_string($_POST["nick"]),
        "pw" => mysql_real_escape_string($_POST["pw"]),
        "pw2" => mysql_real_escape_string($_POST["pw2"]),
    ];

    // 빈값 체크
    foreach ($postArr as $key => $value) {
        if($value == ""){
            die("빈값이 들어왔습니다.");
        }
    }

    if($postArr['pw'] !== $postArr['pw2']){
        die("패스워드가 일치하지 않습니다");
    }

    // 함수정의
    function createAccount($postArr){
        $sql = "INSERT INTO user (id, name, nick, pw) VALUES('$postArr[id]', '$postArr[name]', '$postArr[nick]', '$postArr[pw]')";
        $obj = new QueryAction();
        $obj->sql_getResult($sql);

        if($obj == ""){
            die("에러 발생");
        } else {
            echo "<script>회원가입 되었습니다.</script>";
            header("Location: ../main/login.php");
        }
    }

    // 죽복 체크
    function checkOverlap($arr){
        $idCkSql = "SELECT * FROM user WHERE id = '$arr[id]'";
        $idCkRsult = new QueryAction();
        if($idCkRsult->sql_getRow($idCkSql) == false){
            $idCkSql = "SELECT nick FROM user WHERE nick = '$arr[nick]'";
            $nickCkRsult = new QueryAction();
            if($nickCkRsult->sql_getRow($idCkSql) == false){
                createAccount($arr);
            } else {
                die("닉네임이 중복됩니다.");
            }
        } else {
            die("아이디가 중복됩니다.");
        }
    }
    checkOverlap($postArr);
}

function updateItem(){
    $item = mysql_real_escape_string($_POST["item"]);
    $created = mysql_real_escape_string($_POST["created"]);
    $completed = mysql_real_escape_string($_POST["completed"]);
    $uid = $_SESSION["uid"];

    if(!empty($_POST["idx"])){
      $idx = mysql_real_escape_string($_POST["idx"]);
    }

    switch ($_GET['type']) {
        case 'insert':
            $sql = "INSERT INTO list(item, created, completed, uid) VALUES('$item', now(), '$completed', '$uid')";
            $obj = new QueryAction();
            $obj->sql_getResult($sql);
            $sql = "SELECT * FROM list WHERE uid = '$uid' ORDER BY idx DESC LIMIT 0, 1";
            $obj = new QueryAction();
            $result = $obj->sql_getResult($sql);
            $arr = [];
            while ($row = mysql_fetch_array($result)) {
                $item = [
                    "idx" => $row['idx'],
                    "item" => $row['item'],
                    "created" => $row['created'],
                    "completed" => $row['completed'],
                    "uid" => $row['uid'],
                ];
                array_push($arr, $item);
            }
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
        break;
        case 'update':
            $sql = "UPDATE list SET item = '$item', created = now(), completed = '$completed' WHERE idx = '$idx'";
            $obj = new QueryAction();
            $obj->sql_getResult($sql);
            $sql = "SELECT * FROM list WHERE idx = '$idx'";
            $obj = new QueryAction();
            $result = $obj->sql_getResult($sql);
            $arr = [];
            while ($row = mysql_fetch_array($result)) {
                $item = [
                    "idx" => $row['idx'],
                    "item" => $row['item'],
                    "created" => $row['created'],
                    "completed" => $row['completed'],
                    "uid" => $row['uid'],
                ];
                array_push($arr, $item);
            }
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
        break;

        case 'toggle':
            $sql = "UPDATE list SET completed = '$completed' WHERE idx = '$idx'";
            $obj = new QueryAction();
            $obj->sql_getResult($sql);
            $sql = "SELECT * FROM list WHERE idx = '$idx'";
            $obj = new QueryAction();
            $result = $obj->sql_getResult($sql);
            $arr = [];
            while ($row = mysql_fetch_array($result)) {
                $item = [
                    "idx" => $row['idx'],
                    "item" => $row['item'],
                    "created" => $row['created'],
                    "completed" => $row['completed'],
                    "uid" => $row['uid'],
                ];
                array_push($arr, $item);
            }
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
        break;

        case 'del':
            $sql = "DELETE FROM list WHERE idx = '$idx'";
            $obj = new QueryAction();
            $obj->sql_getResult($sql);
        break;
    }
}

function listInit(){
    $sql = "SELECT * FROM list WHERE uid = '".$_SESSION['uid']."'";
    $obj = new QueryAction();
    $result = $obj->sql_getResult($sql);
    $arr = [];

    while ($row = mysql_fetch_array($result)) {
        $item = [
            "idx" => $row['idx'],
            "item" => $row['item'],
            "created" => $row['created'],
            "completed" => $row['completed'],
            "uid" => $row['uid']
        ];
        array_push($arr, $item);
    }

    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
}

function clearcompleted(){
  $uid = $_SESSION['uid'];
  $sql = "DELETE FROM list WHERE uid = $uid and completed = 1";
  mysql_query($sql);
}

function validation(){
  $value = mysql_real_escape_string($_POST["value"]);
  $name = mysql_real_escape_string($_POST["name"]);
  $sql = "SELECT $name FROM user WHERE $name = '$value'";
  $result = mysql_query($sql);
  $row = mysql_fetch_array($result);

  if($row["$name"] === $value){
    echo "false";
  } else {
    echo "true";
  }
}

 ?>
