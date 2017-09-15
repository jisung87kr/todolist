
Vue.component("my-list", {
    props : ['items', 'index'],
    template :
      '<li :class="{completed:items.completed, edit:editItem}" @dblclick="dbClick">'
        +'<label for="txt" class="txt" @click="complete">{{items.item}}</label>'
        +'<input type="txt" v-model="items.item" id="txt" @keyup.esc="cancelEdit" @blur="update" @keyup.enter="update">'
        +'<span class="info" :class={on:toggle}>'
            +'<span class="created">{{items.created}}</span>'
            +'<span class="del" @click="toggleBtn" v-if="!toggle"><i class="material-icons">&#xE888;</i></span>'
            +'<span class="btn positive" @click="del">YES</span>'
            +'<span class="btn nagative" @click="toggleBtn">NO</span>'
        +'</span>'
      +'</li>'
    ,
    data : function(){
        var data = {
            toggle : false,
            editItem : false,
        }
        return data;
    },
    methods : {
        complete : function(e){
            e.stopPropagation();
            this.$emit("tg-complete", this.index);
            this.toggle = false;
        },
        del : function(e){
            this.$emit("tg-del", this.index);
            this.toggle = false;
        },
        toggleBtn : function(e){
            e.stopPropagation();
            this.toggle == false ? this.toggle = true : this.toggle = false;
        },
        dbClick : function(e){
            this.editItem = true;
        },
        cancelEdit : function(){
            this.editItem = false;
        },
        update : function(){
            this.$emit("tg-update", this.index, this.items.item);
            this.editItem = false;
        }
    },
});

var app = new Vue({
    el : "#app",
    data : {
      list : [],
    //   length : this.watchAddItem,
      classObj : {
          all : false,
          active : false,
          complete : false,
        //   rubberBand: true,
        //   animated: true,
        //   opacity : true,
      }
    },
    computed : {
        watchAddItem : function(){
            var _this = this;
            setTimeout(function(){
                // _this.classObj.rubberBand = false;
                // _this.classObj.animated = false;
                // _this.classObj.opacity = false;
            }, 2000)
            return this.list.length;
        },
    },
    created : function(){
      var _this = this;
        setList(_this);

    },
    methods : {
        addList : function(e){
          var _this = this;
            var val = e.target.value;
            if(val == ""){
                return alert("값을 입력하세요");
            } else {
                var dt = new Date();
                var m = dt.getMonth()+1;
                var d = dt.getDate();
                var y = dt.getFullYear();
                var h = dt.getHours();
                var mi = dt.getMinutes();
                var s = dt.getSeconds();
                var additem = {
                    "item" : val,
                    "created" : y+"-"+m+"-"+d+" "+h+":"+mi+":"+s,
                    "completed" : 0,
                }
                e.target.value = "";
                // _this.classObj.rubberBand = true;
                // _this.classObj.animated = true;
                // _this.classObj.opacity = true;
                callAjax(additem, "insert", _this);
            }
      },
      toggleComplete : function(index){
            var _this = this;
            this.list[index].completed == 1 ? this.list[index].completed = 0 : this.list[index].completed = 1;
            var item = {
              "idx" : this.list[index].idx,
              "item" : this.list[index].item,
              "created" : this.list[index].created,
              "completed" : this.list[index].completed,
              "uis" : this.list[index].uid,
            }
            callAjax(item, 'toggle', _this);
      },
      deleteItem : function(index){
            var _this = this;
            var item = {
              "idx" : this.list[index].idx,
              "item" : this.list[index].item,
              "created" : this.list[index].created,
              "completed" : this.list[index].completed,
              "uis" : this.list[index].uid,
            }
            callAjax(item, "del", _this);
            this.list.splice(index, 1);
      },
      clearComplete : function(){
            var selectedArry = [];
            var _this = this;

            for(var key in this.list){
                if(this.list[key]["completed"] == 1){
                    selectedArry.push(key);
                }
            }
            selectedArry = selectedArry.sort(function(a, b){
                return b-a;
            });

            for(var key in selectedArry){
                this.list.splice(selectedArry[key], 1);
            }
            callAjaxclearCompleted(_this);
      },
      update : function(index, item){
          var _this = this;
          var dt = new Date();
          var m = dt.getMonth()+1;
          var d = dt.getDate();
          var y = dt.getFullYear();
          var h = dt.getHours();
          var mi = dt.getMinutes();
          var s = dt.getSeconds();
          var additem = {
              "idx" : this.list[index].idx,
              "item" : item,
              "created" : y+"-"+m+"-"+d+" "+h+":"+mi+":"+s,
              "completed" : this.list[index].completed,
          }

          callAjax(additem, "update", _this);

          this.list[index].item = item;
          this.list[index].created =  y+"-"+m+"-"+d+" "+h+":"+mi+":"+s;
      },
      filter : function(e){
          if(e.target.value == "all"){
              this.classObj.all = true,
              this.classObj.active = false,
              this.classObj.complete = false
          } else if(e.target.value == "active"){
              this.classObj.all = false,
              this.classObj.active = true,
              this.classObj.complete = false
          } else if(e.target.value == "complete"){
              this.classObj.all = false,
              this.classObj.active = false,
              this.classObj.complete = true
          }
      }
    }
});

function setList(_this){
  $.ajax({
      url : "../include/process.php?mode=init",
      method : "POST",
      success : function(data){
          if(data != ""){
            data = JSON.parse(data);
            setItem(data, _this);
          }
      },
  });
}

function setItem(data, _this, type) {
    switch (type) {
      case "toggle": {
          for (var val in data) {
            data[val].completed = Number(data[val].completed);
          }
      }
      break;
      case "update":
        for (var val in data) {
          data[val].completed = Number(data[val].completed);
        }
      break;

      case "insert":
        for (var val in data) {
            data[val].completed = Number(data[val].completed);
            data[val].animate = true;
            _this.list.push(data[val]);
            setTimeout(function(){
                for (var val in _this.list){
                    _this.list[val].animate = false;
                }
            }, 1000)
        }
      break;

      default:
        for (var val in data) {
          data[val].completed = Number(data[val].completed);
          data[val].animate = true;
          _this.list.push(data[val]);
        }
        setTimeout(function(){
            for (var val in _this.list){
                _this.list[val].animate = false;
            }
        }, 1000)

    }

}


function callAjax(item, type, _this){
    $.ajax({
        url : "../include/process.php?mode=updateItem&type="+type+"",
        method : "POST",
        data : item,
        success : function(data){
            if(data != ""){
              var data = JSON.parse(data);
              setItem(data, _this, type);
            }
        }
    });
}

function callAjaxclearCompleted(_this){
    $.ajax({
        url : "../include/process.php?mode=clearcompleted",
        method : "POST",
        success : function(data){
          console.log(data);
            if(data != ""){
              var data = JSON.parse(data);
              setItem(data, _this, type);
            }
        }
    });
}

function ani(){
    $(".item_list li:last-child").addClass("rubberBand animated opacity");
    setTimeout(function(){
        $(".item_list li:last-child").removeClass("rubberBand animated opacity");
    }, 1500);
}


$(".func input").click(function(){
    $(this).not(".clear").addClass("on").siblings().removeClass("on");
});

$(".input_item").focus();

// join
var join = new Vue({
  el : ".join",
  data : {
    values : {
      id : {
        ok : null,
        nope : null,
        val : null
      },
      nick : {
        ok : null,
        nope : null,
        val : null
      },
      pw : {
        val : "",
        val2 : "",
        ok : null,
        nope : null,
      },
    },
    submit : false,
    doubleSubmitFlag : false,
  },
  computed : {
    ckOk : function(){
      var _this = this;
      isOk(_this);
    }
  },
  methods : {
    ckId : function(e){
      var _this = this;
      var val = e.target.value;
      validation(_this, val, "id");
    },
    ckNick : function(e){
      var _this = this;
      var val = e.target.value;
      validation(_this, val, "nick");
    },
    ckPw : function(e){

      if(this.values.pw.val === this.values.pw.val2){
        this.values.pw.ok = true;
        this.values.pw.nope = false;
      } else {
        if(this.values.pw.val2 == ""){
          this.values.pw.ok = false;
          this.values.pw.nope = true;
          return false;
        } else {
          this.values.pw.ok = false;
          this.values.pw.nope = true;
        }
      }
    },
    submitData : function(e){
  
      var _this = this;
      if(doubleSubmitCheck(_this)){
        e.preventDefault();
      } else {
        var result = isOk(_this);
        if(result != true){
          _this.doubleSubmitFlag = false;
           e.preventDefault();
        }
      }
    },
  }
});

function doubleSubmitCheck(_this){
  if(_this.doubleSubmitFlag){
    return _this.doubleSubmitFlag;
  } else {
    _this.doubleSubmitFlag = true;
    return false;
  }
}


function validation(_this, val, type){
  _this.values[type].val = val;
  if(val == ""){
    _this.values[type].val = "";
    _this.values[type].nope = true;
    _this.values[type].ok = false;
    return false;
  }
  $.ajax({
    url : '../include/process.php?mode=validation',
    type : "POST",
    data : {
      name : type,
      value : val,
    },
    success : function(data){

      if(data == "true"){
        _this.values[type].nope = false;
        _this.values[type].ok = true;
      } else {
        _this.values[type].nope = true;
        _this.values[type].ok = false;
      }
    }
  });
}

function isOk(_this){
  for(var key in _this.values){
    if(_this.values[key].ok == null || _this.values[key].ok == false) {
      _this.submit = false;
      return false;
    }
  }
  _this.submit = true;
  return true;
}
