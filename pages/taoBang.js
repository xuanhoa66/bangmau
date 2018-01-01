var navModule, $this;

$(document).on('change', '.navModule', function(e){
	e.preventDefault();

	$this = $(this);
	itemNav = $this.attr('data-nav');
	$("#loadModule").load('/pages/modules/'+itemNav+'.html');

	console.log('/pages/'+itemNav+'.html');
});
