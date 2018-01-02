var DOCSO=function(){var t=["không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"],r=function(r,n){var o="",a=Math.floor(r/10),e=r%10;return a>1?(o=" "+t[a]+" mươi",1==e&&(o+=" mốt")):1==a?(o=" mười",1==e&&(o+=" một")):n&&e>0&&(o=" lẻ"),5==e&&a>=1?o+=" lăm":4==e&&a>=1?o+=" bốn":(e>1||1==e&&0==a)&&(o+=" "+t[e]),o},n=function(n,o){var a="",e=Math.floor(n/100),n=n%100;return o||e>0?(a=" "+t[e]+" trăm",a+=r(n,!0)):a=r(n,!1),a},o=function(t,r){var o="",a=Math.floor(t/1e6),t=t%1e6;a>0&&(o=n(a,r)+" triệu",r=!0);var e=Math.floor(t/1e3),t=t%1e3;return e>0&&(o+=n(e,r)+" nghìn",r=!0),t>0&&(o+=n(t,r)),o};return{doc:function(r){if(0==r)return t[0];var n="",a="";do ty=r%1e9,r=Math.floor(r/1e9),n=r>0?o(ty,!0)+a+n:o(ty,!1)+a+n,a=" tỷ";while(r>0);return n.trim()}}}();

$(document).ready(function() {
    $('select').material_select();
     $('#export').modal({
        dismissible: false
     });
     
    var navItem, $this, template;

    $("#loadPage").load('pages/taoBang.html');
    $("#loadModule").load('pages/modules/quyetToanBaoGia.html');  
    

    $(document).on('click', '.navItem', function(e){
    	e.preventDefault();
    	$this = $(this);
    	itemNav = $this.attr('data-nav');
    	$("#loadPage").load('pages/'+itemNav+'.html');
        $("#loadModule").load('pages/modules/quyetToanBaoGia.html');    
    });

    $(document).on('click','#pdf',function () {
        $('body').scrollTop(0);  
        createPDF(); 
    });

    var navModule, $this;
    $(document).on('change', '.navModule', function(e){
    	e.preventDefault();

    	$this = $(this);
    	itemNav = $this.attr('data-nav');
    	$("#loadModule").load('pages/modules/'+itemNav+'.html');
    });

    //create pdf  
    function createPDF() {  
        
        $('.no-print').css('display','none');
        $('h1').css('margin-top','35px');

        var form = $('page').get(0);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var hou = today.getHours();
        var minu = today.getMinutes();
        var sec = today.getSeconds();

        var type = $("#type").val();
        var name = 'bang_mau_'+dd+'/'+mm+'/'+yyyy+'/'+hou+'/'+minu+'/'+sec+'.png';

        html2canvas(form).then( function(canvas){
             var a = document.createElement('a');
        // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
            a.href = canvas.toDataURL("image/jpeg");

            a.download = name;

            $('.no-print').css('display','block');

            a.click();


            // var img = canvas.toDataURL().replace("image/jpeg", "image/octet-stream");;
            // var win = window.open(img);
            // $("#export_img").attr('src',img);
            // $("#export_download").attr('href',img);
            // $("#export_dropbox").attr('href','/index.html');
        }); 
        // $("#export").modal('open');
    } 

    // đổi tên file
    $(document).on('click', "#export_close", function(e){
        e.preventDefault();
        $('.no-print').css('display','block');
       $("#export").modal('close');
    });

    // đổi tên file
    $(document).on('input', "#export_name", function(){
        var name = $(this).val();
        $("#export_download").attr('download',name+'.png');

    }); 

  

    // Thêm hàng Quyết toán
    $(document).on('click', "#addRow", function(e){
        e.preventDefault();
        
        template = '<tr>'+
            '<td><input type="" class="text-center c-input"><a class="btn red remove" style="display: none">x</a></td></td>'+
            '<td><textarea class="hangMuc"></textarea></td>'+
            '<td><input type="" class="c-input dvt text-center"></td>'+
            '<td><input type="" class="c-input kl text-right"></td>'+
            '<td><input type="" class="c-input text-right donGia"></td>'+
            '<td class="text-right"><span class="thanhTien"></span></td>'+
            '</tr>';
        $("#appendRow").append(template);
    });

    // Thêm hàng Tổng hợp
    $(document).on('click', "#addRowTongHop", function(e){
        e.preventDefault();
        template = '<tr>'+
            '<td><input type="" class="text-center c-input"><a class="btn red remove" style="display: none">x</a></td>'+
            '<td><textarea class="hangMuc"></textarea></td>'+
            '<td><input type="" class="thanhTien c-input text-right"></td>'+
            '<td><textarea></textarea>'+
            '</tr>';
        $("#appendRow").append(template);
    });

    // addRowKhoiLuong
    $(document).on('click', "#addRowKhoiLuong", function(e){
        e.preventDefault();
        
        template = '<tr>'+
            '<td><input type="" class="text-center c-input"><a class="btn red remove" style="display: none">x</a></td>'+
            '<td><textarea class="hangMuc"></textarea></td>'+
            '<td><input type="" class="text-center dvt c-input"></td>'+
            '<td><input type="" class="text-right kl c-input" ></td>'+
            '</tr>';
        $("#appendRow").append(template);
    });

    // Them commas
    function addCommas(nStr)
    {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }


    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }


    $(document).on('input','.donGia, .thanhTien, #tamUng, #congTyCon', function(){
        var str = $(this).val();
        str = str.replace(/\D+/g, '');
        $(this).val(str.replace(/\d(?=(?:\d{3})+(?!\d))/g, '$&,'));
    });

    $.sumQuyetToan = function() {
        var sum = 0;
        $('tr').each(function () {
             var kl = $(this).find('.kl').val();
             var donGia = $(this).find('.donGia').val();
             if ( kl && kl.length !== 0 && donGia.length !== 0  ) {
                var thanhTien = parseFloat(kl) * parseInt(donGia.replace(/[^0-9\.]/g,''));
                $(this).find('.thanhTien').html(addCommas(thanhTien));
                sum += parseInt(thanhTien);
             }else{
                $(this).find('.thanhTien').html('');
             }
         });
        $("#total").html(addCommas(sum));
        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(sum))+' đồng</i>');
    }

    // Sum các row
    $(document).on('input','.donGia, .kl', function(){
        $.sumQuyetToan();
    });


    $.sumTongHop = function(){
        var sum = 0;
        $('tr').each(function () {
             var thanhTien = $(this).find('.thanhTien').val();

             if (thanhTien == '') {
                thanhTien = 0;
             }
             if ( typeof thanhTien !== 'undefined') {
                sum += parseInt(thanhTien.replace(/[^0-9\.]/g,''));
             }
             
         });
        $("#total").html(addCommas(sum));
        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(sum))+' đồng</i>');
    }

    // Sum các row thành tiền
    $(document).on('input','.thanhTien', function(){
        $.sumTongHop();

        if($("#tamUng").is(":visible")){
            $.tinhTamUng();
            $("congTyCon").val(0);
        }else if($("#congTyCon").is(":visible")){
            $.tinhCongTyCon();
            $("tamUng").val(0);
        }else{
            $.sumTongHop();
        }

    });


    // checkTamUng
    $(document).on('change','.checkTamUng', function(e){
        e.preventDefault();

        if ( this.checked ) {
            $("#showTamUng").show();
            $("#showConLai").show();        
        }else{
            $("#showTamUng").hide();
            $("#showConLai").hide();
            $.sumTongHop();
            $("#tamUng").val(0);
            $(".conLai").html($("#total").text());
        }

    });


    $.tinhTamUng = function(){
        // Tính số tiền còn lại
        var total = $("#total").text();
        var tamUng = $("#tamUng").val();
        var conLai = parseInt(total.replace(/[^0-9\.]/g,'')) - parseInt(tamUng.replace(/[^0-9\.]/g,''));
        $(".conLai").html(addCommas(conLai)); 
        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(conLai))+' đồng</i>');
    }

    $(document).on('input','#tamUng', function(e){
        e.preventDefault();
        $.tinhTamUng();
    });


    // checkTamUng
    $(document).on('change','.checkCongTyCon', function(e){
        e.preventDefault();

        if ( this.checked ) {
            $("#showCongTyCon").show();
            $("#showTongCong").show();
        }else{
            $("#showCongTyCon").hide();
            $("#showTongCong").hide();
            $.sumTongHop();
            $("#congTyCon").val(0);
            $(".tongCong").html($("#total").text());
        }
    });

    $.tinhCongTyCon = function(){
        // Tính số tiền còn lại
        var total = $("#total").text();
        var congTyCon = $("#congTyCon").val();

        var tongCong = parseInt(total.replace(/[^0-9\.]/g,'')) + parseInt(congTyCon.replace(/[^0-9\.]/g,''));

        $(".tongCong").html(addCommas(tongCong)); 
        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(tongCong))+' đồng</i>');
    }

    $(document).on('input','#congTyCon', function(e){
        e.preventDefault();
        $.tinhCongTyCon();
    });

    // xóa hàng
    // 
    $(document).on('click',"#showRemove", function(e){
        e.preventDefault();

        if($(".remove").is(":visible")){
            $(".remove").hide();
        }else{
            $(".remove").show();
        }
        
    });

    $(document).on('click','.remove', function(e){
        e.preventDefault();
        if (!confirm('Ba đang muốn xóa hàng ?')) {
            return false;
        }
        $(this).parent('td').parent('tr').remove();

        var type = $("#type").val();
        if (type == 1) {
            $.sumQuyetToan();
        }else if( type == 2){
            $.sumTongHop();

            if($("#tamUng").is(":visible")){
                $.tinhTamUng();
            }else if($("#congTyCon").is(":visible")){
                $.tinhCongTyCon();
            }
        }else{

        }
        
    });


    $(document).on('change','#anNen', function(e){
        e.preventDefault();
        if ( this.checked ) {
            $("page[size=A4]").addClass('bg-none');
        }else{
            $("page[size=A4]").removeClass('bg-none');
        }
        
    });


    $(document).on('change','#soHang', function(e){
        e.preventDefault();

        var soHang = $(this).val();

        if (soHang != '' || soHang != 0) {
            if (!confirm('Thêm '+soHang+' hàng ?')) {
                $(this).val('');
                return false;
            }
        }

        var type = $("#type").val();
        if (type == 1) {
            for (var i = 1; i <= soHang; i++) {
                template = '<tr>'+
                    '<td><input type="" class="text-center c-input"><a class="btn red remove" style="display: none">x</a></td></td>'+
                    '<td><textarea class="hangMuc"></textarea></td>'+
                    '<td><input type="" class="c-input dvt text-center"></td>'+
                    '<td><input type="" class="c-input kl text-right"></td>'+
                    '<td><input type="" class="c-input text-right donGia"></td>'+
                    '<td class="text-right"><span class="thanhTien"></span></td>'+
                    '</tr>';
                $("#appendRow").append(template);
            }
        }else if( type == 2 ){
            for (var i = 1; i <= soHang; i++) {
                template = '<tr>'+
                '<td><input type="" class="text-center c-input"><a class="btn red remove" style="display: none">x</a></td>'+
                    '<td><textarea class="hangMuc"></textarea></td>'+
                    '<td><input type="" class="thanhTien c-input text-right"></td>'+
                    '<td><textarea></textarea>'+
                    '</tr>';
                $("#appendRow").append(template);
            }
        }else if( type == 3){
            for (var i = 1; i <= soHang; i++) {
                template = '<tr>'+
                    '<td><input type="" class="text-center c-input"><a class="btn red remove" style="display: none">x</a></td>'+
                    '<td><textarea class="hangMuc"></textarea></td>'+
                    '<td><input type="" class="text-center dvt c-input"></td>'+
                    '<td><input type="" class="text-right kl c-input" ></td>'+
                    '</tr>';
                $("#appendRow").append(template);
            }
        }
        $(this).val('');
    });


   


 });


