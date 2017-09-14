
Vue.component("my-list", {
    props : ['items', 'index'],
    template : `
      <li :class="{completed:items.completed, edit:editItem}" @dblclick="dbClick">
        <label for="txt" class="txt" @click="complete">{{items.item}}</label>
        <input type="txt" v-model="items.item" id="txt" @keyup.esc="cancelEdit" @blur="update" @keyup.enter="update">
        <span class="info" :class={on:toggle}>
            <span class="created">{{items.created}}</span>
            <span class="del" @click="toggleBtn" v-if="!toggle"><i class="material-icons">&#xE888;</i></span>
            <span class="btn positive" @click="del">YES</span>
            <span class="btn nagative" @click="toggleBtn">NO</span>
        </span>
      </li>
    `,
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
      length : this.watchAddItem,
      classObj : {
          all : false,
          active : false,
          complete : false
      }
    },
    computed : {
        watchAddItem : function(){
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
                var additem = {
                    "item" : val,
                    "created" : y+"."+m+"."+d,
                    "completed" : 0,
                }
                e.target.value = "";
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
          var additem = {
              "idx" : this.list[index].idx,
              "item" : item,
              "created" : y+"."+m+"."+d,
              "completed" : this.list[index].completed,
          }

          callAjax(additem, "update", _this);

          this.list[index].item = item;
          this.list[index].created = y+"."+m+"."+d;
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
      case "toggle":
      case "update":
        for (var val of data) {
          val.completed = Number(val.completed);
        }
      break;

      case "insert":
        for (var val of data) {
          val.completed = Number(val.completed);
          _this.list.push(val);
        }
      break;

      default:
        for (var val of data) {
          val.completed = Number(val.completed);
          _this.list.push(val);
        }

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
        // data : item,
        success : function(data){
          console.log(data);
            if(data != ""){
              var data = JSON.parse(data);
              setItem(data, _this, type);
            }
        }
    });
}


// animate
// $(".input_item").keyup(function(e){
//     if(e.keyCode == 13){
//         $(".item_list li:last-child").addClass("rubberBand animated opacity");
//         setTimeout(function(){
//             $(".item_list li:last-child").removeClass("rubberBand animated opacity");
//         }, 1500);
//     };
// })


$(".func input").click(function(){
    // console.log($(this).attr("class"));
    $(this).not(".clear").addClass("on").siblings().removeClass("on");
});
