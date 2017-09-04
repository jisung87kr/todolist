Vue.component("my-list", {
    props : ['listData', 'idx'],
    template : `
      <li @click="toggle">
        <span>{{listData.Lv1["중요도"]}}</span>
        <span>{{listData.Lv1["내용"]}}</span>
        <span @click="del">삭제</span>
        <slot name="child">
            <div>내용이 없을경우 나타납니다.</div>
        </slot>
      </li>
    `,
    data : function(){
        var data = {
            childList : this.listData,
            haveChild : false,
        }
        return data;
    },
    methods : {
        toggle : function(e){
            console.log(this.$el);
            if(this.$el.className == "on"){
                this.$el.className = "";
            } else {
                this.$el.className = "on";
            }
        },
        del : function(e){
            alert("삭제되었습니다");
        },
        modify : function(e){
            alert("수정되었습니다");
        },
    },
});

Vue.component("my-list-child", {
    props : ['lv2Data'],
    template : `
        <ul :class="child" v-if="checkChild == true">
            <li v-for="idx in lv2Data.Lv2">{{idx["내용"]}}</li>
        </ul>
    `,
    data : function(){
        var data = {
            child : {
                "haveChild" : null,
            }
        }
        return data;
    },
    computed : {
        checkChild : function(){
            this.lv2Data["자식"] == true ? this.child.haveChild = true : this.child.haveChild = false;
            return this.child.haveChild;
        }
    }
});



  var app = new Vue({
    el : "#app",
    data : {
      list : [
          {
              "Lv1" : {
                  "내용" : "청소하기",
                  "생성일" : "2017.08.31",
                  "중요도" : 1,
                  "자식" : true,
                  "Lv2" : [
                      {
                          "내용" : "방청소",
                          "생성일" : "2017.08.31",
                          "중요도" : 1,
                          "완료" : false,
                      },
                      {
                          "내용" : "화장실",
                          "생성일" : "2017.09.01",
                          "중요도" : 2,
                          "완료" : false,
                      }
                  ]
              },
          },
          {
              "Lv1" : {
                  "내용" : "작업",
                  "생성일" : "2017.09.01",
                  "중요도" : 3,
                  "자식" : false,
              },
          },
      ],
      classObject : {
          "status" : true,
      }
    },
    methods : {
      addList : function(e){
        var addlist = e.target.value;
        if(addlist == ""){
            alert("값을 입력하세요");
        } else {
            this.list.push(addlist);
            e.target.value = "";
        }
        for (var key in this.list) {
            var obj = this.list;

            for(var val in obj[key]){

            }
        }
      },
      toggle : function(){

      },
    }
  });
