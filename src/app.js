Vue.component("my-list", {
    props : ['items', 'index'],
    template : `
      <li :class="{completed:items.completed}">
        <span class="txt" @click="complete">{{items.item}}</span>
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
    },
});

  var app = new Vue({
    el : "#app",
    data : {
      list : [
          {
              "item" : "청소하기",
              "created" : "2017.8.31",
              "completed" : false,
          },
          {
              "item" : "빨래하기1",
              "created" : "2017.8.31",
              "completed" : true,
          },
      ],
    },
    computed : {
        watchAddItem : function(){
            var a = this.list.length;
        }
    },
    methods : {
      addList : function(e){
        var val = e.target.value;
        if(val == ""){
            alert("값을 입력하세요");
        } else {
            var dt = new Date();
            var m = dt.getMonth()+1;
            var d = dt.getDate();
            var y = dt.getFullYear();
            var additem = {
                "item" : val,
                "created" : y+"."+m+"."+d,
                "completed" : false,
            }
            this.list.push(additem);
            e.target.value = "";
        }
      },
      toggleComplete : function(index){
          this.list[index].completed == true ? this.list[index].completed = false : this.list[index].completed = true;
      },
      deleteItem : function(index){
          this.list.splice(index, 1);
      },
      clearComplete : function(){
          var selectedArry = [];
          for(var key in this.list){
              if(this.list[key]["completed"] == true){
                  selectedArry.push(key);
              }
          }
          selectedArry = selectedArry.sort(function(a, b){
              return b-a;
          })

          for(var key in selectedArry){
              console.log(this.list[selectedArry[key]]);
              this.list.splice(selectedArry[key], 1);
          }
      }
    }
  });


// animate
$(".input_item").keyup(function(e){
    if(e.keyCode == 13){
        $(".item_list li:last-child").addClass("rubberBand animated opacity");
        setTimeout(function(){
            $(".item_list li:last-child").removeClass("rubberBand animated opacity");
        }, 1500);

    };
})
