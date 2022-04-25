UM.registerUI('source',function(name){
    var me = this;
    me.addListener('fullscreenchanged',function(){
        me.$container.find('textarea').width(me.$body.width() - 10).height(me.$body.height())

    });
    var $btn = $.eduibutton({
        icon : "preview",
        click : function(){
            me.execCommand("auto")
        },
        title: '智能分析'
    });

    this.addListener('selectionchange',function(){
        var state = this.queryCommandState(name);
        $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
});