function open_next(){++open_menu>2&&(open_menu=2),0==open_menu?open_minimap():1==open_menu?open_leaderboard():2==open_menu&&open_settings()}function open_previous(){--open_menu<0&&(open_menu=0),0==open_menu?open_minimap():1==open_menu?open_leaderboard():2==open_menu&&open_settings()}function open_minimap(){minimap_button.className.endsWith("active")||(minimap_button.className="game-button active",leaderboard_button.className="game-button",settings_button.className="game-button",minimap_square.className="active",leaderboard_square.className="inactive",settings_square.className="inactive",open_menu=0)}function open_leaderboard(){leaderboard_button.className.endsWith("active")||(leaderboard_button.className="game-button active",minimap_button.className="game-button",settings_button.className="game-button",leaderboard_square.className="active",minimap_square.className="inactive",settings_square.className="inactive",open_menu=1)}function open_settings(){settings_button.className.endsWith("active")||(settings_button.className="game-button active",leaderboard_button.className="game-button",minimap_button.className="game-button",settings_square.className="active",leaderboard_square.className="inactive",minimap_square.className="inactive",open_menu=2)}function open_exit(){restart("You killed yourself")}function generate_mainCanvas(){main_canvas.width=window.innerWidth,main_canvas.height=window.innerHeight,main_ctx.fillStyle="#FFFFFF";for(var e=0;e<30;e++)main_ctx.fillRect(Math.round(Math.random()*main_canvas.width),Math.round(Math.random()*main_canvas.height),2,2);main_ctx.translate(Math.round(Math.random()*main_canvas.width),Math.round(Math.random()*(main_canvas.height/2)+main_canvas.height/2)),main_ctx.rotate(Math.round(360*Math.random()*Math.PI/180)),main_ctx.drawImage(small_spaceship.img,Math.round(-small_spaceship.oWidth/2),Math.round(-small_spaceship.oHeight/2),small_spaceship.oWidth,small_spaceship.oHeight)}function waitForMainCanvas(){setTimeout(function(){small_spaceship.loaded?generate_mainCanvas():waitForMainCanvas()},50)}function load(){restarts%2!=0?adplayer.startPreRoll():load_after_ad()}function verifyAdblocker(){var e=document.createElement("div");e.innerHTML="&nbsp;",e.className="adsbox",document.body.appendChild(e),window.setTimeout(function(){if(0===e.offsetHeight){var t=document.getElementsByClassName("upgrade");for(var a in t)t[a].className="upgrade adblocker"}e.remove()},100)}function generate_stars(){if(null!=me)if(0==stars.length)for(e=0;e<40;e++)stars[e]={x:me.x-8e3*Math.random()+4e3,y:me.y-8e3*Math.random()+4e3};else for(var e=0;e<stars.length;e++){var t=stars[e];if(t.x<me.x-4e3||t.x>me.x+4e3||t.y<me.y-4e3||t.y>me.y+4e3){var a=Math.round(3*Math.random());stars[e]=0==a?{x:me.x-6e3*Math.random()+3e3,y:me.y-3e3}:1==a?{x:me.x-6e3*Math.random()+3e3,y:me.y+3e3}:2==a?{x:me.x-3e3,y:me.y-6e3*Math.random()+3e3}:{x:me.x+3e3,y:me.y-6e3*Math.random()+3e3}}}}function broadcast(e,t){main.emit("broadcast",e,t)}function init_main(){main.on("server",function(e){null!=e?(server=io(e.ip),loc=e.loc):(server=main,loc="Main"),init_server()}),main.on("broadcast",function(e){var t=document.getElementById("game-text-sub").innerHTML;document.getElementById("game-text-sub").innerHTML=e,setTimeout(function(){document.getElementById("game-text-sub").innerHTML==e&&(document.getElementById("game-text-sub").innerHTML=t)},3e3)}),main.on("disconnect",function(e){e.includes("transport")?setTimeout(function(){close(),exit()},1e3):(close(),started&&setTimeout(function(){exit()},1e3))}),window.onunload=function(){close()}}function init_server(){server.on("joined",function(e){console.log("Joined ("+(new Date).toLocaleTimeString()+")"),(me=new player).name=e,players[players.length]=me}),server.on("spawn",function(e,t,a,n,i){if(e!=me.name){console.log("Player "+e+"("+i+") joined");var l=new player;l.name=e,l.x=t,l.y=a,l.setR(n),l.team=i,players[players.length]=l}else me.x=t,me.y=a,me.r=n,me.setR(n),me.team=i,generate_stars(),0==me.team?document.getElementById("game-text-title").innerHTML="Capture the flag":document.getElementById("game-text-title").innerHTML="Defend the flag"}),server.on("leave",function(e){console.log("Player "+e+" left"),removePlayer(e)}),server.on("boost",function(e){var t=getPlayer(e);t.boosting=!0,t.boostTimer=0,t.shooting=!1}),server.on("move",function(e,t,a,n,i){var l=getPlayer(e);if(!i)return l.moving=!1,void(l.rotating=!1);Math.round(l.oldX)==Math.round(t)&&Math.round(l.oldY)==Math.round(a)||(l.moving=!0),Math.round(l.oldR)!=Math.round(n)&&(l.rotating=!0),l==me?(l.x=t,l.y=a,l.oldX=t,l.oldY=a):(l.setX(t),l.setY(a)),l.setR(n)}),server.on("fuel_spawn",function(e,t,a,n){fuel_tanks[fuel_tanks.length]={x:e,y:t,r:a,fuel:n}}),server.on("fuel_remove",function(e,t){for(var a in fuel_tanks)fuel_tanks[a].x==e&&fuel_tanks[a].y==t&&fuel_tanks.splice(a,1)}),server.on("stat",function(e,t){"health"==e?statrows.health.set(t):"heat"==e?statrows.heat.set(t):statrows.boost.set(t)}),server.on("health",function(e,t){getPlayer(e).health=t}),server.on("killed",function(e,t){e==me.name?restart("You were killed by<br /><i>"+t+"</i>",4e3):null!=getPlayer(t)&&getPlayer(t).kills++,e!=me.name&&t==me.name&&(upgrades.points++,upgrades.upgrade())}),server.on("hit",function(e){var t=getPlayer(e);t.hit=!0,t.hitTimer=0,t.hitAlpha=0}),server.on("shoot",function(e,t){var a=getPlayer(e);a.shooting=!0,a.shotTimer=0,a.turret=t,a.boosting=!1}),server.on("state",function(e){document.getElementById("game-text-title").innerHTML=e}),server.on("message",function(e){e!=document.getElementById("game-text-sub").innerHTML&&null==document.getElementById("game-text-sub").innerHTML&&(document.getElementById("game-text-sub").innerHTML=e,setTimeout(function(){document.getElementById("game-text-sub").innerHTML==e&&(document.getElementById("game-text-sub").innerHTML="")},3e3))}),server.on("wait",function(e){e&&null!=document.getElementById("game-text-sub").innerHTML?document.getElementById("game-text-sub").innerHTML="Wait until there are defenders":"Wait until there are defenders"==document.getElementById("game-text-sub").innerHTML&&(document.getElementById("game-text-sub").innerHTML="")}),server.on("kills",function(e,t){getPlayer(e).kills=t}),server.on("capturing",function(e,t,a){e?t==me.name?(time_left=100*a,start_date=Date.now(),document.getElementById("game-text-title").innerHTML="Capturing the flag<br>"+Math.round(time_left/1e3)+" seconds left"):document.getElementById("game-text-title").innerHTML="The flag is being captured":(time_left=0,0==me.team?document.getElementById("game-text-title").innerHTML="Capture the flag":document.getElementById("game-text-title").innerHTML="Defend the flag")}),server.on("captured",function(e,t){var a=document.getElementById("game-text-title");t?(0==me.team?me.name==e?a.innerHTML="Get the flag to the safe-zone":a.innerHTML=e+" has the flag":a.innerHTML="Get our flag back",flagPlayer=e):(0==me.team?(a.innerHTML="You lost the flag",setTimeout(function(){"You lost the flag"==a.innerHTML&&(a.innerHTML="Capture the flag")},2e3)):(a.innerHTML="The flag was returned",setTimeout(function(){"The flag was returned"==a.innerHTML&&(a.innerHTML="Defend the flag")},2e3)),flagPlayer=null);var n=getPlayer(e);flagCaptured=t,null!=n&&(n.flagTime=0)}),server.on("disconnect",function(){console.log("Left ("+(new Date).toLocaleTimeString()+")"),server.close()}),server.on("finished",function(){restart("The attackers<br>have won the game",5e3)}),server.on("kicked",function(e){restart("You were kicked<br /><small>"+e+"</small>")})}function getPlayer(e){for(var t=0;t<players.length;t++)if(players[t].name==e)return players[t]}function removePlayer(e){for(var t=0;t<players.length;t++)if(players[t].name==e){players.splice(t,1);break}}function load_after_ad(){username=document.getElementById("username").value;var e=document.getElementById("title");e.innerHTML="<span>Loading...<div class='hint'>"+hints[Math.floor(hints.length*Math.random())]+"</div></span>",e.className="active",e.style.zIndex="10",init(),setTimeout(function(){start_when_loaded()},5e3)}function restart(e,t){if(t=t||2e3,!restarting){restarts++,restarting=!0,started=!1,main.disconnect(),main.close(),null!=server&&(server.disconnect(),server.close(),server=null);var a=document.getElementById("title"),n=document.getElementById("main"),i=document.getElementById("game");a.innerHTML="<span>"+e+"</span>",a.className="active",a.style.zIndex="10",setTimeout(function(){n.style.display="initial",i.style.display="none",a.className="inactive",viewport=new viewport_(canvas,.2),gameloop.running=!1,gameloop=new gameloop_(update,tick),input=new input_,camera=new camera_(canvas,viewport),leaderboard=new leaderboard_,settings=new settings_,flagPlayer=null,time_left=0,generate_mainCanvas(),statrows={speed:new statrow(document.getElementById("speed")),regen:new statrow(document.getElementById("regen")),damage:new statrow(document.getElementById("damage")),boost:new statrow(document.getElementById("boost")),health:new statrow(document.getElementById("health")),heat:new statrow(document.getElementById("heat"))},players=[],fuel_tanks=[],me=null,loc=null,ping=0,main=io({forceNew:!0}),init_main(),setTimeout(function(){a.style.zIndex="-5",restarting=!1},1e3)},t)}}function close(){main.disconnect(),main.close(),null!=server&&(server.disconnect(),server.close()),settings.save()}function exit(){location.reload()}function start_when_loaded(){if(img_manager.loaded()){if(restarting)return;document.getElementById("main").style.display="none",document.getElementById("game").style.display="initial",document.getElementById("title").className="inactive",setTimeout(function(){started&&(document.getElementById("title").style.zIndex="-5")},500),start(username)}else window.setTimeout(start_when_loaded,500)}function init(){main.emit("server"),statrows.speed.fill(),statrows.regen.fill(),statrows.damage.fill(),statrows.boost.fill(),statrows.health.fill(),statrows.heat.fill(!0)}function start(e){document.getElementById("loc").innerHTML=loc,"undefined"!=typeof Storage&&localStorage.setItem("username",e),settings.load(),server.emit("join",e),started=!0,gameloop.start()}function calcMinimap(e){return Math.round(200*e/mapSize)}function update(){if(ctx.fillStyle="#00001e",ctx.fillRect(0,0,canvas.width,canvas.height),document.getElementById("game-text-title").innerHTML.startsWith("Capturing the flag")&&(time_left=1e4-(Date.now()-start_date),document.getElementById("game-text-title").innerHTML="Capturing the flag<br>"+Math.round(time_left/1e3)+" seconds left"),null!=me){if(camera.setX(me.x),camera.setY(me.y),camera.update(),"inactive"!=document.getElementById("square-minimap").className){minimap_ctx.fillStyle="#00001e",minimap_ctx.fillRect(0,0,minimap_canvas.width,minimap_canvas.height),0==me.team?(minimap_ctx.fillStyle="#FF7F7F",minimap_ctx.fillRect(calcMinimap(flagX)-10,calcMinimap(flagY)-10,calcMinimap(flagW)+20,calcMinimap(flagH)+20),minimap_ctx.beginPath(),minimap_ctx.strokeStyle="#FF0000",minimap_ctx.lineWidth="1",minimap_ctx.rect(calcMinimap(flagX)-10,calcMinimap(flagY)-10,calcMinimap(flagW)+20,calcMinimap(flagH)+20),minimap_ctx.stroke(),minimap_ctx.fillStyle="#7F92FF",minimap_ctx.fillRect(calcMinimap(szX)-10,calcMinimap(szY)-10,calcMinimap(szW)+20,calcMinimap(szH)+10),minimap_ctx.beginPath(),minimap_ctx.strokeStyle="#0026FF",minimap_ctx.lineWidth="1",minimap_ctx.rect(calcMinimap(szX)-10,calcMinimap(szY)-10,calcMinimap(szW)+20,calcMinimap(szH)+10),minimap_ctx.stroke()):(minimap_ctx.fillStyle="#7F92FF",minimap_ctx.fillRect(calcMinimap(flagX)-10,calcMinimap(flagY)-10,calcMinimap(flagW)+20,calcMinimap(flagH)+20),minimap_ctx.beginPath(),minimap_ctx.strokeStyle="#0026FF",minimap_ctx.lineWidth="1",minimap_ctx.rect(calcMinimap(flagX)-10,calcMinimap(flagY)-10,calcMinimap(flagW)+20,calcMinimap(flagH)+20),minimap_ctx.stroke(),minimap_ctx.fillStyle="#FF7F7F",minimap_ctx.fillRect(calcMinimap(szX)-10,calcMinimap(szY)-10,calcMinimap(szW)+20,calcMinimap(szH)+10),minimap_ctx.beginPath(),minimap_ctx.strokeStyle="#FF0000",minimap_ctx.lineWidth="1",minimap_ctx.rect(calcMinimap(szX)-10,calcMinimap(szY)-10,calcMinimap(szW)+20,calcMinimap(szH)+10),minimap_ctx.stroke()),flagCaptured||0==time_left?flagCaptured||minimap_ctx.drawImage(flag_small.img,calcMinimap(flagX)-5,calcMinimap(flagY)-5,calcMinimap(flagW)+10,calcMinimap(flagH)+10):(minimapAniTime>60&&minimap_ctx.drawImage(flag_small.img,calcMinimap(flagX)-5,calcMinimap(flagY)-5,calcMinimap(flagW)+10,calcMinimap(flagH)+10),++minimapAniTime>120&&(minimapAniTime=0)),0==me.team&&minimap_ctx.drawImage(home_small.img,90,182,20,20);for(var e in players){var t=players[e];if(minimap_ctx.save(),minimap_ctx.translate(calcMinimap(t.x),calcMinimap(t.y)),minimap_ctx.rotate(t.r*Math.PI/180),t.name==flagPlayer){if(t.flagTime>=0){minimap_ctx.drawImage(flag_small.img,-7,-7,14,14),30==++t.flagTime&&(t.flagTime=-1),minimap_ctx.restore();continue}-32==--t.flagTime&&(t.flagTime=0)}t==me?minimap_ctx.drawImage(arrow_white.img,-6,-6,12,12):t.team==me.team?minimap_ctx.drawImage(arrow_blue.img,-6,-6,12,12):minimap_ctx.drawImage(arrow_red.img,-6,-6,12,12),minimap_ctx.restore()}}ctx.fillStyle="#FFFFFF";for(i=0;i<stars.length;i++){var a=stars[i];(a.x>me.x-3e3||a.x<me.x+3e3||a.y>me.y-3e3||a.y<me.y+3e3)&&ctx.fillRect(camera.calcX(a.x),camera.calcY(a.y),camera.calc(10),camera.calc(10))}ctx.fillStyle="#000000",ctx.fillRect(camera.calcX(-3e3),camera.calcY(-3e3),camera.calc(3e3),camera.calc(mapSize+6e3)),ctx.fillRect(camera.calcX(-3e3),camera.calcY(-3e3),camera.calc(mapSize+6e3),camera.calc(3e3)),ctx.fillRect(camera.calcX(mapSize),camera.calcY(-3e3),camera.calc(3e3),camera.calc(mapSize+6e3)),ctx.fillRect(camera.calcX(-3e3),camera.calcY(mapSize),camera.calc(mapSize+6e3),camera.calc(3e3)),0==me.team?(ctx.fillStyle="#FF7F7F",ctx.fillRect(camera.calcX(flagX),camera.calcY(flagY),camera.calc(flagW),camera.calc(flagH)),ctx.beginPath(),ctx.strokeStyle="#FF0000",ctx.lineWidth=camera.calc(30)+"",ctx.rect(camera.calcX(flagX),camera.calcY(flagY),camera.calc(flagW),camera.calc(flagH)),ctx.stroke(),ctx.fillStyle="#7F92FF",ctx.fillRect(camera.calcX(szX),camera.calcY(szY),camera.calc(szW),camera.calc(szH)),ctx.beginPath(),ctx.strokeStyle="#0026FF",ctx.lineWidth=camera.calc(30)+"",ctx.rect(camera.calcX(szX),camera.calcY(szY),camera.calc(szW),camera.calc(szH)),ctx.stroke()):(ctx.fillStyle="#7F92FF",ctx.fillRect(camera.calcX(flagX),camera.calcY(flagY),camera.calc(flagW),camera.calc(flagH)),ctx.beginPath(),ctx.strokeStyle="#0026FF",ctx.lineWidth=camera.calc(30)+"",ctx.rect(camera.calcX(flagX),camera.calcY(flagY),camera.calc(flagW),camera.calc(flagH)),ctx.stroke(),ctx.fillStyle="#FF7F7F",ctx.fillRect(camera.calcX(szX),camera.calcY(szY),camera.calc(szW),camera.calc(szH)),ctx.beginPath(),ctx.strokeStyle="#FF0000",ctx.lineWidth=camera.calc(30)+"",ctx.rect(camera.calcX(szX),camera.calcY(szY),camera.calc(szW),camera.calc(szH)),ctx.stroke()),(flagX>me.x-3e3||flagX<me.x+3e3||flagY>me.y-3e3||flagY<me.y+3e3)&&!flagCaptured&&ctx.drawImage(main_flag.img,camera.calcX(flagX),camera.calcY(flagY),camera.calc(1e3),camera.calc(1e3));for(var e in fuel_tanks){ctx.save();var n=fuel_tanks[e];if(!(n.x<me.x-3e3||n.x>me.x+3e3||n.y<me.y-3e3||n.y>me.y+3e3)){ctx.translate(camera.calcX(n.x),camera.calcY(n.y)),ctx.rotate(n.r*Math.PI/180),ctx.drawImage(fuel_tank.img,camera.calc(-66),camera.calc(-219),camera.calc(133),camera.calc(438)),n.fuel<=5?ctx.fillStyle="rgb(255, "+n.fuel/5*255+", 0)":ctx.fillStyle="rgb("+(255-(n.fuel-5)/5*255)+", 255, 0)";for(var i=0;i<n.fuel;i++)ctx.fillRect(camera.calc(-11),camera.calc(152-14*i),camera.calc(22),camera.calc(11));ctx.restore()}}}for(var e in players)if(ctx.save(),(t=players[e]).update(),!(t.x<me.x-3e3||t.x>me.x+3e3||t.y<me.y-3e3||t.y>me.y+3e3)){t==me?ctx.translate(camera.middleX(),camera.middleY()):ctx.translate(camera.calcX(t.x),camera.calcY(t.y)),ctx.rotate(t.r*Math.PI/180);var l=camera.calc(-400),r=camera.calc(-620),m=camera.calc(800),c=camera.calc(1e3);t==me?ctx.drawImage(spaceship_body_white.img,l,r,m,c):t.team==me.team?ctx.drawImage(spaceship_body_blue.img,l,r,m,c):ctx.drawImage(spaceship_body_red.img,l,r,m,c),t.boosting?(ctx.drawImage(spaceship_boosters.img,l,r,m,c),10==++t.boostTimer&&(t.boosting=!1)):ctx.drawImage(spaceship_turrets.img,l,r,m,c),t.shooting&&(0==t.turret?ctx.drawImage(spaceship_laser1.img,l,r,m,c):1==t.turret?ctx.drawImage(spaceship_laser2.img,l,r,m,c):2==t.turret?ctx.drawImage(spaceship_laser3.img,l,r,m,c):ctx.drawImage(spaceship_laser4.img,l,r,m,c),10==++t.shotTimer&&(t.shooting=!1)),ctx.drawImage(spaceship_wings.img,l,r,m,c),t.hit&&(t.hitTimer<10?(t.hitAlpha+=.03,ctx.globalAlpha=t.hitAlpha):t.hitTimer>=10&&t.hitTimer<20?(t.hitAlpha-=.03,ctx.globalAlpha=t.hitAlpha):20==t.hitTimer&&(ctx.globalAlpha=0,t.hit=!1),ctx.drawImage(spaceship_hurt.img,l,r,m,c),ctx.globalAlpha=1,t.hitTimer++),t.health<=7?ctx.fillStyle="rgb(255, "+Math.round(t.health/7*255)+", 0)":ctx.fillStyle="rgb("+Math.round(255-(t.health-7)/8*255)+", 255, 0)",t!=me&&ctx.fillRect(camera.calc(-22),camera.calc(16.5*(15-t.health)-138),camera.calc(40),camera.calc(16.5*t.health)),flagPlayer==t.name&&t!=me&&ctx.drawImage(main_flag.img,camera.calc(-150),camera.calc(-430),camera.calc(300),camera.calc(300)),t.moving&&ctx.drawImage(spaceship_trail.img,l,r,m,c),ctx.restore()}}function tick(){if(leaderboard.update(players,me),generate_stars(),mouseInScreen&&use_mouse){var e=Math.round(180*Math.atan2(camera.middleX()-mouseX,camera.middleY()-mouseY)/Math.PI);lastTarget!=(e=e<0?-e:360-e)&&(onInput("target",e),lastTarget=e)}}function onInput(e,t){null!=server&&started&&server.emit("input",e,t)}function upgrade(e){null!=server&&server.emit("upgrade",e)}var camera_=function(e,t){var a={};return a.x=0,a.y=0,a.canvas=e,a.positionInterval=6,a.oldX=0,a.oldY=0,a.difX=0,a.difY=0,a.viewport=t,a.setX=function(e){a.oldX=a.x,a.difX=e-a.x},a.setY=function(e){a.oldY=a.y,a.difY=e-a.y},a.update=function(){a.x+=a.difX/a.positionInterval,a.y+=a.difY/a.positionInterval},a.calcX=function(n){return Math.round(n*t.scale+e.width/2-a.x*t.scale)},a.calcY=function(n){return Math.round(n*t.scale+e.height/2-a.y*t.scale)},a.halfX=function(){return Math.round(e.width/2/t.scale)},a.halfY=function(){return Math.round(e.height/2/t.scale)},a.calc=function(e){return Math.round(e*t.scale)},a.middleX=function(){return Math.round(e.width/2)},a.middleY=function(){return Math.round(e.height/2)},a},gameloop_=function(e,t){var a={};return a.tps=5,a.latestTps=0,a.callback1=e,a.callback2=t,a.running=!0,a.render=window.requestAnimationFrame,a.start=function(){a.render.call(window,a.update),a.startInterval()},a.update=function(){a.running&&(a.callback1(),a.render.call(window,a.update))},a.startInterval=function(){a.intervalid=setInterval(function(){a.callback2(),a.tps!=a.latestTps&&(clearInterval(a.intervalid),a.startInterval())},1e3/a.tps),a.latestTps=a.tps},a},img=function(e,t){var a={};return a.src=t,a.img=null,a.name=e,a.loaded=!1,a.oWidth=0,a.oHeight=0,a.oImg=null,a.load=function(){a.img=new Image,a.img.src=a.src,a.img.onload=function(){a.loaded=!0,a.oWidth=a.img.width,a.oHeight=a.img.height,a.oImg=a.img}},a.scale=function(e){var t=document.createElement("canvas"),n=t.getContext("2d");t.width=a.oWidth*e,t.height=a.oHeight*e,n.drawImage(a.oImg,0,0,t.width,t.height),a.img=t},a},img_manager_=function(){var e={};return e.imgs=[],e.add=function(t,a){return e.imgs[e.imgs.length]=new img(t,a)},e.load=function(){for(var t=0;t<e.imgs.length;t++)e.imgs[t].loaded||e.imgs[t].load()},e.loaded=function(){for(var t=0;t<e.imgs.length;t++)if(!e.imgs[t].loaded)return!1;return!0},e.get=function(t){for(var a=0;a<e.imgs.length;a++)if(e.imgs[a].name=t)return e.imgs[a];return null},e.scale=function(t){for(var a=0;a<e.imgs.length;a++)e.imgs[a].scale(t)},e},input_=function(){var e={};return e.square=document.getElementById("game-map"),e.upgrades=document.getElementById("game-upgrades"),e.spaceDown=!1,e.shiftDown=!1,e.wDown=!1,e.aDown=!1,e.sDown=!1,e.dDown=!1,document.addEventListener("keydown",function(t){null!=server&&started&&(use_mouse?32!=t.keyCode||e.spaceDown?16!=t.keyCode||e.shiftDown||(server.emit("input",t.keyCode,!0),e.shiftDown=!0):(server.emit("input",t.keyCode,!0),e.spaceDown=!0):49==t.keyCode?open_minimap():50==t.keyCode?open_leaderboard():51==t.keyCode?open_settings():87!=t.keyCode||e.wDown?65!=t.keyCode||e.aDown?83!=t.keyCode||e.sDown?68!=t.keyCode||e.dDown||(server.emit("input",t.keyCode,!0),e.dDown=!0):(server.emit("input",t.keyCode,!0),e.sDown=!0):(server.emit("input",t.keyCode,!0),e.aDown=!0):(server.emit("input",t.keyCode,!0),e.wDown=!0))}),document.addEventListener("mousemove",function(e){mouseInScreen=!0,mouseX=e.pageX,mouseY=e.pageY}),document.addEventListener("keyup",function(t){null!=server&&started&&(use_mouse?32==t.keyCode&&e.spaceDown?(server.emit("input",t.keyCode,!1),e.spaceDown=!1):16==t.keyCode&&e.shiftDown&&(server.emit("input",t.keyCode,!1),e.shiftDown=!1):87==t.keyCode&&e.wDown?(server.emit("input",t.keyCode,!1),e.wDown=!1):65==t.keyCode&&e.aDown?(server.emit("input",t.keyCode,!1),e.aDown=!1):83==t.keyCode&&e.sDown?(server.emit("input",t.keyCode,!1),e.sDown=!1):68==t.keyCode&&e.dDown&&(server.emit("input",t.keyCode,!1),e.dDown=!1))}),document.addEventListener("mousedown",function(e){null!=server&&started&&server.emit("input",-e.button-1,!0)}),window.addEventListener("mousewheel",function(e){null!=server&&started&&(e.deltaY>0?open_next():e.deltaY<0&&open_previous())}),document.addEventListener("mouseout",function(e){mouseInScreen=!1}),document.addEventListener("mouseenter",function(e){mouseInScreen=!0}),document.addEventListener("contextmenu",function(e){null!=server&&started&&e.preventDefault()}),document.addEventListener("mouseup",function(e){null!=server&&started&&server.emit("input",-e.button-1,!1)}),e.stop=function(e){e.stopPropagation()},e.square.addEventListener("mouseup",e.stop),e.square.addEventListener("mousedown",e.stop),e.upgrades.addEventListener("mouseup",e.stop),e.upgrades.addEventListener("mousedown",e.stop),e},leaderboard_=function(){var e={};return e.rank=document.getElementById("you-rank"),e.amount=document.getElementById("you-amount"),e.rows=document.getElementById("leaderboard-rows"),e.update=function(t,a){if(null!=t&&0!=t.length){for(var n=t.sort(function(e,t){return t.kills-e.kills}),i=e.rows.children,l=0,r=0;r<i.length;r++){var m=i[r],c=n[r];null!=c?("none"==m.style.display&&(m.style.display="block"),c==a&&(l=r+1),m.getElementsByClassName("name")[0].innerHTML=c.name,m.getElementsByClassName("amount")[0].innerHTML=c.kills):m.style.display="none"}e.rank.innerHTML=l+" of "+n.length,a.kills>1||0==a.kills?e.amount.innerHTML="with "+a.kills+" kills":e.amount.innerHTML="with "+a.kills+" kill"}},e},player=function(){var e={};return e.x=0,e.y=0,e.r=0,e.oldR=0,e.difR=0,e.rotationInterval=6,e.name="",e.moving=!1,e.team=0,e.health=15,e.kills=0,e.hit=!1,e.hitTimer=0,e.hitAlpha=0,e.shooting=!1,e.turret=0,e.shotTimer=0,e.boosting=!1,e.boostTimer=0,e.hasFlag=!1,e.flagTime=0,e.setR=function(t){e.oldR=e.r,t-e.r<180&&t-e.r>-180?e.difR=t-e.r:e.r>t?e.difR=360-e.r+t:e.difR=-360+t-e.r},e.oldX=0,e.oldY=0,e.difX=0,e.difY=0,e.positionInterval=6,e.rotating=!1,e.setX=function(t){e.oldX=e.x,e.difX=t-e.x},e.setY=function(t){e.oldY=e.y,e.difY=t-e.y},e.update=function(){e.moving&&(e.x+=e.difX/e.positionInterval,e.y+=e.difY/e.positionInterval),e.rotating&&(e.r+=e.difR/e.rotationInterval,e.r>360?e.r-=360:e.r<0&&(e.r+=360))},e},settings_=function(){var e={};return e.quality=document.getElementById("quality"),e.image=document.getElementById("image"),e.render=document.getElementById("render"),e.smooth=document.getElementById("smooth"),e.tps=document.getElementById("tps"),e.control=document.getElementById("control"),e.prtsc=document.getElementById("prtsc"),e.fullsc=document.getElementById("fullsc"),e.quality.addEventListener("change",function(t){e.set_quality(t.target.value)}),e.image.addEventListener("change",function(t){e.set_image(t.target.value)}),e.render.addEventListener("change",function(t){e.set_render(t.target.value)}),e.smooth.addEventListener("change",function(t){e.set_smooth(t.target.value)}),e.tps.addEventListener("change",function(t){e.set_tps(t.target.value)}),e.prtsc.addEventListener("click",function(){e.set_prtsc()}),e.control.addEventListener("change",function(t){e.set_control(t.target.value)}),e.fullsc.addEventListener("click",function(){e.set_fullsc()}),e.load=function(){if("undefined"!=typeof Storage){var t=localStorage.getItem("quality");null!=t&&""!=t&&(e.set_quality(t),e.quality.value=t),null!=(t=localStorage.getItem("image"))&&""!=t&&(e.set_image(t),e.image.value=t),null!=(t=localStorage.getItem("render"))&&""!=t&&(e.set_render(t),e.render.value=t),null!=(t=localStorage.getItem("smooth"))&&""!=t&&(e.set_smooth(t),e.smooth.value=t),null!=(t=localStorage.getItem("tps"))&&""!=t&&(e.set_tps(t),e.tps.value=t),null!=(t=localStorage.getItem("control"))&&""!=t&&(e.set_control(t),e.control.value=t)}},e.save=function(){"undefined"!=typeof Storage&&(localStorage.setItem("quality",e.quality.value),localStorage.setItem("image",e.image.value),localStorage.setItem("render",e.render.value),localStorage.setItem("smooth",e.smooth.value),localStorage.setItem("tps",e.tps.value),localStorage.setItem("control",e.control.value))},e.set_quality=function(e){null!=e&&("high"==e?ctx.imageSmoothingQuality="high":"medium"==e?ctx.imageSmoothingQuality="medium":"low"==e&&(ctx.imageSmoothingQuality="low"))},e.set_image=function(e){null!=e&&("ultra"==e?img_manager.scale(1):"high"==e?img_manager.scale(.75):"medium"==e?img_manager.scale(.5):"low"==e&&img_manager.scale(.25))},e.set_render=function(e){null!=e&&("auto"==e?canvas.style.imageRendering="auto":"pixel"==e?canvas.style.imageRendering="pixelated":"crisp"==e&&(canvas.style.imageRendering="crisp-edges"))},e.set_smooth=function(e){null!=e&&("true"==e?ctx.imageSmoothingEnabled=!0:"false"==e&&(ctx.imageSmoothingEnabled=!1))},e.set_tps=function(e){null!=e&&e>0&&(gameloop.tps=e)},e.set_prtsc=function(){window.open(canvas.toDataURL())},e.set_fullsc=function(){var t=document.fullscreenElement&&null!==document.fullscreenElement||document.webkitFullscreenElement&&null!==document.webkitFullscreenElement||document.mozFullScreenElement&&null!==document.mozFullScreenElement||document.msFullscreenElement&&null!==document.msFullscreenElement,a=document.documentElement;t?(document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen&&document.msExitFullscreen(),e.fullsc.innerHTML="open"):(a.requestFullscreen?a.requestFullscreen():a.mozRequestFullScreen?a.mozRequestFullScreen():a.webkitRequestFullScreen?a.webkitRequestFullScreen():a.msRequestFullscreen&&a.msRequestFullscreen(),e.fullsc.innerHTML="close")},e.set_control=function(e){use_mouse="mouse"==e},e},minimap_button=document.getElementById("minimap-button"),leaderboard_button=document.getElementById("leaderboard-button"),settings_button=document.getElementById("settings-button"),exit_button=document.getElementById("exit-button"),minimap_square=document.getElementById("square-minimap"),leaderboard_square=document.getElementById("square-leaderboard"),settings_square=document.getElementById("square-settings"),open_menu=0;minimap_button.onclick=function(){open_minimap()},leaderboard_button.onclick=function(){open_leaderboard()},settings_button.onclick=function(){open_settings()},exit_button.onclick=function(){open_exit()};var statrow=function(e){var t={};return t.element=e,t.n=0,t.items=[],t.max=14,t.fill=function(e){e=e||!1,t.element.innerHTML="";for(var a=0;a<t.max;a++){var n=document.createElement("div");e?(n.style.borderColor="rgb(255, "+(255-255/(t.max+1)*a)+", 0)",n.style.background="rgb(255, "+(255-255/(t.max+1)*a)+", 0)"):(n.style.borderColor=t.element.getAttribute("color"),n.style.background=t.element.getAttribute("color")),n.className="item inactive",t.element.appendChild(n),t.items[a]=n}},t.add=function(e){t.n+e>t.max&&(e=t.max-t.n);for(var a=t.n;a<t.n+e;a++)t.items[a].className="item active";t.n+=e},t.remove=function(e){t.n-e<=0&&(e=t.n);for(var a=t.n-e;a<t.n;a++)t.items[a].className="item inactive";t.n-=e},t.set=function(e){(e-=1)>t.n?t.add(e-t.n):e<t.n&&t.remove(t.n-e)},t},upgrades_=function(e,t){var a={};return a.statrows=e,a.callback=t,a.div=document.getElementById("game-upgrades"),a.levelup=document.getElementById("levelup"),a.speedButton=document.getElementById("speed-button"),a.regenButton=document.getElementById("regen-button"),a.damageButton=document.getElementById("damage-button"),a.points=0,a.speedButton.addEventListener("click",function(){a.points>0&&a.statrows.speed.n<14&&(a.points--,a.statrows.speed.add(1),a.callback("speed"),14==a.statrows.speed.n&&a.speedButton.className,a.close())}),a.regenButton.addEventListener("click",function(){a.points>0&&a.statrows.regen.n<14&&(a.points--,a.statrows.regen.add(1),a.callback("regen"),14==a.statrows.regen.n&&a.regenButton.className,a.close())}),a.damageButton.addEventListener("click",function(){a.points>0&&a.statrows.damage.n<14&&(a.points--,a.statrows.damage.add(1),a.callback("damage"),14==a.statrows.damage.n&&a.damageButton.className,a.close())}),a.close=function(){for(var e in document.getElementsByClassName("upgrade")){var t=document.getElementsByClassName("upgrade")[e];t instanceof Element&&(t.style.display="none")}setTimeout(function(){a.div.style.display="none",a.levelup.className="active";for(var e in document.getElementsByClassName("upgrade")){var t=document.getElementsByClassName("upgrade")[e];t instanceof Element&&(t.style.display="block")}},1e3)},a.upgrade=function(){a.div.style.display="initial";for(var e in document.getElementsByClassName("upgrade")){var t=document.getElementsByClassName("upgrade")[e];t instanceof Element&&(t.style.display="block")}setTimeout(function(){a.levelup.className="inactive"},1500)},a},viewport_=function(e,t){var a={};return a.minScale=1,a.maxViewDistance=1e3,a.scale=1,a.resize=function(){e.width=window.innerWidth,e.height=window.innerHeight,window.innerWidth/window.innerHeight>1?e.width>a.minScale*a.maxViewDistance?a.scale=e.width/a.maxViewDistance*t:a.scale=a.minScale*t:e.height>a.minScale*a.maxViewDistance?a.scale=e.height/a.maxViewDistance*t:a.scale=a.minScale*t},a.resize(),a},canvas=document.getElementById("cvs"),minimap_canvas=document.getElementById("minimap-canvas"),ctx=canvas.getContext("2d"),minimap_ctx=minimap_canvas.getContext("2d");minimap_ctx.imageSmoothingEnabled=!0,minimap_ctx.imageSmoothingQuality="medium";var restarts=0,main=io(),server=null,loc=null,ping=0,mapSize=25e3,viewport=new viewport_(canvas,.2),gameloop=new gameloop_(update,tick),input=new input_,camera=new camera_(canvas,viewport),leaderboard=new leaderboard_,startTime,img_manager=new img_manager_,spaceship_body_blue=img_manager.add("spaceship_body_blue","../gfx/spaceship_body_blue.png"),spaceship_body_red=img_manager.add("spaceship_body_red","../gfx/spaceship_body_red.png"),spaceship_body_white=img_manager.add("spaceship_body_white","../gfx/spaceship_body_white.png"),spaceship_trail=img_manager.add("spaceship_trail","../gfx/spaceship_trail.png"),spaceship_wings=img_manager.add("spaceship_wings","../gfx/spaceship_wings.png"),spaceship_turrets=img_manager.add("spaceship_turrets","../gfx/spaceship_turrets.png"),spaceship_hurt=img_manager.add("spaceship_hurt","../gfx/spaceship_hurt.png"),spaceship_laser1=img_manager.add("spaceship_laser1","../gfx/spaceship_laser1.png"),spaceship_laser2=img_manager.add("spaceship_laser2","../gfx/spaceship_laser2.png"),spaceship_laser3=img_manager.add("spaceship_laser3","../gfx/spaceship_laser3.png"),spaceship_laser4=img_manager.add("spaceship_laser4","../gfx/spaceship_laser4.png"),spaceship_boosters=img_manager.add("spaceship_boosters","../gfx/spaceship_boosters.png"),main_flag=img_manager.add("main_flag","../gfx/main_flag.png"),arrow_white=img_manager.add("arrow_white","../gfx/arrow_white.png"),arrow_blue=img_manager.add("arrow_blue","../gfx/arrow_blue.png"),arrow_red=img_manager.add("arrow_red","../gfx/arrow_red.png"),flag_small=img_manager.add("flag_small","../gfx/flag_small.png"),home_small=img_manager.add("home_small","../gfx/home_small.png"),fuel_tank=img_manager.add("fuel_tank","../gfx/fuel_tank.png"),fuel_small=img_manager.add("fuel_small","../gfx/fuel_small.png");img_manager.load();var players=[],fuel_tanks=[],me=null,started=!1,flagPlayer=null,mouseX=0,mouseY=0,mouseInScreen=!0,statrows={speed:new statrow(document.getElementById("speed")),regen:new statrow(document.getElementById("regen")),damage:new statrow(document.getElementById("damage")),boost:new statrow(document.getElementById("boost")),health:new statrow(document.getElementById("health")),heat:new statrow(document.getElementById("heat"))},upgrades=new upgrades_(statrows,upgrade);window.onerror=function(e,t,a,n,i){restart("There was an error<br /><small>"+e+"</small>",5e3)};var hints=["Get points for killing other players and use them for upgrades.","Follow the ingame instructions to know what you have to do.","Use the minimap for directions so you dont get lost.","Collect the boost tanks to refill your boost.","You can change the controls to WASD in the settings.","Defenders lose health when they go into the safezone.","The bar you see on players is their health.","For the quality setting to work you need smooth to be turned on.","If there are no defenders online, you cant capture the flag.","Attackers cant get shot when they are in the safe zone."],main_canvas=document.getElementById("main-cvs"),main_ctx=main_canvas.getContext("2d"),small_spaceship=new img("small_spaceship","../gfx/small_spaceship.png");small_spaceship.load(),waitForMainCanvas(),window.onresize=function(){started||generate_mainCanvas(),viewport.resize()},document.getElementById("username").addEventListener("keydown",function(){started||13!=event.keyCode||load()});var use_mouse=!0,settings=new settings_;"undefined"!=typeof Storage&&null!=localStorage.getItem("username")&&(document.getElementById("username").value=localStorage.getItem("username"));var stars=[];init_main(),verifyAdblocker();var time_left=0,start_date=0,restarting=!1;document.getElementById("enter").onclick=function(){load()};var flagX=12e3,flagY=2500,flagW=1e3,flagH=1e3,szX=7500,szY=23e3,szW=1e4,szH=2e3,flagCaptured=!1,minimapAniTime=0,lastTarget=-1;