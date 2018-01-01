var DOCSO=function(){var t=["không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"],r=function(r,n){var o="",a=Math.floor(r/10),e=r%10;return a>1?(o=" "+t[a]+" mươi",1==e&&(o+=" mốt")):1==a?(o=" mười",1==e&&(o+=" một")):n&&e>0&&(o=" lẻ"),5==e&&a>=1?o+=" lăm":4==e&&a>=1?o+=" bốn":(e>1||1==e&&0==a)&&(o+=" "+t[e]),o},n=function(n,o){var a="",e=Math.floor(n/100),n=n%100;return o||e>0?(a=" "+t[e]+" trăm",a+=r(n,!0)):a=r(n,!1),a},o=function(t,r){var o="",a=Math.floor(t/1e6),t=t%1e6;a>0&&(o=n(a,r)+" triệu",r=!0);var e=Math.floor(t/1e3),t=t%1e3;return e>0&&(o+=n(e,r)+" nghìn",r=!0),t>0&&(o+=n(t,r)),o};return{doc:function(r){if(0==r)return t[0];var n="",a="";do ty=r%1e9,r=Math.floor(r/1e9),n=r>0?o(ty,!0)+a+n:o(ty,!1)+a+n,a=" tỷ";while(r>0);return n.trim()}}}();

$(document).ready(function() {
    $('select').material_select();
     $('#export').modal({
        dismissible: false
     });
     
    var navItem, $this, template;



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
        $('h1').css('margin-top','50px');

        var form = $('page').get(0);

        html2canvas(form).then( function(canvas){
            var img = canvas.toDataURL();
            $("#export_img").attr('src',img);
            $("#export_download").attr('href',img);
            $("#export_dropbox").attr('href','/index.html');
        }); 
        $("#export").modal('open');
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
            '<td><input type="" class="c-input"></td></td>'+
            '<td><textarea class="hangMuc"></textarea></td>'+
            '<td><input type="" class="c-input dvt"></td>'+
            '<td><input type="" class="c-input kl" placeholder="0"></td>'+
            '<td><input type="" class="c-input text-right donGia" placeholder="0"></td>'+
            '<td><input type=""  class="thanhTien c-input text-right" name="" value="0" disabled="disabled"></td>'+
            '</tr>';
        $("#appendRow").append(template);
    });

    // Thêm hàng Tổng hợp
    $(document).on('click', "#addRowTongHop", function(e){
        e.preventDefault();
        template = '<tr>'+
            '<td><input type="" class="c-input"></td></td>'+
            '<td><textarea class="hangMuc"></textarea></td>'+
            '<td><input type="" class="thanhTien c-input text-right" value="0"></td>'+
            '<td><textarea></textarea>'+
            '</tr>';
        $("#appendRow").append(template);
    });

    // addRowKhoiLuong
    $(document).on('click', "#addRowKhoiLuong", function(e){
        e.preventDefault();
        
        template = '<tr>'+
            '<td><input type="" class="c-input"></td></td>'+
            '<td><textarea class="hangMuc"></textarea></td>'+
            '<td><input type="" class="dvt c-input"></td>'+
            '<td><input type="" class="kl c-input" ></td>'+
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



    // Sum các row
    $(document).on('input','.donGia, .kl', function(){
        
        var sum = 0;
        $('tr').each(function () {
             
             var kl = $(this).find('.kl').val();
             var donGia = $(this).find('.donGia').val();
             if ( !isNaN(kl) && kl.length !== 0 && donGia.length !== 0  ) {
                var thanhTien = parseInt(kl) * parseInt(donGia.replace(/[^0-9\.]/g,''));
                $(this).find('.thanhTien').val(addCommas(thanhTien));
                sum += parseInt(thanhTien);
             }else{
                $(this).find('.thanhTien').val('');
             }
         });

        $("#total").html(addCommas(sum));

        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(sum))+' đồng</i>');

    });

    // Sum các row thành tiền
    $(document).on('input','.thanhTien', function(){
        
        var sum = 0;

        $('tr').each(function () {
             var thanhTien = $(this).find('.thanhTien').val();
             
             if ( typeof thanhTien !== 'undefined') {
                sum += parseInt(thanhTien.replace(/[^0-9\.]/g,''));
             }
             
         });
        $("#total").html(addCommas(sum));
        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(sum))+' đồng</i>');

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
        }

    });

    $(document).on('input','#tamUng', function(e){
        e.preventDefault();

        // Tính số tiền còn lại
        var total = $("#total").text();
        var tamUng = $("#tamUng").val();

        var conLai = parseInt(total.replace(/[^0-9\.]/g,'')) - parseInt(tamUng.replace(/[^0-9\.]/g,''));

        $(".conLai").html(addCommas(conLai)); 
        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(conLai))+' đồng</i>');

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
        }
    });



    $(document).on('input','#congTyCon', function(e){
        e.preventDefault();

        // Tính số tiền còn lại
        var total = $("#total").text();
        var congTyCon = $("#congTyCon").val();

        var tongCong = parseInt(total.replace(/[^0-9\.]/g,'')) + parseInt(congTyCon.replace(/[^0-9\.]/g,''));

        $(".tongCong").html(addCommas(tongCong)); 
        $("#docChuSo").html('<i>'+capitalize(DOCSO.doc(tongCong))+' đồng</i>');

    });

   


 });


