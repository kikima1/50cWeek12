"use strict"
d3.json('data.json').then( 
    function(d) {
      console.log(d);
      
     
      let s = d3.select(".chart")
        .append("svg")
        .attr("width", 600)
        .attr("height", 300);
      
      
      let r = s.selectAll("rect")
        .data( d )
        .enter()
        .append("rect")
        .attr("fill", function ( d ) {
          console.log(d.color);
          return d.color;
          
        })
        
        //bar chart heading upwards
        
        .attr("y", function ( d ) {
	  	return 300 - ( d.val);
	  })
        .attr("width", 40)
        
      
        .attr("x", function( d, i ) {
	  	return (i * 40);
	  })
                
       
      .attr("height", function ( d ) {
	  	return d.val * 10;
	  })
      .attr("data-val", function ( d ) {
          return d.text;
        })
        .attr("data-text", function ( d ) {
          return d.val;
        })
        .on("click", handleClick)
        ;
      ///blobs
let l = d3.select(".blobs")
        .append("svg")
        .attr("width", 1200)
        .attr("height", 200);
      
      //make circles
      let m = l.selectAll("circle")
        .data( d )
        .enter()
        .append("circle")
        .attr("fill", function ( d ) {
          console.log(d.color);
          return d.color;
          })
    .attr("r", function(d){
        return  d.val/3;})
    .attr("cx", function(d, i){
      if (d.val < 100)
      {
        return 40 + (i* 60);
      }
    
       else
            return 80 + (i*120)}
)
    .attr("cy", 120)
          
        
 .attr("data-val", function ( d ) {
          return d.text;
        })
        .attr("data-text", function ( d ) {
          return d.val;
        })
        .on("click", handleClick1)
        ;
    }
  
  );
		
 
	

  
  // function runs when user clicks bars
	function handleClick(d3clickObject) {
    
    document.getElementById("msg").innerHTML = d3clickObject.target.dataset.text +" " + d3clickObject.target.dataset.val;
    
	}


// function runs when user clicks blobs
function handleClick1(d3clickObject) {
    
    document.getElementById("msg2").innerHTML = d3clickObject.target.dataset.text +" " + d3clickObject.target.dataset.val;
}
